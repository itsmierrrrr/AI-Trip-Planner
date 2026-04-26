import { motion } from "framer-motion";
import { AlertCircle, BarChart3, Bot, ChevronDown, Eye, Plane, Radar, Trash2, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStats, getAdminUsersWithTrips, removeAdminUser } from "../services/adminPanelService";

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTrips: 0, totalAIRequests: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUsers, setExpandedUsers] = useState({});
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin-security");
      return;
    }

    const loadData = async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        const [usersWithTrips, statsData] = await Promise.all([
          getAdminUsersWithTrips(adminToken),
          getAdminStats(adminToken),
        ]);
        setUsersData(usersWithTrips);
        setStats(statsData);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        if (!silent) setLoading(false);
      }
    };

    loadData(false);

    if (!autoRefresh) {
      return undefined;
    }

    const refreshTimer = setInterval(() => {
      loadData(true);
    }, 15000);

    return () => clearInterval(refreshTimer);
  }, [adminToken, navigate, autoRefresh]);

  const allTrips = useMemo(
    () => usersData.flatMap((user) => user.trips || []),
    [usersData]
  );

  const destinationCounts = useMemo(() => {
    const counts = allTrips.reduce((acc, trip) => {
      const destination = trip.generatedTrip?.overview?.destination || "Unknown";
      acc[destination] = (acc[destination] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [allTrips]);

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyUsers = useMemo(
    () =>
      usersData.reduce((acc, user) => {
        const month = new Date(user.createdAt).getMonth();
        acc[month] += 1;
        return acc;
      }, Array(12).fill(0)),
    [usersData]
  );

  const monthlyTrips = useMemo(
    () =>
      allTrips.reduce((acc, trip) => {
        const month = new Date(trip.createdAt).getMonth();
        acc[month] += 1;
        return acc;
      }, Array(12).fill(0)),
    [allTrips]
  );

  const usersMax = useMemo(() => Math.max(...monthlyUsers, 1), [monthlyUsers]);
  const tripsMax = useMemo(() => Math.max(...monthlyTrips, 1), [monthlyTrips]);

  const toggleUserExpand = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const onDeleteUser = async (userId, userRole) => {
    if (userRole === "admin") {
      setError("Admin users cannot be deleted.");
      return;
    }

    const shouldDelete = window.confirm("Delete this user and all associated trips? This action cannot be undone.");
    if (!shouldDelete) return;

    try {
      await removeAdminUser(adminToken, userId);
      setUsersData((prev) => prev.filter((user) => user._id !== userId));
      setStats((prev) => ({
        ...prev,
        totalUsers: Math.max(prev.totalUsers - 1, 0),
      }));
      setExpandedUsers((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const filteredUsers = usersData.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#000000_0%,#122c4f_45%,#08111f_100%)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#5b88b2]/35 border-t-[#fbf9e4]" />
          <p className="text-[#fbf9e4]/68">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[linear-gradient(180deg,#000000_0%,#122c4f_45%,#08111f_100%)] pb-16">
      <span className="floating-blob left-[-90px] top-[100px] h-72 w-72 bg-[#5b88b2]/16" />
      <span className="floating-blob right-[-90px] top-[220px] h-72 w-72 bg-[#122c4f]/20" style={{ animationDelay: "1.2s" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="font-['Anton'] text-4xl font-bold text-[#fbf9e4]">Admin Command Deck</h1>
            <p className="mt-2 text-[#fbf9e4]/68">Manage all users and their trip data</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-4 md:grid-cols-3"
        >
          {[
            { label: "Total Users", value: stats.totalUsers, icon: Users },
            { label: "Total Trips", value: stats.totalTrips, icon: Plane },
            { label: "AI Requests", value: stats.totalAIRequests, icon: Bot },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="neon-panel p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#fbf9e4]/68">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-[#fbf9e4]">{stat.value}</p>
                </div>
                <stat.icon size={34} className="text-[#5b88b2]" aria-hidden="true" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex flex-wrap items-center justify-between gap-3"
        >
          <p className="text-xs text-[#fbf9e4]">
            {autoRefresh ? "Live updates every 15s" : "Auto-refresh paused"}
            {lastUpdated ? ` • Last synced ${lastUpdated.toLocaleTimeString()}` : ""}
          </p>

          <button
            type="button"
            onClick={() => setAutoRefresh((prev) => !prev)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] transition ${
              autoRefresh
                ? "border-[#5b88b2]/35 bg-[#5b88b2]/15 text-[#fbf9e4] hover:bg-[#5b88b2]/20"
                : "border-[#5b88b2]/30 bg-[#5b88b2]/12 text-[#fbf9e4] hover:bg-[#5b88b2]/60"
            }`}
          >
            Realtime: {autoRefresh ? "On" : "Off"}
          </button>
        </motion.div>

        {/* Realtime Charts */}
        <div className="mb-8 grid gap-4 xl:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="neon-panel p-5 xl:col-span-1"
          >
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-[#fbf9e4]">
              <Radar size={18} className="text-[#5b88b2]" /> Top Destinations
            </h2>
            <div className="mt-4 space-y-3">
              {destinationCounts.length ? (
                destinationCounts.map(([destination, count]) => (
                  <div key={destination}>
                    <div className="mb-1 flex items-center justify-between text-sm text-[#fbf9e4]">
                      <span>{destination}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#122c4f]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#122c4f] to-[#5b88b2]"
                        style={{ width: `${Math.max(12, count * 18)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#fbf9e4]">No destination data yet.</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="neon-panel p-5 xl:col-span-2"
          >
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-[#fbf9e4]">
              <Users size={18} className="text-[#5b88b2]" /> Monthly Registrations
            </h2>
            <div className="mt-4 grid grid-cols-12 items-end gap-2">
              {monthlyUsers.map((count, month) => (
                <div key={month} className="group flex flex-col items-center gap-1">
                  <div className="relative h-[140px] w-full">
                    <span
                      className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#fbf9e4] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      style={{ bottom: `calc(${(count / usersMax) * 100}% + 4px)` }}
                    >
                      {count}
                    </span>
                    <div
                      className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-[#5b88b2]/70 to-[#122c4f]/80"
                      style={{ height: `${(count / usersMax) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#fbf9e4]">{monthLabels[month]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mb-8 neon-panel p-5"
        >
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-[#fbf9e4]">
            <BarChart3 size={18} className="text-[#5b88b2]" /> Trips Created Per Month
          </h2>
          <div className="mt-4 grid grid-cols-12 items-end gap-2">
            {monthlyTrips.map((count, month) => (
              <div key={month} className="group flex flex-col items-center gap-1">
                <div className="relative h-[140px] w-full">
                  <span
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#fbf9e4] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ bottom: `calc(${(count / tripsMax) * 100}% + 4px)` }}
                  >
                    {count}
                  </span>
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-[#122c4f]/70 to-[#5b88b2]/80"
                    style={{ height: `${(count / tripsMax) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#fbf9e4]">{monthLabels[month]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg border border-[#5b88b2]/35 bg-[#5b88b2]/12 p-4 text-sm text-[#5b88b2]"
          >
            <AlertCircle size={18} className="inline mr-2" />
            {error}
          </motion.div>
        )}

        {/* Users & Trips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="neon-panel p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-['Anton'] text-2xl font-bold text-[#fbf9e4]">
              <Users size={24} className="text-[#5b88b2]" />
              Registered Users & Their Trips
            </h2>
            <div className="text-sm text-[#fbf9e4]">{filteredUsers.length} users</div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neon-input w-full px-4 py-3"
            />
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-[#fbf9e4]">
                <p>No users found matching your search</p>
              </div>
            ) : (
              filteredUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="rounded-2xl border border-[#5b88b2]/20 bg-[#122c4f]/85 backdrop-blur-lg transition"
                >
                  {/* User Header */}
                  <button
                    onClick={() => toggleUserExpand(user._id)}
                    className="w-full px-4 py-3 text-left hover:bg-[#122c4f]/20 transition rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5b88b2]/20 text-[#5b88b2] font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-[#fbf9e4]">{user.name}</h3>
                          <p className="text-xs text-[#fbf9e4]">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[#fbf9e4]">
                        <span className="rounded-full bg-[#5b88b2]/18 px-3 py-1 text-xs text-[#5b88b2] font-medium">
                          {user.tripCount} trips
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteUser(user._id, user.role);
                          }}
                          disabled={user.role === "admin"}
                          className="rounded-lg border border-[#5b88b2]/35 bg-[#5b88b2]/10 p-2 text-[#5b88b2] transition hover:bg-[#5b88b2]/20 disabled:cursor-not-allowed disabled:opacity-40"
                          title={user.role === "admin" ? "Admin users cannot be deleted" : "Delete user"}
                        >
                          <Trash2 size={15} />
                        </button>
                        <motion.div
                          animate={{ rotate: expandedUsers[user._id] ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={18} />
                        </motion.div>
                      </div>
                    </div>
                  </button>

                  {/* Trips List */}
                  {expandedUsers[user._id] && user.trips.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-[#5b88b2]/18 p-4 space-y-2"
                    >
                      {user.trips.map((trip, tripIndex) => (
                        <motion.div
                          key={trip._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: tripIndex * 0.05 }}
                          className="rounded-xl bg-[#5b88b2]/10 p-3 border border-[#5b88b2]/22 hover:border-[#5b88b2]/35 transition cursor-pointer group"
                          onClick={() => setSelectedTrip(trip)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 text-sm">
                              <p className="text-[#fbf9e4] font-medium truncate">
                                {trip.prompt || "No description"}
                              </p>
                              <p className="text-xs text-[#fbf9e4] mt-1">
                                {new Date(trip.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTrip(trip);
                              }}
                              className="rounded-lg border border-[#5b88b2]/20 bg-[#5b88b2]/10 p-2 text-[#5b88b2] opacity-0 transition group-hover:opacity-100"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {expandedUsers[user._id] && user.trips.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-[#5b88b2]/18 p-4 text-center text-sm text-[#fbf9e4]"
                    >
                      No trips created yet
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Trip Detail Modal */}
        {selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTrip(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#122c4f]/38 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="neon-panel max-h-[80vh] w-full max-w-2xl overflow-y-auto p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-['Anton'] text-xl font-bold text-[#fbf9e4]">Trip Details</h3>
                  <p className="mt-1 text-sm text-[#fbf9e4]">{selectedTrip.prompt}</p>
                </div>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="rounded-lg border border-[#5b88b2]/22 bg-[#5b88b2]/12 p-2 text-[#fbf9e4] transition hover:bg-[#122c4f]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Trip Overview */}
              {selectedTrip.generatedTrip?.overview && (
                <div className="mb-6 space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      { label: "Destination", value: selectedTrip.generatedTrip.overview.destination },
                      { label: "Duration", value: selectedTrip.generatedTrip.overview.duration },
                      { label: "Budget", value: selectedTrip.generatedTrip.overview.budget },
                      { label: "Best Time", value: selectedTrip.generatedTrip.overview.bestTime },
                    ].map(({ label, value }) => (
                      <div key={label} className="neon-soft rounded-xl p-3">
                        <p className="text-xs text-[#fbf9e4]">{label}</p>
                        <p className="mt-1 font-medium text-[#fbf9e4]">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {selectedTrip.generatedTrip?.itinerary && selectedTrip.generatedTrip.itinerary.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 font-semibold text-[#fbf9e4]">Itinerary</h4>
                  <div className="space-y-2">
                    {selectedTrip.generatedTrip.itinerary.map((day, idx) => (
                      <div key={idx} className="neon-soft rounded-lg p-3 text-sm">
                        <p className="font-medium text-[#5b88b2]">Day {day.day}: {day.title}</p>
                        {day.activities && (
                          <ul className="mt-2 list-inside list-disc space-y-1 pl-2 text-[#fbf9e4]">
                            {day.activities.map((activity, aIdx) => (
                              <li key={aIdx} className="text-xs">{activity}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="text-xs text-[#fbf9e4] border-t border-[#5b88b2]/18 pt-4">
                Created: {new Date(selectedTrip.createdAt).toLocaleString()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
