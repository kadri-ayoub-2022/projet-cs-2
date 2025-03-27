import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Button from "../../components/Button";
import { FaPlus, FaList } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import { FaSortAlphaDown, FaSortAlphaUpAlt } from "react-icons/fa";
import Checkbox from "../../components/Checkbox";
import Swal from "sweetalert2";
import Axios from "../../utils/api";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortType, setSortType] = useState<string>("default");
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          "http://localhost:7777/service-admin/api/admin/teachers"
        );
        if (!response.ok) throw new Error("Failed to fetch teachers");
        const data: Teacher[] = await response.json();
        setTeachers(data);
        setFilteredTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const sortedTeachers = [...teachers];

    if (sortType === "asc") {
      sortedTeachers.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sortType === "desc") {
      sortedTeachers.sort((a, b) => b.fullName.localeCompare(a.fullName));
    }

    if (query === "") {
      setFilteredTeachers(sortedTeachers);
    } else {
      const filtered = sortedTeachers.filter(
        (t) =>
          t.fullName.toLowerCase().includes(query) ||
          t.email.toLowerCase().includes(query) ||
          t.registrationNumber.toLowerCase().includes(query)
      );
      setFilteredTeachers(filtered);
    }
  };

  const handleSort = (type: string) => {
    setSortType(type);

    const sortedTeachers = [...teachers];

    if (type === "asc") {
      sortedTeachers.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (type === "desc") {
      sortedTeachers.sort((a, b) => b.fullName.localeCompare(a.fullName));
    }

    const filtered = sortedTeachers.filter(
      (t) =>
        t.fullName.toLowerCase().includes(searchQuery) ||
        t.email.toLowerCase().includes(searchQuery) ||
        t.registrationNumber.toLowerCase().includes(searchQuery)
    );

    setFilteredTeachers(filtered);
  };

  const selectAllTeachers = () => {
    if (selectedTeachers.length === teachers.length) {
      setSelectedTeachers([]);
    } else {
      const selectAll = teachers.map((t) => t.teacherId);
      setSelectedTeachers(selectAll);
    }
  };

  const selectTeacher = (id: number) => {
    setSelectedTeachers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((teacherId) => teacherId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteMany = async () => {
    if (selectedTeachers.length === 0) {
      Swal.fire("Error", "No teachers selected for deletion!", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedTeachers.length} teachers. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await Axios.delete("/service-admin/api/admin/teachers/many", {
        data: selectedTeachers,
      });

      const newTeachers = teachers.filter((t) => !selectedTeachers.includes(t.teacherId));
      const newTeachersF = filteredTeachers.filter((t) => !selectedTeachers.includes(t.teacherId));
      setTeachers(newTeachers);
      setFilteredTeachers(newTeachersF);
      setSelectedTeachers([]);

      Swal.fire("Deleted!", "Teachers deleted successfully.", "success");
    } catch (error) {
      Swal.fire("Error", error.response?.data || "Failed to delete teachers.", "error");
    }
  };

  const handleDeleteTeacher = async (id: number) => {
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
      await Axios.delete(`/service-admin/api/admin/teachers/${id}`);

      setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.teacherId !== id));
      setFilteredTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.teacherId !== id));
      Swal.fire("Deleted!", "Teacher has been deleted successfully.", "success");
    } catch (error) {
      Swal.fire("Error", error.response?.data || "Failed to delete teacher.", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Title
          title="Teachers Management"
          description="Monitor and Manage all Teachers here"
        />
        <div className="w-1/3">
          <Input
            placeholder="Search Teacher"
            onChange={handleSearch}
            value={searchQuery}
            type="search"
          />
        </div>
      </div>
      <div className="bg-card-bg rounded-xl mt-6 px-6">
        <div className="flex justify-between items-center py-6">
          <h3 className="font-bold text-xl text-text-primary">All Teachers</h3>
          <div className="flex items-center gap-2">
            {selectedTeachers.length > 0 && (
              <button onClick={handleDeleteMany} className={`p-2 rounded-full bg-red-200`}>
                <RiDeleteBinLine size={20} color="red" />
              </button>
            )}
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
              text="Add New Teacher"
              icon={<FaPlus />}
              href="/admin/teachers/new"
            />
          </div>
        </div>
        {loading ? (
          <Loading className="mt-12" />
        ) : (
          <table className="w-full">
            <thead className="bg-background w-full">
              <tr>
                <th className="p-3 font-bold cursor-pointer" onClick={selectAllTeachers}>
                  <Checkbox checked={selectedTeachers.length === teachers.length} />
                </th>
                <th className="p-3 font-bold">Registration Number</th>
                <th className="p-3 font-bold">Full Name</th>
                <th className="p-3 font-bold">Email</th>
                <th className="p-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((t, i) => (
                  <tr key={i}>
                    <td className="p-3 cursor-pointer" onClick={() => selectTeacher(t.teacherId)}>
                      <Checkbox checked={selectedTeachers.includes(t.teacherId)} />
                    </td>
                    <td className="p-3">{t.registrationNumber}</td>
                    <td className="p-3">{t.fullName}</td>
                    <td className="p-3">{t.email}</td>
                    <td className="p-3">
                      <RiDeleteBinLine
                        className="text-red-500 cursor-pointer"
                        size={22}
                        onClick={() => handleDeleteTeacher(t.teacherId)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No teachers found.
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