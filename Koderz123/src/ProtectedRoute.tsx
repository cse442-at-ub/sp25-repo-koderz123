import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const loggedInUsername = localStorage.getItem("loggedInUsername");

  return loggedInUsername ? (
    <Outlet />
  ) : (
    <div>
      <script>alert("Please login first");</script>
      <Navigate to="/" />
    </div>
  );
};

export default ProtectedRoute;
