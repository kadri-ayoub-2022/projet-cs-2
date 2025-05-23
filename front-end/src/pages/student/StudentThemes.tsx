import type React from "react";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Title from "../../components/admin/Title";
import Button from "../../components/Button";
import { FaEye } from "react-icons/fa6";
import { HiOutlineUserGroup } from "react-icons/hi";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import Axios from "../../utils/api";
import { useAuth } from "../../contexts/useAuth";
import AddTeammateModal from "../../components/student/AddTeammateModal";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LuSend } from "react-icons/lu";

interface Teacher {
  fullName: string;
}

interface ProjectTheme {
  themeId: number;
  title: string;
  description: string;
  file: string;
  progression: number;
  teacher: Teacher;
  specialtyIds: number[];
}

interface Invitation {
  preference_order: number;
  student1Id: number;
  student2Id: number;
  projectTheme: ProjectTheme;
}

const StudentThemes = () => {
  const [themes, setThemes] = useState<ProjectTheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selecting, setSelecting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<ProjectTheme | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [invitationCounts, setInvitationCounts] = useState<{
    [key: string]: number;
  }>({});
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<Object>({});

  console.log(selectedPreferences);

  useEffect(() => {
    fetchThemes();
  }, []);

  const { user } = useAuth();

  const fetchThemes = async () => {
    try {
      const response = await Axios.get(
        "/project-theme/api/project-themes/unassigned"
      );
      setThemes(response.data);
      response.data.forEach((theme: ProjectTheme) => {
        Axios.get(
          `/project-theme/api/project-themes/${theme.themeId}/invitations/count`
        )
          .then((response) => {
            setInvitationCounts((prev) => ({
              ...prev,
              [theme.themeId]: response.data,
            }));
          })
          .catch((err) => console.error("Error fetching invitations:", err));
      });
      const response2 = await Axios.get(
        `/project-theme/api/project-themes/students/${user.studentId}/invitations`
      );
      setInvitations(response2.data);
    } catch (error) {
      console.error("Error fetching themes:", error);
      toast.error("Failed to load themes.");
    } finally {
      setLoading(false);
    }
  };

  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  useEffect(() => {
    const fetchStudentProject = async () => {
      const token = localStorage.getItem("token");
      const response1 = await Axios.get(
        "/monitoring/api/project/themes-by-student",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelectedProject(response1.data.projectTheme);
    };

    fetchStudentProject();
  }, []);

  useEffect(() => {
    if (invitations?.length > 0) {
      const initialPreferences = {};
      invitations.forEach((invitation) => {
        initialPreferences[invitation.projectTheme.themeId] =
          invitation.preference_order;
      });
      setSelectedPreferences(initialPreferences);
    }
  }, [invitations]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredThemes = themes
    .filter(
      (theme) =>
        theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((theme) => theme.specialtyIds.includes(user.specialty.specialtyId));

  const handlePreferenceChange = (themeId) => {
    setSelectedPreferences((prev) => {
      const newPref = Object.keys(prev).length + 1;
      return prev[themeId] ? prev : { ...prev, [themeId]: newPref };
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Title title="Available Themes" description="Select a theme to apply" />
        <div className="w-1/3">
          <Input
            placeholder="Search by theme or teacher"
            onChange={handleSearch}
            value={searchQuery}
            type="search"
          />
        </div>
      </div>

      <div className="bg-card-bg rounded-xl mt-6 px-6 py-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-text-primary">Themes List</h3>
          {themes.length > 0 && !selectedProject && (
            <div className="flex items-center gap-2">
              {Object.keys(selectedPreferences).length > 0 && selecting ? (
                <Button
                  onClick={() => setShowModal(true)}
                  text="Confirm Selection"
                />
              ) : !selecting ? (
                <Button
                  onClick={() => setSelecting(!selecting)}
                  text="Send Invitation"
                />
              ) : (
                <div className="border-2 py-2 px-4 border-dashed border-gray-500 text-gray-500 font-semibold flex items-center justify-center rounded-md text-sm">
                  Start Selecting
                </div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="p-3 font-bold text-left">Title</th>
                  <th className="p-3 font-bold text-left">Description</th>
                  <th className="p-3 font-bold text-left">Teacher</th>
                  <th className="p-3 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredThemes.length > 0 ? (
                  filteredThemes.map((theme, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="p-3">
                        <h4 className="font-semibold">{theme.title}</h4>
                      </td>
                      <td className="p-3">
                        <p
                          className="text-gray-600 text-sm truncate max-w-xs"
                          title={theme.description}
                        >
                          {theme.description}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="text-gray-600 text-sm">
                          {theme.teacher.fullName}
                        </p>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center items-center gap-3">
                          <FaEye
                            className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
                            size={20}
                            onClick={() => {
                              if (theme.file) {
                                window.open(theme.file, "_blank");
                              } else {
                                toast.error("No file available");
                              }
                            }}
                            title="View File"
                          />

                          {theme.student1Id === user.studentId ||
                          theme.student1Id === user.studentId ? (
                            <IoMdCheckmarkCircleOutline
                              className="text-green-500"
                              size={20}
                              title="Assigned"
                            />
                          ) : (
                            invitations.find(
                              (inv) =>
                                inv.projectTheme.themeId === theme.themeId
                            ) && (
                              <div className="flex items-center gap-2 p-2 rounded-xl bg-green-50 border border-green-200 shadow-sm">
                                <LuSend
                                  className="text-green-600"
                                  size={20}
                                  title="Invitation Sent"
                                />
                                <span className="text-green-700 font-medium text-sm">
                                  {selectedPreferences[theme.themeId]}
                                </span>
                              </div>
                            )
                          )}

                          {!selecting ? (
                            <div className="relative">
                              <HiOutlineUserGroup
                                className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
                                size={20}
                                onClick={() => {
                                  setSelectedTheme(theme);
                                  setShowModal(true);
                                }}
                                title="View Team"
                              />
                              {invitationCounts[theme.themeId] > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gray-200 text-gray-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                                  {invitationCounts[theme.themeId]}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div
                              className={`w-6 h-6 text-xs font-bold border-2 cursor-pointer rounded-sm flex items-center justify-center ${
                                selectedPreferences[theme.themeId]
                                  ? "bg-blue-500 border-blue-500 text-white"
                                  : "border-gray-500"
                              }`}
                              onClick={() => {
                                setSelectedPreferences((prev) => {
                                  const newSelections = { ...prev };
                                  if (newSelections[theme.themeId]) {
                                    delete newSelections[theme.themeId];
                                  } else {
                                    newSelections[theme.themeId] =
                                      Object.keys(prev).length + 1;
                                  }
                                  return newSelections;
                                });
                              }}
                              title={
                                selectedPreferences[theme.themeId]
                                  ? `Preference ${
                                      selectedPreferences[theme.themeId]
                                    }`
                                  : "Select as preference"
                              }
                            >
                              {selectedPreferences[theme.themeId] &&
                                selectedPreferences[theme.themeId]}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      No themes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <AddTeammateModal
          student1Id={user.studentId}
          specialtyId={user.specialty?.specialtyId}
          selectedPreferences={selectedPreferences}
          onClose={() => {
            setShowModal(false);
            setSelecting(false);
          }}
        />
      )}
    </div>
  );
};

export default StudentThemes;
