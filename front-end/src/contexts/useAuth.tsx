import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router";

interface Admin {
  adminId: number;
  fullName: string;
  email: string;
  role: "admin" | null;
}

interface AuthContextType {
  user: Admin | Teacher | Student | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Admin | Teacher | Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:7777/auth/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userWithRole = {
          ...response.data,
          role: response.data.role,
        };
        setUser(userWithRole);

        // if (userWithRole.role) {
        //   navigate(`/${userWithRole.role}`);
        // } else {
        //   console.error("Role is missing in user:", userWithRole);
        // }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:7777/auth/auth/login",
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      console.log("role is ... " + user.role);
      navigate(`/${user.role}`);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials");
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "http://localhost:7777/auth/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
