import { motion } from "framer-motion";
import {
  BedDouble,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CloudSun,
  Gem,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { FaDiscord, FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP } from "react-icons/fa";
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

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
  { label: "Email", href: "mailto:support@lessgoai.com", icon: FaEnvelope },
  { label: "Pinterest", href: "https://pinterest.com", icon: FaPinterestP },
  { label: "Discord", href: "https://discord.com", icon: FaDiscord },
];

const animatedPlaces = [
  {
    place: "Santorini",
    country: "Greece",
    vibe: "Sunset Cliffs",
    description: "Whitewashed villages, blue domes, and golden-hour views over the caldera.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Kyoto",
    country: "Japan",
    vibe: "Temples & Gardens",
    description: "Walk through bamboo groves, quiet shrines, and timeless tea-house streets.",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Bali",
    country: "Indonesia",
    vibe: "Island Escape",
    description: "Rice terraces, beach clubs, and jungle waterfalls for a perfect balance of calm and adventure.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Interlaken",
    country: "Switzerland",
    vibe: "Alpine Views",
    description: "Snowy peaks, lake cruises, and scenic train rides through dramatic valleys.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Istanbul",
    country: "Turkey",
    vibe: "Culture + Food",
    description: "Grand bazaars, Bosphorus sunsets, and bold flavors at every corner.",
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Dubai",
    country: "UAE",
    vibe: "Skyline Luxury",
    description: "Futuristic towers, desert safaris, and premium shopping in one city.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
  },
  {
    place: "Goa",
    country: "India",
    vibe: "Beach Chill",
    description: "Palm-lined beaches, sunset shacks, and laid-back coastal nightlife.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  },
];

const LandingPage = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [activePlaceIndex, setActivePlaceIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const generateNowPath = isAuthenticated ? "/planner" : "/auth";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const placeTimer = setInterval(() => {
      setActivePlaceIndex((prev) => (prev + 1) % animatedPlaces.length);
    }, 3000);

    return () => clearInterval(placeTimer);
  }, []);

  const handlePrevPlace = () => {
    setActivePlaceIndex((prev) => (prev - 1 + animatedPlaces.length) % animatedPlaces.length);
  };

  const handleNextPlace = () => {
    setActivePlaceIndex((prev) => (prev + 1) % animatedPlaces.length);
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-16">
      <span className="floating-blob left-[-90px] top-[100px] h-72 w-72 bg-[#004643]/18" />
      <span className="floating-blob right-[-90px] top-[220px] h-72 w-72 bg-[#0f5a56]/16" style={{ animationDelay: "1.2s" }} />
      <span className="floating-blob bottom-[-110px] left-1/3 h-72 w-72 bg-[#2b716d]/14" style={{ animationDelay: "2.2s" }} />

      <section className="grid-backdrop relative mx-auto mt-2 w-[94%] max-w-7xl overflow-hidden rounded-[2rem] border border-[#004643]/20 bg-[#f0ede5]/70 px-4 py-20 text-center shadow-[0_20px_50px_rgba(0,70,67,0.12)]">
        {floatingDestinations.map((destination, index) => (
          <motion.div
            key={destination.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{ duration: 5, delay: 0.4 + index * 0.15, repeat: Infinity, repeatType: "mirror" }}
            className={`neon-soft absolute hidden px-5 py-3 text-sm font-medium text-[#0f5a56] md:block ${destination.className}`}
          >
            {destination.name}
          </motion.div>
        ))}

        <div className="relative z-10 mx-auto max-w-4xl">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mx-auto inline-flex min-w-[320px] items-center justify-center rounded-2xl border border-[#004643]/28 bg-[#004643]/12 px-6 py-3 text-center font-['Anton'] text-2xl font-bold tracking-[0.08em] text-[#004643] shadow-[0_0_22px_rgba(0,70,67,0.14)] md:min-w-[420px] md:text-3xl"
          >
            TIME: {currentTime.toLocaleTimeString()}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="neon-heading mt-6 font-['Anton'] text-4xl font-bold leading-tight md:text-7xl"
          >
            {env.heroHeadline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-base text-[#2f5f5c] md:text-lg"
          >
            {env.heroSubheading}
          </motion.p>

          <p className="mt-8 font-['Anton'] text-lg font-semibold uppercase tracking-[0.14em] text-[#0f5a56]">
            Generate your trip now
          </p>

          <div className="mt-3">
            <Link
              to={generateNowPath}
              className="inline-flex items-center justify-center rounded-2xl border border-[#004643]/45 bg-[#004643] px-7 py-3 font-['Anton'] text-sm font-bold uppercase tracking-[0.12em] text-[#f0ede5] shadow-[0_0_24px_rgba(0,70,67,0.22)] transition hover:border-[#0f5a56] hover:bg-[#0f5a56]"
            >
              Generate Now
            </Link>
          </div>

          <div className="mt-6 text-sm text-[#4b716d]">Trusted by travelers from 110+ countries and 6 imaginary planets.</div>

          <div className="relative mx-auto mt-10 max-w-[88rem] overflow-hidden rounded-3xl border border-[#004643]/20 bg-[#f3eee6]/80 p-7 md:p-8">
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `-${activePlaceIndex * 100}%` }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              >
                {animatedPlaces.map((place) => (
                  <article key={place.place} className="w-full min-w-full px-2 md:px-3">
                    <div className="neon-soft p-6 md:p-7 text-left">
                      <div className="relative h-64 w-full overflow-hidden rounded-xl md:h-[26rem]">
                        <img
                          src={place.image}
                          alt={place.place}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#002f2d]/45 via-transparent to-transparent" />
                      </div>
                      <p className="mt-3 text-lg font-semibold text-[#123f3d] md:text-xl">{place.place}</p>
                      <p className="mt-1 text-sm text-[#3f6764]">{place.country}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#0f5a56]">{place.vibe}</p>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#2f5f5c]">{place.description}</p>
                    </div>
                  </article>
                ))}
              </motion.div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevPlace}
                className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#004643]/35 bg-[#004643]/10 text-[#004643] transition hover:bg-[#004643]/20"
                aria-label="Previous place"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-2">
                {animatedPlaces.map((place, idx) => (
                  <button
                    key={place.place}
                    type="button"
                    onClick={() => setActivePlaceIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === activePlaceIndex ? "w-8 bg-[#0f5a56]" : "w-2.5 bg-[#88a7a4] hover:bg-[#6f8f8c]"
                    }`}
                    aria-label={`Go to ${place.place}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextPlace}
                className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#004643]/35 bg-[#004643]/10 text-[#004643] transition hover:bg-[#004643]/20"
                aria-label="Next place"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
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
              <div className="inline-flex rounded-2xl border border-[#004643]/30 bg-[#004643]/12 p-2 text-[#004643]">
                <item.icon size={18} />
              </div>
              <h3 className="mt-4 font-['Anton'] text-lg font-semibold text-[#0f3836]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#456a67]">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 w-[94%] max-w-6xl">
        <div className="neon-panel p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#0f5a56]">How It Works</p>
              <h2 className="mt-3 font-['Anton'] text-3xl font-bold text-[#0f3836] md:text-4xl">
                One Prompt To Full Travel Blueprint
              </h2>
            </div>
            <p className="max-w-xl text-sm text-[#456a67]">
              lessgo ai combines AI planning logic, destination context, weather signals, and budgeting to generate practical and exciting plans.
            </p>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={step.title} className="neon-soft p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#0f5a56]">Step {idx + 1}</p>
                <h3 className="mt-2 text-base font-semibold text-[#0f3836]">{step.title}</h3>
                <p className="mt-2 text-sm text-[#456a67]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 w-[94%] max-w-6xl">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="neon-panel p-6">
            <h3 className="font-['Anton'] text-2xl font-bold text-[#0f3836]">Everything In One Place</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#456a67]">
              {[
                "Natural language trip generation",
                "Destination-specific hotel recommendations",
                "Budget breakdown across major categories",
                "Weather-aware best-time suggestions",
                /*"Saved trips library for quick reuse",*/
              ].map((item) => (
                <li key={item} className="inline-flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 text-[#0f5a56]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="neon-panel p-6">
            <h3 className="font-['Anton'] text-2xl font-bold text-[#0f3836]">Built For Real Travelers</h3>
            <p className="mt-4 text-sm text-[#456a67]">
              Whether you are planning a solo escape, honeymoon, family trip, or quick city break, the platform adapts your itinerary style, pace, and spend range.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="neon-soft p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[#5d7d7a]">Use Cases</p>
                <p className="mt-1 text-sm text-[#2f5f5c]">Backpacking, luxury, remote work, weekend escapes</p>
              </div>
              <div className="neon-soft p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[#5d7d7a]">Output</p>
                <p className="mt-1 text-sm text-[#2f5f5c]">Overview, timeline, hotels, tips, and budget cards</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-10 w-[94%] max-w-6xl">
        <div className="flex flex-col items-center gap-4 px-2 text-center">
          <h3 className="font-['Anton'] text-2xl font-bold text-[#0f3836] md:text-3xl">Ready to build your next adventure?</h3>
          <p className="max-w-2xl text-sm text-[#456a67]">Share your destination, budget, and travel style. The AI will generate the full itinerary in seconds.</p>
          <Link
            to={generateNowPath}
            className="inline-flex items-center justify-center rounded-2xl border border-[#004643]/45 bg-[#004643] px-7 py-3 font-['Anton'] text-sm font-bold uppercase tracking-[0.12em] text-[#f0ede5] shadow-[0_0_24px_rgba(0,70,67,0.22)] transition hover:border-[#0f5a56] hover:bg-[#0f5a56]"
          >
            Generate Now
          </Link>
        </div>
      </section>

      <footer className="mx-auto mt-6 w-[94%] max-w-6xl pb-10">
        <div className="neon-panel p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-['Anton'] text-lg font-semibold text-[#0f3836]">{env.appName}</h3>
              <p className="mt-2 text-sm text-[#456a67]">
                AI-powered travel planning with weather-aware itineraries, budget-first suggestions, and saved trips.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#0f3836]">Quick Links</p>
              <div className="mt-2 flex flex-col gap-1 text-sm text-[#456a67]">
                <Link to="/planner" className="transition hover:text-[#0f5a56]">Planner</Link>
                <Link to="/saved-trips" className="transition hover:text-[#0f5a56]">Saved Trips</Link>
                <Link to="/auth" className="transition hover:text-[#0f5a56]">Login / Signup</Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#0f3836]">Support</p>
              <p className="mt-2 text-sm text-[#456a67]">Need help planning? Use the planner prompt to generate a rupee-based travel plan instantly.</p>
            </div>

            <div className="md:col-span-3">
              <p className="text-sm font-semibold text-[#0f3836]">Follow Us</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    title={item.label}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                    className="neon-input inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#456a67] transition hover:border-[#004643]/55 hover:text-[#004643]"
                  >
                    <item.icon size={13} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-[#004643]/20 pt-4 text-center text-xs text-[#5d7d7a]">
            © {new Date().getFullYear()} {env.appName}. Crafted for smarter journeys. Founded by Imran Hashmi.
          </div>
        </div>
      </footer>

      <div className="mx-auto mt-3 w-[94%] max-w-6xl pb-6 text-center">
        <Link
          to="/admin-security"
          className="neon-input inline-flex items-center rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#456a67] transition hover:border-[#004643]/55 hover:text-[#004643]"
        >
           Admin Access
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
