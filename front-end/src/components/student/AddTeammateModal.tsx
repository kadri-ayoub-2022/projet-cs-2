import { useEffect, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { toast } from "react-toastify";
import Axios from "../../utils/api";

interface AddTeammateModalProps {
  student1Id: number | null | undefined;
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
  selectedPreferences,
  onClose,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [student2Id, setStudent2Id] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:7777/service-admin/api/admin/students`
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Error fetching students.");
      }
    };
    fetchStudentData();
  }, []);

  const sendInvitations = async () => {
    const themeIds = Object.keys(selectedPreferences);
    const preferencesNumber = Object.values(selectedPreferences);
    if (themeIds.length === 0) {
      toast.error("Please select at least one theme.");
      return;
    }
    try {
      await Axios.post(
        "http://localhost:7777/project-theme/api/project-themes/project-choices",
        { themeIds, student1Id, student2Id, preferencesNumber }
      );
      toast.success("Preferences saved successfully.");
      onClose();
    } catch (error) {
      toast.error("Failed to send invitations.");
    }
  };

  return (
    <Modal onClose={onClose} title="Add Your Teammate">
      <div className="space-y-4">
        <div className="max-h-60 overflow-y-auto">
          {" "}
          {/* Scrollable list */}
          <ul className="space-y-3">
            {students
              ?.filter((student) => student.studentId !== student1Id)
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
          disabled={!student2Id}
        />
      </div>
    </Modal>
  );
};

export default AddTeammateModal;
