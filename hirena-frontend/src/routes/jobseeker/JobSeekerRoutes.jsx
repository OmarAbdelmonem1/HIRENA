import { Route } from "react-router-dom";

import Jobs from "../../features/jobseeker/pages/Jobs";
import JobDetails from "../../features/jobseeker/pages/JobDetails";
import Apply from "../../features/jobseeker/pages/Apply";
import Companies from "../../features/jobseeker/pages/Companies";
import CompanyDetails from "../../features/jobseeker/pages/CompanyDetails";
import Applications from "../../features/jobseeker/pages/Applications";
import ApplicationDetails from "../../features/jobseeker/pages/ApplicationDetails";
import SavedJobs from "../../features/jobseeker/pages/SavedJobs";
import Notifications from "../../features/jobseeker/pages/Notifications";
import Profile from "../../features/jobseeker/pages/Profile";

export const jobSeekerRoutes = (
  <>
    <Route path="/jobs" element={<Jobs />} />
    <Route path="/jobs/:id" element={<JobDetails />} />
    <Route path="/jobs/:id/apply" element={<Apply />} />
    <Route path="/companies" element={<Companies />} />
    <Route path="/companies/:id" element={<CompanyDetails />} />
    <Route path="/applications" element={<Applications />} />
    <Route path="/applications/:id" element={<ApplicationDetails />} />
    <Route path="/saved-jobs" element={<SavedJobs />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/profile" element={<Profile />} />
  </>
);
