"use client";

import { createContext, useState, useContext, useEffect } from "react";

// Define the structure of the authentication context
interface User {
  name: string;
  email: string;
  [key: string]: string; // For additional properties that may exist
}

interface AuthContextType {
  token: string | null; // Store token
  role: string | null; // Store role of the user
  user: User | null; // Store user data as an object
  isAuthenticated: boolean;
  login: (token: string, role: string, userId: string, user: User) => void;
  logout: () => void;
  loading: boolean;
  isLoggedIn: boolean;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Create a provider component that will wrap the entire app
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Role state to store user's role
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null); // User state to store user object

  // Check localStorage for token, role, and user on page load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    if (
      storedToken !== undefined &&
      storedRole !== undefined &&
      storedUser !== null &&
      storedUser !== undefined
    ) {
      setToken(storedToken);
      setRole(storedRole);
      setUser(storedUser !== null ? JSON.parse(storedUser) : null); // Parse stored user JSON
      setIsLoggedIn(true); // Mark as logged in if token exists
    } else {
      logout();
    }
    setLoading(false);
  }, []);

  const login = (token: string, role: string, userId: string, user: User) => {
    setToken(token);
    setRole(role);
    setUser(user); // Set the user object on login
    localStorage.setItem("token", token); // Store token in localStorage
    localStorage.setItem("role", role); // Store role in localStorage
    localStorage.setItem("userId", userId); // Store userId in localStorage
    localStorage.setItem("user", JSON.stringify(user)); // Store user as a JSON string
    setIsLoggedIn(true); // Mark as logged in
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null); // Clear the user object on logout
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("role"); // Remove role from localStorage
    localStorage.removeItem("user"); // Remove user from localStorage
    setIsLoggedIn(false); // Mark as logged out
  };

  const isAuthenticated = token !== null;

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        isAuthenticated,
        login,
        logout,
        loading,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext in other components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
