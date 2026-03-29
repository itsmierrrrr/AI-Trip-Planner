import { useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getSavedTrips } from "../services/tripService";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tripCount, setTripCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const trips = await getSavedTrips();
        setTripCount(trips.length);
      } catch {
        setTripCount(0);
      }
    };

    fetchCount();
  }, []);

  return (
    <section className="neon-panel p-6">
      <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-slate-100">Profile</h1>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.35)]">
          <UserRound size={46} />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-100">{user?.name}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <p className="mt-2 inline-flex rounded-full border border-violet-300/30 bg-violet-300/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-violet-200">
            {user?.role}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="neon-soft p-4">
          <p className="text-sm text-slate-400">Saved Trips</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">{tripCount}</p>
        </div>
        <div className="neon-soft p-4">
          <p className="text-sm text-slate-400">Theme</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">Adaptive Futuristic</p>
        </div>
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-rose-300/35 bg-rose-300/10 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-300/20"
      >
        <LogOut size={15} />
        Logout
      </button>
    </section>
  );
};

export default ProfilePage;
