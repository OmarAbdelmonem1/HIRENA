import { Routes, Route } from "react-router-dom";
import Applications from "../../features/admin/pages/Applications/Applications.jsx";
import ApplicationDetails from "../../features/admin/pages/Applications/ApplicationDetails.jsx";

export default function ApplicationRoutes() {
  return (
    <Routes>
      <Route index element={<Applications />} />
      <Route path=":id" element={<ApplicationDetails />} />
    </Routes>
  );
}
