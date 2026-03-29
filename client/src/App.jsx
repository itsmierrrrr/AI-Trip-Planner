import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import AdminSecurityPage from "./pages/AdminSecurityPage";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import PlannerPage from "./pages/PlannerPage";
import ProfilePage from "./pages/ProfilePage";
import SavedTripsPage from "./pages/SavedTripsPage";
import SettingsPage from "./pages/SettingsPage";
import UserDashboardPage from "./pages/UserDashboardPage";

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin-security" element={<AdminSecurityPage />} />
          <Route path="/admin-panel" element={<AdminPanelPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/saved-trips" element={<SavedTripsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
