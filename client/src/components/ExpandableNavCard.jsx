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
                className="mb-3 flex w-full items-center justify-between rounded-lg bg-[#122c4f]/56 p-2 transition hover:bg-[#122c4f]"
              >
                <span className="text-xs font-semibold text-[#fbf9e4] uppercase tracking-wider">Menu</span>
                <X size={16} className="text-[#fbf9e4]" />
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
                          ? "bg-gradient-to-r from-[#5b88b2]/20 to-[#5b88b2]/20 text-[#5b88b2] border border-[#5b88b2]/30"
                          : "text-[#fbf9e4] hover:text-[#5b88b2] hover:bg-[#122c4f]/38"
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
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-[#5b88b2] to-[#122c4f] text-[#fbf9e4] transition hover:shadow-[0_0_24px_rgba(21,104,116,0.4)]"
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
