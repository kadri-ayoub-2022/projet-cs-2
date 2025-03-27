import { Navigate, Outlet } from "react-router";
import StudentLayout from "../layouts/StudentLayout.tsx";
import { useAuth } from "../contexts/useAuth.tsx";
import { LoadingScreen } from "../components/Loading.tsx";

const StudentRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" />;
  if (user.role !== "student") return <Navigate to={"/" + user.role} />;

  return (
    <StudentLayout>
      <Outlet />
    </StudentLayout>
  );
};

export default StudentRoutes;
