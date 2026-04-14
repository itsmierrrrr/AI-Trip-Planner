import { motion } from "framer-motion";
import { Bell, Compass, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import env from "../config/env";
import { useAuth } from "../hooks/useAuth";

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
      className="fixed inset-x-0 top-0 z-50 border-b border-[#004643]/20 bg-[#f0ede5]/75 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-[94%] max-w-7xl items-center justify-between gap-4 py-3">
      <Link to="/" className="group flex items-center gap-2 text-[#0f3836] transition">
        <motion.span
          whileHover={{ scale: 1.1, rotate: 12 }}
          className="rounded-xl border border-[#004643]/35 bg-[#004643]/10 p-2 text-[#004643] shadow-[0_0_18px_rgba(0,70,67,0.22)] transition group-hover:border-[#004643]/50 group-hover:shadow-[0_0_28px_rgba(0,70,67,0.28)]"
        >
          <Compass size={18} />
        </motion.span>
        <span className="font-['Anton'] text-lg font-semibold tracking-tight transition group-hover:text-[#0f5a56]">{env.appName}</span>
      </Link>

      <div className="hidden items-center gap-2 lg:flex">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "border border-[#004643]/30 bg-[#004643]/15 text-[#004643]"
                  : "text-[#2f5f5c] hover:bg-[#004643]/10 hover:text-[#0f3836]"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <button
            type="button"
            className="neon-input inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2f5f5c] transition hover:text-[#004643]"
            aria-label="Notifications"
          >
            <Bell size={15} />
          </button>
        ) : null}

        {isAuthenticated && (
          <Link to="/profile" className="neon-input inline-flex h-10 w-10 items-center justify-center rounded-full">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserRound size={16} className="text-[#2f5f5c]" />}
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
