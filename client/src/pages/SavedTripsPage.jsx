import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { deleteSavedTrip, getSavedTrips } from "../services/tripService";
import TripResultView from "../components/TripResultView";

const PLACE_IMAGE = "/place.jpg";

const SavedTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await getSavedTrips();
      setTrips(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    const scoped = !query.trim()
      ? trips
      : trips.filter((trip) => trip.prompt.toLowerCase().includes(query.toLowerCase()));

    return [...scoped].sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [trips, query, sortBy]);

  const onDelete = async (id) => {
    try {
      await deleteSavedTrip(id);
      setTrips((prev) => prev.filter((trip) => trip._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete trip.");
    }
  };

  return (
    <section className="space-y-4">
      <div className="neon-panel p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-['Anton'] text-3xl font-bold text-[#fbf9e4]">Saved Trips</h1>
          <p className="text-sm text-[#fbf9e4]">{filteredTrips.length} trips</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="neon-input flex flex-1 items-center gap-2 px-3 py-2">
            <Search size={16} className="text-[#5b88b2]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your saved adventures"
              className="w-full bg-transparent text-sm text-[#fbf9e4] outline-none"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="neon-input px-3 py-2 text-sm text-[#fbf9e4] outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {loading ? <p className="text-sm text-[#fbf9e4]">Loading trips...</p> : null}
      {error ? <p className="mb-3 text-sm text-[#5b88b2]">{error}</p> : null}

      <div className="grid gap-3 md:grid-cols-2">
        {filteredTrips.map((trip) => (
          <article key={trip._id} className="neon-soft overflow-hidden p-0">
            <div className="relative h-36">
              <img
                src={PLACE_IMAGE}
                alt="Destination"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#122c4f]/28" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <h3 className="text-lg font-semibold text-[#fbf9e4]">{trip.generatedTrip?.overview?.destination || "Custom Trip"}</h3>
                <p className="text-xs text-[#fbf9e4]">{new Date(trip.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-[#fbf9e4]">{trip.prompt}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setSelectedTrip(trip)}
                  className="neon-input rounded-xl px-3 py-1.5 text-sm text-[#fbf9e4] transition hover:border-[#5b88b2]/55"
                >
                  View Trip
                </button>
                <button
                  onClick={() => onDelete(trip._id)}
                  className="rounded-xl border border-[#5b88b2]/35 bg-[#5b88b2]/10 px-3 py-1.5 text-sm text-[#5b88b2] transition hover:bg-[#5b88b2]/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedTrip && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#122c4f]/38 p-4 backdrop-blur-sm"
          onClick={() => setSelectedTrip(null)}
        >
          <div
            className="neon-panel max-h-[80vh] w-full max-w-2xl overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-['Anton'] text-xl font-bold text-[#fbf9e4]">Trip Details</h3>
                <p className="mt-1 text-sm text-[#fbf9e4]">{selectedTrip.prompt}</p>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="neon-input p-2 text-[#fbf9e4]"
              >
                <X size={16} />
              </button>
            </div>

            <TripResultView trip={selectedTrip.generatedTrip} compact />
          </div>
        </div>
      )}
    </section>
  );
};

export default SavedTripsPage;
