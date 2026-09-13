import { Outlet } from "react-router-dom";
import CompanySidebar from "../company/CompanySidebar";

export default function CompanyLayout() {
  return (
    <div className="admin-layout">
      <CompanySidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
