import { motion } from "framer-motion";
import { LayoutDashboard, PlusCircle, Shield, WalletCards, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ExpandableNavCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Planner", to: "/planner", icon: PlusCircle },
    { label: "Saved Trips", to: "/saved-trips", icon: WalletCards },
    { label: "Profile", to: "/profile", icon: LayoutDashboard },
  ];

  const adminItems = [
    { label: "Admin Panel", to: "/admin", icon: Shield },
  ];

  const allItems = user?.role === "admin" ? [...navItems, ...adminItems] : navItems;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <motion.div
        layout
        className="neon-panel overflow-hidden"
        initial={{ width: 56 }}
        animate={{ width: isOpen ? 240 : 56 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-3">
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-1"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="mb-3 flex w-full items-center justify-between rounded-lg bg-slate-800/50 p-2 transition hover:bg-slate-800"
              >
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Menu</span>
                <X size={16} className="text-slate-400" />
              </button>

              <nav className="space-y-1">
                {allItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-400/20 to-violet-400/20 text-cyan-300 border border-cyan-300/30"
                          : "text-slate-300 hover:text-cyan-300 hover:bg-slate-800/30"
                      }`
                    }
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 text-white transition hover:shadow-[0_0_24px_rgba(34,211,238,0.4)]"
            >
              <PlusCircle size={24} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ExpandableNavCard;
