import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Button from "../../components/Button";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import Loading from "../../components/Loading";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          "http://localhost:7777/service-admin/api/admin/teachers"
        );
        if (!response.ok) throw new Error("Failed to fetch teachers");
        const data: Teacher[] = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div>
      <Title
        title="Teachers Management"
        description="Monitor and Manage all Teachers here"
      />
      <div className="bg-card-bg rounded-xl mt-6 px-6">
        <div className="flex justify-between items-cente py-6">
          <h3 className="font-bold text-xl text-text-primary">All Teachers</h3>
          <Button
            text="Add New Teachers"
            icon={<FaPlus />}
            href="/admin/teachers/add"
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
              <td className="p-3 font-bold">Actions</td>
            </thead>
            <tbody>
              {teachers.map((t, i) => (
                <tr key={i}>
                  <td className="p-3">{t.registrationNumber}</td>
                  <td className="p-3">{t.fullName}</td>
                  <td className="p-3">{t.email}</td>
                  <td className="p-3"><RiDeleteBinLine className="text-red-500" size={22} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
