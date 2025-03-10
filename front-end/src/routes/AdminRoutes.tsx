import { Outlet } from "react-router";
// import { useAuth } from "../context/AuthContext";
import AdminLayout from "../layouts/AdminLayout.tsx";

const AdminRoutes = () => {
    // const { user } = useAuth();

    // if (!user) return <Navigate to="/login" />; 
    // if (user.role !== "admin") return <Navigate to="/dashboard" />; 

    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    );
};

export default AdminRoutes;
