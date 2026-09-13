import { Routes, Route } from 'react-router-dom';
import Applications from '../../features/admin/pages/Applications/Applications';
import ApplicationDetails from '../../features/admin/pages/Applications/ApplicationDetails';

export default function ApplicationRoutes() {
  return (
    <Routes>
      <Route index element={<Applications />} />
      <Route path=":id" element={<ApplicationDetails />} />
    </Routes>
  );
}
