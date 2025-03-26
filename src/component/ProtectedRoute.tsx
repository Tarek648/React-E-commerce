import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const accessToken = localStorage.getItem("accessToken"); 

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;