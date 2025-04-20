import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const loggedInUsername = localStorage.getItem("loggedInUsername");

  if (loggedInUsername) {
    return <Outlet />;
  } else {
    useEffect(() => {
      alert("Please login first");
    }, []);

    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
