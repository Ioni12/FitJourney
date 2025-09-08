import { useContext, createContext, useState, useEffect } from "react";
import {
  createUser,
  signInUser,
  logOut as logOutService, // Renamed to avoid naming conflict
  fetchUser,
} from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = fetchUser();
    if (user) {
      setUser(user);
    }
  }, []);

  const signin = async (email, password) => {
    try {
      const response = await signInUser(email, password);
      if (response.success) {
        setUser(response.data);
        localStorage.setItem("token", response.data.token); // if using JWT
      }
      setLoading(false);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    setLoading(false);
    setUser(null);
    try {
      const response = await createUser(userData);
      if (response.success) {
        setUser(response.data);
        localStorage.setItem("token", response.data.token);
      }
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logOut = () => {
    setUser(null);
    setLoading(false);
    logOutService(); // Call the service function with the new name
  };

  return (
    <AuthContext.Provider value={{ user, loading, signin, register, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
