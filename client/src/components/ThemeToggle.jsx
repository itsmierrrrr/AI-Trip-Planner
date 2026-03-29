import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative inline-flex h-10 w-20 items-center rounded-full border p-1 transition-all duration-300 ${
        isDark
          ? "border-fuchsia-300/40 bg-gradient-to-r from-slate-900/90 via-indigo-900/70 to-slate-900/90 shadow-[0_0_18px_rgba(217,70,239,0.25)]"
          : "border-sky-300/60 bg-gradient-to-r from-sky-100 via-amber-50 to-rose-100 shadow-[0_8px_20px_rgba(56,189,248,0.22)]"
      }`}
    >
      <span
        className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 ${
          isDark
            ? "bg-[radial-gradient(circle_at_20%_50%,rgba(167,139,250,0.25),transparent_45%),radial-gradient(circle_at_80%_50%,rgba(34,211,238,0.2),transparent_45%)] opacity-100"
            : "bg-[radial-gradient(circle_at_20%_50%,rgba(251,191,36,0.2),transparent_45%),radial-gradient(circle_at_80%_50%,rgba(59,130,246,0.18),transparent_45%)] opacity-100"
        }`}
      />

      <motion.span
        animate={{ x: isDark ? 38 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={`absolute left-1 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full ${
          isDark
            ? "bg-gradient-to-br from-violet-300 via-fuchsia-300 to-cyan-300 shadow-[0_0_16px_rgba(168,85,247,0.5)]"
            : "bg-gradient-to-br from-amber-300 via-orange-300 to-rose-300 shadow-[0_4px_14px_rgba(251,146,60,0.35)]"
        }`}
      >
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -40, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-slate-900"
        >
          {isDark ? <Moon size={14} /> : <Sun size={14} />}
        </motion.span>
      </motion.span>

      <span className="relative z-10 flex w-full items-center justify-between px-1.5">
        <motion.span
          animate={{ rotate: isDark ? -30 : 0, scale: isDark ? 0.85 : 1 }}
          transition={{ duration: 0.25 }}
        >
          <Sun size={12} className={`transition ${isDark ? "text-amber-200/30" : "text-amber-600"}`} />
        </motion.span>
        <motion.span
          animate={{ rotate: isDark ? 0 : 30, scale: isDark ? 1 : 0.85 }}
          transition={{ duration: 0.25 }}
        >
          <Moon size={12} className={`transition ${isDark ? "text-cyan-200" : "text-indigo-400/45"}`} />
        </motion.span>
      </span>
    </button>
  );
};

export default ThemeToggle;
