import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.45, delay }}
    className="neon-panel group p-6 transition hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-[0_0_28px_rgba(34,211,238,0.22)]"
  >
    <div className="mb-4 inline-flex rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-2.5 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.2)] transition group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
      <Icon size={18} />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-slate-100">{title}</h3>
    <p className="text-sm leading-relaxed text-slate-400">{description}</p>
  </motion.div>
);

export default FeatureCard;
