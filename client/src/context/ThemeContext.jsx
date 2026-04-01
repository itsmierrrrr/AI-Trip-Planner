import { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("theme-light");
    root.classList.add("theme-dark", "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme("dark");
  };

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
