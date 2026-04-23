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
          ? "border-[#5b88b2]/40 bg-gradient-to-r from-[#122c4f]/90 via-[#000000]/70 to-[#122c4f]/90 shadow-[0_0_18px_rgba(91,136,178,0.25)]"
          : "border-[#5b88b2]/60 bg-gradient-to-r from-[#fbf9e4] via-[#eef0d8] to-[#fffef6] shadow-[0_8px_20px_rgba(91,136,178,0.22)]"
      }`}
    >
      <span
        className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 ${
          isDark
            ? "bg-[radial-gradient(circle_at_20%_50%,rgba(91,136,178,0.25),transparent_45%),radial-gradient(circle_at_80%_50%,rgba(18,44,79,0.2),transparent_45%)] opacity-100"
            : "bg-[radial-gradient(circle_at_20%_50%,rgba(91,136,178,0.18),transparent_45%),radial-gradient(circle_at_80%_50%,rgba(0,0,0,0.16),transparent_45%)] opacity-100"
        }`}
      />

      <motion.span
        animate={{ x: isDark ? 38 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={`absolute left-1 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full ${
          isDark
            ? "bg-gradient-to-br from-[#122c4f] via-[#5b88b2] to-[#000000] shadow-[0_0_16px_rgba(91,136,178,0.5)]"
            : "bg-gradient-to-br from-[#5b88b2] via-[#fbf9e4] to-[#122c4f] shadow-[0_4px_14px_rgba(91,136,178,0.35)]"
        }`}
      >
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -40, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-[#000000]"
        >
          {isDark ? <Moon size={14} /> : <Sun size={14} />}
        </motion.span>
      </motion.span>

      <span className="relative z-10 flex w-full items-center justify-between px-1.5">
        <motion.span
          animate={{ rotate: isDark ? -30 : 0, scale: isDark ? 0.85 : 1 }}
          transition={{ duration: 0.25 }}
        >
          <Sun size={12} className={`transition ${isDark ? "text-[#fbf9e4]/35" : "text-[#5b88b2]"}`} />
        </motion.span>
        <motion.span
          animate={{ rotate: isDark ? 0 : 30, scale: isDark ? 1 : 0.85 }}
          transition={{ duration: 0.25 }}
        >
          <Moon size={12} className={`transition ${isDark ? "text-[#5b88b2]" : "text-[#122c4f]/45"}`} />
        </motion.span>
      </span>
    </button>
  );
};

export default ThemeToggle;
