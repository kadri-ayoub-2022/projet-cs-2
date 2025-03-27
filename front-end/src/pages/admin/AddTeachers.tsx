import React, { useState } from "react";
import { toast } from "react-toastify";
import Title from "../../components/admin/Title";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Axios from "../../utils/api";

const AddTeachers: React.FC = () => {
  const [teacher, setTeacher] = useState({
    fullName: "",
    email: "",
    password: "",
    registrationNumber: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      await Axios.post("/service-admin/api/admin/teachers", teacher);
      toast.success("Teacher added successfully");
      setTeacher({
        fullName: "",
        email: "",
        password: "",
        registrationNumber: "",
      });
    } catch {
      toast.error("Failed to add teacher");
    }
  };

  const handleUploadCSV = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      await Axios.post("/service-admin/api/admin/teachers/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      toast.success("Teachers added successfully");
      setFile(null);
    } catch (error: any) {
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data)) {
          error.response.data.forEach((errMsg: string) => toast.error(errMsg));
        } else {
          toast.error(error.response.data);
        }
      } else {
        toast.error("Failed to upload CSV file");
      }
    }
  };
  

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <Title
        title="Add Teachers"
        description="Add a single teacher or upload a CSV file to add multiple teachers."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Input label="Full Name" type="text" name="fullName" value={teacher.fullName} onChange={handleChange} placeholder="Enter full name" />
        <Input label="Email" type="email" name="email" value={teacher.email} onChange={handleChange} placeholder="Enter email" />
        <Input label="Password" type="password" name="password" value={teacher.password} onChange={handleChange} placeholder="Enter password" />
        <Input label="Registration Number" type="text" name="registrationNumber" value={teacher.registrationNumber} onChange={handleChange} placeholder="Enter registration number" />
      </div>

      <div className="mt-4">
        <Button text="Add Teacher" onClick={handleSubmit} />
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <p className="font-medium mb-2 text-gray-700">📂 Upload CSV File</p>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#2E86FB] rounded-lg cursor-pointer hover:bg-blue-50 transition">
          <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          {file ? (
            <p className="text-gray-600 text-sm font-medium">{file.name}</p>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 text-sm">Drag & Drop your CSV file here</p>
              <p className="text-xs text-gray-500">or click to select a file</p>
            </div>
          )}
        </label>
        <Button text="📤 Upload CSV" onClick={handleUploadCSV} className="mt-4 w-full bg-[#2E86FB] hover:bg-blue-700" />
      </div>
    </div>
  );
};

export default AddTeachers;
