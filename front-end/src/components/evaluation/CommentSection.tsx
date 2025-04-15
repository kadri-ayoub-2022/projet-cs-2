import { format } from "date-fns";
import { FiMessageSquare, FiX } from "react-icons/fi";
import { Comment } from "../../types";

interface CommentSectionProps {
  comments: Comment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
  handleDeleteComment: (commentId: number) => void; // Add delete handler
}

export default function CommentSection({
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  handleDeleteComment,
}: CommentSectionProps) {
  return (
    <div className="px-5 pb-5 border-t border-slate-200 pt-4 bg-white">
      <h4 className="font-medium mb-4 text-slate-800 flex items-center">
        <FiMessageSquare className="mr-2 text-blue-500" />
        Comments
      </h4>
      <div className="space-y-4 mb-5">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.commentId}
              className="bg-slate-50 p-4  rounded-lg relative group"
            >
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-slate-200">
                  <img
                    src={"/src/assets/avatar.png"}
                    alt={comment.author || "User"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-800">
                      {comment.author || "User"}
                    </span>
                    <span className="text-slate-500">
                      {format(comment.createdAt, "MMM d, h:mm a")}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteComment(comment.commentId)}
                className="absolute top-3 right-3 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-200"
                title="Delete comment"
              >
                <FiX size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-lg">
            <FiMessageSquare
              className="mx-auto text-slate-400 mb-2"
              size={24}
            />
            <p className="text-slate-500 text-sm">No comments yet</p>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
