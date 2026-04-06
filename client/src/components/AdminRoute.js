import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { userProfile } = useAuth();

  // block if user is not admin
  if (userProfile?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;

// Notes:
// AdminRoute protects the route before AdminDashboard renders