import React from "react";
import Sidebar from "../components/student/Sidebar";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-10 h-screen">
      <div className="col-span-2">
        <Sidebar />
      </div>
      <main className="col-span-8 bg-background rounded-tl-2xl rounded-bl-2xl p-6 overflow-scroll">
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;