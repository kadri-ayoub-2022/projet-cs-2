import "./App.css";
import { Routes, Route } from "react-router";
import AdminRoutes from "./routes/AdminRoutes";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/admin" element={<AdminRoutes />}>
          <Route path="" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
