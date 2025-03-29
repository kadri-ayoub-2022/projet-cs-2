import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa6";
import Axios from "../../utils/api";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";


interface ProjectTheme {
  themeId: String;
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
          "http://localhost:7777/project-theme/api/project-themes/my-themes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const filteredThemes = response.data.filter(
          (theme: ProjectTheme) => theme.student1Id && theme.student2Id
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

  return (
    <div>
      <Title title="Group Themes" description="List of assigned project themes" />
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {themes.map((theme: ProjectTheme) => (
            <div
              key={theme.themeId}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition"
            >
              <h4 className="font-semibold text-lg">{theme.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{theme.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                Progress: {theme.progression}%
              </p>
              <p className="text-sm mt-2">
                <strong>Student 1:</strong> {theme.student1.fullName}
              </p>
              <p className="text-sm">
                <strong>Student 2:</strong> {theme.student2.fullName}
              </p>
              <div className="flex justify-end mt-4">
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;
