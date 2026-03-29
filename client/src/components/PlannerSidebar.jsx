import { LayoutDashboard, PlusCircle, Shield, WalletCards } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PlannerSidebar = () => {
  const { user } = useAuth();

  const links = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "New Trip", to: "/planner", icon: PlusCircle },
    { label: "Saved Trips", to: "/saved-trips", icon: WalletCards },
  ];

  if (user?.role === "admin") {
    links.push({ label: "Admin", to: "/admin", icon: Shield });
  }

  return (
    <aside className="neon-panel sticky top-24 flex h-fit flex-col p-4">
      <p className="mb-4 px-2 text-xs uppercase tracking-[0.22em] text-slate-400">Navigation</p>
      <nav className="space-y-1">
        {links.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "border border-cyan-300/30 bg-cyan-300/15 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.28)]"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-100"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default PlannerSidebar;
