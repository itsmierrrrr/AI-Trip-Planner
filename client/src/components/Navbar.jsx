import { motion } from "framer-motion";
import { Bell, Compass, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import env from "../config/env";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  const links = isAuthenticated
    ? [
        { to: "/planner", label: "Planner" },
        { to: "/saved-trips", label: "Saved" },
        { to: "/profile", label: "Profile" },
        ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/auth", label: "Login" },
      ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-cyan-300/20 bg-slate-950/35 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-[94%] max-w-7xl items-center justify-between gap-4 py-3">
      <Link to="/" className="group flex items-center gap-2 text-slate-100 transition">
        <motion.span
          whileHover={{ scale: 1.1, rotate: 12 }}
          className="rounded-xl border border-cyan-300/35 bg-cyan-300/10 p-2 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition group-hover:border-cyan-300/50 group-hover:shadow-[0_0_28px_rgba(34,211,238,0.45)]"
        >
          <Compass size={18} />
        </motion.span>
        <span className="font-['Space_Grotesk'] text-lg font-semibold tracking-tight transition group-hover:text-cyan-200">{env.appName}</span>
      </Link>

      <div className="hidden items-center gap-2 lg:flex">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "border border-cyan-300/30 bg-cyan-300/15 text-cyan-200"
                  : "text-slate-300 hover:bg-cyan-300/10 hover:text-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {isAuthenticated ? (
          <button
            type="button"
            className="neon-input inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-300 transition hover:text-cyan-200"
            aria-label="Notifications"
          >
            <Bell size={15} />
          </button>
        ) : null}

        {isAuthenticated && (
          <Link to="/profile" className="neon-input inline-flex h-10 w-10 items-center justify-center rounded-full">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserRound size={16} className="text-slate-300" />}
          </Link>
        )}

        {!isAuthenticated ? (
          <Link to="/auth" className="neon-btn inline-flex items-center px-4 py-2 text-sm">
            Login / Signup
          </Link>
        ) : null}
      </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
