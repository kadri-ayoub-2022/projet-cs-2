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
