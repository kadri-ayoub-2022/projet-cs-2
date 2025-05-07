import type React from "react"

import { useEffect, useState } from "react"
import Axios from "../../utils/api"
import Modal from "../Modal"
import { toast } from "react-toastify"

interface Props {
  theme: any
  onClose: () => void
}

interface Student {
  studentId: number
  fullName: string
  email: string
  registrationNumber: string
  average: number
}

interface ProjectTheme {
  themeId: number
  title: string
  description: string
  file?: string
  progression: number
  date_selection_begin: string
  date_selection_end: string
  teacherId: number
  specialtyIds: number[]
  student1Id?: number | null
  student2Id?: number | null
  student1?: Student | null
  student2?: Student | null
}

interface Invitation {
  invitationId: number
  createdAt: string
  preference_order: number
  projectTheme: ProjectTheme
  student1Id: number
  student2Id: number
  student1: Student | null
  student2: Student | null
}

const InvitationModal: React.FC<Props> = ({ theme, onClose }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    Axios.get(`/project-theme/api/project-themes/${theme.themeId}/invitations`)
      .then((res: any) => setInvitations(res.data))
      .catch(() => console.error("Error fetching invitations"))
      .finally(() => setLoading(false))
  }, [theme.themeId])

  const handleAcceptInvitation = async (invitationId: number) => {
    const token = localStorage.getItem("token")
    try {
      await Axios.put(
        `/project-theme/api/project-themes/project-assignments/${theme.themeId}`,
        {
          invitationId,
          status: "validated",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      toast.success("Invitation accepted successfully!")
      onClose()
    } catch (error) {
      console.error("Error accepting invitation:", error)
      toast.error("Failed to accept invitation.")
    }
  }

  
  const renderStudentInfo = (invitation: Invitation) => {
    const { student1, student2 } = invitation

    if (student1 && student2) {
      return (
        <>
          <p className="font-semibold text-gray-700">
            <span className="text-blue-600">#{invitation.preference_order}</span> - {student1.fullName} (
            {student1.average}) & {student2.fullName} ({student2.average})
          </p>
          <p className="text-sm text-gray-500">
            {student1.email} | {student2.email}
          </p>
        </>
      )
    }


    if (student1 && !student2) {
      return (
        <>
          <p className="font-semibold text-gray-700">
            <span className="text-blue-600">#{invitation.preference_order}</span> - {student1.fullName} (
            {student1.average})
          </p>
          <p className="text-sm text-gray-500">{student1.email}</p>
        </>
      )
    }

 
    if (!student1 && student2) {
      return (
        <>
          <p className="font-semibold text-gray-700">
            <span className="text-blue-600">#{invitation.preference_order}</span> - {student2.fullName} (
            {student2.average})
          </p>
          <p className="text-sm text-gray-500">{student2.email}</p>
        </>
      )
    }

   
    return (
      <p className="font-semibold text-gray-700">
        <span className="text-blue-600">#{invitation.preference_order}</span> - No student information available
      </p>
    )
  }

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
                <div>{renderStudentInfo(invite)}</div>
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
  )
}

export default InvitationModal
