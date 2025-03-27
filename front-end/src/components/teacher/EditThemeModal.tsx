import { useState } from "react";
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

const EditThemeModal: React.FC<EditThemeModalProps> = ({
  theme,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState(theme.title);
  const [description, setDescription] = useState(theme.description);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
   
      const updatedTheme = { title, description };
      const res = await Axios.put(
        `http://localhost:7777/project-theme/api/project-themes/${theme.themeId}`,
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
        <div className="flex justify-end space-x-2">
          <Button text="Close" onClick={onClose} variant="secondary" />
          <Button text="Save" onClick={handleSubmit} loading={loading} />
        </div>
      </div>
    </Modal>
  );
};

export default EditThemeModal;
