import { useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getSavedTrips } from "../services/tripService";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tripCount, setTripCount] = useState(0);
  const [savedTrips, setSavedTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoadingTrips(true);
      try {
        const trips = await getSavedTrips();
        setTripCount(trips.length);
        setSavedTrips(trips.slice(0, 4));
      } catch {
        setTripCount(0);
        setSavedTrips([]);
      } finally {
        setLoadingTrips(false);
      }
    };

    fetchTrips();
  }, []);

  const destinationPalette = (destination = "") => {
    const map = {
      tokyo: "from-fuchsia-500/35 via-indigo-500/30 to-cyan-500/25",
      dubai: "from-amber-400/30 via-orange-500/20 to-rose-500/20",
      goa: "from-cyan-400/30 via-teal-500/30 to-blue-500/20",
      switzerland: "from-slate-200/25 via-cyan-300/20 to-blue-500/20",
    };

    const key = Object.keys(map).find((item) => destination.toLowerCase().includes(item));
    return map[key] || "from-violet-500/25 via-blue-500/20 to-cyan-500/20";
  };

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

      <div className="mt-6">
        <div className="neon-soft p-4">
          <p className="text-sm text-slate-400">Saved Trips</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">{tripCount}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-100">Saved Trip Cards</h2>
          <button
            onClick={() => navigate("/saved-trips")}
            className="text-sm text-cyan-300 transition hover:text-cyan-200"
          >
            View all
          </button>
        </div>

        {loadingTrips ? (
          <p className="text-sm text-slate-400">Loading trips...</p>
        ) : savedTrips.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {savedTrips.map((trip) => (
              <article key={trip._id} className="neon-soft overflow-hidden p-0">
                <div className={`relative h-32 bg-gradient-to-br ${destinationPalette(trip.generatedTrip?.overview?.destination)}`}>
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <h3 className="text-base font-semibold text-white">{trip.generatedTrip?.overview?.destination || "Custom Trip"}</h3>
                    <p className="text-xs text-slate-200">{new Date(trip.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-300">{trip.prompt}</p>
                  <button
                    onClick={() => navigate(`/saved-trips?tripId=${trip._id}`)}
                    className="neon-input mt-3 rounded-xl px-3 py-1.5 text-sm text-slate-200 transition hover:border-cyan-300/60"
                  >
                    View Trip
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No saved trips yet.</p>
        )}
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
