import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa6";
import Axios from "../../utils/api";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

interface ProjectTheme {
  themeId: string;
  title: string;
  description: string;
  file: string;
  progression: number;
  date_selection_begin: string;
  date_selection_end: string;
  teacherId: number;
  specialtyIds: number[];
  student1Id: number | null;
  student2Id: number | null;
  student1: Student;
  student2: Student;
}

interface Student {
  studentId: number;
  fullName: string;
  email: string;
  registrationNumber: string;
  average: number;
}

const Groups = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await Axios.get(
          "/project-theme/api/project-themes/my-themes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const filteredThemes = response.data.filter(
          (theme: ProjectTheme) => theme.student1Id || theme.student2Id
        );
        setThemes(filteredThemes);
      } catch (error) {
        toast.error("Failed to fetch themes");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div>
      <Title
        title="Group Themes"
        description="List of assigned project themes"
      />
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {themes.map((theme: ProjectTheme) => (
            <div
              key={theme.themeId}
              className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <div className="border-b border-gray-100 p-4">
                <h4 className="font-semibold text-lg text-gray-800">
                  {theme.title}
                </h4>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Progress
                  </span>
                  <span className="text-sm font-medium">
                    {theme.progression}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className={`h-1.5 rounded-full ${getProgressColor(
                      theme.progression
                    )}`}
                    style={{ width: `${theme.progression}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {theme.description}
                </p>

                <div className="space-y-2 mb-4">
                  {theme.student1 && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-xs mr-2">
                        {theme.student1?.fullName.charAt(0)}
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Student 1:</span>{" "}
                        {theme.student1.fullName}
                      </p>
                    </div>
                  )}

                  {theme.student2 && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-xs mr-2">
                        {theme.student2?.fullName.charAt(0)}
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Student 2:</span>{" "}
                        {theme.student2.fullName}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    onClick={() => {
                      if (theme.file) {
                        window.open(theme.file, "_blank");
                      } else {
                        toast.error("No file available");
                      }
                    }}
                  >
                    <FaEye className="text-gray-600" size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;
