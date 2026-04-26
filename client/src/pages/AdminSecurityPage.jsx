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
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#000000_0%,#122c4f_45%,#08111f_100%)] pb-16">
      <span className="floating-blob left-[-90px] top-[100px] h-72 w-72 bg-[#5b88b2]/16" />
      <span className="floating-blob right-[-90px] top-[220px] h-72 w-72 bg-[#122c4f]/20" style={{ animationDelay: "1.2s" }} />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="neon-panel rounded-[2rem] border border-[#5b88b2]/25 p-2 shadow-[0_0_50px_rgba(0,0,0,0.24)]">
          {/* Security Icon */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <div className="rounded-full border border-[#5b88b2]/45 bg-gradient-to-br from-[#122c4f]/30 to-[#5b88b2]/18 p-4 shadow-[0_0_36px_rgba(91,136,178,0.35)]">
              <Lock size={40} className="text-[#5b88b2]" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-2 text-center"
          >
            <h1 className="neon-heading font-['Anton'] text-3xl font-bold">Admin Access</h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 text-center text-[#fbf9e4]/68"
          >
            Enter the security code to access the admin panel
          </motion.p>

          {/* Security Code Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleVerify}
            className="space-y-4 rounded-3xl border border-[#5b88b2]/20 bg-[#122c4f]/56 p-6 backdrop-blur-xl"
          >
            {/* Code Input */}
            <div>
              <label className="mb-2 block text-center text-sm font-medium tracking-[0.06em] text-[#fbf9e4]/72">Serurity code</label>
              <div className="relative mx-auto max-w-[240px]">
                
                <input
                  type="password"
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
                className="rounded-lg border border-[#5b88b2]/35 bg-[#122c4f]/35 p-3 text-sm text-[#5b88b2]"
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
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#5b88b2]/35 border-t-[#fbf9e4]" />
                  Verifying...
                </span>
              ) : (
                "Unlock Admin Panel"
              )}
            </button>

            {/* Info Box */}
            <div className="rounded-2xl border border-[#5b88b2]/25 bg-gradient-to-r from-[#122c4f]/14 to-[#5b88b2]/10 p-3 text-xs text-[#fbf9e4]/70">
              <p className="mb-1 font-medium tracking-[0.08em] text-[#5b88b2]">SECURE ACCESS ONLY</p>
              <p>Only OGs Allowed</p>
            </div>
          </motion.form>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 text-center text-xs text-[#fbf9e4]"
          >
            Protected by Odomos
          </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSecurityPage;
