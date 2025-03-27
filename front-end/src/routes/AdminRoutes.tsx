import { Navigate, Outlet } from "react-router";
import AdminLayout from "../layouts/AdminLayout.tsx";
import { useAuth } from "../contexts/useAuth.tsx";
import { LoadingScreen } from "../components/Loading.tsx";

const AdminRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" />;
  if (user.role !== "admin") return <Navigate to={"/" + user.role} />;

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminRoutes;
