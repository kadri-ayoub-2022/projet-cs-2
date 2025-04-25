import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Title from "../../components/admin/Title";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Axios from "../../utils/api";
import Select from "../../components/Select";

const AddStudents: React.FC = () => {
  const [student, setStudent] = useState({
    fullName: "",
    email: "",
    password: "",
    registrationNumber: "",
    average: "",
    specialty: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [specialties, setSpecialties] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await Axios.get("/service-admin/api/admin/specialty");
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
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Check if any field is empty
    if (
      !student.fullName.trim() ||
      !student.email.trim() ||
      !student.password.trim() ||
      !student.registrationNumber.trim() ||
      !student.average.trim() ||
      !student.specialty.trim()
    ) {
      toast.error("All fields are required!");
      setLoading(false);
      return; // Stop execution if validation fails
    }

    console.log(student);

    try {
      await Axios.post("/service-admin/api/admin/students", {
        ...student,
        specialty: JSON.parse(student.specialty),
      });
      toast.success("Student added successfully");

      setStudent({
        fullName: "",
        email: "",
        password: "",
        registrationNumber: "",
        average: "",
        specialty: "",
      });
    } catch {
      toast.error("Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCSV = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await Axios.post("/service-admin/api/admin/students/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Students added successfully");
      setFile(null);
    } catch {
      toast.error("Failed to upload CSV file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <Title
        title="Add Students"
        description="Add a single student or upload a CSV file to add multiple students."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={student.fullName}
          onChange={handleChange}
          placeholder="Enter full name"
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={student.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={student.password}
          onChange={handleChange}
          placeholder="Enter password"
        />
        <Input
          label="Registration Number"
          type="text"
          name="registrationNumber"
          value={student.registrationNumber}
          onChange={handleChange}
          placeholder="Enter registration number"
        />
        <Input
          label="Average"
          type="number"
          name="average"
          value={student.average}
          onChange={handleChange}
          placeholder="Enter average"
        />
        <Select
          label="Specialty"
          value={student.specialty}
          name="specialty"
          onChange={handleChange}
          options={specialties.map((spec) => ({
            label: spec.acronym,
            value: JSON.stringify(spec),
          }))}
        />
      </div>

      <div className="mt-4">
        <Button
          text="Add Student"
          onClick={handleSubmit}
          loading={loading}
          disabled={
            loading ||
            !student.fullName.trim() ||
            !student.email.trim() ||
            !student.password.trim() ||
            !student.registrationNumber.trim() ||
            !student.average.trim() ||
            !student.specialty.trim()
          }
        />
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <p className="font-medium mb-2 text-gray-700">📂 Upload CSV File</p>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#2E86FB] rounded-lg cursor-pointer hover:bg-blue-50 transition">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <p className="text-gray-600 text-sm font-medium">{file.name}</p>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Drag & Drop your CSV file here
              </p>
              <p className="text-xs text-gray-500">or click to select a file</p>
            </div>
          )}
        </label>
        <Button
          text="📤 Upload CSV"
          onClick={handleUploadCSV}
          className="mt-4 w-full bg-[#2E86FB] hover:bg-blue-700"
          loading={loading}
          disabled={loading || !file}
        />
      </div>
    </div>
  );
};

export default AddStudents;
