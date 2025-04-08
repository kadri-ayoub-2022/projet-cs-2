import { FiClipboard } from "react-icons/fi";


export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-dashed border-slate-300 shadow-sm">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <FiClipboard className="text-blue-500" size={32} />
      </div>
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          No Project Selected
        </h2>
        <p className="text-slate-500 mb-6">
          Select a project from the tabs above to view and manage its tasks.
        </p>
      
      </div>
    </div>
  );
}
