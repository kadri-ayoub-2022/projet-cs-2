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

interface ProjectTheme {
  themeId: string;
  title: string;
  description: string;
  file: string;
  progression: number;
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
  const [selectedPreferences, setSelectedPreferences] = useState<Object>({});

  useEffect(() => {
    fetchThemes();
  }, []);

  const { user } = useAuth();

  const fetchThemes = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:7777/project-theme/api/project-themes/unassigned"
      );
      setThemes(response.data);
      response.data.forEach((theme: ProjectTheme) => {
        Axios.get(
          `http://localhost:7777/project-theme/api/project-themes/${theme.themeId}/invitations/count`
        )
          .then((response) => {
            setInvitationCounts((prev) => ({
              ...prev,
              [theme.themeId]: response.data,
            }));
          })
          .catch((err) => console.error("Error fetching invitations:", err));
      });
    } catch (error) {
      console.error("Error fetching themes:", error);
      toast.error("Failed to load themes.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredThemes = themes.filter((theme) =>
    theme.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            placeholder="Search Theme"
            onChange={handleSearch}
            value={searchQuery}
            type="search"
          />
        </div>
      </div>

      <div className="bg-card-bg rounded-xl mt-6 px-6 py-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-text-primary">Themes List</h3>
          <div className="flex items-center gap-2">
            {Object.keys(selectedPreferences).length > 0 ? (
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
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredThemes.map((theme, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-xl transition"
              >
                <h4 className="font-semibold text-lg">{theme.title}</h4>
                <p className="text-gray-600 text-sm mt-1">
                  {theme.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Progress: {theme.progression}%
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  20/02/2025 to 01/03/2025
                </p>

                <div className="flex justify-between items-center mt-4">
                  <FaEye
                    className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
                    size={22}
                    onClick={() => {
                      if (theme.file) {
                        window.open(theme.file, "_blank");
                      } else {
                        toast.error("No file available");
                      }
                    }}
                  />
                  {!selecting ? (
                    <div className="relative">
                      <HiOutlineUserGroup
                        className="text-gray-500"
                        size={22}
                        onClick={() => {
                          setSelectedTheme(theme);
                          setShowModal(true);
                        }}
                      />
                      {invitationCounts[theme.themeId] > 0 && (
                        <span className="absolute -top-2 -right-4 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">
                          {invitationCounts[theme.themeId]}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`w-4 h-4 text-xs font-bold border-2 cursor-pointer rounded-sm flex items-center justify-center ${
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
                    >
                      {selectedPreferences[theme.themeId] &&
                        selectedPreferences[theme.themeId]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddTeammateModal
          student1Id={user.studentId}
          selectedPreferences={selectedPreferences}
          onClose={() => {
            setShowModal(false);
            setSelectedPreferences({});
            setSelecting(false);
          }}
        />
      )}
    </div>
  );
};

export default StudentThemes;
