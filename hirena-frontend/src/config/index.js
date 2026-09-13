// Base API URL for the frontend to call. Set VITE_API_BASE_URL in your environment or in the project .env file.
// Defaults to localhost:8080 for local development when VITE_API_BASE_URL is not provided.
export const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
