import { format } from "date-fns";
import { FiFile, FiDownload, FiX, FiUpload } from "react-icons/fi";
import { File } from "../../types";
import { useEffect, useState } from "react";

interface FileSectionProps {
  files: File[];
  onFileUpload: (newFile: File) => void; // Add callback for parent component
}

export default function FileSection({ files, onFileUpload }: FileSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console.log(files);
  }, [files]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Reset previous state
      setUploadError(null);
      setUploadProgress(0);

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size exceeds 5MB limit");
        return;
      }

      // Create a temporary File object to display before upload
      setSelectedFile({
        fileId: Math.random() * 100000, // Temporary ID for local state
        fileName: file.name,
        size: formatFileSize(file.size),
        url: URL.createObjectURL(file),
        createdAt: new Date(),
        rawFile: file, // Store the actual File object for upload
      });
    }
  };

  const uploadToCloudinary = async () => {
    if (!selectedFile?.rawFile) {
      setUploadError("No file selected");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload to Cloudinary first
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", selectedFile.rawFile);
      cloudinaryData.append("upload_preset", "pfe-2cs");
      cloudinaryData.append("cloud-name", "dpurxtwvs");
      cloudinaryData.append("api_key", "585412418698357");
      cloudinaryData.append("folder", "project-themes");
      cloudinaryData.append("resource_type", "raw");

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dpurxtwvs/raw/upload",
        { method: "POST", body: cloudinaryData }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const cloudinaryResult = await cloudinaryResponse.json();

      // Now call parent's handler to store in database
      await onFileUpload({
        fileId: cloudinaryResult.public_id,
        fileName: selectedFile.fileName,
        url: cloudinaryResult.secure_url,
        size: selectedFile.size,
        createdAt: new Date(),
        rawFile: selectedFile.rawFile,
      });

      resetFileSelection();
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetFileSelection = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError(null);
    // Clear file input
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]);
  };

  return (
    <div className="px-5 pb-5 border-t border-slate-200 pt-4 bg-white">
      <h4 className="font-medium mb-4 text-slate-800 flex items-center">
        <FiFile className="mr-2 text-blue-500" />
        Files
      </h4>

      {/* Selected file preview (before upload) */}
      {selectedFile && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded bg-blue-100 flex items-center justify-center mr-3">
              <FiFile className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <span className="text-blue-600 font-medium">
                {selectedFile.fileName}
              </span>
              <div className="flex text-xs text-slate-500 mt-0.5">
                <span className="mr-2">{selectedFile.size}</span>
                <span>Ready to upload</span>
              </div>
            </div>
            <button
              onClick={resetFileSelection}
              className="text-slate-500 hover:text-red-500"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Upload progress/error */}
          {isUploading && (
            <div className="mt-2">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {uploadError && (
            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
          )}
        </div>
      )}

      {/* Existing files list */}
      <div className="space-y-2 mb-5">
        {files.length > 0
        ? files.map((file) => (
              <div
                key={file.fileId}
                className="flex items-center p-3  bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="h-9 w-9 rounded bg-blue-100 flex items-center justify-center mr-3">
                  <FiFile className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <a
                    href={file.fileUrl || "#"}
                    className="text-blue-600 hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.fileName.slice(0, 64)}
                    {file.fileName.length > 64 && "..."} 
                  </a>
                  <div className="flex text-xs text-slate-500 mt-0.5">
                    {file.size && <span className="mr-2">{file.size}</span>}
                    <span>{format(file.createdAt, "MMM d, yyyy")}</span>
                  </div>
                </div>
                <a
                  href={file.fileUrl}
                  download
                  className="text-slate-500 hover:text-blue-600 text-sm px-3 py-1 flex items-center"
                >
                  <FiDownload className="mr-1" />
                  Download
                </a>
              </div>
            ))
          : !selectedFile && (
              <div className="text-center py-6 bg-slate-50 rounded-lg">
                <FiFile className="mx-auto text-slate-400 mb-2" size={24} />
                <p className="text-slate-500 text-sm">No files attached</p>
              </div>
            )}
      </div>

      {/* File upload controls */}
      <div className="flex gap-3">
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex items-center justify-center flex-1 border border-slate-300 rounded-md px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <FiFile className="mr-2 text-blue-500" />
          Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={uploadToCloudinary}
          disabled={!selectedFile || isUploading}
          className={`flex items-center justify-center ${
            isUploading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <FiUpload className="mr-2" />
              Upload
            </>
          )}
        </button>
      </div>
    </div>
  );
}
