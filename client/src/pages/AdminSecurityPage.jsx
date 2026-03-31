import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAdminCode } from "../services/adminPanelService";

const AdminSecurityPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await verifyAdminCode(code);
      // Store token in localStorage
      localStorage.setItem("adminToken", response.token);
      navigate("/admin-panel");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid security code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-16">
      <span className="floating-blob left-[-90px] top-[100px] h-72 w-72 bg-cyan-400/20" />
      <span className="floating-blob right-[-90px] top-[220px] h-72 w-72 bg-violet-500/25" style={{ animationDelay: "1.2s" }} />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="neon-panel rounded-[2rem] border border-cyan-300/25 p-2 shadow-[0_0_50px_rgba(34,211,238,0.12)]">
          {/* Security Icon */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <div className="rounded-full border border-cyan-300/45 bg-gradient-to-br from-cyan-300/25 to-violet-400/20 p-4 shadow-[0_0_36px_rgba(34,211,238,0.35)]">
              <Lock size={40} className="text-cyan-300" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-2 text-center"
          >
            <h1 className="neon-heading font-['Space_Grotesk'] text-3xl font-bold">Admin Access</h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 text-center text-slate-400"
          >
            Enter the security code to access the admin panel
          </motion.p>

          {/* Security Code Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleVerify}
            className="space-y-4 rounded-3xl border border-cyan-300/20 bg-slate-900/55 p-6 backdrop-blur-xl"
          >
            {/* Code Input */}
            <div>
              <label className="mb-2 block text-sm font-medium tracking-[0.06em] text-slate-300">-------------------Security code------------------</label>
              <div className="relative mx-auto max-w-[240px]">
                
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
                    setError("");
                  }}
                  maxLength={4}
                  inputMode="numeric"
                  className="neon-input w-full py-3 px-4 text-center text-2xl font-semibold tracking-[0.45em]"
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-rose-500/35 bg-rose-500/10 p-3 text-sm text-rose-300"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!code || code.length !== 4 || loading}
              className="neon-btn w-full rounded-2xl py-3 text-sm tracking-[0.06em] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-slate-100" />
                  Verifying...
                </span>
              ) : (
                "Unlock Admin Panel"
              )}
            </button>

            {/* Info Box */}
            <div className="rounded-2xl border border-cyan-300/25 bg-gradient-to-r from-cyan-300/10 to-violet-400/10 p-3 text-xs text-slate-300">
              <p className="mb-1 font-medium tracking-[0.08em] text-cyan-200">SECURE ACCESS ONLY</p>
              <p>Only OGs Allowed</p>
            </div>
          </motion.form>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 text-center text-xs text-slate-500"
          >
            Protected by Durex
          </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSecurityPage;
