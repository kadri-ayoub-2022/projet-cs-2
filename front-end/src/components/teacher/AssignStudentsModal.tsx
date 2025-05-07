"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Modal from "../Modal"
import Button from "../Button"
import { toast } from "react-toastify"
import Axios from "../../utils/api"
import Input from "../Input"

interface AssignStudentsModalProps {
  selectedSpecialties: number[]
  onAssignStudents: (student1Id: number | null, student2Id: number | null) => void
  onClose: () => void
}

interface Student {
  studentId: number
  fullName: string
  email: string
  specialty: {
    specialtyId: number
  }
}

const AssignStudentsModal: React.FC<AssignStudentsModalProps> = ({
  selectedSpecialties,
  onAssignStudents,
  onClose,
}) => {
  const [students, setStudents] = useState<Student[]>([])
  const [assignedStudents, setAssignedStudents] = useState<number[]>([])
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true)
        const response = await Axios.get(`/service-admin/api/admin/students`)
        setStudents(response.data)

        const assignedResponse = await Axios.get(`/project-theme/api/project-themes/assigned-students`)
        setAssignedStudents(assignedResponse.data)
      } catch (error) {
        console.error("Error fetching students:", error)
        toast.error("Error fetching students.")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [])

  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents((prev) => {
      // If student is already selected, remove them
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId)
      }

      // If we already have 2 students, replace the last one
      if (prev.length >= 2) {
        return [prev[0], studentId]
      }

      // Otherwise add the student
      return [...prev, studentId]
    })
  }

  const handleConfirm = () => {
    const student1Id = selectedStudents[0] || null
    const student2Id = selectedStudents[1] || null
    onAssignStudents(student1Id, student2Id)
    onClose()
  }

  // Filter students based on selected specialties and search query
  const filteredStudents = students.filter(
    (student) =>
      // Filter by specialty
      selectedSpecialties.includes(student.specialty.specialtyId) &&
      // Filter by search query
      student.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      // Filter out already assigned students
      !assignedStudents.includes(student.studentId),
  )

  return (
    <Modal onClose={onClose} title="Assign Students to Theme">
      <div className="space-y-4">
        <Input
          placeholder="Search students by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="search"
        />

        {loading ? (
          <div className="text-center py-4">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No available students found for the selected specialties.
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            <ul className="space-y-3">
              {filteredStudents.map((student) => (
                <li
                  key={student.studentId}
                  className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-700">{student.fullName}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.studentId)}
                    onChange={() => handleStudentSelection(student.studentId)}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">{selectedStudents.length} of 2 students selected</div>
          <Button onClick={handleConfirm} text="Assign Students" disabled={selectedStudents.length === 0} />
        </div>
      </div>
    </Modal>
  )
}

export default AssignStudentsModal
