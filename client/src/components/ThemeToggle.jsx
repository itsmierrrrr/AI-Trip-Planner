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
          ? "border-[#156874]/40 bg-gradient-to-r from-[#f3eded]/92 via-[#e8e1e1]/80 to-[#f3eded]/92 shadow-[0_0_18px_rgba(21,104,116,0.28)]"
          : "border-[#156874]/45 bg-gradient-to-r from-[#f3eded] via-[#e8e1e1] to-[#f7f1f1] shadow-[0_8px_20px_rgba(21,104,116,0.22)]"
      }`}
    >
      <span
        className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 ${
          isDark
            ? "bg-[radial-gradient(circle_at_20%_50%,rgba(15,83,93,0.26),transparent_45%),radial-gradient(circle_at_80%_50%,rgba(21,104,116,0.2),transparent_45%)] opacity-100"
            : "bg-[radial-gradient(circle_at_20%_50%,rgba(15,83,93,0.18),transparent_45%),radial-gradient(circle_at_80%_50%,rgba(251,79,89,0.16),transparent_45%)] opacity-100"
        }`}
      />

      <motion.span
        animate={{ x: isDark ? 38 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={`absolute left-1 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full ${
          isDark
            ? "bg-gradient-to-br from-[#2a7f8b] via-[#156874] to-[#2a7f8b] shadow-[0_0_16px_rgba(15,83,93,0.5)]"
            : "bg-gradient-to-br from-[#2a7f8b] via-[#156874] to-[#0f535d] shadow-[0_4px_14px_rgba(21,104,116,0.35)]"
        }`}
      >
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -40, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-[#174b53]"
        >
          {isDark ? <Moon size={14} /> : <Sun size={14} />}
        </motion.span>
      </motion.span>

      <span className="relative z-10 flex w-full items-center justify-between px-1.5">
        <motion.span
          animate={{ rotate: isDark ? -30 : 0, scale: isDark ? 0.85 : 1 }}
          transition={{ duration: 0.25 }}
        >
          <Sun size={12} className={`transition ${isDark ? "text-[#174b53]/30" : "text-[#156874]"}`} />
        </motion.span>
        <motion.span
          animate={{ rotate: isDark ? 0 : 30, scale: isDark ? 1 : 0.85 }}
          transition={{ duration: 0.25 }}
        >
          <Moon size={12} className={`transition ${isDark ? "text-[#2a7f8b]" : "text-[#5f8b95]/50"}`} />
        </motion.span>
      </span>
    </button>
  );
};

export default ThemeToggle;
