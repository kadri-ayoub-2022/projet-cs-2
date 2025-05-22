import { useLocation, Link } from "react-router";
import {
  FiHome,
  FiLogOut,
  FiBookOpen,
} from "react-icons/fi";



import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/useAuth";
import { GoTasklist } from "react-icons/go";
import { RiCalendarScheduleLine } from "react-icons/ri";

const studentSidebar = () => {
  const location = useLocation();

  const { signOut } = useAuth()

  const studentLinks = [
    { text: "Themes", route: "/student/projects-themes", icon: FiBookOpen },
    { text: "Evaluation", route: "/student/evaluation", icon: GoTasklist },
    { text: "Defense Schedule", route: "/student/defense-schedule", icon: RiCalendarScheduleLine },
    
  ];

  const { user } = useAuth()

  return (
    <div className="flex flex-col justify-between h-screen bg-card-bg py-6 px-4">
      <div>
        <img src={logo} alt="" className="mx-auto mb-6" />
        <div className="flex flex-col gap-2">
          {studentLinks.map((link) => {
            const isSelected = location.pathname === link.route;
            const Icon = link.icon;

            return (
              <Link to={link.route} key={link.route}>
                <div
                  className={`flex items-center gap-3 py-3 px-4 rounded-md transition-colors  ${
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
        
        <div className="flex flex-col">
          <p className="text-sm font-medium text-text-primary">{user.fullName}</p>
          <p className="text-xs text-text-secondary">{user.email}</p>
        </div>
        <button onClick={signOut} className="ml-auto text-error">
          <FiLogOut className="w-4 h-4" />
        </button>
      </button>
    </div>
  );
};

export default studentSidebar;
