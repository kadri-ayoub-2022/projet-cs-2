import { format } from "date-fns";
import { useState } from "react";
import {
  FiClock,
  FiEdit2,
  FiMessageSquare,
  FiFile,
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { Task } from "../../types";
import CommentSection from "./CommentSection";
import FileSection from "./FileSection";
import Axios from "../../utils/api";

interface TaskCardProps {
  task: Task;
  projectId: number;
  onEditTask: (task: Task) => void;
  onAddComment: (projectId: number, taskId: number, comment: string) => void;
}

export default function TaskCard({
  task,
  onEditTask,
}: TaskCardProps) {
  const [openComments, setOpenComments] = useState(false);
  const [openFiles, setOpenFiles] = useState(false);
  const [newComment, setNewComment] = useState("");

  const toggleComments = () => {
    setOpenComments(!openComments);
    if (openFiles) setOpenFiles(false);
  };

  const toggleFiles = () => {
    setOpenFiles(!openFiles);
    if (openComments) setOpenComments(false);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const token = localStorage.getItem("token");
        const response = await Axios.post(
          "/monitoring/api/comments",
          {
            content: newComment,
            taskId: task.taskId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        task.comments.push({
          ...response.data,
          avatar: "/placeholder.svg?height=40&width=40",
          author: "Random User",
        });
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error.response?.data || error.message);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem("token");
      await Axios.delete(`/monitoring/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Immediately update the UI
      task.comments = task.comments.filter((comment) => comment.commentId !== commentId);
      setNewComment(""); // Trigger re-render
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data || error.message);
    }
  };

  // Helper function to determine status color and text
  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return {
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-800",
          icon: <FiCheckCircle className="mr-1" />,
          text: "Completed",
        };
      case "IN_PROGRESS":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          icon: <FiClock className="mr-1" />,
          text: "In Progress",
        };
      case "PENDING":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          icon: <FiAlertCircle className="mr-1" />,
          text: "Pending",
        };
      default:
        return {
          bgColor: "bg-slate-100",
          textColor: "text-slate-800",
          icon: null,
          text: status,
        };
    }
  };

  // Get status display info
  const statusInfo = getStatusInfo(task.status);

  // Helper function to determine priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "HIGH":
        return (
          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full flex items-center">
            <FiAlertTriangle className="mr-1" size={12} />
            High Priority
          </span>
        );
      case "MEDIUM":
        return (
          <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
            Medium Priority
          </span>
        );
      case "LOW":
        return (
          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
            Low Priority
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group relative">
      {/* Edit button that appears on hover */}
      <button
        onClick={() => onEditTask(task)}
        className="absolute top-3 right-3 bg-blue-100 text-blue-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-200"
      >
        <FiEdit2 size={16} />
      </button>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md ${statusInfo.bgColor} ${statusInfo.textColor}`}
              >
                {statusInfo.icon}
                {statusInfo.text}
              </span>
              {getPriorityBadge(task.priority)}
            </div>
            <h3 className="text-lg font-semibold mt-2 text-slate-800">
              {task.title}
            </h3>
          </div>
          <div className="text-sm text-slate-500 flex flex-col items-end">
            <div className="flex items-center bg-slate-50 px-3 py-1 rounded-md">
              <FiClock className="mr-1.5 text-blue-500" />
              <span>Start: {format(task.date_begin, "MMM d, yyyy")}</span>
            </div>
            {task.date_end && (
              <div className="flex items-center mt-1.5 bg-slate-50 px-3 py-1 rounded-md">
                <FiClock className="mr-1.5 text-blue-500" />
                <span>Due: {format(task.date_end, "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed mt-3">
          {task.description}
        </p>

        {task.evaluation && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md text-sm">
            <span className="font-medium text-blue-700">Evaluation:</span>{" "}
            {task.evaluation}
          </div>
        )}
      </div>
      <div className="flex justify-start space-x-4 px-5 py-3 bg-slate-50 border-t border-slate-100">
        <button
          onClick={toggleComments}
          className={`text-sm flex items-center px-3 py-1.5 rounded-md transition-colors ${
            openComments
              ? "text-blue-600 bg-blue-50"
              : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          <FiMessageSquare className="mr-2" />
          Comments ({task.comments.length})
        </button>
        <button
          onClick={toggleFiles}
          className={`text-sm flex items-center px-3 py-1.5 rounded-md transition-colors ${
            openFiles
              ? "text-blue-600 bg-blue-50"
              : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          <FiFile className="mr-2" />
          Files ({task.files.length})
        </button>
      </div>

      {/* Comments section */}
      {openComments && (
        <CommentSection
          comments={task.comments}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          handleDeleteComment={handleDeleteComment}
        />
      )}

      {/* Files section */}
      {openFiles && <FileSection files={task.files} />}
    </div>
  );
}
