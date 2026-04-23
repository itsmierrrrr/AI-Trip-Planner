import { createContext, useEffect, useMemo } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const theme = "dark";

  useEffect(() => {
    const root = document.documentElement;

    root.classList.add("theme-dark", "dark");
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: true,
      setTheme: () => {},
      toggleTheme: () => {},
    }),
    []
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
