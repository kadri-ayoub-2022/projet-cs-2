import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Button from "../../components/Button";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import Loading from "../../components/Loading";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "http://localhost:7777/service-admin/api/admin/students"
        );
        if (!response.ok) throw new Error("Failed to fetch students");
        const data: Student[] = await response.json();
        console.log(data);

        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <Title
        title="Students Management"
        description="Monitor and Manage all Students here"
      />
      <div className="bg-card-bg rounded-xl mt-6 px-6">
        <div className="flex justify-between items-cente py-6">
          <h3 className="font-bold text-xl text-text-primary">All Students</h3>
          <Button
            text="Add New Students"
            icon={<FaPlus />}
            href="/admin/students/add"
          />
        </div>
        {loading ? (
          <Loading className="mt-12" />
        ) : (
          <table className="w-full">
            <thead className="bg-background w-full">
              <td className="p-3 font-bold">Registration Number</td>
              <td className="p-3 font-bold">Full Name</td>
              <td className="p-3 font-bold">Email</td>
              <td className="p-3 font-bold">Speciality</td>
              <td className="p-3 font-bold">Actions</td>
            </thead>
            <tbody>
              {students.map((t, i) => (
                <tr key={i}>
                  <td className="p-3">{t.registrationNumber}</td>
                  <td className="p-3">{t.fullName}</td>
                  <td className="p-3">{t.email}</td>
                  <td className="p-3">{t?.specialty?.acronym}</td>
                  <td className="p-3">
                    <RiDeleteBinLine className="text-red-500" size={22} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
