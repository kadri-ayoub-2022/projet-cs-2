import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/useAuth.tsx";

const AuthRoutes = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={"/" + user.role} />;
  }

  return <Outlet />;
};

export default AuthRoutes;