import "./App.css";
import { Routes, Route } from "react-router";
import AdminRoutes from "./routes/AdminRoutes";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Teachers from "./pages/admin/Teachers";
import Students from "./pages/admin/Students";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/admin" element={<AdminRoutes />}>
          <Route path="" element={<AdminDashboard />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
