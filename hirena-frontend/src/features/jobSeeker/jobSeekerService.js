import api from "../../api/axios";

export const getMyProfile = async () => {
  const response = await api.get("/api/jobseeker/profile");

  return response.data;
};