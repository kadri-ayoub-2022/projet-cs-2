import { useState, useEffect } from "react";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import Axios from "../../utils/api";

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
}

interface updateRequest {
  title: string;
  description: string;
}

interface EditThemeModalProps {
  theme: ProjectTheme;
  onClose: () => void;
  onUpdate: (updatedTheme: updateRequest) => ProjectTheme;
}

interface Specialty {
  specialtyId: number;
  name: string;
}

const EditThemeModal: React.FC<EditThemeModalProps> = ({
  theme,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState(theme.title);
  const [description, setDescription] = useState(theme.description);
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>(
    theme.specialtyIds
  );

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await Axios.get(
          "/service-admin/api/admin/specialty"
        );
        setSpecialties(response.data);
      } catch {
        toast.error("Failed to fetch specialties");
      }
    };
    fetchSpecialties();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const updatedTheme = {
        title,
        description,
        specialties: selectedSpecialties,
      };
      const res = await Axios.put(
        `/project-theme/api/project-themes/${theme.themeId}`,
        updatedTheme,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Theme updated successfully !");
      onUpdate(res.data);
      onClose();
    } catch {
      toast.error("Failed to update theme");
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtyChange = (specialtyId: number) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialtyId)
        ? prev.filter((id) => id !== specialtyId)
        : [...prev, specialtyId]
    );
  };

  return (
    <Modal onClose={onClose} title="Edit Theme">
      <div className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label className="block font-semibold mb-2">Specialties</label>
          <div className="grid grid-cols-2 gap-2">
            {specialties.map((specialty) => (
              <div key={specialty.specialtyId} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSpecialties.includes(specialty.specialtyId)}
                  onChange={() => handleSpecialtyChange(specialty.specialtyId)}
                  className="mr-2"
                />
                {specialty.name}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button text="Close" onClick={onClose} variant="secondary" />
          <Button text="Save" onClick={handleSubmit} loading={loading} />
        </div>
      </div>
    </Modal>
  );
};

export default EditThemeModal;
