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


interface ProjectTheme {
  themeId: number;
  title: string;
  description: string;
  file: string;
  progression: number;
  date_selection_begin: string;
  date_selection_end: string;
  teacher: Teacher;
  specialties: Speciality[];
  // student1Id: number | null;
  // student2Id: number | null;
  student1: Student;
  student2: Student;
  status: boolean;
}