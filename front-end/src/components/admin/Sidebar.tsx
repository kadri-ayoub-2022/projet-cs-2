import { useLocation, Link } from "react-router";
import {
  FiHome,
  FiUsers,
  FiLogOut,
  FiUserCheck,
  FiBookOpen,
} from "react-icons/fi";

import { PiStudent } from "react-icons/pi";

import logo from "../../assets/logo.png";

const AdminSidebar = () => {
  const location = useLocation();

  const adminLinks = [
    { text: "Home", route: "/admin", icon: FiHome },
    { text: "Teachers", route: "/admin/teachers", icon: FiUserCheck },
    { text: "Students", route: "/admin/students", icon: PiStudent },
    { text: "Projects Themes", route: "/admin/projects-themes", icon: FiBookOpen },
    { text: "Groups", route: "/admin/groups", icon: FiUsers },
  ]

  const user = {
    name: "PFE Admin",
    email: "pfe@esi-sba.dz",
    avatar: "/placeholder.svg?height=40&width=40",
  };

  return (
    <div className="flex flex-col justify-between h-screen bg-card-bg py-6 px-4">
      <div>
        <img src={logo} alt="" className="mx-auto mb-6" />
        <div className="flex flex-col gap-2">
          {adminLinks.map((link) => {
            const isSelected =
              location.pathname === link.route ||
              location.pathname.startsWith(link.route);
            const Icon = link.icon;

            return (
              <Link to={link.route} key={link.route}>
                <div
                  className={`flex items-center gap-3 py-3 px-4 rounded-md transition-colors ${
                    isSelected
                      ? "bg-primary text-white"
                      : "text-text-primary hover:bg-background"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <p className="text-sm font-medium">{link.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <button className="flex items-center gap-3 px-4 py-3 cursor-pointer">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={logo}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-text-primary">{user.name}</p>
          <p className="text-xs text-text-secondary">{user.email}</p>
        </div>
        <button className="ml-auto text-error">
          <FiLogOut className="w-4 h-4" />
        </button>
      </button>
    </div>
  );
};

export default AdminSidebar;
