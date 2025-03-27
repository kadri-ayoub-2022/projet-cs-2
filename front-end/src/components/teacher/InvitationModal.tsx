import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import Axios from "../../utils/api";
import Modal from "../Modal";
import { toast } from "react-toastify";

interface Props {
  theme: any;
  onClose: () => void;
}

interface Student {
  studentId: number;
  fullName: string;
  email: string;
  registrationNumber: string;
  average: number;
}

interface ProjectTheme {
  themeId: number;
  title: string;
  description: string;
  file?: string;
  progression: number;
  date_selection_begin: string;
  date_selection_end: string;
  teacherId: number;
  specialtyIds: number[];
  student1Id?: number | null;
  student2Id?: number | null;
  student1?: Student | null;
  student2?: Student | null;
}

interface Invitation {
  invitationId: number;
  createdAt: string;
  preference_order: number;
  projectTheme: ProjectTheme;
  student1Id: number;
  student2Id: number;
  student1: Student;
  student2: Student;
}

const InvitationModal: React.FC<Props> = ({ theme, onClose }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Axios.get(
      `http://localhost:7777/project-theme/api/project-themes/${theme.themeId}/invitations`
    )
      .then((res: any) => setInvitations(res.data))
      .catch(() => console.error("Error fetching invitations"))
      .finally(() => setLoading(false));
  }, [theme.themeId]);

  const handleAcceptInvitation = async (invitationId: number) => {
    const token = localStorage.getItem("token");
    try {
      await Axios.put(
        `http://localhost:7777/project-theme/api/project-themes/project-assignments/${theme.themeId}`,
        {
          invitationId,
          status: "validated",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Invitation accepted successfully!");
      onClose();
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation.");
    }
  };

  return (
    <Modal onClose={onClose} title={`Invitations for ${theme.title}`}>
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : invitations.length > 0 ? (
          <ul className="space-y-3">
            {invitations.map((invite) => (
              <li
                key={invite.invitationId}
                className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-700">
                    <span className="text-blue-600">
                      #{invite.preference_order}
                    </span>{" "}
                    -{invite.student1.fullName} & {invite.student2.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {invite.student1.email} | {invite.student2.email}
                  </p>
                </div>
                <button
                  onClick={() => handleAcceptInvitation(invite.invitationId)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Accept
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No invitations found.</p>
        )}
      </div>
    </Modal>
  );
};

export default InvitationModal;
