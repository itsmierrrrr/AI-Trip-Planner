import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedTrips } from "../services/tripService";

const PLACE_IMAGE = "/place.jpg";
const CHECKLIST_STORAGE_KEY = "ai-trip-planner:dashboard-checklist";

const essentialsCategories = [
  "Essentials",
  "Clothing",
  "Toiletries",
  "Health & Safety",
  "Tech & Gadgets",
  "Documents",
  "Extras",
];

const buildChecklistState = () =>
  essentialsCategories.reduce((acc, category) => {
    acc[category] = { checked: false, items: [], draft: "" };
    return acc;
  }, {});

const getStoredChecklistState = () => {
  const fallback = buildChecklistState();

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return fallback;

    return essentialsCategories.reduce((acc, category) => {
      const savedCategory = parsed[category];
      const items = Array.isArray(savedCategory?.items)
        ? savedCategory.items
            .filter((item) => item && typeof item.id === "string" && typeof item.text === "string")
            .map((item) => ({ ...item, done: Boolean(item.done) }))
        : [];

      acc[category] = {
        checked: Boolean(savedCategory?.checked),
        items,
        draft: typeof savedCategory?.draft === "string" ? savedCategory.draft : "",
      };

      return acc;
    }, {});
  } catch {
    return fallback;
  }
};

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
  const [checklist, setChecklist] = useState(getStoredChecklistState);

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

  useEffect(() => {
    try {
      window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklist));
    } catch {
      // Ignore storage errors (private mode/quota exceeded) and keep UI responsive.
    }
  }, [checklist]);

  const updateChecklistDraft = (category, value) => {
    setChecklist((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        draft: value,
      },
    }));
  };

  const toggleCategoryCheck = (category) => {
    setChecklist((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        checked: !prev[category].checked,
      },
    }));
  };

  const addChecklistItem = (category) => {
    const text = checklist[category]?.draft?.trim();
    if (!text) return;

    setChecklist((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: [
          ...prev[category].items,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            text,
            done: false,
          },
        ],
        draft: "",
      },
    }));
  };

  const toggleChecklistItem = (category, itemId) => {
    setChecklist((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        ),
      },
    }));
  };

  const deleteChecklistItem = (category, itemId) => {
    setChecklist((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.filter((item) => item.id !== itemId),
      },
    }));
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

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="neon-panel p-7"
      >
        <h2 className="font-['Anton'] text-2xl font-semibold text-[#fbf9e4]">Travel Checklist</h2>
        <p className="mt-2 text-sm text-[#fbf9e4]">Organize notes and todos by category before your trip.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {essentialsCategories.map((category) => (
            <div
              key={category}
              className={`neon-soft rounded-2xl p-5 ${
                category === "Extras" ? "md:col-span-2 md:w-full md:max-w-2xl md:justify-self-center" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#fbf9e4]">{category}</h3>
                <button
                  type="button"
                  onClick={() => toggleCategoryCheck(category)}
                  aria-pressed={checklist[category].checked}
                  aria-label={`${category} completed`}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                    checklist[category].checked
                      ? "border-[#5b88b2]/55 bg-[#5b88b2]/24 text-[#fbf9e4]"
                      : "border-[#5b88b2]/28 bg-[#122c4f]/45 text-[#fbf9e4]/80 hover:border-[#5b88b2]/45"
                  }`}
                >
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                      checklist[category].checked
                        ? "border-[#5b88b2]/45 bg-[#5b88b2]/25 text-[#fbf9e4]"
                        : "border-[#5b88b2]/28 bg-[#122c4f]/45 text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <Check size={10} />
                  </span>
                  {checklist[category].checked ? "Completed" : "Mark done"}
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={checklist[category].draft}
                  onChange={(e) => updateChecklistDraft(category, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addChecklistItem(category);
                    }
                  }}
                  placeholder="add note"
                  className="neon-input w-full px-3.5 py-2.5 text-sm outline-none transition focus:border-[#5b88b2]/70"
                />
                <button
                  type="button"
                  onClick={() => addChecklistItem(category)}
                  className="rounded-md border border-[#5b88b2]/35 bg-transparent px-3.5 py-2.5 text-xs font-medium text-[#fbf9e4] transition hover:border-[#5b88b2]/55 hover:bg-[#5b88b2]/12"
                >
                  Add
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                {checklist[category].items.length === 0 ? (
                  <p className="text-xs text-[#fbf9e4]/75">No notes yet.</p>
                ) : (
                  checklist[category].items.map((item) => (
                    <div
                      key={item.id}
                      className="flex w-full items-center gap-2.5 rounded-xl border border-[#5b88b2]/25 bg-[#122c4f]/35 px-3 py-2"
                    >
                      <button
                        type="button"
                        onClick={() => toggleChecklistItem(category, item.id)}
                        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                      >
                        <span
                          className={`inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
                            item.done
                              ? "border-[#5b88b2]/45 bg-[#5b88b2]/25 text-[#fbf9e4]"
                              : "border-[#5b88b2]/35 bg-[#122c4f]/45 text-transparent"
                          }`}
                          aria-hidden="true"
                        >
                          <Check size={12} />
                        </span>
                        <span className={`truncate text-xs text-[#fbf9e4] ${item.done ? "line-through opacity-70" : ""}`}>
                          {item.text}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteChecklistItem(category, item.id)}
                        aria-label={`Delete note ${item.text}`}
                        className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-[#5b88b2]/28 bg-[#122c4f]/45 text-[#fbf9e4]/80 transition hover:border-[#5b88b2]/45 hover:bg-[#5b88b2]/18 hover:text-[#fbf9e4]"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      
    </div>
  );
};

export default UserDashboardPage;
