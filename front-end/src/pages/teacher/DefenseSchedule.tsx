"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/useAuth";
import Loading from "../../components/Loading";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Users,
  User,
  Award,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

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
  pv?: string | null;
  note: number | null;
  __v: number;
}

interface GradeModalProps {
  defense: ThesisDefense;
  onClose: () => void;
  onSubmit: (id: number, grade: number) => Promise<void>;
}

const GradeModal: React.FC<GradeModalProps> = ({
  defense,
  onClose,
  onSubmit,
}) => {
  const [grade, setGrade] = useState<number>(defense.note || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (grade < 0 || grade > 20) {
      setError("La note doit être entre 0 et 20");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(defense.themeId, grade);
      onClose();
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold">Attribuer une Note</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-1">Projet:</h4>
            <p className="text-gray-700">{defense.title}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="grade"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Note (0-20)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="grade"
                  min="0"
                  max="20"
                  step="0.5"
                  value={grade}
                  onChange={(e) => setGrade(Number.parseFloat(e.target.value))}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Award className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Visual grade indicator */}
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getGradeColor(grade)}`}
                    style={{ width: `${(grade / 20) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>10</span>
                  <span>20</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
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

const DefenseSchedule: React.FC = () => {
  const [defenses, setDefenses] = useState<ThesisDefense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDefense, setSelectedDefense] = useState<ThesisDefense | null>(
    null
  );
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDefenses = async () => {
      try {
        setLoading(true);
        const teacherId = user?.teacherId;

        if (!teacherId) {
          setError("User ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8085/api/thesisDefense/ForTeacher/${teacherId}`,
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
  }, [user?.teacherId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const handleSubmitGrade = async (defenseId: number, grade: number) => {
    try {
      await axios.put(
        `http://localhost:8085/api/thesisDefense/Period/update-noteByTeacher/${defenseId}`,
        { note: grade },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the local state with the new grade
      setDefenses(
        defenses.map((defense) =>
          defense.themeId === defenseId ? { ...defense, note: grade } : defense
        )
      );

      // Show success notification
      setNotification({
        type: "success",
        message: "La note a été enregistrée avec succès",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error("Error updating grade:", err);
      setNotification({
        type: "error",
        message: "Échec de l'enregistrement de la note. Veuillez réessayer.",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);

      throw err;
    }
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
        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <Check className="h-5 w-5 mr-2 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            )}
            <p>{notification.message}</p>
          </div>
        )}

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

                          {/* Grade badge */}
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
                                <Users className="h-5 w-5 mr-2 text-blue-600" />
                                Students
                              </h3>
                              <div className="space-y-4">
                                {defense.student1 && (
                                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-start">
                                      <div className="bg-blue-600 rounded-full p-2 mr-3 flex-shrink-0">
                                        <User className="h-4 w-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {defense.student1.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {defense.student1.email}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {defense.student2 && (
                                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-start">
                                      <div className="bg-blue-600 rounded-full p-2 mr-3 flex-shrink-0">
                                        <User className="h-4 w-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {defense.student2.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {defense.student2.email}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
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

                            {/* Grade section */}
                            <div className="mt-6">
                              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                                <Award className="h-5 w-5 mr-2 text-blue-600" />
                                Evaluation
                              </h3>

                              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                {defense.note !== null &&
                                defense.note !== undefined ? (
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-gray-700">
                                        Note attribuée:
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

                                    <button
                                      onClick={() =>
                                        setSelectedDefense(defense)
                                      }
                                      className="w-full mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
                                    >
                                      <Award className="h-4 w-4 mr-2" />
                                      Modifier la note
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-center py-4">
                                    <Award className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500 mb-4">
                                      Aucune note attribuée
                                    </p>
                                    <button
                                      onClick={() =>
                                        setSelectedDefense(defense)
                                      }
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                                    >
                                      <Award className="h-4 w-4 mr-2" />
                                      Attribuer une note
                                    </button>
                                  </div>
                                )}
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

      {/* Grade Modal */}
      {selectedDefense && (
        <GradeModal
          defense={selectedDefense}
          onClose={() => setSelectedDefense(null)}
          onSubmit={handleSubmitGrade}
        />
      )}
    </div>
  );
};

// Helper function to get badge color based on grade
const getGradeBadgeColor = (grade: number): string => {
  if (grade < 8) return "bg-red-100 text-red-800";
  if (grade < 10) return "bg-orange-100 text-orange-800";
  if (grade < 14) return "bg-yellow-100 text-yellow-800";
  if (grade < 16) return "bg-green-100 text-green-800";
  return "bg-emerald-100 text-emerald-800";
};

export default DefenseSchedule;
