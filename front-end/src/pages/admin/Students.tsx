import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Button from "../../components/Button";
import { FaList, FaPlus } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import { FaSortAlphaDown, FaSortAlphaUpAlt } from "react-icons/fa";
import Checkbox from "../../components/Checkbox";
import Swal from "sweetalert2";
import Axios from "../../utils/api";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortType, setSortType] = useState<string>("default");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "http://localhost:7777/service-admin/api/admin/students"
        );
        if (!response.ok) throw new Error("Failed to fetch students");
        const data: Student[] = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const sortedStudents = [...students]; // Ensure sorting is retained

    if (sortType === "asc") {
      sortedStudents.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sortType === "desc") {
      sortedStudents.sort((a, b) => b.fullName.localeCompare(a.fullName));
    }

    if (query === "") {
      setFilteredStudents(sortedStudents);
    } else {
      const filtered = sortedStudents.filter(
        (t) =>
          t.fullName.toLowerCase().includes(query) ||
          t.email.toLowerCase().includes(query) ||
          t.registrationNumber.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    }
  };

  const handleSort = (type: string) => {
    setSortType(type);

    const sortedStudents = [...students];

    if (type === "asc") {
      sortedStudents.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (type === "desc") {
      sortedStudents.sort((a, b) => b.fullName.localeCompare(a.fullName));
    }

    const filtered = sortedStudents.filter(
      (t) =>
        t.fullName.toLowerCase().includes(searchQuery) ||
        t.email.toLowerCase().includes(searchQuery) ||
        t.registrationNumber.toLowerCase().includes(searchQuery)
    );

    setFilteredStudents(filtered);
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === students.length) {
      setSelectedUsers([]);
    } else {
      const selectAll = students.map((s) => s.studentId);
      setSelectedUsers(selectAll);
    }
  };

  const selectUser = (id: number) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteMany = async () => {
    if (selectedUsers.length === 0) {
      Swal.fire("Error", "No students selected for deletion!", "error");
      return;
    }
  
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedUsers.length} students. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });
  
    if (!result.isConfirmed) return;
  
    try {
      await Axios.delete("/service-admin/api/admin/students/many", {
        data: selectedUsers, // Sending the list of IDs in the request body
      });
  
      // Remove deleted students from the state
      const newUsers = students.filter((s) => !selectedUsers.includes(s.studentId)); // Use correct field name
      const newUsersF = filteredStudents.filter((s) => !selectedUsers.includes(s.studentId)); // Use correct field name
      setStudents(newUsers);
      setFilteredStudents(newUsersF);
      setSelectedUsers([]);
  
      Swal.fire("Deleted!", "Students deleted successfully.", "success");
    } catch (error) {
      Swal.fire("Error", error.response?.data || "Failed to delete students.", "error");
    }
  };
  
  const handleDeleteUser = async (id : number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });
  
    if (!result.isConfirmed) return;
  
    try {
      await Axios.delete(`/service-admin/api/admin/students/${id}`);
  
      setStudents((prevStudents) => prevStudents.filter((student) => student.studentId !== id));
      setFilteredStudents((prevStudents) => prevStudents.filter((student) => student.studentId !== id));
      Swal.fire("Deleted!", "Student has been deleted successfully.", "success");
    } catch (error) {
      Swal.fire("Error", error.response?.data || "Failed to delete student.", "error");
    }
  };
  

  return (
    <div>
      <div className="flex items-center justify-between">
        <Title
          title="Students Management"
          description="Monitor and Manage all Students here"
        />
        <div className="w-1/3">
          <Input
            placeholder="Search Student"
            onChange={handleSearch}
            value={searchQuery}
            type="search"
          />
        </div>
      </div>
      <div className="bg-card-bg rounded-xl mt-6 px-6">
        <div className="flex justify-between items-center py-6">
          <h3 className="font-bold text-xl text-text-primary">All Students</h3>
          <div className="flex items-center gap-2">
            {selectedUsers.length > 0 && <button onClick={handleDeleteMany} className={`p-2 rounded-full bg-red-200`}>
              <RiDeleteBinLine size={20} color="red" />
            </button>}
            <button
              onClick={() => handleSort("default")}
              className={`p-2 rounded-full ${
                sortType === "default" ? "bg-gray-300" : "bg-gray-100"
              }`}
            >
              <FaList size={18} />
            </button>
            <button
              onClick={() => handleSort("asc")}
              className={`p-2 rounded-full ${
                sortType === "asc" ? "bg-gray-300" : "bg-gray-100"
              }`}
            >
              <FaSortAlphaDown size={18} />
            </button>
            <button
              onClick={() => handleSort("desc")}
              className={`p-2 rounded-full ${
                sortType === "desc" ? "bg-gray-300" : "bg-gray-100"
              }`}
            >
              <FaSortAlphaUpAlt size={18} />
            </button>

            <Button
              text="Add New Student"
              icon={<FaPlus />}
              href="/admin/students/new"
            />
          </div>
        </div>
        {loading ? (
          <Loading className="mt-12" />
        ) : (
          <table className="w-full">
            <thead className="bg-background w-full">
              <td
                className="p-3 font-bold cursor-pointer"
                onClick={selectAllUsers}
              >
                <Checkbox checked={selectedUsers.length === students.length} />
              </td>
              <td className="p-3 font-bold">Registration Number</td>
              <td className="p-3 font-bold">Full Name</td>
              <td className="p-3 font-bold">Email</td>
              <td className="p-3 font-bold">Avrege</td>
              <td className="p-3 font-bold">Speciality</td>
              <td className="p-3 font-bold">Actions</td>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((t, i) => (
                  <tr key={i}>
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => selectUser(t.studentId)}
                    >
                      <Checkbox checked={selectedUsers.includes(t.studentId)} />
                    </td>
                    <td className="p-3">{t.registrationNumber}</td>
                    <td className="p-3">{t.fullName}</td>
                    <td className="p-3">{t.email}</td>
                    <td className="p-3">{t.average}</td>
                    <td className="p-3">{t?.specialty?.acronym}</td>
                    <td className="p-3">
                      <RiDeleteBinLine className="text-red-500" size={22} onClick={()=>handleDeleteUser(t.studentId)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No Students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
