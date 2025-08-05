import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // إعداد axios للإرسال مع الـ token تلقائياً
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // التحقق من صحة الـ token عند تحميل التطبيق
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get("/api/auth/verify");
          setUser(response.data.user);
        } catch (error) {
          console.error("Token verification failed:", error);
          // إزالة الـ token غير الصحيح
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // دالة تسجيل الدخول
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
  };

  // دالة تسجيل الخروج
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  // التحقق من كون المستخدم أدمن
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  // التحقق من كون المستخدم مهندس
  const isEngineer = () => {
    return user && user.role === "engineer";
  };

  // التحقق من كون المستخدم مسجل دخول
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isEngineer,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
