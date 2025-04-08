import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Button from "../../components/Button";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import Loading from "../../components/Loading";
import Checkbox from "../../components/Checkbox";
import Swal from "sweetalert2";
import Axios from "../../utils/api";

interface ProjectTheme {
  themeId: number;
  title: string;
  description: string;
  file: string;
  teacherId: number;
  // Add other properties if needed
}

export default function AThemes() {
  const [themes, setThemes] = useState<ProjectTheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedThemes, setSelectedThemes] = useState<number[]>([]);

  useEffect(() => {
    const getThemes = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching themes...");

        const res = await Axios.get("/project-theme/projectThemes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data._embedded?.projectThemes || [];
        console.log("Fetched themes:", data);
        setThemes(data);
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

  const selectAllThemes = () => {
    if (selectedThemes.length === themes.length) {
      setSelectedThemes([]);
    } else {
      const selectAll = themes.map((s) => s.themeId);
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
    console.log(selectedThemes);
  };

  const handleDeleteMany = async () => {
    if (selectedThemes.length === 0) {
      Swal.fire("Error", "No themes selected for deletion!", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedThemes.length} theme(s). This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await Axios.delete("/service-admin/api/admin/themes/many", {
        data: { themeIds: selectedThemes },
      });

      setThemes((prevThemes) =>
        prevThemes.filter((s) => !selectedThemes.includes(s.themeId))
      );
      setSelectedThemes([]);

      Swal.fire("Deleted!", "Themes deleted successfully.", "success");
    } catch (error: any) {
      console.error("Delete error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to delete themes.",
        "error"
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Title
          title="Themes Management"
          description="Monitor and Manage all Themes here"
        />
      </div>
      <div className="bg-card-bg rounded-xl mt-6 px-6">
        <div className="flex justify-between items-center py-6">
          <h3 className="font-bold text-xl text-text-primary">All Themes</h3>
          <div className="flex items-center gap-2">
            {selectedThemes.length > 0 && (
              <button
                onClick={handleDeleteMany}
                className="p-2 rounded-full bg-red-200 hover:bg-red-300 transition-colors"
                aria-label="Delete selected themes"
              >
                <RiDeleteBinLine size={20} color="red" />
              </button>
            )}
            <Button
              text="Add New Theme"
              icon={<FaPlus />}
              href="/admin/projects-themes/new"
            />
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
                        selectedThemes.length === themes.length &&
                        themes.length > 0
                      }
                    />
                  </th>
                  <th className="p-3 font-bold text-left">Title</th>
                  <th className="p-3 font-bold text-left">Description</th>
                  <th className="p-3 font-bold text-left">File</th>
                  <th className="p-3 font-bold text-left">Teacher</th>
                  <th className="p-3 font-bold text-left">Specialty</th>
                  <th className="p-3 font-bold text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {themes.length > 0 ? (
                  themes.map((t) => (
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
                      <td className="p-3">{t.title}</td>
                      <td className="p-3">{t.description}</td>
                      <td className="p-3">{t.file}</td>
                      <td className="p-3">{t.teacherId}</td>
                      <td className="p-3">SIW | ISI</td>
                      <td className="p-3">
                        <button
                          className="hover:text-red-700 transition-colors"
                          aria-label={`Delete theme ${t.title}`}
                        >
                          <RiDeleteBinLine className="text-red-500" size={22} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No themes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
