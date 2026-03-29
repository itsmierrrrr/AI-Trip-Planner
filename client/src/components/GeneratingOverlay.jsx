import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import env from "../config/env";

const loadingTexts = env.loadingMessages;

const GeneratingOverlay = ({ open }) => {
  const [index, setIndex] = useState(0);

  const text = useMemo(() => loadingTexts[index % loadingTexts.length], [index]);

  useEffect(() => {
    if (!open) return undefined;

    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 1800);

    return () => clearInterval(timer);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl"
        >
          <div className="neon-panel w-[92%] max-w-md p-8 text-center">
            <div className="mx-auto ring-loader" />
            <h3 className="mt-6 text-lg font-semibold text-slate-100">Generating Your Quantum Itinerary</h3>
            <p className="mt-2 text-sm text-cyan-200">{text}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default GeneratingOverlay;
