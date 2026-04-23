import { motion } from "framer-motion";
import { Bell, MoonStar, ShieldCheck, Sparkles } from "lucide-react";

const SettingCard = ({ icon: Icon, title, description, enabled = true }) => (
  <article className="neon-soft flex items-start justify-between p-4">
    <div className="flex items-start gap-3">
      <span className="rounded-xl border border-[#5b88b2]/30 bg-[#5b88b2]/10 p-2 text-[#fbf9e4]">
        <Icon size={17} />
      </span>
      <div>
        <h3 className="font-semibold text-[#fbf9e4]">{title}</h3>
        <p className="mt-1 text-sm text-[#fbf9e4]">{description}</p>
      </div>
    </div>
    <button
      className={`h-6 w-11 rounded-full border transition ${
        enabled
          ? "border-[#5b88b2]/40 bg-[#5b88b2]/30"
          : "border-[#5b88b2]/30 bg-[#122c4f]"
      }`}
    >
      <span className={`mt-1 block h-4 w-4 rounded-full bg-white transition ${enabled ? "ml-6" : "ml-1"}`} />
    </button>
  </article>
);

const SettingsPage = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="neon-panel p-6"
    >
      <h1 className="text-3xl font-bold text-[#fbf9e4]">Settings</h1>
      <p className="mt-2 text-sm text-[#fbf9e4]">Tune your futuristic planner experience.</p>

      <div className="mt-6 space-y-3">
        <SettingCard
          icon={MoonStar}
          title="Dark Cosmic Theme"
          description="Always enabled. The future does not use light mode."
        />
        <SettingCard
          icon={Bell}
          title="Trip Alerts"
          description="Receive reminders for itinerary updates and price changes."
        />
        <SettingCard
          icon={Sparkles}
          title="AI Auto-enhance"
          description="Automatically improve prompts before generation."
          enabled={false}
        />
        <SettingCard
          icon={ShieldCheck}
          title="Privacy Shield"
          description="Protect your trip history and account activity."
        />
      </div>
    </motion.section>
  );
};

export default SettingsPage;
