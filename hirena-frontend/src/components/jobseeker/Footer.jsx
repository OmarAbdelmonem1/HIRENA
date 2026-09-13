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
          <Link to="/companies">About</Link>
          <Link to="/profile">Contact</Link>
          <Link to="/profile">Privacy</Link>
          <Link to="/profile">Terms</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} HIRENA. All rights reserved.
      </div>
    </footer>
  );
}
