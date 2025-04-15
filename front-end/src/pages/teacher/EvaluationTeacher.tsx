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

export default function EvaluationTeacher() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [teacherProjects, setTeacherProjects] = useState<ProjectTheme[]>([]);
  const [team, setTeam] = useState({
    supervisor: { name: "", email: "" },
    student1: null,
    student2: null,
  });  const [tasks, setTasks] = useState<{ [key: number]: Task[] }>({});
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      const token = localStorage.getItem("token");
      try {
        const response = await Axios.get(
            "/monitoring/api/project/themes-by-teacher",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
        );

        // Extract projects and tasks from the response
        const projects = response.data.map((item: any) => item.projectTheme);
        const tasksByProject: { [key: number]: Task[] } = {};
        response.data.forEach((item: any) => {
          tasksByProject[item.projectTheme.themeId] = item.tasks;
        });

        setTeacherProjects(projects.filter((project: ProjectTheme) => project.student1Id !== null));
        setTasks(tasksByProject);
      } catch (error ) {
        console.error(
            "Error fetching projects:",
            error.response || error.message
        );
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const project = getProject(selectedProject);
      console.log('from use effect')

      console.log(project)

      const teamMembers = {
        supervisor: project?.teacher,
        student1: project?.student1,
        student2: project?.student2 || null,
      };

      console.log(teamMembers)

      setTeam(teamMembers)


      console.log(team);


    }

  }, [selectedProject]);

  useEffect(() => {
    console.log("Team state updated:", team);
  }, [team]);

  const handleAddTask = (newTask: {
    title: string;
    description: string;
    date_begin: Date;
    date_end?: Date;
    priority: string;
  }) => {
    if (selectedProject) {
      console.log("Adding task to project:", selectedProject, newTask); // Debugging log
      const newTaskObj: Task = {
        taskId:
            Math.max(
                0,
                ...(tasks[selectedProject]?.map((t) => t.taskId) || [0])
            ) + 1,
        title: newTask.title,
        description: newTask.description,
        status: "IN_PROGRESS",
        priority: newTask.priority,
        createdAt: new Date(),
        date_begin: newTask.date_begin,
        date_end: newTask.date_end || null,
        evaluation: null,
        comments: [],
        files: [],
      };

      setTasks((prev) => ({
        ...prev,
        [selectedProject]: [...(prev[selectedProject] || []), newTaskObj],
      }));

      setIsAddTaskOpen(false);
    } else {
      console.error("No project selected for adding task"); // Debugging log
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditTaskOpen(true);
  };

  const saveEditedTask = (editedTask: {
    title: string;
    description: string;
    status: string;
    priority: string;
    evaluation?: string | null;
  }) => {
    if (selectedProject && editingTask) {
      const updatedTasks = { ...tasks };
      const taskIndex = updatedTasks[selectedProject].findIndex(
          (t) => t.taskId === editingTask.taskId
      );

      if (taskIndex !== -1) {
        updatedTasks[selectedProject][taskIndex] = {
          ...updatedTasks[selectedProject][taskIndex],
          title: editedTask.title,
          description: editedTask.description,
          status: editedTask.status,
          priority: editedTask.priority,
          evaluation: editedTask.evaluation ?? null,
        };

        setTasks(updatedTasks);
        setIsEditTaskOpen(false);
        setEditingTask(null);
      }
    }
  };

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

  const getProjectName = (id: number | null) => {
    if (!id) return "";
    return teacherProjects.find((p) => p.themeId === id)?.title || "";
  };

  const getProject = (id: number | null) => {
    if (!id) return null;
    return teacherProjects.find((p) => p.themeId === id) || null;
  };


  return (
      <div className="flex min-h-screen ">

        {/* Main content */}
        <div className="flex-1 ">
          {/* Project tabs */}
          <div className=" border-b border-slate-200">
            <div className="container mx-auto px-6 py-3">
              <div className="flex space-x-4 overflow-x-auto">
                {teacherProjects.map((project) => (
                    <Button
                        key={project.themeId}
                        onClick={() => setSelectedProject(project.themeId)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            selectedProject === project.themeId
                                ? "bg-primary text-white shadow-sm"
                                : "bg-white !text-slate-700 border border-slate-200  hover:!text-white  hover:border-blue-300 hover:bg-primary"
                        }`}
                        text={project.title}
                    />
                ))}
              </div>
            </div>
          </div>

          {/* Task board */}
          <div className="container mx-auto px-6 py-4">
            {selectedProject ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-slate-800">
                      {getProjectName(selectedProject)}
                    </h1>
                    <Button
                        onClick={() => setIsAddTaskOpen(true)}
                        className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center shadow-sm transition-colors"
                        icon={<FiPlus className="mr-2" />}
                        text="Add Task"
                    />
                  </div>

                  <div className="flex gap-6">
                    {/* Tasks column */}
                    <TaskList
                        tasks={tasks[selectedProject] || []}
                        projectId={selectedProject}
                        onEditTask={handleEditTask}
                        onAddComment={handleAddComment}
                        onAddTask={() => setIsAddTaskOpen(true)}
                    />

                    {/* Team members column */}
                    <TeamMembers
                        team={team}
                        selectedProject={selectedProject}
                    />
                  </div>
                </div>
            ) : (
                <EmptyState
                    projects={teacherProjects}
                    onSelectProject={setSelectedProject}
                />
            )}
          </div>
        </div>

        {/* Add Task Modal */}
        <AddTaskModal
            isOpen={isAddTaskOpen}
            onClose={() => setIsAddTaskOpen(false)}
            onAddTask={handleAddTask}
            selectedProject={selectedProject} // Ensure selectedProject is passed
        />

        {/* Edit Task Modal */}
        <EditTaskModal
            isOpen={isEditTaskOpen}
            onClose={() => setIsEditTaskOpen(false)}
            task={editingTask}
            onSave={saveEditedTask}
        />
      </div>
  );
}
