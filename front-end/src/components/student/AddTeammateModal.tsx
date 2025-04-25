import { useEffect, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { toast } from "react-toastify";
import Axios from "../../utils/api";
import Input from "../Input";

interface AddTeammateModalProps {
  student1Id: number | null | undefined;
  specialtyId: number | null | undefined;
  selectedPreferences: Object;
  onClose: () => void;
}

interface Student {
  studentId: number;
  fullName: string;
  email: string;
}

const AddTeammateModal: React.FC<AddTeammateModalProps> = ({
  student1Id,
  specialtyId,
  selectedPreferences,
  onClose,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [student2Id, setStudent2Id] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [themes, setThemes] = useState();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await Axios.get(`/service-admin/api/admin/students`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Error fetching students.");
      }
    };
    const fetchAssignedStudents = async () => {
      try {
        const response = await Axios.get(
          `/project-theme/api/project-themes/assigned-students`
        );
        setAssignedStudents(response.data);
      } catch (error) {
        console.error("Error fetching themes:", error);
      }
    };
    fetchStudentData();
    fetchAssignedStudents();
  }, []);

  const sendInvitations = async () => {
    const themeIds = Object.keys(selectedPreferences);
    const preferencesNumber = Object.values(selectedPreferences);
    if (themeIds.length === 0) {
      toast.error("Please select at least one theme.");
      return;
    }
    try {
      await Axios.post("/project-theme/api/project-themes/project-choices", {
        themeIds,
        student1Id,
        student2Id,
        preferencesNumber,
      });
      toast.success("Preferences saved successfully.");
      onClose();
    } catch (error) {
      toast.error("Failed to send invitations.");
    }
  };

  return (
    <Modal onClose={onClose} title="Add Your Teammate">
      <div className="space-y-4">
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="search"
        />
        <div className="max-h-60 overflow-y-auto">
          <ul className="space-y-3">
            {students
              ?.filter(
                (student) =>
                  student.studentId !== student1Id &&
                  !assignedStudents.includes(student.studentId) &&
                  specialtyId === student.specialty.specialtyId &&
                  student.fullName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
              .map((student) => (
                <li
                  key={student.studentId}
                  className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      {student.fullName}
                    </p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={student2Id === student.studentId}
                    onChange={() =>
                      setStudent2Id(
                        student2Id === student.studentId
                          ? null
                          : student.studentId
                      )
                    }
                    className="w-5 h-5 text-green-500 border-gray-300 rounded"
                  />
                </li>
              ))}
          </ul>
        </div>
        <Button
          onClick={() => sendInvitations()}
          text="Send Invitations"
        />
      </div>
    </Modal>
  );
};

export default AddTeammateModal;
