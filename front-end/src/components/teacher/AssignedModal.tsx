import { useEffect, useState } from "react";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import Axios from "../../utils/api";

interface AssignedModalProps {
  student1Id: Number | null | undefined;
  student2Id: Number | null | undefined;
  onClose: () => void;
}

interface Student {
  studentId: number;
  fullName: string;
  email: string;
  registrationNumber: string;
  average: number;
}

const AssignedModal: React.FC<AssignedModalProps> = ({
  student1Id,
  student2Id,
  onClose,
}) => {
  const [student1, setStudent1] = useState<Student>();
  const [student2, setStudent2] = useState<Student>();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response1 = await Axios.get(
          `http://localhost:7777/service-admin/api/admin/students/${student1Id}`
        );
        setStudent1(response1.data);

        const response2 = await Axios.get(
          `http://localhost:7777/service-admin/api/admin/students/${student2Id}`
        );
        setStudent2(response2.data);
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error("Error fetching student details.");
        return null;
      }
    };
    fetchStudentData();
  }, []);

  return (
    <Modal onClose={onClose} title="Theme Assigned to Students">
    <div className="space-y-4">
      <p className="text-gray-700">This theme has been assigned to the following students:</p>

      {[student1, student2].map((student) => (
        <div key={student?.studentId} className="p-4 border rounded-lg shadow-md bg-gray-50">
          <h3 className="text-lg font-semibold">{student?.fullName}</h3>
          <p className="text-gray-600">{student?.email}</p>
        </div>
      ))}
    </div>
  </Modal>
  );
};

export default AssignedModal;
