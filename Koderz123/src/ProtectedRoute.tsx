import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const loggedInUsername = localStorage.getItem("loggedInUsername");

  return loggedInUsername ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
