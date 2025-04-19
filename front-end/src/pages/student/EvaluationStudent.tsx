import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { ProjectTheme, type Task } from "../../types";
import EmptyState from "../../components/evaluation/EmptyState";
import TeamMembers from "../../components/evaluation/TeamMembers";
import TaskList from "../../components/evaluation/TaskList";
import AddTaskModal from "../../components/evaluation/AddTaskModal";
import EditTaskModal from "../../components/evaluation/EditTaskModal";
import Button from "../../components/Button";
import Axios from "../../utils/api";
import ProjectProgress from "../../components/evaluation/ProjectProgress";

export default function EvaluationTeacher() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [teacherProjects, setTeacherProjects] = useState<ProjectTheme[]>([]);
  const [studentProject, setStudentProject] = useState<ProjectTheme | null>(
    null
  );
  const [team, setTeam] = useState({
    supervisor: null,
    student1: null,
    student2: null,
  });
  const [tasks, setTasks] = useState<{ [key: number]: Task[] }>({});
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  // const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  // const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    async function fetchProjectDeatails() {
      const token = localStorage.getItem("token");
      try {
        const response = await Axios.get(
          "/monitoring/api/project/themes-by-student",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Response data:", response.data); // Debugging log
        // Extract projects and tasks from the response

        const project = response.data.projectTheme;
        setStudentProject(project);

        setTasks(response.data.tasks);

        setSelectedProject(project.themeId);
      } catch (error) {
        console.error(
          "Error fetching projects:",
          error.response || error.message
        );
      }
    }
    fetchProjectDeatails();
  }, []);

  useEffect(() => {
    if (studentProject) {
      const project = studentProject;
      console.log("from use effect");

      console.log(project);

      const teamMembers = {
        supervisor: project?.teacher,
        student1: project?.student1,
        student2: project?.student2 || null,
      };

      setTeam(teamMembers);
    }
  }, [studentProject]);

  useEffect(() => {
    console.log("Team state updated:", team);
  }, [team]);

  const handleAddComment = (
    projectId: number,
    taskId: number,
    commentText: string
  ) => {
    if (commentText.trim()) {
      const updatedTasks = { ...tasks };
      const taskIndex = updatedTasks[projectId].findIndex(
        (t) => t.taskId === taskId
      );

      if (taskIndex !== -1) {
        const newCommentObj = {
          commentId:
            Math.max(
              0,
              ...updatedTasks[projectId][taskIndex].comments.map(
                (c) => c.commentId
              ),
              0
            ) + 1,
          content: commentText,
          createdAt: new Date(),
          taskId: taskId,
          author: "You",
        };

        updatedTasks[projectId][taskIndex].comments.push(newCommentObj);
        setTasks(updatedTasks);
      }
    }
  };

  return (
    <div className="flex min-h-screen ">
      {/* Main content */}
      <div className="flex-1 ">
        {/* Project tabs */}
        <div className=" border-b border-slate-200">
          <div className="container mx-auto px-6 py-3"></div>
        </div>

        {/* Task board */}
        <div className="container mx-auto px-6 py-4">
          {selectedProject ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-slate-800">
                  {studentProject?.title}
                </h1>
              </div>

              <ProjectProgress
                projectId={selectedProject}
                initialProgress={
                  studentProject?.progression || 0
                }
                onProgressUpdate={() => {}}
              />
              <div className="flex gap-6">
                {/* Tasks column */}
                <TaskList
                  tasks={tasks}
                  projectId={selectedProject}
                  onEditTask={() => {}}
                  onAddComment={handleAddComment}
                  onAddTask={() => setIsAddTaskOpen(true)}
                  team={team}
                />

                {/* Team members column */}
                <TeamMembers team={team} selectedProject={selectedProject} />
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {/* <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
        selectedProject={selectedProject} // Ensure selectedProject is passed
      /> */}

      {/* Edit Task Modal */}
      {/* <EditTaskModal
        isOpen={isEditTaskOpen}
        onClose={() => setIsEditTaskOpen(false)}
        task={editingTask}
        onSave={saveEditedTask}
      /> */}
    </div>
  );
}
