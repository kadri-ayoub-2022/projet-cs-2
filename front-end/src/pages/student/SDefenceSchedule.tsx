import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/useAuth";
import Loading from "../../components/Loading";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, FileText, User, Award } from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  note: string | null;
}

interface JuryMember {
  id: number;
  name: string;
  email: string;
  note: string | null;
  _id: string;
}

interface Room {
  _id: string;
  name: string;
  __v: number;
}

interface ThesisDefense {
  teacher: Teacher;
  student1: Student | null;
  student2: Student | null;
  _id: string;
  themeId: number;
  title: string;
  jury: JuryMember[];
  roomId: Room;
  date: string;
  startTime: string;
  endTime: string;
  note: number | null;
  pv?: string | null;
  __v: number;
}

const SDefenseSchedule: React.FC = () => {
  const [defenses, setDefenses] = useState<ThesisDefense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDefenses = async () => {
      try {
        setLoading(true);
        const studentId = user?.studentId;

        if (!studentId) {
          setError("Student ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8085/api/thesisDefense/ForStudent/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDefenses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching defense schedule:", err);
        setError("Failed to load defense schedule. Please try again later.");
        setLoading(false);
      }
    };

    fetchDefenses();
  }, [user?.studentId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to get color based on grade
  const getGradeColor = (grade: number): string => {
    if (grade < 8) return "bg-red-500";
    if (grade < 10) return "bg-orange-500";
    if (grade < 14) return "bg-yellow-500";
    if (grade < 16) return "bg-green-500";
    return "bg-emerald-500";
  };

  // Helper function to get grade label
  const getGradeLabel = (grade: number | null | undefined): string => {
    if (grade === null || grade === undefined) return "Not Graded Yet";
    if (grade < 8) return "Insufficient";
    if (grade < 10) return "Poor";
    if (grade < 12) return "Fair";
    if (grade < 14) return "Good";
    if (grade < 16) return "Very Good";
    if (grade < 18) return "Excellent";
    return "Outstanding";
  };

  // Helper function to get badge color based on grade
  const getGradeBadgeColor = (grade: number): string => {
    if (grade < 8) return "bg-red-100 text-red-800";
    if (grade < 10) return "bg-orange-100 text-orange-800";
    if (grade < 14) return "bg-yellow-100 text-yellow-800";
    if (grade < 16) return "bg-green-100 text-green-800";
    return "bg-emerald-100 text-emerald-800";
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="p-6">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md"
          role="alert"
        >
          <div className="flex items-center">
            <svg
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Group defenses by date for better organization
  const groupedDefenses = defenses.reduce((groups, defense) => {
    const date = formatDate(defense.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(defense);
    return groups;
  }, {} as Record<string, ThesisDefense[]>);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Defense Schedule
          </h1>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
            {defenses.length} Defense{defenses.length !== 1 ? "s" : ""}
          </div>
        </div>

        {defenses.length === 0 ? (
          <div className="bg-white shadow-lg rounded-xl p-8 text-center border border-gray-100">
            <div className="flex flex-col items-center justify-center">
              <Calendar className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Defenses Scheduled
              </h2>
              <p className="text-gray-500 max-w-md">
                You don't have any thesis defense sessions scheduled at the
                moment.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedDefenses).map(([date, dateDefenses]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {date}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {dateDefenses.map((defense) => (
                    <div
                      key={defense._id}
                      className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-xl font-bold mb-1">
                              {defense.title}
                            </h2>
                            <p className="text-blue-100 text-sm">
                              Theme ID: {defense.themeId}
                            </p>
                          </div>

                          {/* Grade badge - only show if grade exists */}
                          {defense.note !== null &&
                            defense.note !== undefined && (
                              <div className="flex flex-col items-end">
                                <div
                                  className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeBadgeColor(
                                    defense.note
                                  )}`}
                                >
                                  {defense.note}/20
                                </div>
                                <span className="text-xs text-blue-100 mt-1">
                                  {getGradeLabel(defense.note)}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                                Schedule Details
                              </h3>
                              <div className="space-y-3">
                                <div className="flex items-center text-gray-700">
                                  <Calendar className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" />
                                  <span>{formatDate(defense.date)}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <Clock className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" />
                                  <span>
                                    {defense.startTime} - {defense.endTime}
                                  </span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <MapPin className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" />
                                  <span>{defense.roomId.name}</span>
                                </div>
                                {defense.note && (
                                  <div className="flex items-start text-gray-700">
                                    <FileText className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span>{defense.note}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                                <User className="h-5 w-5 mr-2 text-blue-600" />
                                Supervisor
                              </h3>
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-start">
                                  <div className="bg-blue-600 rounded-full p-2 mr-3 flex-shrink-0">
                                    <User className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {defense.teacher.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {defense.teacher.email}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                                Jury Members
                              </h3>
                              <div className="grid grid-cols-1 gap-3">
                                {defense.jury.map((member) => (
                                  <div
                                    key={member._id}
                                    className="p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200 hover:bg-gray-100"
                                  >
                                    <div className="flex items-start">
                                      <div className="bg-gray-200 rounded-full p-2 mr-3 flex-shrink-0">
                                        <User className="h-4 w-4 text-gray-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {member.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {member.email}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Grade section - only show if grade exists */}
                            {defense.note !== null &&
                              defense.note !== undefined && (
                                <div className="mt-6">
                                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                                    <Award className="h-5 w-5 mr-2 text-blue-600" />
                                    Your Grade
                                  </h3>

                                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                    <div className="space-y-4">
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">
                                          Your grade:
                                        </span>
                                        <span
                                          className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeBadgeColor(
                                            defense.note
                                          )}`}
                                        >
                                          {defense.note}/20
                                        </span>
                                      </div>

                                      <div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                          <div
                                            className={`h-full ${getGradeColor(
                                              defense.note
                                            )}`}
                                            style={{
                                              width: `${
                                                (defense.note / 20) * 100
                                              }%`,
                                            }}
                                          ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                          <span>0</span>
                                          <span>10</span>
                                          <span>20</span>
                                        </div>
                                      </div>

                                      <div className="text-center">
                                        <span className="text-sm font-medium text-gray-600">
                                          {getGradeLabel(defense.note)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {defense.pv && (
                                    <a
                                      href={defense.pv}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full mt-3 inline-flex justify-center items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      See PV
                                    </a>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SDefenseSchedule;
