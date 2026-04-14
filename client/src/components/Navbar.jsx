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
      className="fixed inset-x-0 top-0 z-50 border-b border-[#156874]/20 bg-[#ede6e6]/75 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-[94%] max-w-7xl items-center justify-between gap-4 py-3">
      <Link to="/" className="group flex items-center gap-2 text-[#174b53] transition">
        <motion.span
          whileHover={{ scale: 1.1, rotate: 12 }}
          className="rounded-xl border border-[#156874]/35 bg-[#156874]/10 p-2 text-[#156874] shadow-[0_0_18px_rgba(21,104,116,0.22)] transition group-hover:border-[#156874]/50 group-hover:shadow-[0_0_28px_rgba(21,104,116,0.28)]"
        >
          <Compass size={18} />
        </motion.span>
        <span className="font-['Anton'] text-lg font-semibold tracking-tight transition group-hover:text-[#0f535d]">{env.appName}</span>
      </Link>

      <div className="hidden items-center gap-2 lg:flex">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "border border-[#156874]/30 bg-[#156874]/15 text-[#156874]"
                  : "text-[#2d6068] hover:bg-[#156874]/10 hover:text-[#174b53]"
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
            className="neon-input inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2d6068] transition hover:text-[#156874]"
            aria-label="Notifications"
          >
            <Bell size={15} />
          </button>
        ) : null}

        {isAuthenticated && (
          <Link to="/profile" className="neon-input inline-flex h-10 w-10 items-center justify-center rounded-full">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserRound size={16} className="text-[#2d6068]" />}
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
