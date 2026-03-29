import { createContext, useEffect, useMemo, useState } from "react";
import { googleLoginUser, loginUser, signupUser } from "../services/authService";

export const AuthContext = createContext(null);

const TOKEN_KEY = "trip_planner_token";
const USER_KEY = "trip_planner_user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(USER_KEY);
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const handleAuthSuccess = (data) => {
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const login = async (payload) => {
    const data = await loginUser(payload);
    return handleAuthSuccess(data);
  };

  const signup = async (payload) => {
    const data = await signupUser(payload);
    return handleAuthSuccess(data);
  };

  const googleLogin = async (credential) => {
    const data = await googleLoginUser(credential);
    return handleAuthSuccess(data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      signup,
      googleLogin,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
