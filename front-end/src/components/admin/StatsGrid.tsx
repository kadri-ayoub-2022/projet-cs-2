import React from "react";
import { FaUsers, FaUser } from "react-icons/fa";

// stat card

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color?: string;
}

const StatCard = ({
  icon,
  title,
  value,
  color = "text-gray-700",
}: StatCardProps) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <span className={`${color}`}>{icon}</span>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);


interface StatsData {
  total: number;
  completed: number;
  notCompleted: number;
  fullProgress: number;
  partialProgress: number;
  studentCount: number;
  teacherCount: number;
  undeliveredProjects: number;
  deliveredProjects: number;
}

interface StatsGridProps {
  stats: StatsData;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      <StatCard
        icon={<FaUser className="text-2xl" />}
        title="Total Users"
        value={stats.studentCount + stats.teacherCount}
      />
      <StatCard
        icon={<FaUser className="text-2xl" />}
        title="Teachers Number"
        value={stats.teacherCount}
        color="text-blue-500"
      />
      <StatCard
        icon={<FaUser className="text-2xl" />}
        title="Students Number"
        value={stats.studentCount}
        color="text-blue-300"
      />
      <StatCard
        icon={<FaUsers className="text-2xl" />}
        title="Teams"
        value={stats.total}
        color="text-blue-500"
      />
    </div>
  );
};

export default StatsGrid;
