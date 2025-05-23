import { useState, useRef } from "react";
import {  IoDocument } from "react-icons/io5";
import Modal from "../Modal";

interface PVModalProps {
  themeId: number;
  existingPvUrl?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PVModal = ({
  themeId,
  existingPvUrl,
  onClose,
  onSuccess,
}: PVModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please select a PDF file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload to Cloudinary
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "pfe-2cs");
      data.append("cloud-name", "dpurxtwvs");
      data.append("api_key", "585412418698357");
      data.append("folder", "project-themes");
      data.append("resource_type", "raw");

      const uploadRes = await fetch(
        "https://api.cloudinary.com/v1_1/dpurxtwvs/raw/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!uploadRes.ok) throw new Error("File upload failed");

      const { secure_url } = await uploadRes.json();

      // Update database
      const updateRes = await fetch(
        `http://localhost:8085/api/thesisDefense/Period/addPv/${themeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ pv: secure_url }),
        }
      );

      if (!updateRes.ok) throw new Error("Failed to update PV");

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Manage PV Document" onClose={onClose}>
      <div className="space-y-4">
        {existingPvUrl && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Current PV:</p>
            <a
              href={existingPvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center"
            >
              <IoDocument className="mr-2" />
              View Current PV
            </a>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            {existingPvUrl ? "Replace PV Document" : "Upload PV Document"}
          </label>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors"
          >
            {file ? (
              <span className="text-blue-600">PDF Selected: {file.name}</span>
            ) : (
              <span className="text-gray-500">Click to select PDF file</span>
            )}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save PV"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PVModal;
