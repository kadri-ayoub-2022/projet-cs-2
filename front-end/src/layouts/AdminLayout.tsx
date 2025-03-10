import React from "react";
import Sidebar from "../components/admin/Sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-10 min-h-screen">
      <div className="col-span-2">
        <Sidebar />
      </div>
      <main className="col-span-8 bg-background rounded-tl-2xl rounded-bl-2xl p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;