import React from "react";
import { FaProjectDiagram } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ProjectStatus {
  status: string;
  count: number;
}

interface ProjectsOverviewProps {
  projectsByStatus: ProjectStatus[];
}

const ProjectsOverview: React.FC<ProjectsOverviewProps> = ({
  stats
}) => {

  const projectsStats = [
    { status: "Unvalidated", count: stats.notCompleted },
    { status: "Validated", count: stats.completed },
    { status: "In Progress", count: stats.partialProgress },
    { status: "Completed", count: stats.fullProgress },
    { status: "Assigned", count: stats.deliveredProjects },
    { status: "Not assigned", count: stats.undeliveredProjects },
  ];
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaProjectDiagram className="text-blue-600" />
        Projects Overview
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={projectsStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" tick={{ fill: "#6b7280" }} />
            <YAxis
              tick={{ fill: "#6b7280" }}
              domain={[0, stats.total || "dataMax"]}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar
              dataKey="count"
              name="Projects"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectsOverview;
