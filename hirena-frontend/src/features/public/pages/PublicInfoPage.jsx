import { Link } from "react-router-dom";

const PAGE_CONTENT = {
  about: {
    eyebrow: "ABOUT HIRENA",
    title: "A clearer path to meaningful work.",
    intro:
      "HIRENA connects talented people with companies creating the next generation of opportunities.",
    sections: [
      {
        title: "Built for better matches",
        text: "We make it easier for job seekers to discover relevant roles and for companies to meet candidates who fit their needs.",
      },
      {
        title: "Simple by design",
        text: "From searching to applying, HIRENA keeps the experience focused, transparent, and easy to navigate.",
      },
    ],
  },
  contact: {
    eyebrow: "CONTACT US",
    title: "We are here to help.",
    intro:
      "Have a question about your account, an application, or hiring on HIRENA? Reach out and our team will get back to you.",
    sections: [
      {
        title: "General support",
        text: "For account and platform questions, email our support team.",
        action: { label: "support@hirena.com", href: "mailto:support@hirena.com" },
      },
      {
        title: "Business enquiries",
        text: "Interested in reaching talented candidates? We would love to hear about your hiring needs.",
        action: { label: "business@hirena.com", href: "mailto:business@hirena.com" },
      },
    ],
  },
  privacy: {
    eyebrow: "YOUR PRIVACY",
    title: "Your information deserves care.",
    intro:
      "This overview explains how HIRENA handles information while you use our platform.",
    sections: [
      {
        title: "Information we use",
        text: "We use account, profile, application, and platform activity information to provide job search, hiring, and notification features.",
      },
      {
        title: "Your choices",
        text: "You can review and update your profile information from your account. Contact us if you need help accessing or correcting your information.",
      },
      {
        title: "Keeping information safe",
        text: "We use reasonable technical and organizational safeguards to protect information and limit access to what is needed to operate HIRENA.",
      },
    ],
  },
  terms: {
    eyebrow: "TERMS OF USE",
    title: "Clear expectations for everyone.",
    intro:
      "By using HIRENA, you agree to use the platform responsibly and provide information that is accurate and up to date.",
    sections: [
      {
        title: "Use the platform honestly",
        text: "Do not impersonate others, post misleading opportunities, submit fraudulent applications, or use HIRENA to harm other users.",
      },
      {
        title: "Your account",
        text: "You are responsible for keeping your account details secure and for activity performed through your account.",
      },
      {
        title: "Platform content",
        text: "Job listings and company information are provided by their respective users. Verify important details before making employment decisions.",
      },
    ],
  },
};

export default function PublicInfoPage({ page }) {
  const content = PAGE_CONTENT[page];

  return (
    <div className="public-info-page">
      <section className="public-info-hero">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </section>
      <section className="public-info-content">
        {content.sections.map((section) => (
          <article className="public-info-card" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
            {section.action && (
              <a href={section.action.href}>{section.action.label}</a>
            )}
          </article>
        ))}
        <div className="public-info-cta">
          <p>Ready to take your next step?</p>
          <Link className="primary-button" to="/jobs">
            Explore jobs
          </Link>
        </div>
      </section>
    </div>
  );
}

export function About() {
  return <PublicInfoPage page="about" />;
}

export function Contact() {
  return <PublicInfoPage page="contact" />;
}

export function Privacy() {
  return <PublicInfoPage page="privacy" />;
}

export function Terms() {
  return <PublicInfoPage page="terms" />;
}
