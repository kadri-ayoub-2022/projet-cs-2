import { useState, useEffect } from "react"
import Modal from "../Modal"
import { Task } from "../../types"
import Axios from "../../utils/api";

interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  onSave: (editedTask: {
    title: string
    description: string
    status: string
    priority: string
    evaluation?: string | null
  }) => void
}

export default function EditTaskModal({ isOpen, onClose, task, onSave }: EditTaskModalProps) {
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    evaluation: null as string | null,
  })

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        evaluation: task.evaluation,
      })
    }
  }, [task])

  const handleSubmit = async () => {
    if (editedTask.title && task) {
      try {
        const token = localStorage.getItem("token");
        const response = await Axios.put(
          `/monitoring/api/tasks/${task.taskId}`,
          {
            title: editedTask.title,
            description: editedTask.description,
            status: editedTask.status,
            priority: editedTask.priority,
            evaluation: editedTask.evaluation,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        console.log("Task updated successfully:", response.data); // Debugging log
        onSave(response.data); // Pass the updated task back to the parent
        onClose();
      } catch (error) {
        console.error("Error updating task:", error.response?.data || error.message); // Improved error logging
      }
    } else {
      console.error("Validation failed: Missing required fields or task"); // Debugging log
    }
  }

  if (!isOpen || !task) return null

  return (
    <Modal title="Edit Task" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 mb-1">
            Task Title
          </label>
          <input
            id="edit-title"
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            id="edit-description"
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            className="w-full border border-slate-300 rounded-md px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            value={editedTask.status}
            onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
            className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
          <select
            value={editedTask.priority}
            onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
            className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
        <div>
          <label htmlFor="edit-evaluation" className="block text-sm font-medium text-slate-700 mb-1">
            Evaluation (Optional)
          </label>
          <textarea
            id="edit-evaluation"
            value={editedTask.evaluation || ""}
            onChange={(e) => setEditedTask({ ...editedTask, evaluation: e.target.value || null })}
            placeholder="Add evaluation notes"
            className="w-full border border-slate-300 rounded-md px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
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
          Save Changes
        </button>
      </div>
    </Modal>
  )
}
