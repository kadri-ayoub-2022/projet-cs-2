import { useState } from "react";
import Modal from "../Modal";
import Axios from "../../utils/api";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    description: string;
    date_begin: string;
    date_end?: string;
    priority: string;
  }) => void;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
  selectedProject,
}: AddTaskModalProps & { selectedProject: number | null }) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date_begin: "",
    date_end: "",
    priority: "MEDIUM",
  });

  const handleSubmit = async () => {
    if (newTask.title && newTask.date_begin && selectedProject) {
      try {
        const token = localStorage.getItem("token");
        const response = await Axios.post(
          "/monitoring/api/tasks",
          {
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            date_begin: newTask.date_begin,
            date_end: newTask.date_end || null,
            projectId: selectedProject,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Task added successfully:", response.data); // Debugging log
        onAddTask(response.data); // Pass the created task back to the parent
        setNewTask({
          title: "",
          description: "",
          date_begin: "",
          date_end: "",
          priority: "MEDIUM",
        });
        onClose();
      } catch (error) {
        console.error("Error adding task:", error.response?.data || error.message); // Improved error logging
      }
    } else {
      console.error("Validation failed: Missing required fields or project"); // Debugging log
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Add New Task" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Task Title
          </label>
          <input
            id="title"
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Enter task title"
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Describe the task in detail"
            className="w-full border border-slate-300 rounded-md px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Priority
          </label>
          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="date_begin"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Start Date
            </label>
            <input
              id="date_begin"
              type="date"
              value={newTask.date_begin}
              onChange={(e) =>
                setNewTask({ ...newTask, date_begin: e.target.value })
              }
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="date_end"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              End Date (Optional)
            </label>
            <input
              id="date_end"
              type="date"
              value={newTask.date_end}
              onChange={(e) =>
                setNewTask({ ...newTask, date_end: e.target.value })
              }
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Create Task
        </button>
      </div>
    </Modal>
  );
}
