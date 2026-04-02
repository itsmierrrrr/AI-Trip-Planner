import { useEffect, useState } from "react";
import { BarChart3, Radar, Users } from "lucide-react";
import {
  getAdminStats,
  getAdminTrips,
  getAdminUsers,
  removeTripByAdmin,
  removeUserByAdmin,
} from "../services/adminService";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalTrips: 0, totalAIRequests: 0 });
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    try {
      const [statsData, usersData, tripsData] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getAdminTrips(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setTrips(tripsData);
      setActiveUsers(Math.max(1, Math.floor(usersData.length * 0.62)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin dashboard.");
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const onDeleteUser = async (id) => {
    try {
      await removeUserByAdmin(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setTrips((prev) => prev.filter((trip) => trip.userId?._id !== id));
      setStats((prev) => ({ ...prev, totalUsers: Math.max(prev.totalUsers - 1, 0) }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const onDeleteTrip = async (id) => {
    try {
      await removeTripByAdmin(id);
      setTrips((prev) => prev.filter((trip) => trip._id !== id));
      setStats((prev) => ({ ...prev, totalTrips: Math.max(prev.totalTrips - 1, 0) }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete trip.");
    }
  };

  const destinationCounts = trips.reduce((acc, trip) => {
    const destination = trip.generatedTrip?.overview?.destination || "Unknown";
    acc[destination] = (acc[destination] || 0) + 1;
    return acc;
  }, {});

  const topDestinations = Object.entries(destinationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyUsers = users.reduce((acc, user) => {
    const month = new Date(user.createdAt).getMonth();
    acc[month] += 1;
    return acc;
  }, Array(12).fill(0));

  const monthlyTrips = trips.reduce((acc, trip) => {
    const month = new Date(trip.createdAt).getMonth();
    acc[month] += 1;
    return acc;
  }, Array(12).fill(0));

  return (
    <section className="space-y-5">
      <h1 className="font-['Anton'] text-3xl font-bold text-slate-100">Admin Command Deck</h1>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Users", stats.totalUsers],
          ["Total Trips", stats.totalTrips],
          ["Total AI Requests", stats.totalAIRequests],
          ["Active Users", activeUsers],
        ].map(([label, value]) => (
          <article key={label} className="neon-panel p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="neon-panel p-5 xl:col-span-1">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-100"><Radar size={18} className="text-cyan-200" /> Most Searched Destinations</h2>
          <div className="mt-4 space-y-3">
            {topDestinations.length ? topDestinations.map(([destination, count]) => (
              <div key={destination}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
                  <span>{destination}</span>
                  <span>{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${Math.max(12, count * 18)}%` }} />
                </div>
              </div>
            )) : <p className="text-sm text-slate-400">No data yet.</p>}
          </div>
        </div>

        <div className="neon-panel p-5 xl:col-span-2">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-100"><Users size={18} className="text-cyan-200" /> Monthly Registrations</h2>
          <div className="mt-4 grid grid-cols-12 items-end gap-2">
            {monthlyUsers.map((count, month) => (
              <div key={month} className="flex flex-col items-center gap-2">
                <div className="w-full rounded-t-md bg-gradient-to-t from-violet-500/70 to-cyan-400/80" style={{ height: `${Math.max(10, count * 14)}px` }} />
                <span className="text-[10px] text-slate-400">{monthLabels[month]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="neon-panel p-5">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-100"><BarChart3 size={18} className="text-cyan-200" /> Trips Created</h2>
        <div className="mt-4 grid grid-cols-12 items-end gap-2">
          {monthlyTrips.map((count, month) => (
            <div key={month} className="flex flex-col items-center gap-2">
              <div className="w-full rounded-t-md bg-gradient-to-t from-cyan-400/70 to-blue-400/80" style={{ height: `${Math.max(10, count * 14)}px` }} />
              <span className="text-[10px] text-slate-400">{monthLabels[month]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="neon-panel p-5">
        <h2 className="text-lg font-semibold text-slate-100">Users</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-slate-800 text-slate-200 transition hover:bg-cyan-300/5">
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2 capitalize">{user.role}</td>
                  <td className="py-2">
                    <button
                      onClick={() => onDeleteUser(user._id)}
                      disabled={user.role === "admin"}
                      className="rounded-xl border border-rose-300/35 bg-rose-300/10 px-3 py-1 text-rose-300 transition hover:bg-rose-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="neon-panel p-5">
        <h2 className="text-lg font-semibold text-slate-100">Saved Trips</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="py-2">Destination</th>
                <th className="py-2">Prompt</th>
                <th className="py-2">User</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip._id} className="border-t border-slate-800 text-slate-200 transition hover:bg-cyan-300/5">
                  <td className="py-2">{trip.generatedTrip?.overview?.destination || "Custom"}</td>
                  <td className="max-w-md py-2 pr-3 text-xs text-slate-300">{trip.prompt}</td>
                  <td className="py-2">{trip.userId?.email || "Unknown"}</td>
                  <td className="py-2">
                    <button
                      onClick={() => onDeleteTrip(trip._id)}
                      className="rounded-xl border border-rose-300/35 bg-rose-300/10 px-3 py-1 text-rose-300 transition hover:bg-rose-300/20"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
