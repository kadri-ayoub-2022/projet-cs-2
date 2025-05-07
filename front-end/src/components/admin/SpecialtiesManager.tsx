import React, { useState } from "react";
import { FaGraduationCap, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Button from "../Button";
import SpecialtyModal from "./SpecialtyModal";

interface Specialty {
  specialtyId: number;
  acronym: string;
  name: string;
  studentCount: number;
}

interface SpecialtiesManagerProps {
  specialties: Specialty[];
  onSpecialtyAdd: (specialty: Omit<Specialty, "id" | "studentCount">) => void;
  onSpecialtyEdit: (
    id: number,
    specialty: Omit<Specialty, "id" | "studentCount">
  ) => void;
  onSpecialtyDelete: (id: number) => void;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const SpecialtiesManager: React.FC<SpecialtiesManagerProps> = ({
  specialties,
  onSpecialtyAdd,
  onSpecialtyEdit,
  onSpecialtyDelete,
  isLoading,
  error,
  onRefresh,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(
    null
  );
  const [newSpecialty, setNewSpecialty] = useState({
    acronym: "",
    name: "",
  });

  const handleOpenModal = (type: "create" | "edit", specialty?: Specialty) => {
    setModalMode(type);
    setNewSpecialty(
      type === "edit" && specialty
        ? { acronym: specialty.acronym, name: specialty.name }
        : { acronym: "", name: "" }
    );
    setEditingSpecialty(type === "edit" && specialty ? specialty : null);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === "create") {
      onSpecialtyAdd(newSpecialty);
    } else if (editingSpecialty) {
      onSpecialtyEdit(editingSpecialty.specialtyId, newSpecialty);
    }

    setNewSpecialty({ acronym: "", name: "" });
    setShowModal(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setNewSpecialty({
      ...newSpecialty,
      [field]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-3">
          <FaGraduationCap className="text-blue-600" />
          Specialties
          {isLoading && <span className="ml-2 text-sm text-gray-500">(Loading...)</span>}
        </h2>
        <div className="flex space-x-2">
          
          <Button
            onClick={() => handleOpenModal("create")}
            className="btn-primary"
            text="New Specialty"
            icon={<FaPlus />}
            disabled={isLoading}
          />
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
          <button 
            className="ml-2 underline"
            onClick={onRefresh}
          >
            Try again
          </button>
        </div>
      )}
      
      {/* Specialties list */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse">Loading specialties...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {specialties.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No specialties found. Add your first one!
            </div>
          ) : (
            specialties.map((specialty) => (
              <div
                key={specialty.specialtyId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-lg">
                    <span className="text-blue-600 font-bold">
                      {specialty.acronym}
                    </span>{" "}
                    - {specialty.name}
                  </h3>
                  <p className="text-gray-600">{specialty.studentCount} students</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleOpenModal("edit", specialty)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onSpecialtyDelete(specialty.specialtyId)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      <SpecialtyModal
        isOpen={showModal}
        mode={modalMode}
        specialty={newSpecialty}
        onClose={() => setShowModal(false)}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SpecialtiesManager;
