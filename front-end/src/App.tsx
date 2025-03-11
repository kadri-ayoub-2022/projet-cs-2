import { Routes, Route } from "react-router";
import AdminRoutes from "./routes/AdminRoutes";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Teachers from "./pages/admin/Teachers";
import Students from "./pages/admin/Students";
import Login from "./pages/auth/Login";
import { AuthProvider } from "./contexts/useAuth";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminRoutes />}>
            <Route path="" element={<AdminDashboard />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="students" element={<Students />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
