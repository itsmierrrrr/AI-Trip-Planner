import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.45, delay }}
    className="neon-panel group p-6 transition hover:-translate-y-1 hover:border-[#5b88b2]/45 hover:shadow-[0_0_28px_rgba(91,136,178,0.2)]"
  >
    <div className="mb-4 inline-flex rounded-2xl border border-[#5b88b2]/30 bg-[#122c4f]/45 p-2.5 text-[#5b88b2] shadow-[0_0_14px_rgba(91,136,178,0.14)] transition group-hover:shadow-[0_0_20px_rgba(91,136,178,0.25)]">
      <Icon size={18} />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-[#fbf9e4]">{title}</h3>
    <p className="text-sm leading-relaxed text-[#fbf9e4]/74">{description}</p>
  </motion.div>
);

export default FeatureCard;
