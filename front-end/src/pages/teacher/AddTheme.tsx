import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Axios from "../../utils/api";
import Title from "../../components/admin/Title";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { uploadFileToDrive } from "../../../googleDriveConfig";

interface Specialty {
  specialtyId: number;
  name: string;
}

const AddTheme: React.FC = () => {
  const [projectTheme, setProjectTheme] = useState({
    title: "",
    description: "",
    file: null as File | null,
    specialties: [] as number[],
  });
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await Axios.get(
          "http://localhost:7777/service-admin/api/admin/specialty"
        );
        setSpecialties(response.data);
      } catch {
        toast.error("Failed to fetch specialties");
      }
    };
    fetchSpecialties();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProjectTheme({ ...projectTheme, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProjectTheme({ ...projectTheme, file: e.target.files[0] });
    }
  };

  const handleUploadFile = async (): Promise<string | null> => {
    if (!projectTheme.file) return null;

    const data = new FormData();
    data.append("file", projectTheme.file);
    data.append("upload_preset", "pfe-2cs");
    data.append("cloud-name", "dpurxtwvs");
    data.append("api_key", "585412418698357");
    data.append("folder", "project-themes");
    data.append("resource_type", "raw");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dpurxtwvs/raw/upload",
      {
        method: "post",
        body: data,
      }
    );

    const url = await res.json();
    return url.secure_url;
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const fileUrl = await handleUploadFile();
      console.log("Uploaded File URL:", fileUrl);

      const updatedProjectTheme = {
        ...projectTheme,
        file: fileUrl,
      };

      await Axios.post(
        "http://localhost:7777/project-theme/api/project-themes",
        updatedProjectTheme,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Project theme added successfully");
      setProjectTheme({
        title: "",
        description: "",
        file: null,
        specialties: [],
      });
    } catch {
      toast.error("Failed to add project theme");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <Title
        title="Add Project Theme"
        description="Create a new project theme with specialties and file upload."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Input
          label="Title"
          type="text"
          name="title"
          value={projectTheme.title}
          onChange={handleChange}
          placeholder="Enter project title"
        />
        <Input
          label="Description"
          type="text"
          name="description"
          value={projectTheme.description}
          onChange={handleChange}
          placeholder="Enter project description"
        />
      </div>

      <div className="mt-4">
        <label className="block font-medium text-gray-700">
          Select Specialties
        </label>
        <div className="grid grid-cols-2 gap-2">
          {specialties.map((specialty) => (
            <label
              key={specialty.specialtyId}
              className="flex items-center space-x-2"
            >
              <input
                type="checkbox"
                value={specialty.specialtyId}
                checked={projectTheme.specialties.includes(
                  specialty.specialtyId
                )}
                onChange={() => {
                  const updatedSpecialties = new Set(projectTheme.specialties);
                  if (updatedSpecialties.has(specialty.specialtyId)) {
                    updatedSpecialties.delete(specialty.specialtyId);
                  } else {
                    updatedSpecialties.add(specialty.specialtyId);
                  }
                  setProjectTheme({
                    ...projectTheme,
                    specialties: Array.from(updatedSpecialties),
                  });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring focus:ring-blue-200"
              />
              <span>{specialty.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="block font-medium text-gray-700">Upload File</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="mt-4">
        <Button
          text={loading ? "Loading..." : "Add Project Theme"}
          disabled={loading}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AddTheme;
