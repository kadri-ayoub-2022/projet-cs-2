import { Navigate, Outlet } from "react-router";
import TeacherLayout from "../layouts/TeacherLayout.tsx";
import { useAuth } from "../contexts/useAuth.tsx";
import { LoadingScreen } from "../components/Loading.tsx";

const TeacherRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" />;
  if (user.role !== "teacher") return <Navigate to={"/" + user.role} />;

  return (
    <TeacherLayout>
      <Outlet />
    </TeacherLayout>
  );
};

export default TeacherRoutes;
