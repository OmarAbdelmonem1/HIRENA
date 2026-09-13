import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading) return <div>Loading...</div>;
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
