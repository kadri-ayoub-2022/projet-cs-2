interface Teacher {
  teacherId: number;
  fullName: string;
  email: string;
  registrationNumber: string;
  role: "teacher";
}

interface Speciality {
  specialityId: number;
  name: string;
  acronym: string;
}

interface Student {
  studentId: number;
  fullName: string;
  email: string;
  registrationNumber: string;
  average: number;
  specialty: Speciality;
  createdAt: Date;
  role: "student";
}


// temprary types for evaluation


export type Task = {
  taskId: number;
  title: string;
  description: string;
  status: string; // "COMPLETED" | "IN_PROGRESS" | "PENDING" | etc.
  priority: string; // "HIGH" | "MEDIUM" | "LOW" | etc.
  createdAt: Date;
  date_begin: Date;
  date_end: Date | null;
  evaluation: string | null;
  files: File[];
  comments: Comment[];
};

export type Comment = {
  commentId: number;
  content: string;
  createdAt: Date;
  taskId: number;
  // Frontend-only fields for display purposes
  author?: string;
  avatar?: string;
};

export type File = {
  fileId: number;
  createdAt: Date;
  fileName: string;
  taskId: number;
  // Frontend-only fields for display purposes
  url?: string;
  size?: string;
  rawFile?: File; // The actual File object for upload
};

export type ProjectTasks = {
  [key: number]: Task[];
};

export type Team = {
  supervisor: Supervisor;
  students: TeamMember[];
};

export type Teams = {
  [key: number]: Team;
};

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

export type Supervisor = {
  name: string;
  email: string;
  avatar: string;
};
interface ProjectTheme {
  themeId: number;
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
  status: boolean;
}
