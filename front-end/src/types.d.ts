interface Teacher {
  teacherId: number;
  fullName: string;
  email: string;
  password: string;
  registrationNumber: string;
  role: "teacher" | null;
}

interface Speciality {
  specialityId: number;
  name: string;
  acronym: string;
}

interface Student {
  atudentId: number;
  fullName: string;
  email: string;
  password: string;
  registrationNumber: string;
  specialty: Speciality;
  createdAt: Date;
  role: "student" | null;
}
