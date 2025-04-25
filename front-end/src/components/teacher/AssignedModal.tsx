import type React from "react"

import { useEffect, useState } from "react"
import Modal from "../Modal"
import { toast } from "react-toastify"
import Axios from "../../utils/api"

interface AssignedModalProps {
  student1Id: number | null | undefined
  student2Id: number | null | undefined
  onClose: () => void
}

interface Student {
  studentId: number
  fullName: string
  email: string
  registrationNumber: string
  average: number
}

const AssignedModal: React.FC<AssignedModalProps> = ({ student1Id, student2Id, onClose }) => {
  const [student1, setStudent1] = useState<Student | null>(null)
  const [student2, setStudent2] = useState<Student | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true)

        // Only fetch student1 data if student1Id exists
        if (student1Id) {
          const response1 = await Axios.get(`/service-admin/api/admin/students/${student1Id}`)
          setStudent1(response1.data)
        }

        // Only fetch student2 data if student2Id exists
        if (student2Id) {
          const response2 = await Axios.get(`/service-admin/api/admin/students/${student2Id}`)
          setStudent2(response2.data)
        }
      } catch (error) {
        console.error("Error fetching student:", error)
        toast.error("Error fetching student details.")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [student1Id, student2Id])

  return (
    <Modal onClose={onClose} title="Theme Assigned to Students">
      <div className="space-y-4">
        <p className="text-gray-700">
          This theme has been assigned to the following {student1 && student2 ? "students" : "student"}:
        </p>

        {loading ? (
          <div className="text-center py-4">Loading student information...</div>
        ) : (
          <div className="space-y-3">
            {student1 && (
              <div className="p-4 border rounded-lg shadow-md bg-gray-50">
                <h3 className="text-lg font-semibold">{student1.fullName}</h3>
                <p className="text-gray-600">{student1.email}</p>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-gray-500">Registration: {student1.registrationNumber}</span>
                  <span className="font-medium">Average: {student1.average}</span>
                </div>
              </div>
            )}

            {student2 && (
              <div className="p-4 border rounded-lg shadow-md bg-gray-50">
                <h3 className="text-lg font-semibold">{student2.fullName}</h3>
                <p className="text-gray-600">{student2.email}</p>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-gray-500">Registration: {student2.registrationNumber}</span>
                  <span className="font-medium">Average: {student2.average}</span>
                </div>
              </div>
            )}

            {!student1 && !student2 && (
              <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-700">
                No students are currently assigned to this theme.
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default AssignedModal
