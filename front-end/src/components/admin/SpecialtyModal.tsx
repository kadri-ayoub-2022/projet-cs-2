import React from "react";
import Modal from "../Modal";
import Input from "../Input";


interface SpecialtyModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  specialty: {
    acronym: string;
    name: string;
  };
  onClose: () => void;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SpecialtyModal: React.FC<SpecialtyModalProps> = ({
  isOpen,
  mode,
  specialty,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      title={`${mode === "create" ? "Create" : "Edit"} Specialty`}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Acronym</label>
          <Input
            type="text"
            value={specialty.acronym}
            onChange={(e) => onChange("acronym", e.target.value)}
            placeholder="e.g. CS, SE"
            
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <Input
            type="text"
            value={specialty.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. Computer Science"
            
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SpecialtyModal;
