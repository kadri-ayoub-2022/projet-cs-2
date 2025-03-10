interface Teacher {
  teacherId: number;
  fullName: string;
  email: string;
  password: string;
  registrationNumber: string;
  createdAt: Date;
}

interface Speciality {
  specialityId: number;
  name: string;
  acronym: string;
}

interface Student {
  teacherId: number;
  fullName: string;
  email: string;
  password: string;
  registrationNumber: string;
  specialty: Speciality;
  createdAt: Date;
}
