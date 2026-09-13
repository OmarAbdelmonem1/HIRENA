import { Routes, Route } from 'react-router-dom';
import Jobs from '../../features/admin/pages/Jobs/Jobs';
import JobDetails from '../../features/admin/pages/Jobs/JobDetails';
import EditJob from '../../features/admin/pages/Jobs/EditJob';
export default function JobRoutes() { return <Routes><Route index element={<Jobs />} /><Route path=":id" element={<JobDetails />} /><Route path=":id/edit" element={<EditJob />} /></Routes>; }
