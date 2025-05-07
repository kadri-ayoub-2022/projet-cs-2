import React from "react";
import Modal from "../Modal";
import Input from "../Input";

interface RoomModalProps {
  isOpen: boolean;
  mode: "create"; // Simplified to only create mode
  roomName: string;
  onClose: () => void;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  roomName,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <Modal title="Add New Room" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Room Name</label>
          <Input
            type="text"
            value={roomName}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Salle A1"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RoomModal;
