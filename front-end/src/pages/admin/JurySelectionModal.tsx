import { useState } from "react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

interface Teacher {
  teacherId: number;
  fullName: string;
  email: string;
  registrationNumber: string;
}

interface Speciality {
  specialtyId: number;
  name: string;
  acronym: string;
}

interface Student {
  studentId: number;
  fullName: string;
  email: string;
  registrationNumber: string;
  average: number;
  specialty: Speciality;
  createdAt: Date;
  role: "student";
}

interface ProjectTheme {
  themeId: number;
  jury: unknown;
  title: string;
  description: string;
  file: string;
  progression: number;
  date_selection_begin: string;
  date_selection_end: string;
  status: boolean;
  teacher: {
    teacherId: number;
    fullName: string;
    email: string;
    password: string;
    registrationNumber: string;
  };
  student1: Student | null;
  student2: Student | null;
  specialties: Array<Speciality>;
}

interface JurySelectionModalProps {
  show: boolean;
  onClose: () => void;
  theme: ProjectTheme;
  themeTitle: string;
  teachers: Teacher[];
  onJurySaved: () => void;
}

export default function JurySelectionModal({
  show,
  onClose,
  theme,
  themeTitle,
  teachers,
  onJurySaved,
}: JurySelectionModalProps) {
  const [juryMembers, setJuryMembers] = useState<number[]>([0, 0]);
  const [saving, setSaving] = useState<boolean>(false);

  const addJuryMember = () => {
    setJuryMembers([...juryMembers, 0]);
  };

  // Remove a jury member
  const removeJuryMember = (index: number) => {
    if (juryMembers.length <= 2) {
      toast.error("At least two jury members are required");
      return;
    }
    const newJuryMembers = [...juryMembers];
    newJuryMembers.splice(index, 1);
    setJuryMembers(newJuryMembers);
  };

  // Update a jury member selection
  const updateJuryMember = (index: number, teacherId: number) => {
    const newJuryMembers = [...juryMembers];
    newJuryMembers[index] = teacherId;
    setJuryMembers(newJuryMembers);
  };

  // Validate jury selection
  const validateJurySelection = () => {
    // Check if any jury member is not selected (value is 0)
    if (juryMembers.some((member) => member === 0)) {
      toast.error("Please select all jury members");
      return false;
    }

    // Check for duplicates
    const uniqueMembers = new Set(juryMembers);
    if (uniqueMembers.size !== juryMembers.length) {
      toast.error("Each jury member must be unique");
      return false;
    }

    return true;
  };

  // Save jury selection
  const saveJurySelection = async () => {
    if (!validateJurySelection()) return;

    setSaving(true);
    try {
      // Format data according to the required structure
      const selectedJuryMembers = juryMembers.map(juryId => {
        const teacher = teachers.find(t => t.teacherId === juryId);
        return {
          id: teacher?.teacherId,
          name: teacher?.fullName,
          email: teacher?.email
        };
      });

      // Format student data if present
      const student1Data = theme.student1 ? {
        id: theme.student1.studentId,
        name: theme.student1.fullName,
        email: theme.student1.email
      } : null;

      const student2Data = theme.student2 ? {
        id: theme.student2.studentId,
        name: theme.student2.fullName,
        email: theme.student2.email
      } : null;

      // Prepare payload according to required format
      const payload = {
        themeId: theme.themeId,
        title: theme.title,
        teacher: {
          id: theme.teacher.teacherId,
          name: theme.teacher.fullName,
          email: theme.teacher.email
        },
        student1: student1Data,
        student2: student2Data,
        jury: selectedJuryMembers
      };

      await axios.post("http://localhost:8085/api/thesisDefense", payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        }
      });

      toast.success("Jury members assigned successfully");
      onJurySaved();
      onClose();
    } catch (error) {
      console.error("Error assigning jury members:", error);
      toast.error("Failed to assign jury members");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {show && (
        <Modal title={`${theme.jury ? 'update' : 'Assign'} Jury for: ${themeTitle}`} onClose={onClose}>
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Select at least two jury members for this project theme. Each
              member must be unique.
            </p>

            {juryMembers.map((selectedTeacherId, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jury Member {index + 1}
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) =>
                      updateJuryMember(index, parseInt(e.target.value))
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value={0}>Select a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.teacherId} value={teacher.teacherId}>
                        {teacher.fullName} ({teacher.registrationNumber})
                      </option>
                    ))}
                  </select>
                </div>
                {index >= 2 && (
                  <button
                    onClick={() => removeJuryMember(index)}
                    className="mt-6 p-2 text-red-600 hover:text-red-800"
                    title="Remove jury member"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <Button
                text="Add Jury Member"
                onClick={addJuryMember}
                className="bg-blue-500 hover:bg-blue-600"
                icon={<FaPlus />}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button
                text="Cancel"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600"
              />
              <Button
                text={saving ? "Saving..." : "Save Jury Selection"}
                onClick={saveJurySelection}
                className="bg-green-500 hover:bg-green-600"
                disabled={saving}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}