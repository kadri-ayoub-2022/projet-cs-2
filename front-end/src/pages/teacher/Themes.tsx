import type React from "react"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Title from "../../components/admin/Title"
import Button from "../../components/Button"
import { FaPlus, FaSortAlphaDown, FaSortAlphaUpAlt, FaEdit } from "react-icons/fa"
import { RiDeleteBinLine } from "react-icons/ri"
import { FaEye } from "react-icons/fa6"
import Loading from "../../components/Loading"
import Input from "../../components/Input"
import Axios from "../../utils/api"
import { MdGroup } from "react-icons/md"
import EditThemeModal from "../../components/teacher/EditThemeModal"
import InvitationModal from "../../components/teacher/InvitationModal"
import AssignedModal from "../../components/teacher/AssignedModal"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import type { ProjectTheme } from "../../types"

const Themes = () => {
  const [themes, setThemes] = useState<ProjectTheme[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<boolean>(true)
  const [editTheme, setEditTheme] = useState<ProjectTheme | null>(null)
  const [invitationCounts, setInvitationCounts] = useState<{
    [key: string]: number
  }>({})
  const [selectedTheme, setSelectedTheme] = useState<ProjectTheme | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showAssignedModal, setShowAssignedModal] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    Axios.get("/project-theme/api/project-themes/my-themes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setThemes(res.data)
        console.log(res.data)

        res.data.forEach((theme: ProjectTheme) => {
          Axios.get(`/project-theme/api/project-themes/${theme.themeId}/invitations/count`)
            .then((response) => {
              setInvitationCounts((prev) => ({
                ...prev,
                [theme.themeId]: response.data,
              }))
            })
            .catch((err) => console.error("Error fetching invitations:", err))
        })
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleDelete = async (themeId: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("You must be logged in to delete a theme")
        return
      }

      const confirmDelete = window.confirm("Are you sure you want to delete this theme?")
      if (!confirmDelete) return

      await Axios.delete(`/project-theme/api/project-themes/${themeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success("Project theme deleted successfully")
      setThemes((prevThemes) => prevThemes.filter((theme) => theme.themeId !== themeId))
    } catch {
      toast.error("Failed to delete project theme")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTheme = (updatedTheme: ProjectTheme) => {
    setThemes((prev) => prev.map((theme) => (theme.themeId === updatedTheme.themeId ? updatedTheme : theme)))
  }

  const sortedThemes = [...themes].sort((a, b) =>
    sortOrder ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
  )

  const filteredThemes = sortedThemes.filter((theme) => theme.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleInvitationClick = async (theme: ProjectTheme) => {
    setSelectedTheme(theme)
    if (theme.student1Id || theme.student2Id) {
      setShowAssignedModal(true)
    } else {
      setShowModal(true)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Title title="Themes Management" description="Monitor and Manage all your themes here" />
        <div className="w-1/3">
          <Input placeholder="Search Theme" onChange={handleSearch} value={searchQuery} type="search" />
        </div>
      </div>

      <div className="bg-card-bg rounded-xl mt-6 px-6 py-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-text-primary">All Your Themes</h3>
          <div className="flex items-center gap-2">
            <Button
              icon={sortOrder ? <FaSortAlphaUpAlt /> : <FaSortAlphaDown />}
              onClick={() => setSortOrder(!sortOrder)}
              text=""
            />
            <Button text="Add New Theme" icon={<FaPlus />} href="/teacher/projects-themes/new" />
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="p-3 font-bold text-left">Title</th>
                  <th className="p-3 font-bold text-left">Description</th>
                  <th className="p-3 font-bold text-left">Progress</th>
                  <th className="p-3 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredThemes.length > 0 ? (
                  filteredThemes.map((theme, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="p-3">
                        <h4 className="font-semibold">{theme.title}</h4>
                      </td>
                      <td className="p-3">
                        <p className="text-gray-600 text-sm truncate max-w-xs" title={theme.description}>
                          {theme.description}
                        </p>
                      </td>
                      <td className="p-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${theme.progression}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">{theme.progression}%</span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center items-center gap-3">
                          <FaEye
                            className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
                            size={20}
                            onClick={() => {
                              if (theme.file) {
                                window.open(theme.file, "_blank")
                              } else {
                                toast.error("No file available")
                              }
                            }}
                            title="View File"
                          />
                          <FaEdit
                            className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
                            size={20}
                            onClick={() => setEditTheme(theme)}
                            title="Edit Theme"
                          />
                          <div className="relative">
                            <MdGroup
                              className="text-blue-500 cursor-pointer hover:text-blue-700 transition"
                              size={20}
                              onClick={() => handleInvitationClick(theme)}
                              title="Manage Invitations"
                            />
                            {invitationCounts[theme.themeId] > 0 && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {invitationCounts[theme.themeId]}
                              </span>
                            )}
                          </div>
                          <RiDeleteBinLine
                            className="text-red-500 cursor-pointer hover:text-red-700 transition"
                            size={20}
                            onClick={() => handleDelete(theme.themeId)}
                            title="Delete Theme"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      No themes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {editTheme && (
        <EditThemeModal theme={editTheme} onClose={() => setEditTheme(null)} onUpdate={handleUpdateTheme} />
      )}
      {showModal && selectedTheme && (
        <InvitationModal
          theme={selectedTheme}
          onClose={() => {
            setShowModal(false)
            setInvitationCounts({
              ...invitationCounts,
              [selectedTheme?.themeId]: 0,
            })
          }}
        />
      )}
      {showAssignedModal && (
        <AssignedModal
          student1Id={selectedTheme?.student1Id}
          student2Id={selectedTheme?.student2Id}
          onClose={() => {
            setShowAssignedModal(false)
          }}
        />
      )}
    </div>
  )
}

export default Themes
