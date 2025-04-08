import { Routes, Route } from "react-router";
import AdminRoutes from "./routes/AdminRoutes";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Teachers from "./pages/admin/Teachers";
import Students from "./pages/admin/Students";
import Login from "./pages/auth/Login";
import { AuthProvider } from "./contexts/useAuth";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthRoutes from "./routes/AuthRoutes";
import AddTeachers from "./pages/admin/AddTeachers";
import AddStudents from "./pages/admin/AddStudents";
import TeacherRoutes from "./routes/TeacherRoutes";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import Themes from "./pages/teacher/Themes";
import StudentThemes from "./pages/student/StudentThemes";
import AddTheme from "./pages/teacher/AddTheme";
import StudentRoutes from "./routes/StudentRoutes";
import StudentDashboard from "./pages/student/StudentDashboard";
import Groups from "./pages/teacher/Groups";
import AThemes from "./pages/admin/AThemes";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthRoutes />}>
            <Route path="" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
          <Route path="/admin" element={<AdminRoutes />}>
            <Route path="" element={<AdminDashboard />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="teachers/new" element={<AddTeachers />} />
            <Route path="students" element={<Students />} />
            <Route path="students/new" element={<AddStudents />} />
            <Route path="projects-themes" element={<AThemes />} />
            <Route path="projects-themes/new" element={<AddTheme />} />
          </Route>
          <Route path="/teacher" element={<TeacherRoutes />}>
            <Route path="" element={<TeacherDashboard />} />
            <Route path="projects-themes" element={<Themes />} />
            <Route path="projects-themes/new" element={<AddTheme />} />
            <Route path="groups" element={<Groups />} />
          </Route>
          <Route path="/student" element={<StudentRoutes />}>
            <Route path="" element={<StudentDashboard />} />
            <Route path="projects-themes" element={<StudentThemes />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
