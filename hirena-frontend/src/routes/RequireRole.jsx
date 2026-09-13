import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function RequireRole({ role, children }) {
  const auth = useAuth();

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (auth.user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
