// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { login, logout, getProfile } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => { // Verificamos si el usuario está autenticado
    const checkAuth = async () => {
      try {
        const { data } = await getProfile(); 
        setUser(data); 
        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginUser = async (credentials) => {
    try {
      await login(credentials);
      const { data } = await getProfile();
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error("Credenciales inválidas");
    }
  };

  const logoutUser = async () => { 
    await logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return ( 
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login: loginUser, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
