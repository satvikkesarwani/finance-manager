import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/user/status");
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const interval = setInterval(() => {
      checkAuth();
    }, 5000);

    const handleExpired = () => {
      setUser(null);
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    };

    window.addEventListener('auth-expired', handleExpired);

    return () => {
      clearInterval(interval);
      window.removeEventListener('auth-expired', handleExpired);
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/user/login", { email, password });
    setUser(data.user);
    return data;
  };

  const signup = async (fullname, email, password) => {
    const { data } = await api.post("/user/signup", { fullname, email, password });
    return data;
  };

  const logout = async () => {
    await api.get("/user/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
