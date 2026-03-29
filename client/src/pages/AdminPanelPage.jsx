import { motion } from "framer-motion";
import { AlertCircle, ChevronDown, Eye, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStats, getAdminUsersWithTrips } from "../services/adminPanelService";

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTrips: 0, totalAIRequests: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUsers, setExpandedUsers] = useState({});
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin-security");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [usersWithTrips, statsData] = await Promise.all([
          getAdminUsersWithTrips(adminToken),
          getAdminStats(adminToken),
        ]);
        setUsersData(usersWithTrips);
        setStats(statsData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [adminToken, navigate]);

  const toggleUserExpand = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const filteredUsers = usersData.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
          <p className="text-slate-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-16">
      <span className="floating-blob left-[-90px] top-[100px] h-72 w-72 bg-cyan-400/20" />
      <span className="floating-blob right-[-90px] top-[220px] h-72 w-72 bg-violet-500/25" style={{ animationDelay: "1.2s" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-slate-100">Admin Command Deck</h1>
            <p className="mt-2 text-slate-400">Manage all users and their trip data</p>
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
            { label: "Total Users", value: stats.totalUsers, icon: "👥" },
            { label: "Total Trips", value: stats.totalTrips, icon: "✈️" },
            { label: "AI Requests", value: stats.totalAIRequests, icon: "🤖" },
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
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-100">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-300"
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
            <h2 className="flex items-center gap-2 font-['Space_Grotesk'] text-2xl font-bold text-slate-100">
              <Users size={24} className="text-cyan-300" />
              Registered Users & Their Trips
            </h2>
            <div className="text-sm text-slate-400">{filteredUsers.length} users</div>
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
              <div className="py-12 text-center text-slate-400">
                <p>No users found matching your search</p>
              </div>
            ) : (
              filteredUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="rounded-2xl border border-cyan-300/20 bg-slate-900/40 backdrop-blur-lg transition"
                >
                  {/* User Header */}
                  <button
                    onClick={() => toggleUserExpand(user._id)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-800/20 transition rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300/20 text-cyan-300 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-100">{user.name}</h3>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400">
                        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300 font-medium">
                          {user.tripCount} trips
                        </span>
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
                      className="border-t border-slate-800 p-4 space-y-2"
                    >
                      {user.trips.map((trip, tripIndex) => (
                        <motion.div
                          key={trip._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: tripIndex * 0.05 }}
                          className="rounded-xl bg-slate-800/30 p-3 border border-slate-700/50 hover:border-cyan-400/30 transition cursor-pointer group"
                          onClick={() => setSelectedTrip(trip)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 text-sm">
                              <p className="text-slate-300 font-medium truncate">
                                {trip.prompt || "No description"}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(trip.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTrip(trip);
                              }}
                              className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-300 opacity-0 transition group-hover:opacity-100"
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
                      className="border-t border-slate-800 p-4 text-center text-sm text-slate-500"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
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
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-slate-100">Trip Details</h3>
                  <p className="mt-1 text-sm text-slate-400">{selectedTrip.prompt}</p>
                </div>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-2 text-slate-400 transition hover:bg-slate-800"
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
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className="mt-1 font-medium text-slate-100">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {selectedTrip.generatedTrip?.itinerary && selectedTrip.generatedTrip.itinerary.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 font-semibold text-slate-100">Itinerary</h4>
                  <div className="space-y-2">
                    {selectedTrip.generatedTrip.itinerary.map((day, idx) => (
                      <div key={idx} className="neon-soft rounded-lg p-3 text-sm">
                        <p className="font-medium text-cyan-300">Day {day.day}: {day.title}</p>
                        {day.activities && (
                          <ul className="mt-2 list-inside list-disc space-y-1 pl-2 text-slate-300">
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
              <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
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
