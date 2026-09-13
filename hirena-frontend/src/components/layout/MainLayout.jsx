import { Outlet } from "react-router-dom";
import Navbar from "../jobseeker/Navbar";
import Footer from "../jobseeker/Footer";

export default function MainLayout() {
  return (
    <div className="main-site">
      <Navbar />
      <main className="main-site-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
