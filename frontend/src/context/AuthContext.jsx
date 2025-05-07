import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, logout as logoutService, getProfile as getProfileService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { // Verificamos si el usuario está autenticado
    const checkAuth = async () => {
      try {
        const {data} = await getProfileService();
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

  const loginUser = async (values, { setStatus, setSubmitting }) => {
    try {
      await loginService(values);

      const { data } = await getProfileService();
      setUser(data);
      setIsAuthenticated(true);

      navigate(`/`);
    } catch (err) {
      setStatus({ error: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const logoutUser = async () => {
    try {
      await logoutService(); 
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate("/"); 
    }
  };

  return ( 
    <AuthContext.Provider value={{ user, isAuthenticated, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
