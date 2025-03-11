import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

// Define the user types
interface Admin {
  adminId: number;
  fullName: string;
  email: string;
  password: string;
  role: "admin" | null;
}


// Define the AuthContext type
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
        setUser(response.data);
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
    const response = await axios.post("http://localhost:7777/auth/auth/login", {
      email,
      password,
    });

    const { token, user, role } = response.data;
    const userWithRole = { ...user, role }; // Ensure role is assigned to user
    localStorage.setItem("token", token);
    setUser(userWithRole);
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
            window.location.href = "/login";
          }
        } catch (err) {
          console.error("Logout error:", err);
          alert("Failed to logout. Please try again.");
        }
  };
  
  console.log(user)

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
