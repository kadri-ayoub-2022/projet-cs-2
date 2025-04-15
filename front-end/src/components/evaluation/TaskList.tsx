import { FiClipboard, FiPlus } from "react-icons/fi";
import { Task, Team } from "../../types";
import TaskCard from "./TaskCard";
import { useAuth } from "../../contexts/useAuth";

interface TaskListProps {
  tasks: Task[];
  projectId: number;
  onEditTask: (task: Task) => void;
  onAddComment: (projectId: number, taskId: number, comment: string) => void;
  onAddTask: () => void;
  team: Team;
}

export default function TaskList({
  tasks,
  projectId,
  onEditTask,
  onAddComment,
  onAddTask,
  team
}: TaskListProps) {
  const { user} = useAuth();
  return (
    <div className="flex-1">
      <div className="mb-4 flex items-center">
        <div className="bg-blue-100 text-blue-800 p-1 rounded mr-2 flex items-center justify-center">
          <FiClipboard size={20} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Tasks</h2>
      </div>

      <div className="space-y-4">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              projectId={projectId}
              onEditTask={onEditTask}
              onAddComment={onAddComment}
              team={team}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClipboard className="text-blue-500" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No tasks yet
            </h3>

            {user?.role === "teacher" && (
              <>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  Get started by creating your first task for this project.
                </p>
                <button
                  onClick={onAddTask}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors flex items-center mx-auto"
                >
                  <FiPlus className="mr-2" />
                  Add Your First Task
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
