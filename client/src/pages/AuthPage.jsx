import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { Globe, Orbit } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const initialSignup = { name: "", email: "", password: "" };
const initialLogin = { email: "", password: "" };

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, googleLogin } = useAuth();

  const [mode, setMode] = useState("login");
  const [signupForm, setSignupForm] = useState(initialSignup);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search || ""}`
    : "/planner";

  const validate = () => {
    if (mode === "signup") {
      if (!signupForm.name.trim() || !signupForm.email.trim() || signupForm.password.length < 6) {
        return "Please enter valid details. Password must be at least 6 characters.";
      }
    } else if (!loginForm.email.trim() || !loginForm.password.trim()) {
      return "Email and password are required.";
    }

    return "";
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    setError(validationError);

    if (validationError) return;

    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(signupForm);
      } else {
        await login(loginForm);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "peer neon-input w-full px-4 pb-2 pt-5 text-sm outline-none transition focus:border-cyan-300/70 focus:shadow-[0_0_0_1px_rgba(34,211,238,0.35),0_0_24px_rgba(34,211,238,0.25)]";

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8">
      <span className="floating-blob left-[-140px] top-[15%] h-96 w-96 bg-cyan-500/20" />
      <span className="floating-blob right-[-120px] top-[55%] h-96 w-96 bg-violet-500/20" style={{ animationDelay: "1.2s" }} />

      <div className="mx-auto grid min-h-[92vh] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950/60 md:grid-cols-2">
        <section className="relative hidden overflow-hidden p-10 md:block">
          <div className="grid-backdrop absolute inset-0 opacity-40" />
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
              <Orbit size={14} /> Access Portal
            </p>
            <h2 className="neon-heading mt-5 font-['Space_Grotesk'] text-5xl font-bold leading-tight">
              Sync Your Journey with the AI Grid
            </h2>
            <p className="mt-5 max-w-md text-sm text-slate-300">
              Login to unlock predictive itineraries, futuristic stay intelligence, and a personal navigation brain for your next escape.
            </p>

            <div className="mt-10 space-y-3">
              {[
                "Real-time route optimization",
                "Adaptive budget calculations",
                "Hidden gems map intelligence",
              ].map((item) => (
                <div key={item} className="neon-soft flex items-center gap-3 px-4 py-3 text-sm text-slate-200">
                  <Globe size={15} className="text-cyan-200" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-5 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="neon-panel w-full max-w-md p-7"
          >
            <div className="mb-6 flex rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-1 backdrop-blur-md">
              {["login", "signup"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setMode(tab);
                    setError("");
                  }}
                  className={`w-1/2 rounded-xl px-3 py-2 text-sm font-medium capitalize transition ${
                    mode === tab
                      ? "bg-gradient-to-r from-cyan-300/30 to-violet-400/30 text-cyan-100"
                      : "text-slate-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form className="space-y-3" onSubmit={onSubmit}>
              {mode === "signup" && (
                <label className="relative block">
                  <input
                    placeholder=" "
                    value={signupForm.name}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                    className={inputClass}
                  />
                  <span className="pointer-events-none absolute left-4 top-3 text-xs text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-200">
                    Full name
                  </span>
                </label>
              )}

              <label className="relative block">
                <input
                  type="email"
                  placeholder=" "
                  value={mode === "signup" ? signupForm.email : loginForm.email}
                  onChange={(e) =>
                    mode === "signup"
                      ? setSignupForm((prev) => ({ ...prev, email: e.target.value }))
                      : setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={inputClass}
                />
                <span className="pointer-events-none absolute left-4 top-3 text-xs text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-200">
                  Email address
                </span>
              </label>

              <label className="relative block">
                <input
                  type="password"
                  placeholder=" "
                  value={mode === "signup" ? signupForm.password : loginForm.password}
                  onChange={(e) =>
                    mode === "signup"
                      ? setSignupForm((prev) => ({ ...prev, password: e.target.value }))
                      : setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className={inputClass}
                />
                <span className="pointer-events-none absolute left-4 top-3 text-xs text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-200">
                  Password
                </span>
              </label>

              {error && <p className="text-sm text-rose-300">{error}</p>}

              <button type="submit" disabled={loading} className="neon-btn w-full disabled:opacity-60">
                {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
              </button>
            </form>

            <div className="my-5 h-px bg-slate-700/80" />

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <GoogleLogin 
                onSuccess={onGoogleSuccess} 
                onError={() => setError("Google login failed")}
                text="logo_only"
                size="large"
              />
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
