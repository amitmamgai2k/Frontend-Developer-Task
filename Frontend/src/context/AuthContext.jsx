import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      // Set the token for future requests
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await apiClient.post("/users/login", { email, password });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await apiClient.post("/users", { name, email, password });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    delete apiClient.defaults.headers.common["Authorization"];
  };

  const updateProfile = async (userData) => {
    try {
        const { data } = await apiClient.put("/users/profile", userData);
        setUser(data);
        localStorage.setItem("userInfo", JSON.stringify(data)); // Update local storage
        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Update failed",
        };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
