import { useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getSavedTrips } from "../services/tripService";

const PLACE_IMAGE = "/place.jpg";

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

  return (
    <section className="neon-panel p-6">
      <h1 className="font-['Anton'] text-3xl font-bold text-[#174b53]">Profile</h1>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#156874]/40 bg-[#156874]/10 text-[#0f535d] shadow-[0_0_28px_rgba(21,104,116,0.35)]">
          <UserRound size={46} />
        </div>
        <div>
          <p className="text-lg font-semibold text-[#174b53]">{user?.name}</p>
          <p className="text-sm text-[#5f8b95]">{user?.email}</p>
          <p className="mt-2 inline-flex rounded-full border border-[#0f535d]/30 bg-[#0f535d]/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[#0f535d]">
            {user?.role}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="neon-soft p-4">
          <p className="text-sm text-[#5f8b95]">Saved Trips</p>
          <p className="mt-1 text-2xl font-semibold text-[#174b53]">{tripCount}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-['Anton'] text-xl font-bold text-[#174b53]">Saved Trip Cards</h2>
          <button
            onClick={() => navigate("/saved-trips")}
            className="text-sm text-[#156874] transition hover:text-[#0f535d]"
          >
            View all
          </button>
        </div>

        {loadingTrips ? (
          <p className="text-sm text-[#5f8b95]">Loading trips...</p>
        ) : savedTrips.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {savedTrips.map((trip) => (
              <article key={trip._id} className="neon-soft overflow-hidden p-0">
                <div className="relative h-32">
                  <img
                    src={PLACE_IMAGE}
                    alt="Destination"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#f7f1f1]/28" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <h3 className="text-base font-semibold text-[#174b53]">{trip.generatedTrip?.overview?.destination || "Custom Trip"}</h3>
                    <p className="text-xs text-[#2d6068]">{new Date(trip.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-[#3f737d]">{trip.prompt}</p>
                  <button
                    onClick={() => navigate(`/saved-trips?tripId=${trip._id}`)}
                    className="neon-input mt-3 rounded-xl px-3 py-1.5 text-sm text-[#2d6068] transition hover:border-[#156874]/55"
                  >
                    View Trip
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#5f8b95]">No saved trips yet.</p>
        )}
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#156874]/35 bg-[#156874]/10 px-4 py-2 text-sm font-medium text-[#156874] transition hover:bg-[#156874]/20"
      >
        <LogOut size={15} />
        Logout
      </button>
    </section>
  );
};

export default ProfilePage;
