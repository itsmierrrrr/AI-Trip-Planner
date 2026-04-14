import { motion } from "framer-motion";
import { LayoutDashboard, LogOut, Menu, PlusCircle, WalletCards, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PlannerSidebar = () => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "New Trip", to: "/planner", icon: PlusCircle },
    { label: "My Trips", to: "/saved-trips", icon: WalletCards },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="neon-input mb-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#2f5f5c] md:hidden"
        aria-label="Toggle sidebar"
      >
        {open ? <X size={15} /> : <Menu size={15} />} Menu
      </button>

      <motion.aside
        className={`neon-panel sticky top-24 h-fit p-4 ${open ? "block" : "hidden"} md:block`}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <p className="mb-4 px-2 text-xs uppercase tracking-[0.22em] text-[#5d7d7a]">Navigation</p>
        <nav className="space-y-1">
          {links.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border border-[#004643]/30 bg-[#004643]/15 text-[#004643] shadow-[0_0_18px_rgba(0,70,67,0.2)]"
                    : "text-[#456a67] hover:bg-[#004643]/10 hover:text-[#0f3836]"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={logout}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-300/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </motion.aside>
    </>
  );
};

export default PlannerSidebar;
