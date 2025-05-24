/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Button from "../../components/Button";
import { FaEdit, FaPlus } from "react-icons/fa";
// import { RiDeleteBinLine } from "react-icons/ri";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";
import axios from "axios";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { IoDocument } from "react-icons/io5";
import PVModal from "../../components/admin/PVModal";

interface ProjectTheme {
  themeId: number;
  title: string;
  description: string;
  file: string;
  progression: number;
  date_selection_begin: string;
  date_selection_end: string;
  teacher: Teacher;
  specialties: Speciality[];
  student1: Student;
  student2: Student;
  status: boolean;
  jury: any;
}

interface Teacher {
  _id: string;
  name: string;
}

interface Speciality {
  _id: string;
  name: string;
}

interface Student {
  _id: string;
  name: string;
}

export default function ThesisDefense() {
  const [defenses, setDefenses] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [themes, setThemes] = useState<ProjectTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [loadingUpRoom, setLoadingUpRoom] = useState(false);
  const [loadingUpTime, setLoadingUpTime] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDefense, setCurrentDefense] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editRoomId, setEditRoomId] = useState("");
  const [openPVModal, setOpenPVModal] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [selectedDefensePv, setSelectedDefensePv] = useState<string>("");
  // Manual session generation state
  const [manualThemeId, setManualThemeId] = useState<number | null>(null);
  const [manualRoomId, setManualRoomId] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [manualStartTime, setManualStartTime] = useState("");
  const [manualEndTime, setManualEndTime] = useState("");
  const [loadingManual, setLoadingManual] = useState(false);

  const fetchDefenses = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8085/api/thesisDefense",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDefenses(data.filter((ele: any) => ele.roomId));
    } catch (error) {
      console.error("Failed to fetch defenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8085/api/thesisDefense/Room",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRooms(data.rooms);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  const fetchAvailableThemes = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:7777/project-theme/api/project-themes/with-details",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Filter themes with progression 100 and not already in defenses
      const defenseThemeIds = defenses.map(defense => defense.themeId);
      setThemes(data.filter((theme: ProjectTheme) => 
        theme.progression === 100 && !defenseThemeIds.includes(theme.themeId)
      ))
    } catch (error) {
      console.error("Failed to fetch available themes:", error);
    }
  };

  useEffect(() => {
    fetchDefenses();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (showManualModal) {
      fetchAvailableThemes();
    }
  }, [showManualModal, defenses]);

  const handleGenerateSessions = async () => {
    if (!startDate || !endDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing Dates",
        text: "Please select both start and end dates.",
      });
      return;
    }
    setShowModal(false);
    setGenerating(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8085/api/thesisDefense/Period/generate",
        {
          defenseStart: startDate,
          defenseEnd: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Sessions generated successfully",
      });
      fetchDefenses();
      setShowModal(false);
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed to generate sessions. Please try again.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateManualSession = async () => {
    if (!manualThemeId || !manualRoomId || !manualDate || !manualStartTime || !manualEndTime) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all required fields.",
      });
      return;
    }
    setLoadingManual(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8085/api/thesisDefense/Period/generate/forOne",
        {
          themeId: manualThemeId,
          roomId: manualRoomId,
          date: manualDate,
          startTime: manualStartTime,
          endTime: manualEndTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Session created successfully",
      });
      fetchDefenses();
      setShowManualModal(false);
      // Reset form
      setManualThemeId(null);
      setManualRoomId("");
      setManualDate("");
      setManualStartTime("");
      setManualEndTime("");
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed to create session. Please try again.",
      });
    } finally {
      setLoadingManual(false);
    }
  };

  const handleEditDefense = (defense: any) => {
    setCurrentDefense(defense);
    setEditDate(defense.date.split("T")[0]);
    setEditStartTime(defense.startTime);
    setEditEndTime(defense.endTime);
    setEditRoomId(defense.roomId?._id || "");
    setShowEditModal(true);
  };

  const handleUpdateRoom = async () => {
    if (!editRoomId) {
      Swal.fire({
        icon: "warning",
        title: "Missing Room",
        text: "Please select a room.",
      });
      return;
    }
    setLoadingUpRoom(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8085/api/thesisDefense/Period/update-room/${currentDefense._id}`,
        { roomId: editRoomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Room updated successfully",
      });
      fetchDefenses();
      setShowEditModal(false);
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed to update room. Please try again.",
      });
    } finally {
      setLoadingUpRoom(false);
      setShowEditModal(false);
    }
  };

  const handleUpdateTime = async () => {
    if (!editDate || !editStartTime || !editEndTime) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all time fields.",
      });
      return;
    }
    setLoadingUpTime(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8085/api/thesisDefense/Period/update-time/${currentDefense.themeId}`, 
        {
          date: editDate,
          startTime: editStartTime,
          endTime: editEndTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Time updated successfully",
      });
      fetchDefenses();
      setShowEditModal(false);
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed to update time. Please try again.",
      });
    } finally {
      setLoadingUpTime(false);
      setShowEditModal(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Title
          title="Projects Defenses Management"
          description="Monitor and Manage all Defenses here"
        />
        <div className="flex gap-3">
          <Button
            onClick={() => setShowModal(true)}
            icon={<FaPlus className="mr-2" />}
            text="Generate Sessions"
          />
          <Button
            onClick={() => setShowManualModal(true)}
            icon={<FaPlus className="mr-2" />}
            text="Add Manual Session"
            className="bg-green-600 hover:bg-green-700"
          />
        </div>
      </div>
      <div className="bg-card-bg rounded-xl mt-6 px-6">
        <div className="flex justify-between items-center py-6">
          <h3 className="font-bold text-xl text-text-primary">
            All Projects Defense
          </h3>
        </div>
        {loading ? (
          <Loading className="mt-12" />
        ) : (
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="p-3 font-bold">Title</th>
                <th className="p-3 font-bold">Students</th>
                <th className="p-3 font-bold">Teacher</th>
                <th className="p-3 font-bold">Jury</th>
                <th className="p-3 font-bold">Room</th>
                <th className="p-3 font-bold">Date</th>
                <th className="p-3 font-bold">Time</th>
                <th className="p-3 font-bold">Actions</th>
                <th className="p-3 font-bold text-left min-w-[60px]">PV</th>
              </tr>
            </thead>
            <tbody>
              {defenses.length > 0 ? (
                defenses.map((item, i) => (
                  <tr key={i}>
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">
                      {item.student1?.name} <br /> {item.student2?.name}
                    </td>
                    <td className="p-3">{item.teacher?.name}</td>
                    <td className="p-3">
                      {item.jury.map((j: any) => (
                        <div key={j._id}>{j.name}</div>
                      ))}
                    </td>
                    <td className="p-3">{item.roomId?.name}</td>
                    <td className="p-3">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {item.startTime} - {item.endTime}
                    </td>
                    <td className="p-3 flex gap-3">
                      <FaEdit
                        className="text-blue-500 cursor-pointer"
                        size={18}
                        onClick={() => handleEditDefense(item)}
                      />
                    </td>
                    <td>
                      <div
                        className="flex items-center justify-center rounded-full w-10 h-10 bg-gray-100 text-gray-500 cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          setSelectedThemeId(item.themeId);
                          setSelectedDefensePv(item.pv);
                          setOpenPVModal(true);
                        }}
                      >
                        <IoDocument className="text-primary text-xl" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-gray-500">
                    No Defenses Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal
          title="Generate Defense Sessions"
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            <Input
              label="Start Date:"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date:"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black"
                text="Cancel"
              />
              <Button
                onClick={handleGenerateSessions}
                disabled={generating}
                text={generating ? "Generating..." : "Confirm"}
              />
            </div>
          </div>
        </Modal>
      )}

      {showManualModal && (
        <Modal
          title="Add Manual Defense Session"
          onClose={() => setShowManualModal(false)}
        >
          <div className="space-y-4">
            <Select
              label="Select Project Theme:"
              value={manualThemeId || ""}
              options={themes.map(theme => ({
                label: `${theme.title} (${theme.student1?.name} & ${theme.student2?.name})`,
                value: theme.themeId,
              }))}
              onChange={(e) => setManualThemeId(Number(e.target.value))}
            />
            <Select
              label="Select Room:"
              value={manualRoomId}
              options={rooms.map(room => ({
                label: room.name,
                value: room._id,
              }))}
              onChange={(e) => setManualRoomId(e.target.value)}
            />
            <Input
              label="Date:"
              type="date"
              value={manualDate}
              onChange={(e) => setManualDate(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time:"
                type="time"
                value={manualStartTime}
                onChange={(e) => setManualStartTime(e.target.value)}
              />
              <Input
                label="End Time:"
                type="time"
                value={manualEndTime}
                onChange={(e) => setManualEndTime(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setShowManualModal(false)}
                className="bg-gray-300 text-black"
                text="Cancel"
              />
              <Button
                onClick={handleGenerateManualSession}
                disabled={loadingManual}
                text={loadingManual ? "Creating..." : "Create Session"}
                className="bg-green-600 hover:bg-green-700"
              />
            </div>
          </div>
        </Modal>
      )}

      {showEditModal && currentDefense && (
        <Modal
          title="Edit Defense Session"
          onClose={() => setShowEditModal(false)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Date:"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="Start Time:"
                  type="time"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="End Time:"
                  type="time"
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                />
              </div>
              <div>
                <Select
                  label="Room:"
                  value={editRoomId}
                  options={rooms.map((room) => ({
                    label: room.name,
                    value: room._id,
                  }))}
                  onChange={(e) => setEditRoomId(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 text-black"
                text="Cancel"
              />
              <Button
                onClick={handleUpdateTime}
                text="Update Time"
                className="mr-2"
                loading={loadingUpTime}
                disabled={loadingUpTime}
              />
              <Button
                onClick={handleUpdateRoom}
                text="Update Room"
                loading={loadingUpRoom}
                disabled={loadingUpRoom}
              />
            </div>
          </div>
        </Modal>
      )}
      {openPVModal && (
        <PVModal
          themeId={selectedThemeId}
          existingPvUrl={selectedDefensePv}
          onClose={() => setOpenPVModal(false)}
          onSuccess={() => {
            fetchDefenses();
            setOpenPVModal(false);
          }}
        />
      )}

      {generating && (
        <div className="fixed top-0 left-0 h-screen w-full flex items-center justify-center bg-primary/70">
          <p className="font-semibold capitalize text-xl">
            This may take minutes please wait ...
          </p>
        </div>
      )}
    </div>
  );
}