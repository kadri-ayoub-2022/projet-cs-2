import type React from "react";

import { useState, useEffect } from "react";
import { FiTrendingUp, FiPercent, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "../../contexts/useAuth";

interface ProjectProgressProps {
  projectId: number;
  initialProgress: number;
  onProgressUpdate: (projectId: number, newProgress: number) => void;
}

export default function ProjectProgress({
  projectId,
  initialProgress,
  onProgressUpdate,
}: ProjectProgressProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(initialProgress.toString());
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  
  const isTeacher = user?.role === "teacher";

  console.log({isTeacher});
  

  useEffect(() => {
    setProgress(initialProgress);
    setInputValue(initialProgress.toString());
  }, [initialProgress]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user?.role !== "teacher") return; // Prevent non-teachers from editing
    const value = e.target.value;
    setInputValue(value);

    // Validate input
    if (value === "") {
      setError(null);
    } else {
      const numValue = Number.parseInt(value, 10);
      if (isNaN(numValue)) {
        setError("Please enter a valid number");
      } else if (numValue < 0 || numValue > 100) {
        setError("Progress must be between 0 and 100");
      } else {
        setError(null);
      }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user?.role !== "teacher") return; // Prevent non-teachers from editing
    const value = Number.parseInt(e.target.value, 10);
    setProgress(value);
    setInputValue(value.toString());
    setError(null);
  };

  const handleSave = () => {
    if (user?.role !== "teacher") return; // Prevent non-teachers from editing
    if (!error && inputValue !== "") {
      const newProgress = Number.parseInt(inputValue, 10);
      setProgress(newProgress);
      onProgressUpdate(projectId, newProgress);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {

    setInputValue(progress.toString());
    setError(null);
    setIsEditing(false);
  };

  // Determine progress color
  const getProgressColor = () => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  // Get status text
  const getStatusText = () => {
    if (progress < 30) return "Just started";
    if (progress < 70) return "In progress";
    if (progress < 100) return "Almost there";
    return "Completed";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <FiTrendingUp className="text-blue-500 mr-2" />
          <h3 className="text-sm font-medium text-slate-700">
            Project Progress
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <span className="text-sm font-medium text-slate-800">
              {progress}
            </span>
            <FiPercent size={14} className="text-slate-500" />
            <span className="ml-2 text-xs text-slate-500 hidden sm:inline">
              {getStatusText()}
            </span>
          </div>

          {isTeacher && !isEditing   ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
              title="Edit progress"
            >
              <FiEdit2 size={16} />
            </button>
          ) : isTeacher && isEditing ? (
            <div className="flex space-x-1">
              <button
                onClick={handleSave}
                disabled={!!error}
                className={`p-1 rounded-full ${
                  error
                    ? "text-slate-400"
                    : "text-emerald-600 hover:bg-emerald-50"
                } transition-colors`}
                title="Save"
              >
                <FiCheck size={16} />
              </button>
              <button
                onClick={handleCancel}
                className="text-red-600 hover:bg-red-50 p-1 rounded-full transition-colors"
                title="Cancel"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Progress bar with slider overlay when editing */}
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor()} transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        ></div>

        {isEditing && (
          <input
            type="range"
            min="0"
            max="100"
            value={error ? progress : inputValue}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        )}
      </div>

      {/* Compact edit mode */}
      {isEditing && (
        <div className="flex items-center mt-2 space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={handleProgressChange}
              className={`w-full pl-2 pr-7 py-1 text-xs border ${
                error ? "border-red-300" : "border-slate-300"
              } rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiPercent size={12} className="text-slate-400" />
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}
