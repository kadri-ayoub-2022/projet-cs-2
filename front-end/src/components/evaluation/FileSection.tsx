import { format } from "date-fns";
import { FiFile, FiDownload } from "react-icons/fi";
import { File } from "../../types";

interface FileSectionProps {
  files: File[];
}

export default function FileSection({ files }: FileSectionProps) {
  return (
    <div className="px-5 pb-5 border-t border-slate-200 pt-4 bg-white">
      <h4 className="font-medium mb-4 text-slate-800 flex items-center">
        <FiFile className="mr-2 text-blue-500" />
        Files
      </h4>
      <div className="space-y-2 mb-5">
        {files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.fileId}
              className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="h-9 w-9 rounded bg-blue-100 flex items-center justify-center mr-3">
                <FiFile className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <a
                  href={file.url || "#"}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {file.fileName}
                </a>
                <div className="flex text-xs text-slate-500 mt-0.5">
                  {file.size && <span className="mr-2">{file.size}</span>}
                  <span>{format(file.createdAt, "MMM d, yyyy")}</span>
                </div>
              </div>
              <button className="text-slate-500 hover:text-blue-600 text-sm px-3 py-1 flex items-center">
                <FiDownload className="mr-1" />
                Download
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-lg">
            <FiFile className="mx-auto text-slate-400 mb-2" size={24} />
            <p className="text-slate-500 text-sm">No files attached</p>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex items-center justify-center flex-1 border border-slate-300 rounded-md px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <FiFile className="mr-2 text-blue-500" />
          Choose File
        </label>
        <input id="file-upload" type="file" className="hidden" />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Upload
        </button>
      </div>
    </div>
  );
}
