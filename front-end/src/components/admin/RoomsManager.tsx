import React, { useState } from "react";
import { FaDoorOpen, FaPlus, FaTrash } from "react-icons/fa";
import Button from "../Button";
import RoomModal from "./RoomModal";

interface Room {
  _id: string;
  name: string;
}

interface RoomsManagerProps {
  rooms: Room[];
  onRoomAdd: (name: string) => void;
  onRoomDelete: (_id: string) => void;
}

const RoomsManager: React.FC<RoomsManagerProps> = ({
  rooms,
  onRoomAdd,
  onRoomDelete,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  
  const handleOpenModal = () => {
    setRoomName("");
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (roomName.trim()) {
      onRoomAdd(roomName);
    }
    
    setRoomName("");
    setShowModal(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-3">
          <FaDoorOpen className="text-blue-600" />
          Rooms
        </h2>
        <Button
          onClick={handleOpenModal}
          className="btn-primary"
          text="New Room"
          icon={<FaPlus />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
          >
            <span className="font-medium">{room.name}</span>
            <div className="flex gap-2">
              <button
                className="text-red-600 hover:text-red-700"
                onClick={() => onRoomDelete(room._id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <RoomModal
        isOpen={showModal}
        mode="create"
        roomName={roomName}
        onClose={() => setShowModal(false)}
        onChange={setRoomName}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RoomsManager;
