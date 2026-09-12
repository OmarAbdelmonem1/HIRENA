import { Routes, Route } from 'react-router-dom';
import Companies from '../../features/admin/pages/Companies/Companies';
import CompanyDetails from '../../features/admin/pages/Companies/CompanyDetails';

export default function CompanyRoutes() {
  return (
    <Routes>
      <Route index element={<Companies />} />
      <Route path=":id" element={<CompanyDetails />} />
    </Routes>
  );
}
