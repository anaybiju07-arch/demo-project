import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load current user on initial mount
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success) {
            setUser(res.user);
            setProfile(res.profile);
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    setError(null);
    try {
      const res = await authAPI.login(credentials);
      if (res.success) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        setProfile(res.profile);
        return { success: true, user: res.user };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await authAPI.register(userData);
      if (res.success) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        setProfile(res.profile);
        return { success: true, user: res.user };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfileData = (updatedUser, updatedProfile) => {
    if (updatedUser) setUser(updatedUser);
    if (updatedProfile) setProfile(updatedProfile);
  };

  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';
  const isCompany = user?.role === 'company';
  const isInternalStudent = isStudent && profile?.studentType === 'internal';
  const isExternalStudent = isStudent && profile?.studentType === 'external';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateProfileData,
        isStudent,
        isAdmin,
        isCompany,
        isInternalStudent,
        isExternalStudent,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
