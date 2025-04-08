import { FiUsers } from "react-icons/fi";
import { Team } from "../../types";

interface TeamMembersProps {
  team: Team | undefined;
  selectedProject: number | null;
}

export default function TeamMembers({
  team,
  selectedProject,
}: TeamMembersProps) {
  return (
    <div className="w-80 shrink-0">
      <div className="mb-4 flex items-center">
        <div className="bg-blue-100 text-blue-800 p-1 rounded mr-2 flex items-center justify-center">
          <FiUsers size={20} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Team Members</h2>
      </div>

      {selectedProject && team ? (
        <div className="space-y-6">
          {/* Supervisor */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-sm font-medium text-slate-500 mb-3">
              Supervisor
            </h3>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full overflow-hidden mr-3 bg-slate-200">
                <img
                  src={team.supervisor.avatar || "/placeholder.svg"}
                  alt={team.supervisor.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-slate-800">
                  {team.supervisor.name}
                </p>
                <p className="text-sm text-slate-500">
                  {team.supervisor.email}
                </p>
              </div>
            </div>
          </div>

          {/* Students */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-sm font-medium text-slate-500 mb-3">
              Students
            </h3>
            <div className="space-y-4">
              {team.students.map((student) => (
                <div key={student.id} className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-slate-200">
                    <img
                      src={student.avatar || "/placeholder.svg"}
                      alt={student.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-5 text-center">
          <p className="text-slate-500">
            Select a project to view team members
          </p>
        </div>
      )}
    </div>
  );
}
