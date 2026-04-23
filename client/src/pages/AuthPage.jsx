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
    "neon-input w-full px-4 py-3 text-sm outline-none transition focus:border-[#5b88b2]/70 focus:shadow-[0_0_0_1px_rgba(91,136,178,0.28),0_0_24px_rgba(18,44,79,0.16)]";

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8">
      <span className="floating-blob left-[-140px] top-[15%] h-96 w-96 bg-[#5b88b2]/16" />
      <span className="floating-blob right-[-120px] top-[55%] h-96 w-96 bg-[#122c4f]/18" style={{ animationDelay: "1.2s" }} />

      <div className="mx-auto grid min-h-[92vh] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-[#5b88b2]/20 bg-[#000000]/76 md:grid-cols-2">
        <section className="relative hidden overflow-hidden p-10 md:block">
          <div className="grid-backdrop absolute inset-0 opacity-40" />
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#5b88b2]/25 bg-[#122c4f]/45 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#5b88b2]">
              <Orbit size={14} /> Access Portal
            </p>
            <h2 className="neon-heading mt-5 font-['Anton'] text-5xl font-bold leading-tight">
              Sync Your Journey with the AI Grid
            </h2>
            <p className="mt-5 max-w-md text-sm text-[#fbf9e4]/72">
              Login to unlock predictive itineraries, futuristic stay intelligence, and a personal navigation brain for your next escape.
            </p>

            <div className="mt-10 space-y-3">
              {[
                "Real-time route optimization",
                "Adaptive budget calculations",
                "Hidden gems map intelligence",
              ].map((item) => (
                <div key={item} className="neon-soft flex items-center gap-3 px-4 py-3 text-sm text-[#fbf9e4]/72">
                  <Globe size={15} className="text-[#5b88b2]" />
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
            <div className="mb-6 flex rounded-2xl border border-[#5b88b2]/20 bg-[#122c4f]/45 p-1 backdrop-blur-md">
              {["login", "signup"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setMode(tab);
                    setError("");
                  }}
                  className={`w-1/2 rounded-xl px-3 py-2 text-sm font-medium capitalize transition ${
                    mode === tab
                      ? "bg-[#122c4f] text-[#fbf9e4]"
                      : "text-[#fbf9e4]/68"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form className="space-y-3" onSubmit={onSubmit}>
              {mode === "signup" && (
                <label className="block">
                  <input
                    placeholder="Full name"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                    className={inputClass}
                  />
                </label>
              )}

              <label className="block">
                <input
                  type="email"
                  placeholder="Email address"
                  value={mode === "signup" ? signupForm.email : loginForm.email}
                  onChange={(e) =>
                    mode === "signup"
                      ? setSignupForm((prev) => ({ ...prev, email: e.target.value }))
                      : setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={inputClass}
                />
              </label>

              <label className="block">
                <input
                  type="password"
                  placeholder="Password"
                  value={mode === "signup" ? signupForm.password : loginForm.password}
                  onChange={(e) =>
                    mode === "signup"
                      ? setSignupForm((prev) => ({ ...prev, password: e.target.value }))
                      : setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className={inputClass}
                />
              </label>

              {error && <p className="text-sm text-[#5b88b2]">{error}</p>}

              <button type="submit" disabled={loading} className="neon-btn w-full disabled:opacity-60">
                {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
              </button>
            </form>

            <div className="my-5 h-px bg-[#5b88b2]/20" />

            <motion.div
              className="flex w-full items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.01 }}
            >
              <GoogleLogin 
                onSuccess={onGoogleSuccess} 
                onError={() => setError("Google login failed")}
                text="signin_with"
                theme="outline"
                shape="rectangular"
                size="large"
                logo_alignment="left"
              />
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
