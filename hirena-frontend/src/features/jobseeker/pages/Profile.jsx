import { useEffect, useState } from "react";
import {
  createProfile,
  getProfile,
  updateProfile,
  uploadProfileImage,
  uploadCv,
  getMyCvFile,
} from "../services/jobseekerService";
import {
  COUNTRIES,
  EMPTY_CERTIFICATE,
  EMPTY_EDUCATION,
  EMPTY_EXPERIENCE,
  INITIAL_PROFILE,
} from "../../../constants/jobSeekerProfile";

const toForm = (data = {}) => ({
  ...INITIAL_PROFILE,
  ...data,
  education: data.education || [],
  workExperience: data.workExperience || [],
  certificates: data.certificates || [],
  skills: (data.skills || []).map((skill) =>
    typeof skill === "string" ? skill : skill.name,
  ),
});

const clean = (value) => value || null;

function Section({ title, description, children, action }) {
  return (
    <section className="profile-section">
      <div className="profile-section-heading">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function TextField({ label, name, value, onChange, ...props }) {
  return (
    <label>
      {label}
      <input name={name} value={value ?? ""} onChange={onChange} {...props} />
    </label>
  );
}

function Profile() {
  const [form, setForm] = useState(toForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [openingCv, setOpeningCv] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setForm(toForm(data));
        setHasProfile(true);
      })
      .catch((e) => {
        if (e.response?.status !== 404) {
          setError(e.response?.data?.message || "Could not load your profile.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateArrayItem = (key, index, event) => {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [name]: type === "checkbox" ? checked : value }
          : item,
      ),
    }));
  };

  const addItem = (key, emptyItem) => {
    setForm((current) => ({
      ...current,
      [key]: [...current[key], { ...emptyItem }],
    }));
  };

  const removeItem = (key, index) => {
    setForm((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const changeSkill = (index, value) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.map((skill, skillIndex) =>
        skillIndex === index ? value : skill,
      ),
    }));
  };

  const handleCvUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!hasProfile) {
      setError("Save your personal information before uploading a CV.");
      setNotice("");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, DOC, or DOCX file.");
      setNotice("");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("CV must be 3 MB or smaller.");
      setNotice("");
      return;
    }

    setError("");
    setNotice("");
    setUploadingCv(true);
    try {
      const cv = await uploadCv(file, Boolean(form.cv));
      setForm((current) => ({ ...current, cv }));
      setNotice("CV uploaded successfully.");
    } catch (e) {
      setError(e.response?.data?.message || "Could not upload your CV.");
    } finally {
      setUploadingCv(false);
    }
  };

  const openCv = async () => {
    setOpeningCv(true);
    setError("");
    try {
      const response = await getMyCvFile();
      const url = URL.createObjectURL(response.data);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      setError(e.response?.data?.message || "Could not open your CV.");
    } finally {
      setOpeningCv(false);
    }
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!hasProfile) {
      setError(
        "Save your personal information before uploading a profile picture.",
      );
      return;
    }
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type,
      )
    ) {
      setError("Please upload a JPG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile picture must be 5 MB or smaller.");
      return;
    }
    setError("");
    setNotice("");
    setUploadingImage(true);
    try {
      const saved = await uploadProfileImage(file);
      setForm(toForm(saved));
      setNotice("Profile picture uploaded successfully.");
    } catch (e) {
      setError(
        e.response?.data?.message || "Could not upload your profile picture.",
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);

    const data = {
      ...form,
      dateOfBirth: clean(form.dateOfBirth),
      gender: clean(form.gender),
      yearsOfExperience:
        form.yearsOfExperience === "" ? null : Number(form.yearsOfExperience),
      expectedSalary:
        form.expectedSalary === "" ? null : Number(form.expectedSalary),
      availability: clean(form.availability),
      education: form.education.map((item) => ({
        ...item,
        startDate: clean(item.startDate),
        endDate: clean(item.endDate),
      })),
      workExperience: form.workExperience.map((item) => ({
        ...item,
        startDate: clean(item.startDate),
        endDate: item.currentlyWorking ? null : clean(item.endDate),
      })),
      certificates: form.certificates.map((item) => ({
        ...item,
        issueDate: clean(item.issueDate),
        expirationDate: clean(item.expirationDate),
      })),
      skills: form.skills.map((skill) => skill.trim()).filter(Boolean),
    };

    try {
      const saved = hasProfile
        ? await updateProfile(data)
        : await createProfile(data);
      setForm(toForm(saved));
      setHasProfile(true);
      setNotice("Profile saved successfully.");
    } catch (e) {
      setError(e.response?.data?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="narrow-page profile-page">
      <section className="page-intro">
        <span className="eyebrow">YOUR PROFESSIONAL STORY</span>
        <h1>Complete your profile</h1>
        <p>
          Add your experience, education and skills so companies can discover
          the best version of you.
        </p>
      </section>

      <div className="profile-photo-card">
        <div className="profile-photo-placeholder">
          {form.profileImage ? (
            <img src={form.profileImage} alt="Profile" />
          ) : (
            `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}` || "?"
          )}
        </div>
        <div>
          <strong>Profile picture</strong>
          <p>Use a clear JPG, PNG, WebP, or GIF image up to 5 MB.</p>
        </div>
        <label className="secondary-button upload-inline-button">
          {uploadingImage ? "Uploading…" : "Upload picture"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleProfileImageUpload}
            disabled={uploadingImage}
          />
        </label>
      </div>

      <form className="profile-form panel" onSubmit={submit}>
        {(error || notice) && (
          <div
            className={`profile-status ${error ? "is-error" : "is-success"}`}
            role="status"
          >
            <span>{error ? "!" : "✓"}</span>
            <p>{error || notice}</p>
          </div>
        )}

        <Section title="Personal information" description="Tell us the basics.">
          <div className="form-two">
            <TextField
              label="First name"
              name="firstName"
              value={form.firstName}
              onChange={change}
              required
            />
            <TextField
              label="Last name"
              name="lastName"
              value={form.lastName}
              onChange={change}
              required
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={change}
              required
            />
            <TextField
              label="Date of birth"
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={change}
              required
            />
            <label>
              Gender
              <select
                name="gender"
                value={form.gender}
                onChange={change}
                required
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </label>
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={change}
              required
            />
            <TextField
              label="City"
              name="city"
              value={form.city}
              onChange={change}
              required
            />
            <label>
              Country
              <select
                name="country"
                value={form.country}
                onChange={change}
                required
              >
                <option value="">Select country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Section>

        <Section
          title="Career preferences"
          description="Optional information. You can complete this later, even if you are currently unemployed."
        >
          <div className="form-two">
            <TextField
              label="Target job title"
              name="currentJobTitle"
              value={form.currentJobTitle}
              onChange={change}
              placeholder="e.g. Java Developer"
            />
            <TextField
              label="Years of experience"
              type="number"
              min="0"
              name="yearsOfExperience"
              value={form.yearsOfExperience}
              onChange={change}
            />
            <TextField
              label="Expected salary"
              type="number"
              min="0"
              step="0.01"
              name="expectedSalary"
              value={form.expectedSalary}
              onChange={change}
            />
            <label>
              Availability
              <select
                name="availability"
                value={form.availability}
                onChange={change}
              >
                <option value="">Select availability</option>
                <option value="IMMEDIATE">Immediate</option>
                <option value="TWO_WEEKS">Within two weeks</option>
                <option value="ONE_MONTH">Within one month</option>
                <option value="NEGOTIABLE">Negotiable</option>
              </select>
            </label>
          </div>
          <label>
            Bio
            <textarea
              name="bio"
              rows="5"
              value={form.bio}
              onChange={change}
              placeholder="Describe your strengths and career goals..."
            />
          </label>
        </Section>

        <Section
          title="Resume / CV"
          description="Optional. Upload a PDF, DOC, or DOCX file up to 3 MB."
        >
          <div className="cv-upload-card">
            <div>
              <strong>{form.cv?.fileName || "No CV uploaded yet"}</strong>
              <p>
                {form.cv
                  ? "Replace your CV whenever you want."
                  : "A CV helps companies learn more about your background."}
              </p>
            </div>
            {form.cv && (
              <button
                type="button"
                className="secondary-button"
                onClick={openCv}
                disabled={openingCv}
              >
                {openingCv ? "Opening CV…" : "Open CV"}
              </button>
            )}
            <label className="upload-button">
              {uploadingCv
                ? "Uploading…"
                : form.cv
                  ? "Replace CV"
                  : "Upload CV"}
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleCvUpload}
                disabled={uploadingCv}
              />
            </label>
          </div>
        </Section>

        <Section
          title="Education"
          description="Add degrees, diplomas or other education."
          action={
            <button
              type="button"
              className="secondary-button"
              onClick={() => addItem("education", EMPTY_EDUCATION)}
            >
              + Add education
            </button>
          }
        >
          {form.education.map((item, index) => (
            <div className="profile-array-item" key={`education-${index}`}>
              <div className="array-item-heading">
                <strong>Education {index + 1}</strong>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeItem("education", index)}
                >
                  Remove
                </button>
              </div>
              <div className="form-two">
                <TextField
                  label="Institution name"
                  name="institutionName"
                  value={item.institutionName}
                  onChange={(e) => updateArrayItem("education", index, e)}
                  required
                />
                <TextField
                  label="Degree"
                  name="degree"
                  value={item.degree}
                  onChange={(e) => updateArrayItem("education", index, e)}
                  required
                />
                <TextField
                  label="Field of study"
                  name="fieldOfStudy"
                  value={item.fieldOfStudy}
                  onChange={(e) => updateArrayItem("education", index, e)}
                />
                <TextField
                  label="Grade"
                  name="grade"
                  value={item.grade}
                  onChange={(e) => updateArrayItem("education", index, e)}
                />
                <TextField
                  label="Start date"
                  type="date"
                  name="startDate"
                  value={item.startDate}
                  onChange={(e) => updateArrayItem("education", index, e)}
                />
                <TextField
                  label="End date"
                  type="date"
                  name="endDate"
                  value={item.endDate}
                  onChange={(e) => updateArrayItem("education", index, e)}
                />
              </div>
              <label>
                Description
                <textarea
                  name="description"
                  rows="3"
                  value={item.description}
                  onChange={(e) => updateArrayItem("education", index, e)}
                />
              </label>
            </div>
          ))}
        </Section>

        <Section
          title="Work experience"
          description="Show companies what you have accomplished."
          action={
            <button
              type="button"
              className="secondary-button"
              onClick={() => addItem("workExperience", EMPTY_EXPERIENCE)}
            >
              + Add experience
            </button>
          }
        >
          {form.workExperience.map((item, index) => (
            <div className="profile-array-item" key={`experience-${index}`}>
              <div className="array-item-heading">
                <strong>Experience {index + 1}</strong>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeItem("workExperience", index)}
                >
                  Remove
                </button>
              </div>
              <div className="form-two">
                <TextField
                  label="Company name"
                  name="companyName"
                  value={item.companyName}
                  onChange={(e) => updateArrayItem("workExperience", index, e)}
                  required
                />
                <TextField
                  label="Job title"
                  name="jobTitle"
                  value={item.jobTitle}
                  onChange={(e) => updateArrayItem("workExperience", index, e)}
                  required
                />
                <TextField
                  label="Location"
                  name="location"
                  value={item.location}
                  onChange={(e) => updateArrayItem("workExperience", index, e)}
                />
                <TextField
                  label="Start date"
                  type="date"
                  name="startDate"
                  value={item.startDate}
                  onChange={(e) => updateArrayItem("workExperience", index, e)}
                />
                <TextField
                  label="End date"
                  type="date"
                  name="endDate"
                  value={item.endDate}
                  onChange={(e) => updateArrayItem("workExperience", index, e)}
                  disabled={item.currentlyWorking}
                />
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="currentlyWorking"
                  checked={item.currentlyWorking}
                  onChange={(e) => updateArrayItem("workExperience", index, e)}
                />{" "}
                I currently work here
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  rows="3"
                  value={item.description}
                  onChange={(e) => updateArrayItem("workExperience", index, e)}
                />
              </label>
            </div>
          ))}
        </Section>

        <Section
          title="Certificates"
          description="Add professional certifications and credentials."
          action={
            <button
              type="button"
              className="secondary-button"
              onClick={() => addItem("certificates", EMPTY_CERTIFICATE)}
            >
              + Add certificate
            </button>
          }
        >
          {form.certificates.map((item, index) => (
            <div className="profile-array-item" key={`certificate-${index}`}>
              <div className="array-item-heading">
                <strong>Certificate {index + 1}</strong>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeItem("certificates", index)}
                >
                  Remove
                </button>
              </div>
              <div className="form-two">
                <TextField
                  label="Certificate name"
                  name="name"
                  value={item.name}
                  onChange={(e) => updateArrayItem("certificates", index, e)}
                  required
                />
                <TextField
                  label="Issuing organization"
                  name="issuingOrganization"
                  value={item.issuingOrganization}
                  onChange={(e) => updateArrayItem("certificates", index, e)}
                />
                <TextField
                  label="Issue date"
                  type="date"
                  name="issueDate"
                  value={item.issueDate}
                  onChange={(e) => updateArrayItem("certificates", index, e)}
                />
                <TextField
                  label="Expiration date"
                  type="date"
                  name="expirationDate"
                  value={item.expirationDate}
                  onChange={(e) => updateArrayItem("certificates", index, e)}
                />
                <TextField
                  label="Credential ID"
                  name="credentialId"
                  value={item.credentialId}
                  onChange={(e) => updateArrayItem("certificates", index, e)}
                />
                <TextField
                  label="Credential URL"
                  type="url"
                  name="credentialUrl"
                  value={item.credentialUrl}
                  onChange={(e) => updateArrayItem("certificates", index, e)}
                />
              </div>
            </div>
          ))}
        </Section>

        <Section
          title="Skills"
          description="Add the skills recruiters should find you by."
          action={
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  skills: [...current.skills, ""],
                }))
              }
            >
              + Add skill
            </button>
          }
        >
          <div className="skills-editor">
            {form.skills.map((skill, index) => (
              <div className="skill-input" key={`skill-${index}`}>
                <input
                  value={skill}
                  onChange={(e) => changeSkill(index, e.target.value)}
                  placeholder="e.g. Spring Boot"
                />
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeItem("skills", index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </Section>

        <div className="form-actions">
          <button className="primary-button" disabled={loading || saving}>
            {saving ? "Saving…" : "Save profile →"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
