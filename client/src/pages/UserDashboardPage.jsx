import { motion } from "framer-motion";
import { CalendarDays, Camera, Check, Hotel, IdCard, Plane } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedTrips } from "../services/tripService";

const PLACE_IMAGE = "/place.jpg";

const upcomingTripsData = [
  {
    id: "goa",
    destination: "Goa",
    dates: "12 Apr - 16 Apr",
    budget: "INR 22,000",
    status: "Planned",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "japan",
    destination: "Japan",
    dates: "05 May - 14 May",
    budget: "INR 1,85,000",
    status: "Booked",
    image:
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "bali",
    destination: "Bali",
    dates: "21 Jun - 27 Jun",
    budget: "INR 68,000",
    status: "Planned",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  },
];

const LoadingSkeleton = ({ className }) => <div className={`animate-pulse rounded-2xl bg-[#5b88b2]/12 ${className}`} />;

const TripStatusBadge = ({ status }) => {
  const palette =
    status === "Booked"
      ? "border-[#5b88b2]/35 bg-[#5b88b2]/15 text-[#fbf9e4]"
      : status === "Completed"
        ? "border-[#5b88b2]/35 bg-[#122c4f]/30 text-[#fbf9e4]"
        : "border-[#5b88b2]/35 bg-[#5b88b2]/15 text-[#fbf9e4]";

  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${palette}`}>{status}</span>;
};

const TripCard = ({ trip, onOpen }) => (
  <motion.article
    whileHover={{ y: -4 }}
    onClick={onOpen}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen();
      }
    }}
    role="button"
    tabIndex={0}
    className="neon-soft min-w-[280px] cursor-pointer overflow-hidden p-0 sm:min-w-[320px]"
  >
    <div className="relative h-36">
      <img src={trip.image} alt={`${trip.destination} preview`} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#122c4f]/70 via-[#122c4f]/30 to-transparent" />
      <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
        <TripStatusBadge status={trip.status} />
        <span className="rounded-full border border-[#5b88b2]/45 bg-[#5b88b2]/45 px-2 py-1 text-[10px] font-medium text-[#fbf9e4]">
          {trip.budget}
        </span>
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="font-['Anton'] text-lg font-semibold text-[#fbf9e4]">{trip.destination}</h3>
        <p className="text-xs text-[#fbf9e4]">{trip.dates}</p>
      </div>
    </div>
  </motion.article>
);

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [previousTrips, setPreviousTrips] = useState([]);
  const [previousTripsLoading, setPreviousTripsLoading] = useState(true);
  const [checklist, setChecklist] = useState({
    passport: true,
    flights: true,
    hotel: false,
    clothes: false,
    camera: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchPreviousTrips = async () => {
      setPreviousTripsLoading(true);
      try {
        const trips = await getSavedTrips();
        const normalized = trips.slice(0, 6).map((trip) => ({
          id: trip._id,
          destination: trip.generatedTrip?.overview?.destination || "Custom Trip",
          dates: new Date(trip.createdAt).toLocaleDateString(),
          budget: trip.generatedTrip?.overview?.budget || "Budget TBD",
          status: "Completed",
          image: PLACE_IMAGE,
        }));
        setPreviousTrips(normalized);
      } catch {
        setPreviousTrips([]);
      } finally {
        setPreviousTripsLoading(false);
      }
    };

    fetchPreviousTrips();
  }, []);

  const toggleChecklist = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-4 font-['Anton'] text-2xl font-semibold text-[#fbf9e4]">Upcoming Trips</h2>

        {loading ? (
          <div className="flex gap-3 overflow-hidden">
            <LoadingSkeleton className="h-48 min-w-[280px]" />
            <LoadingSkeleton className="hidden h-48 min-w-[280px] sm:block" />
            <LoadingSkeleton className="hidden h-48 min-w-[280px] lg:block" />
          </div>
        ) : upcomingTripsData.length === 0 ? (
          <div className="neon-soft p-8 text-center">
            <p className="text-sm text-[#fbf9e4]">No upcoming trips available.</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(21,104,116,0.4)_transparent]">
            {upcomingTripsData.map((trip) => (
              <TripCard key={trip.id} trip={trip} onOpen={() => navigate("/planner")} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-['Anton'] text-2xl font-semibold text-[#fbf9e4]">Previous Trips</h2>

        {previousTripsLoading ? (
          <div className="flex gap-3 overflow-hidden">
            <LoadingSkeleton className="h-48 min-w-[280px]" />
            <LoadingSkeleton className="hidden h-48 min-w-[280px] sm:block" />
            <LoadingSkeleton className="hidden h-48 min-w-[280px] lg:block" />
          </div>
        ) : previousTrips.length === 0 ? (
          <div className="neon-soft p-8 text-center">
            <p className="text-sm text-[#fbf9e4]">No previous trips found from your saved history.</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(21,104,116,0.4)_transparent]">
            {previousTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onOpen={() => navigate("/saved-trips")} />
            ))}
          </div>
        )}
      </section>

      <section className="neon-panel p-5" id="travel-checklist">
        <h2 className="mb-4 font-['Anton'] text-2xl font-semibold text-[#fbf9e4]">Travel Checklist</h2>
        <div className="space-y-2">
          {[
            { key: "passport", label: "Passport", icon: IdCard },
            { key: "flights", label: "Flight tickets", icon: Plane },
            { key: "hotel", label: "Hotel booking", icon: Hotel },
            { key: "clothes", label: "Clothes packed", icon: CalendarDays },
            { key: "camera", label: "Camera charged", icon: Camera },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleChecklist(item.key)}
              className="neon-soft flex w-full items-center justify-between px-3 py-2 text-left"
            >
              <span className="inline-flex items-center gap-2 text-sm text-[#fbf9e4]">
                <item.icon size={15} className="text-[#5b88b2]" />
                {item.label}
              </span>
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-md border ${
                  checklist[item.key]
                    ? "border-[#5b88b2]/40 bg-[#5b88b2]/20 text-[#fbf9e4]"
                    : "border-[#5b88b2]/30 bg-[#5b88b2]/12 text-[#fbf9e4]"
                }`}
                aria-hidden="true"
              >
                {checklist[item.key] ? <Check size={12} /> : null}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserDashboardPage;
