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
  atudentId: number;
  fullName: string;
  email: string;
  registrationNumber: string;
  specialty: Speciality;
  createdAt: Date;
  role: "student";
}
