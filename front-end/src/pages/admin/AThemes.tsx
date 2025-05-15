/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import Checkbox from "../../components/Checkbox";
import Swal from "sweetalert2";
import Axios from "../../utils/api";
import {
  FaCheck,
  FaExternalLinkAlt,
  FaTimes,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import { Link } from "react-router";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import JurySelectionModal from "./JurySelectionModal";

export default function AThemes() {
  const [themes, setThemes] = useState<ProjectTheme[]>([]);
  const [filteredThemes, setFilteredThemes] = useState<ProjectTheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedThemes, setSelectedThemes] = useState<number[]>([]);
  const [showDateModal, setShowDateModal] = useState<boolean>(false);
  const [editedTheme, setEditedTheme] = useState<number | boolean>(false);
  const [dateStart, setDateStart] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dateEnd, setDateEnd] = useState<string>("");
  const [showDescModal, setShowDescModal] = useState<boolean>(false);
  const [currentDesc, setCurrentDesc] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDelivery, setSelectedDelivery] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [specialties, setSpecialties] = useState<Speciality[]>([]);

  // Add to existing state declarations:
  const [selectedProgression, setSelectedProgression] = useState<string>("all");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showJuryModal, setShowJuryModal] = useState<boolean>(false);
  const [selectedThemeForJury, setSelectedThemeForJury] = useState<ProjectTheme | null>(null);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await Axios.get("/service-admin/api/admin/specialty");
        setSpecialties(response.data);
      } catch {
        toast.error("Failed to fetch specialties");
      }
    };
    fetchSpecialties();
  }, []);

  useEffect(() => {
    const getThemes = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching themes...");

        const { data } = await Axios.get(
          "/project-theme/api/project-themes/with-details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("all themes data", data);

        setThemes(data);
        setFilteredThemes(data);
      } catch (error) {
        console.error("Error fetching themes:", error);
        Swal.fire(
          "Error",
          "Failed to fetch themes. Please try again later.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    getThemes();
  }, []);

  // In the useEffect for filtering themes:
  useEffect(() => {
    let result = [...themes];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (theme) =>
          theme.title.toLowerCase().includes(term) ||
          theme.description.toLowerCase().includes(term) ||
          theme.teacher.fullName.toLowerCase().includes(term)
      );
    }

    // Apply specialty filter
    if (selectedSpecialty !== "all") {
      result = result.filter((theme) =>
        theme.specialties.some((s) => s.acronym === selectedSpecialty)
      );
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      const statusFilter = selectedStatus === "valid";
      result = result.filter((theme) => theme.status === statusFilter);
    }

    // Apply delivery filter
    if (selectedDelivery !== "all") {
      const isDelivered = selectedDelivery === "delivered";
      result = result.filter((theme) =>
        isDelivered
          ? theme.student1 || theme.student2
          : !theme.student1 && !theme.student2
      );
    }

    // Apply progression filter
    if (selectedProgression !== "all") {
      result = result.filter((theme) =>
        selectedProgression === "complete"
          ? theme.progression === 100
          : theme.progression < 100
      );
    }

    setFilteredThemes(result);
  }, [
    themes,
    searchTerm,
    selectedSpecialty,
    selectedStatus,
    selectedDelivery,
    selectedProgression,
  ]);

  const selectAllThemes = () => {
    if (selectedThemes.length === filteredThemes.length) {
      setSelectedThemes([]);
    } else {
      const selectAll = filteredThemes.map((s) => s.themeId);
      setSelectedThemes(selectAll);
    }
  };

  const selectTheme = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedThemes((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((themeId) => themeId !== id)
        : [...prevSelected, id]
    );
  };

  const updateThemeStatus = async (themeId: number, status: boolean) => {
    try {
      const response = await fetch(
        `http://localhost:7777/service-admin/api/admin/update-theme-status/${themeId}?status=${status}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update theme status.");
      }

      setThemes((prevThemes) =>
        prevThemes.map((s) => {
          if (s.themeId === themeId) {
            return { ...s, status };
          }
          return s;
        })
      );

      Swal.fire(
        "Success!",
        `Theme status updated to ${
          status ? "validated" : "invalidated"
        } successfully.`,
        "success"
      );
    } catch (error: any) {
      console.error("Status update error:", error);
      Swal.fire(
        "Error",
        error.message || "Failed to update theme status.",
        "error"
      );
    }
  };

  const updateManyThemeStatus = async (status: boolean) => {
    if (selectedThemes.length === 0) {
      Swal.fire("Error", "No themes selected for status update!", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${status ? "validate" : "invalidate"} ${
        selectedThemes.length
      } theme(s).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Yes, ${status ? "validate" : "invalidate"}!`,
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        "http://localhost:7777/service-admin/api/admin/update-many-theme-status",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            events: selectedThemes.map((themeId) => ({
              themeId,
              status,
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update themes status.");
      }

      setThemes((prevThemes) =>
        prevThemes.map((s) => {
          if (selectedThemes.includes(s.themeId)) {
            return { ...s, status };
          }
          return s;
        })
      );

      Swal.fire(
        "Success!",
        `Themes ${status ? "validated" : "invalidated"} successfully.`,
        "success"
      );
    } catch (error: any) {
      console.error("Status update error:", error);
      Swal.fire(
        "Error",
        error.message || "Failed to update themes status.",
        "error"
      );
    }
  };

  const updateThemeDates = async () => {
    console.log("Updating one theme dates...");
    try {
      const response = await fetch(
        `http://localhost:7777/service-admin/api/admin/update-theme-date/${editedTheme}?dateb=${dateStart}&datee=${dateEnd}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update theme dates.");
      }

      setThemes((prevThemes) =>
        prevThemes.map((s) => {
          if (s.themeId === editedTheme) {
            return {
              ...s,
              date_selection_begin: dateStart,
              date_selection_end: dateEnd,
            };
          }
          return s;
        })
      );
      setEditedTheme(false);
      setShowDateModal(false);

      Swal.fire("Success!", "Theme dates updated successfully.", "success");
    } catch (error: any) {
      console.error("Date update error:", error);
      Swal.fire(
        "Error",
        error.message || "Failed to update theme dates.",
        "error"
      );
    }
  };

  const updateManyThemeDates = async () => {
    console.log("Updating many theme dates...");
    console.log("Selected themes:", selectedThemes);
    console.log("Date start:", dateStart);
    console.log("Date end:", dateEnd);

    if (selectedThemes.length === 0) {
      Swal.fire("Error", "No themes selected for date update!", "error");
      return;
    }

    if (!dateEnd) {
      Swal.fire("Error", "Please select an end date!", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to update dates for ${selectedThemes.length} theme(s).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, update dates!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        "http://localhost:7777/service-admin/api/admin/update-many-theme-date",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            events: selectedThemes.map((themeId) => ({
              themeId,
              date_selection_begin: dateStart,
              date_selection_end: dateEnd,
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update themes dates.");
      }

      setThemes((prevThemes) =>
        prevThemes.map((s) => {
          if (selectedThemes.includes(s.themeId)) {
            return {
              ...s,
              date_selection_begin: dateStart,
              date_selection_end: dateEnd,
            };
          }
          return s;
        })
      );
      setShowDateModal(false);

      Swal.fire("Success!", "Themes dates updated successfully.", "success");
    } catch (error: any) {
      console.error("Date update error:", error);
      Swal.fire(
        "Error",
        error.message || "Failed to update themes dates.",
        "error"
      );
    }
  };

  const handleOpenDateModal = (themses: boolean, theme?: number) => {
    if (!themses && theme) {
      setEditedTheme(theme);
      const selectedTheme = themes.find((t) => t.themeId === theme);
      if (selectedTheme) {
        setDateStart(selectedTheme.date_selection_begin || "");
        setDateEnd(selectedTheme.date_selection_end || "");
      }
    } else {
      setEditedTheme(false);
      setDateStart(new Date().toISOString().split("T")[0]);
      setDateEnd("");
    }
    setShowDateModal(true);
  };

  const showDescriptionModal = (desc: string) => {
    setCurrentDesc(desc);
    setShowDescModal(true);
  };

  const truncateDescription = (desc: string, maxLength: number = 50) => {
    if (desc.length <= maxLength) return desc;
    return `${desc.substring(0, maxLength)}...`;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("all");
    setSelectedStatus("all");
    setSelectedDelivery("all");
    setFilteredThemes(themes);
  };

  // Check if a theme is delivered (has at least one student)
  const isThemeDelivered = (theme: ProjectTheme) => {
    return theme.student1 || theme.student2;
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await Axios.get("/service-admin/api/admin/teachers");
        setTeachers(response.data);
      } catch {
        toast.error("Failed to fetch teachers");
      }
    };
    fetchTeachers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Title
          title="Themes Management"
          description="Monitor and Manage all Themes here"
        />
        <div className="flex flex-col md:flex-row gap-4 mb-4 w-1/2">
          <div className="relative flex-grow">
            <Input
              placeholder="Search ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
            />
          </div>
          <Button
            text="Filters"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-500 hover:bg-gray-600"
            icon={<FaFilter />}
          />
          {showFilters && (
            <Button
              text="Reset"
              onClick={resetFilters}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            />
          )}
        </div>
      </div>

      {/* Search and Filters Section */}
      {showFilters && (
        <div className="bg-card-bg rounded-xl mt-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Specialties</option>
                {specialties.map((s) => (
                  <option key={s.specialityId} value={s.acronym}>
                    {s.name} ({s.acronym})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Statuses</option>
                <option value="valid">Valid</option>
                <option value="invalid">Invalid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Status
              </label>
              <select
                value={selectedDelivery}
                onChange={(e) => setSelectedDelivery(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Themes</option>
                <option value="delivered">Delivered</option>
                <option value="not-delivered">Not Delivered</option>
              </select>
            </div>
            {/* In the filters section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progression
              </label>
              <select
                value={selectedProgression}
                onChange={(e) => setSelectedProgression(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Themes</option>
                <option value="complete">Completed (100%)</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card-bg rounded-xl mt-6 px-6">
        <div className="flex justify-between items-center py-6">
          <h3 className="font-bold text-xl text-text-primary">
            {filteredThemes.length} Theme
            {filteredThemes.length !== 1 ? "s" : ""} Found
          </h3>
          <div className="flex items-center gap-2">
            {selectedThemes.length > 0 && (
              <>
                <Button
                  text="Validate Selected"
                  onClick={() => updateManyThemeStatus(true)}
                  className="bg-green-500 hover:bg-green-600"
                  icon={<FaCheck />}
                />
                <Button
                  text="Invalidate Selected"
                  onClick={() => updateManyThemeStatus(false)}
                  className="bg-yellow-500 hover:bg-yellow-600"
                  icon={<FaTimes />}
                />
                <Button
                  text="Update Dates"
                  onClick={() => handleOpenDateModal(true)}
                  className="bg-blue-500 hover:bg-blue-600"
                  icon={<FaCalendarAlt />}
                />
              </>
            )}
          </div>
        </div>
        {loading ? (
          <Loading className="mt-12" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th
                    className="p-3 font-bold cursor-pointer"
                    onClick={selectAllThemes}
                  >
                    <Checkbox
                      checked={
                        selectedThemes.length === filteredThemes.length &&
                        filteredThemes.length > 0
                      }
                    />
                  </th>
                  <th className="p-3 font-bold text-left">Title</th>
                  <th className="p-3 font-bold text-left">Description</th>
                  <th className="p-3 font-bold text-left">Teacher</th>
                  <th className="p-3 font-bold text-left">Specialty</th>
                  <th className="p-3 font-bold text-left">File</th>
                  <th className="p-3 font-bold text-left">Status</th>
                  <th className="p-3 font-bold text-left">Dates</th>
                  <th className="p-3 font-bold text-left">Progression</th>
                  <th className="p-3 font-bold text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredThemes.length > 0 ? (
                  filteredThemes.map((t) => (
                    <tr key={t.themeId} className="hover:bg-gray-50">
                      <td
                        className="p-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectTheme(t.themeId, e);
                        }}
                      >
                        <Checkbox
                          checked={selectedThemes.includes(t.themeId)}
                        />
                      </td>
                      <td
                        className={`p-3 ${
                          isThemeDelivered(t)
                            ? "text-green-600 font-semibold"
                            : ""
                        }`}
                      >
                        {t.title}
                        {isThemeDelivered(t) && (
                          <span className="ml-2 text-xs text-green-500">
                            (Delivered)
                          </span>
                        )}
                      </td>
                      <td
                        className="p-3 cursor-pointer hover:text-blue-600"
                        onClick={() => showDescriptionModal(t.description)}
                      >
                        {truncateDescription(t.description)}
                      </td>
                      <td className="p-3">{t.teacher.fullName}</td>
                      <td className="p-3">
                        {t.specialties.map((s) => s.acronym).join(", ")}
                      </td>
                      <td className="p-3">
                        <Link to={t.file} target="_blank">
                          <FaExternalLinkAlt />
                        </Link>
                      </td>
                      <td className="p-3">
                        {t.status ? (
                          <span className="text-green-500">Valid</span>
                        ) : (
                          <span className="text-red-500">Invalid</span>
                        )}
                      </td>
                      <td className="p-3">
                        {t.date_selection_begin && t.date_selection_end ? (
                          <span>
                            {new Date(
                              t.date_selection_begin
                            ).toLocaleDateString("en-GB")}
                            -{" "}
                            {new Date(t.date_selection_end).toLocaleDateString(
                              "en-GB"
                            )}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${t.progression}%` }}
                            ></div>
                          </div>
                          <span className="ml-2">{t.progression}%</span>
                        </div>
                      </td>
                      <td className="p-3 flex items-center gap-2">
                        {t.progression === 100 && (
                          <Button
                            text="Select Jury"
                            onClick={() => {
                              setSelectedThemeForJury(t);
                              setShowJuryModal(true);
                            }}
                            className="bg-purple-500 hover:bg-purple-600 text-sm py-1"
                          />
                        )}
                        <button
                          className="hover:text-green-700 transition-colors cursor-pointer"
                          onClick={() =>
                            updateThemeStatus(t.themeId, !t.status)
                          }
                        >
                          {t.status ? (
                            <FaTimes className="text-yellow-500" size={22} />
                          ) : (
                            <FaCheck className="text-green-500" size={22} />
                          )}
                        </button>
                        <button
                          className="hover:text-blue-700 transition-colors cursor-pointer"
                          onClick={() => {
                            setDateStart(
                              t.date_selection_begin ||
                                new Date().toISOString().split("T")[0]
                            );
                            setDateEnd(t.date_selection_end || "");
                            handleOpenDateModal(false, t.themeId);
                          }}
                        >
                          <FaCalendarAlt className="text-blue-500" size={22} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center p-4 text-gray-500">
                      No themes found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Date Update Modal */}
      {showDateModal && (
        <Modal
          title="Update Selection Dates"
          onClose={() => {
            setEditedTheme(false);
            setShowDateModal(false);
          }}
        >
          <div className="space-y-4">
            <Input
              label="Start Date"
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                text="Cancel"
                onClick={() => {
                  setEditedTheme(false);
                  setShowDateModal(false);
                }}
                className="bg-gray-500 hover:bg-gray-600"
              />
              {editedTheme ? (
                <Button
                  text="Update"
                  onClick={updateThemeDates}
                  className="bg-blue-500 hover:bg-blue-600"
                />
              ) : (
                <Button
                  text="Update Dates"
                  onClick={updateManyThemeDates}
                  className="bg-blue-500 hover:bg-blue-600"
                />
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Description Modal */}
      {showDescModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <button
                onClick={() => setShowDescModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <p className="whitespace-pre-line">{currentDesc}</p>
            </div>
          </div>
        </div>
      )}
      {/* Add this at the end of the component, before the last closing tag */}
      <JurySelectionModal
        show={showJuryModal}
        onClose={() => setShowJuryModal(false)}
        theme={selectedThemeForJury!}
        themeTitle={selectedThemeForJury?.title || ""}
        teachers={teachers}
        onJurySaved={() => {
          toast.success("Jury assigned successfully!");
          // Optionally refresh data after jury assignment
          // const getThemes = async () => {...}
          // getThemes();
        }}
      />
    </div>
  );
}
