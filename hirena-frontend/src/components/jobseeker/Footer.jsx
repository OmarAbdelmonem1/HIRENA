import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-inner">
        <div>
          <strong className="footer-brand">HIRENA</strong>
          <p>Find work that moves your career forward.</p>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} HIRENA. All rights reserved.
      </div>
    </footer>
  );
}
