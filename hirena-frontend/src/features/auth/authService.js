import api from "../../api/axios";

export async function login(email, password) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "Login failed";

    throw new Error(message);
  }
}