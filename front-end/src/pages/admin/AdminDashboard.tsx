import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import StatsGrid from "../../components/admin/StatsGrid";
import ProjectsOverview from "../../components/admin/ProjectOverview";
import SpecialtiesManager from "../../components/admin/SpecialtiesManager";
import RoomsManager from "../../components/admin/RoomsManager";
import Axios from "../../utils/api";
import axios from "axios";
import { toast } from "react-toastify";

// Mock data - Could be replaced with API calls
const mockStats = {
  totalUsers: 243,
  pendingValidation: 12,
  activeProjects: 45,
  completedProjects: 23,
};

const projectsByStatus = [
  { status: "Draft", count: 8 },
  { status: "Validated", count: 12 },
  { status: "In Progress", count: 25 },
  { status: "Completed", count: 23 },
];

interface Specialty {
  specialtyId: number;
  acronym: string;
  name: string;
  studentCount: number;
}

interface Room {
  _id: string;
  name: string;
}

const AdminDashboard = () => {
  // State for specialties
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatics] = useState<object>({})

  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await Axios.get("/project-theme/api/project-themes/stats");
      setStatics(response.data);
    };
    fetchStatistics();
    
  }, []);

  const fetchSpecialties = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await Axios.get("/service-admin/api/admin/specialty");
      console.log("Fetched specialties:", response.data);
      setSpecialties(response.data);
    } catch (err) {
      console.error("Error fetching specialties:", err);
      setError("Failed to load specialties");
    } finally {
      setIsLoading(false);
    }
  };

  // Load rooms function
  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8085/api/thesisDefense/Room",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Fetched rooms:", response.data);
      setRooms(response.data.rooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  

  useEffect(() => {
    fetchSpecialties();
    fetchRooms();
  }, []);
  // Specialty handlers
  const handleAddSpecialty = async ({
    acronym,
    name,
  }: {
    acronym: string;
    name: string;
  }) => {
    try {
      const response = await Axios.post(
        "/service-admin/api/admin/specialty",
        { acronym, name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Add specialty response:", response.data);

      await fetchSpecialties();
      toast.success("Specialty added successfully");
    } catch (error) {
      console.error("Error adding specialty:", error);
      // Optional: Show error message
      toast.error("Failed to add specialty");
    }
  };

  const handleEditSpecialty = async (
    id: number,
    { acronym, name }: { acronym: string; name: string }
  ) => {
    try {
      const response = await Axios.put(
        `/service-admin/api/admin/specialty/${id}`,
        { acronym, name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Edit specialty response:", response.data);

      // Refetch to ensure we have latest data
      await fetchSpecialties();

      toast.success("Specialty updated successfully");
    } catch (error) {
      console.error("Error editing specialty:", error);
      // Optional: Show error message
      toast.error("Failed to update specialty");
    }
  };

  const handleDeleteSpecialty = async (id: number) => {
    try {
      console.log(`Attempting to delete specialty with ID: ${id}`);

      const response = await Axios.delete(
        `/service-admin/api/admin/specialty/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Delete response:", response);

      await fetchSpecialties();

      toast.success("Specialty deleted successfully");
    } catch (error) {
      console.error("Error deleting specialty:", error);

      // Optional: Show error message
      toast.error("Failed to delete specialty");
    }
  };

  // Room handlers with API integration
  const handleAddRoom = async (name: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8085/api/thesisDefense/Room",
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Add room response:", response.data);

      // Refetch to ensure we have latest data
      await fetchRooms();

      toast.success("Room added successfully");
    } catch (error) {
      console.error("Error adding room:", error);
      // Optional: Show error message
      toast.error("Failed to add room");
    }
  };

  

  const handleDeleteRoom = async (id: string) => {
    try {
      console.log(`Attempting to delete room with ID: ${id}`);

      const response = await axios.delete(
        `http://localhost:8085/api/thesisDefense/Room/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Delete room response:", response);

      // Refetch to ensure we have latest data
      await fetchRooms();

      toast.success("Room deleted successfully");
    } catch (error) {
      console.error("Error deleting room:", error);

      // Optional: Show error message
      toast.error("Failed to delete room");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Title
        title="Dashboard Home"
        description="Monitor all projects and users here"
      />

      {/* Stats Grid */}
      <StatsGrid stats={statistics} />

      {/* Projects Overview */}
      <ProjectsOverview stats={statistics} projectsByStatus={projectsByStatus} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Specialties Management */}
        <SpecialtiesManager
          specialties={specialties}
          onSpecialtyAdd={handleAddSpecialty}
          onSpecialtyEdit={handleEditSpecialty}
          onSpecialtyDelete={handleDeleteSpecialty}
          isLoading={isLoading}
          error={error}
          onRefresh={fetchSpecialties}
        />

        {/* Rooms Management */}
        <RoomsManager
          rooms={rooms}
          onRoomAdd={handleAddRoom}
          onRoomDelete={handleDeleteRoom}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
