import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import PlannerSidebar from "../components/PlannerSidebar";

const AppLayout = () => {
  const location = useLocation();
  const showSidebar = ["/planner", "/dashboard"].includes(location.pathname);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mx-auto w-[94%] max-w-7xl py-8 ${showSidebar ? "grid gap-6 md:grid-cols-[260px_1fr]" : ""}`}
    >
      {showSidebar ? <PlannerSidebar /> : null}
      <main>
        <Outlet />
      </main>
    </motion.div>
  );
};

export default AppLayout;
