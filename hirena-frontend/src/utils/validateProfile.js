const isDateAfter = (first, second) =>
  first && second && new Date(first) > new Date(second);

export default function validateProfile(profile) {
  const errors = [];
  const today = new Date().toISOString().slice(0, 10);

  if (!profile.firstName?.trim()) errors.push("First name is required.");
  if (!profile.lastName?.trim()) errors.push("Last name is required.");
  if (!profile.phone?.trim()) errors.push("Phone is required.");
  else if (!/^[+()0-9\s-]{7,20}$/.test(profile.phone.trim())) {
    errors.push("Enter a valid phone number.");
  }
  if (!profile.dateOfBirth) errors.push("Date of birth is required.");
  else if (profile.dateOfBirth > today) {
    errors.push("Date of birth cannot be in the future.");
  }
  if (!profile.gender) errors.push("Select a gender.");
  if (!profile.address?.trim()) errors.push("Address is required.");
  if (!profile.city?.trim()) errors.push("City is required.");
  if (!profile.country) errors.push("Select a country.");

  if (
    profile.yearsOfExperience !== "" &&
    (Number.isNaN(Number(profile.yearsOfExperience)) ||
      Number(profile.yearsOfExperience) < 0)
  ) {
    errors.push("Years of experience cannot be negative.");
  }
  if (
    profile.expectedSalary !== "" &&
    (Number.isNaN(Number(profile.expectedSalary)) ||
      Number(profile.expectedSalary) < 0)
  ) {
    errors.push("Expected salary cannot be negative.");
  }

  profile.education.forEach((item, index) => {
    if (isDateAfter(item.startDate, item.endDate)) {
      errors.push(`Education ${index + 1}: end date must be after start date.`);
    }
  });

  profile.workExperience.forEach((item, index) => {
    if (!item.currentlyWorking && isDateAfter(item.startDate, item.endDate)) {
      errors.push(
        `Experience ${index + 1}: end date must be after start date.`,
      );
    }
  });

  return errors[0] || "";
}
