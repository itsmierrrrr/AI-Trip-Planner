import { motion } from "framer-motion";
import {
  BedDouble,
  CheckCircle2,
  CloudSun,
  Gem,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import env from "../config/env";
import FeatureCard from "../components/FeatureCard";
import { useAuth } from "../hooks/useAuth";

const floatingDestinations = [
  { name: "Tokyo", className: "left-6 top-24 md:left-24" },
  { name: "Dubai", className: "right-4 top-36 md:right-20" },
  { name: "Goa", className: "left-8 bottom-24 md:left-28" },
  { name: "Switzerland", className: "right-8 bottom-20 md:right-24" },
];

const capabilityCards = [
  {
    icon: CloudSun,
    title: "Live Weather Intelligence",
    desc: "Trips are enriched with real-time weather and best months to visit for smarter planning.",
  },
  {
    icon: ShieldCheck,
    title: "Secure User Workspace",
    desc: "Authentication, profile controls, and protected data flows keep your plans private.",
  },
  {
    icon: Rocket,
    title: "Fast Generation Engine",
    desc: "Get complete itineraries, hotels, and budget splits in seconds from one prompt.",
  },
];

const steps = [
  {
    title: "Describe Your Dream Trip",
    body: "Write your destination, budget, style, and traveler details in natural language.",
  },
  {
    title: "AI Builds The Full Plan",
    body: "The platform creates itinerary timelines, hotel picks, spending breakdown, and travel tips.",
  },
  {
    title: "Save, Compare, and Reuse",
    body: "Store your generated trips, revisit them anytime, and refine your next adventure faster.",
  },
];

const animatedPlaces = [
  {
    place: "Santorini",
    country: "Greece",
    vibe: "Sunset Cliffs",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Kyoto",
    country: "Japan",
    vibe: "Temples & Gardens",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Bali",
    country: "Indonesia",
    vibe: "Island Escape",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Interlaken",
    country: "Switzerland",
    vibe: "Alpine Views",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Istanbul",
    country: "Turkey",
    vibe: "Culture + Food",
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Dubai",
    country: "UAE",
    vibe: "Skyline Luxury",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Goa",
    country: "India",
    vibe: "Beach Chill",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  },
];

const LandingPage = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const { isAuthenticated } = useAuth();
  const generateNowPath = isAuthenticated ? "/planner" : "/auth";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden pb-16">
      <span className="floating-blob left-[-90px] top-[100px] h-72 w-72 bg-cyan-400/20" />
      <span className="floating-blob right-[-90px] top-[220px] h-72 w-72 bg-violet-500/25" style={{ animationDelay: "1.2s" }} />
      <span className="floating-blob bottom-[-110px] left-1/3 h-72 w-72 bg-blue-500/20" style={{ animationDelay: "2.2s" }} />

      <section className="grid-backdrop relative mx-auto mt-2 w-[94%] max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950/45 px-4 py-20 text-center">
        {floatingDestinations.map((destination, index) => (
          <motion.div
            key={destination.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{ duration: 5, delay: 0.4 + index * 0.15, repeat: Infinity, repeatType: "mirror" }}
            className={`neon-soft absolute hidden px-5 py-3 text-sm font-medium text-cyan-100 md:block ${destination.className}`}
          >
            {destination.name}
          </motion.div>
        ))}

        <div className="relative z-10 mx-auto max-w-4xl">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mx-auto inline-flex min-w-[320px] items-center justify-center rounded-2xl border border-violet-300/30 bg-violet-300/15 px-6 py-3 text-center font-['Space_Grotesk'] text-2xl font-bold tracking-[0.08em] text-violet-200 shadow-[0_0_22px_rgba(139,92,246,0.22)] md:min-w-[420px] md:text-3xl"
          >
            TIME: {currentTime.toLocaleTimeString()}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="neon-heading mt-6 font-['Space_Grotesk'] text-4xl font-bold leading-tight md:text-7xl"
          >
            {env.heroHeadline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-base text-slate-300 md:text-lg"
          >
            {env.heroSubheading}
          </motion.p>

          <div className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-900/35 py-4">
            <motion.div
              className="flex w-max gap-3 px-3"
              animate={{ x: [0, -980] }}
              transition={{ duration: 24, ease: "linear", repeat: Infinity }}
            >
              {[...animatedPlaces, ...animatedPlaces].map((place, idx) => (
                <article key={`${place.place}-${idx}`} className="neon-soft min-w-[230px] p-3 text-left">
                  <div className="relative h-24 w-full overflow-hidden rounded-xl">
                    <img
                      src={place.image}
                      alt={place.place}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                  </div>
                  <p className="text-sm font-semibold text-slate-100">{place.place}</p>
                  <p className="mt-1 text-xs text-slate-300">{place.country}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-cyan-300">{place.vibe}</p>
                </article>
              ))}
            </motion.div>
          </div>

          <p className="mt-4 font-['Space_Grotesk'] text-lg font-semibold uppercase tracking-[0.14em] text-cyan-200">
            Generate your trip now
          </p>

          <div className="mt-3">
            <Link
              to={generateNowPath}
              className="inline-flex items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-300/15 px-7 py-3 font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.12em] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:border-cyan-200/70 hover:bg-cyan-300/25 hover:text-white"
            >
              Generate Now
            </Link>
          </div>

          <div className="mt-6 text-sm text-slate-400">Trusted by travelers from 110+ countries and 6 imaginary planets.</div>
        </div>
      </section>

      <section className="mx-auto mt-14 grid w-[94%] max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={Sparkles}
          title="AI Itinerary"
          description="Day-by-day routes generated from your pace, mood, and travel style in seconds."
        />
        <FeatureCard
          icon={BedDouble}
          title="Smart Hotel Suggestions"
          description="Context-aware stay recommendations with ratings, pricing, and vibes."
          delay={0.08}
        />
        <FeatureCard
          icon={Wallet}
          title="Budget Optimizer"
          description="Balances transport, food, activities, and stays with transparent spending logic."
          delay={0.15}
        />
        <FeatureCard
          icon={Gem}
          title="Hidden Gems Discovery"
          description="Find under-the-radar experiences that make trips unforgettable."
          delay={0.2}
        />
      </section>

      <section className="mx-auto mt-10 w-[94%] max-w-6xl">
        <div className="grid gap-4 md:grid-cols-3">
          {capabilityCards.map((item, idx) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: idx * 0.08 }}
              className="neon-panel p-5"
            >
              <div className="inline-flex rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-2 text-cyan-200">
                <item.icon size={18} />
              </div>
              <h3 className="mt-4 font-['Space_Grotesk'] text-lg font-semibold text-slate-100">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 w-[94%] max-w-6xl">
        <div className="neon-panel p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">How It Works</p>
              <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold text-slate-100 md:text-4xl">
                One Prompt To Full Travel Blueprint
              </h2>
            </div>
            <p className="max-w-xl text-sm text-slate-300">
              lessgo ai combines AI planning logic, destination context, weather signals, and budgeting to generate practical and exciting plans.
            </p>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={step.title} className="neon-soft p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Step {idx + 1}</p>
                <h3 className="mt-2 text-base font-semibold text-slate-100">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 w-[94%] max-w-6xl">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="neon-panel p-6">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-100">Everything In One Place</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {[
                "Natural language trip generation",
                "Destination-specific hotel recommendations",
                "Budget breakdown across major categories",
                "Weather-aware best-time suggestions",
                "Saved trips library for quick reuse",
                "Admin analytics and user oversight",
              ].map((item) => (
                <li key={item} className="inline-flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 text-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="neon-panel p-6">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-100">Built For Real Travelers</h3>
            <p className="mt-4 text-sm text-slate-300">
              Whether you are planning a solo escape, honeymoon, family trip, or quick city break, the platform adapts your itinerary style, pace, and spend range.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="neon-soft p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Use Cases</p>
                <p className="mt-1 text-sm text-slate-200">Backpacking, luxury, remote work, weekend escapes</p>
              </div>
              <div className="neon-soft p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Output</p>
                <p className="mt-1 text-sm text-slate-200">Overview, timeline, hotels, tips, and budget cards</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-10 w-[94%] max-w-6xl">
        <div className="neon-panel flex flex-col items-center gap-4 p-6 text-center md:p-8">
          <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-100 md:text-3xl">Ready to build your next adventure?</h3>
          <p className="max-w-2xl text-sm text-slate-300">Share your destination, budget, and travel style. The AI will generate the full itinerary in seconds.</p>
          <Link
            to={generateNowPath}
            className="inline-flex items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-300/15 px-7 py-3 font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.12em] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:border-cyan-200/70 hover:bg-cyan-300/25 hover:text-white"
          >
            Generate Now
          </Link>
        </div>
      </section>

      <footer className="mx-auto mt-6 w-[94%] max-w-6xl pb-10">
        <div className="neon-panel p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-slate-100">{env.appName}</h3>
              <p className="mt-2 text-sm text-slate-300">
                AI-powered travel planning with weather-aware itineraries, budget-first suggestions, and saved trips.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-100">Quick Links</p>
              <div className="mt-2 flex flex-col gap-1 text-sm text-slate-300">
                <Link to="/planner" className="transition hover:text-cyan-300">Planner</Link>
                <Link to="/saved-trips" className="transition hover:text-cyan-300">Saved Trips</Link>
                <Link to="/auth" className="transition hover:text-cyan-300">Login / Signup</Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-100">Support</p>
              <p className="mt-2 text-sm text-slate-300">Need help planning? Use the planner prompt to generate a rupee-based travel plan instantly.</p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800/50 pt-4 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} {env.appName}. Crafted for smarter journeys.
          </div>
        </div>
      </footer>

      <div className="mx-auto mt-3 w-[94%] max-w-6xl pb-6 text-center">
        <Link
          to="/admin-security"
          className="neon-input inline-flex items-center rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-300 transition hover:border-cyan-300/55 hover:text-cyan-300"
        >
          🔐 Admin Access
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
