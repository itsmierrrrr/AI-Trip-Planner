import { motion } from "framer-motion";
import { CalendarDays, Cloud, CloudDrizzle, CloudRain, CloudSnow, CloudSun, Droplets, ExternalLink, IndianRupee, Lightbulb, MapPin, Star, Sun, Timer, Wind } from "lucide-react";

const cardAnimation = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

const getWeatherIcon = (condition) => {
  if (!condition) return <CloudSun size={20} />;
  const cond = condition.toLowerCase();
  if (cond.includes("rain")) return <CloudRain size={20} />;
  if (cond.includes("drizzle")) return <CloudDrizzle size={20} />;
  if (cond.includes("snow")) return <CloudSnow size={20} />;
  if (cond.includes("clear") || cond.includes("sunny")) return <Sun size={20} />;
  if (cond.includes("cloud")) return <Cloud size={20} />;
  return <CloudSun size={20} />;
};

const isHttpUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value.trim());
const HOTEL_CARD_IMAGE = "/oggy.png";

const buildMakeMyTripHotelLink = (destination, hotelName) => {
  const query = [hotelName, destination].filter(Boolean).join(" ");
  if (!query) {
    return "https://www.makemytrip.com/hotels/";
  }

  return `https://www.makemytrip.com/hotels/hotel-listing/?searchText=${encodeURIComponent(query)}`;
};

const TripResultView = ({ trip, compact = false }) => {
  if (!trip) return null;

  const { overview, itinerary = [], hotels = [], budgetBreakdown = {}, travelTips = [], weather = {} } = trip;

  const budgetValues = Object.values(budgetBreakdown)
    .map((value) => Number(String(value).replace(/[^\d.]/g, "")))
    .filter((value) => Number.isFinite(value) && value > 0);
  const totalBudget = budgetValues.reduce((sum, item) => sum + item, 0);

  const summaryPoints = [];

  const destinationLabel = overview?.destination || "the destination";
  const durationLabel = overview?.duration || "your selected duration";
  const budgetLabel = overview?.budget || "your selected budget";
  const bestTimeLabel = overview?.bestTime;
  const bestTimeContent = [weather?.bestMonths, overview?.bestTime]
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .find(Boolean) || "Year-round";

  summaryPoints.push(
    `This trip plans ${destinationLabel} for ${durationLabel} with an estimated budget of ${budgetLabel}${bestTimeLabel ? ` and best time to visit in ${bestTimeLabel}` : ""}.`
  );

  const itineraryHighlights = itinerary
    .slice(0, 3)
    .map((dayItem) => dayItem?.title)
    .filter(Boolean);
  if (itineraryHighlights.length) {
    summaryPoints.push(`Key itinerary highlights: ${itineraryHighlights.join(", ")}.`);
  }

  const topHotels = hotels
    .slice(0, 3)
    .map((hotel) => hotel?.name)
    .filter(Boolean);
  if (topHotels.length) {
    summaryPoints.push(`Recommended stays include: ${topHotels.join(", ")}.`);
  }

  const weatherBits = [weather?.temperature, weather?.condition].filter(Boolean);
  if (weatherBits.length) {
    summaryPoints.push(`Expected weather snapshot: ${weatherBits.join(" • ")}.`);
  }

  const tipHighlights = travelTips.slice(0, 2).filter(Boolean);
  if (tipHighlights.length) {
    summaryPoints.push(`Top travel tips: ${tipHighlights.join(" ")}`);
  }

  return (
    <div className={`${compact ? "" : "mt-8 "}space-y-5`}>
      {/* Weather Widget */}
      {weather.temperature && (
        <motion.section
          {...cardAnimation}
          className="relative overflow-hidden rounded-3xl border border-[#156874]/25 bg-gradient-to-br from-[#f3eded]/70 to-[#ede6e6]/40 p-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(21,104,116,0.25),transparent_50%)]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-3">
            {/* Current Weather */}
            <div>
              <p className="text-xs uppercase tracking-wider text-[#5f8b95]">Current Weather</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="text-[#156874] text-4xl">{getWeatherIcon(weather.condition)}</div>
                <div>
                  <p className="text-4xl font-bold text-[#174b53]">{weather.temperature}</p>
                  <p className="text-sm text-[#3f737d] mt-1">{weather.condition}</p>
                </div>
              </div>
            </div>

            {/* Humidity & Wind */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#e8e1e1]/48 p-4 h-full flex items-center justify-around">
                <div className="text-center">
                  <Droplets size={20} className="mx-auto text-[#2a7f8b] mb-2" />
                  <p className="text-xs text-[#5f8b95]">Humidity</p>
                  <p className="font-semibold text-[#174b53] mt-1 text-lg">{weather.humidity}</p>
                </div>
                <div className="h-12 w-px bg-[#156874]/22" />
                <div className="text-center">
                  <Wind size={20} className="mx-auto text-[#156874] mb-2" />
                  <p className="text-xs text-[#5f8b95]">Wind Speed</p>
                  <p className="font-semibold text-[#174b53] mt-1 text-lg">{weather.windSpeed}</p>
                </div>
              </div>
            </div>

            {/* Best Time to Visit - Prominent Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="lg:row-span-1 lg:col-span-1 rounded-2xl bg-gradient-to-br from-[#156874]/24 to-[#0f535d]/16 p-6 border border-[#2a7f8b]/25 flex flex-col justify-center hover:border-[#2a7f8b]/40 transition"
            >
              <p className="text-xs uppercase tracking-wider text-[#2a7f8b] font-semibold">🗓️ Best Time to Visit</p>
              <div className="mt-4 max-h-32 overflow-y-auto rounded-xl border border-[#2a7f8b]/20 bg-[#ede6e6]/45 p-3 pr-2">
                <p className="text-base font-semibold leading-relaxed text-[#174b53] whitespace-pre-wrap break-words">
                  {bestTimeContent}
                </p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#174b53]/80">
                Plan your visit during these months for optimal weather conditions and enjoyable experiences.
              </p>
            </motion.div>
          </div>
        </motion.section>
      )}

      <motion.section
        {...cardAnimation}
        className="relative overflow-hidden rounded-3xl border border-[#156874]/25 bg-gradient-to-br from-[#f3eded]/84 to-[#ede6e6]/85 p-6"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(21,104,116,0.22),transparent_40%)]" />
        <div className="relative z-10">
          <h3 className="font-['Anton'] text-xl font-semibold text-[#174b53]">Trip Overview</h3>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="group neon-soft p-3 transition hover:border-[#156874]/40 hover:shadow-[0_0_20px_rgba(21,104,116,0.2)]">
              <p className="text-[#5f8b95]">Destination</p>
              <p className="mt-1 flex items-center gap-1 font-medium text-[#174b53]"><MapPin size={15} className="text-[#156874]" /> {overview?.destination || "-"}</p>
            </div>
            <div className="group neon-soft p-3 transition hover:border-[#156874]/40 hover:shadow-[0_0_20px_rgba(21,104,116,0.2)]">
              <p className="text-[#5f8b95]">Duration</p>
              <p className="mt-1 flex items-center gap-1 font-medium text-[#174b53]"><CalendarDays size={15} className="text-[#156874]" /> {overview?.duration || "-"}</p>
            </div>
            <div className="group neon-soft p-3 transition hover:border-[#156874]/40 hover:shadow-[0_0_20px_rgba(21,104,116,0.2)]">
              <p className="text-[#5f8b95]">Budget</p>
              <p className="mt-1 flex items-center gap-1 font-medium text-[#174b53]"><IndianRupee size={15} className="text-[#156874]" /> {overview?.budget || "-"}</p>
            </div>
            <div className="group neon-soft p-3 transition hover:border-[#156874]/40 hover:shadow-[0_0_20px_rgba(21,104,116,0.2)]">
              <p className="text-[#5f8b95]">Best Time</p>
              <p className="mt-1 flex items-center gap-1 font-medium text-[#174b53]"><CloudSun size={15} className="text-[#156874]" /> {overview?.bestTime || "-"}</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section {...cardAnimation} transition={{ duration: 0.35, delay: 0.05 }} className="neon-panel p-6">
        <h3 className="font-['Anton'] text-xl font-semibold text-[#174b53]">Itinerary Timeline</h3>
        <div className="relative mt-6 space-y-4 border-l border-[#156874]/35 pl-6">
          {itinerary.map((dayItem, index) => (
            <motion.div 
              key={`${dayItem.day}-${index}`} 
              whileHover={{ x: 6, boxShadow: "0 0 20px rgba(21, 104, 116, 0.15)" }}
              className="neon-soft group relative p-4 transition"
            >
              <span className="absolute -left-[31px] top-5 h-3 w-3 rounded-full bg-[#156874] shadow-[0_0_16px_rgba(21,104,116,0.7)] transition group-hover:scale-125" />
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2a7f8b]">
                <Timer size={14} /> Day {dayItem.day}
              </div>
              <h4 className="font-medium text-[#174b53]">{dayItem.title}</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#3f737d]">
                {(dayItem.activities || []).map((activity, activityIndex) => (
                  <li key={`${activity}-${activityIndex}`}>{activity}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section {...cardAnimation} transition={{ duration: 0.35, delay: 0.1 }} className="neon-panel p-6">
        <h3 className="font-['Anton'] text-xl font-semibold text-[#174b53]">Hotel Recommendations</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {hotels.map((hotel, index) => (
            (() => {
              const destination = overview?.destination || "";
              const bookingHref = isHttpUrl(hotel?.bookingLink) && hotel.bookingLink.includes("makemytrip.com")
                ? hotel.bookingLink
                : buildMakeMyTripHotelLink(destination, hotel?.name || "Hotel");

              return (
            <motion.article 
              key={`${hotel.name}-${index}`} 
              whileHover={{ y: -4 }}
              className="neon-soft group overflow-hidden p-0 transition hover:border-[#156874]/40"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={HOTEL_CARD_IMAGE}
                  alt="Hotel"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#ede6e6]/60 to-transparent" />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-[#174b53]">{hotel.name}</h4>
                <p className="mt-1 text-sm text-[#3f737d]">{hotel.description}</p>
                <div className="mt-3 flex items-center justify-between text-sm text-[#2d6068]">
                  <span className="font-semibold">{hotel.price}</span>
                  <span className="inline-flex items-center gap-1 text-[#2a7f8b]"><Star size={14} className="fill-[#2a7f8b]" /> {hotel.rating}</span>
                </div>
                <a
                  href={bookingHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-xl border border-[#156874]/35 bg-[#156874]/10 px-3 py-1.5 text-xs font-medium text-[#2a7f8b] transition hover:bg-[#156874]/20 hover:border-[#156874]/50"
                >
                  View on MakeMyTrip
                  <ExternalLink size={13} />
                </a>
              </div>
            </motion.article>
              );
            })()
          ))}
        </div>
      </motion.section>

      <motion.section {...cardAnimation} transition={{ duration: 0.35, delay: 0.15 }} className="neon-panel p-6">
        <h3 className="font-['Anton'] text-xl font-semibold text-[#174b53]">Budget Breakdown</h3>
        <div className="mt-4 grid gap-3 text-sm text-[#2d6068] sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(budgetBreakdown).map(([key, value], index) => (
            <motion.div 
              key={key}
              whileHover={{ y: -2 }}
              className="neon-soft group p-3 transition hover:border-[#156874]/40"
              style={{ transitionDelay: `${index * 30}ms` }}
            >
              <p className="capitalize text-[#5f8b95]">{key}</p>
              <p className="mt-1 font-semibold text-[#174b53]">{value}</p>
              <div className="mt-3 h-1.5 rounded-full bg-[#e8e1e1] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(15, totalBudget ? Math.round((Number(String(value).replace(/[^\d.]/g, "")) / totalBudget) * 100) : 40)}%` }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#2a7f8b] to-[#2a7f8b]"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section {...cardAnimation} transition={{ duration: 0.35, delay: 0.2 }} className="neon-panel p-6">
        <h3 className="flex items-center gap-2 font-['Anton'] text-xl font-semibold text-[#174b53]">
          <Lightbulb size={18} className="text-[#156874]" /> Travel Tips
        </h3>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {travelTips.map((tip, index) => (
            <motion.li 
              key={`${tip}-${index}`} 
              whileHover={{ x: 4 }}
              className="neon-soft list-none p-3 text-sm text-[#3f737d] transition hover:border-[#156874]/40 hover:shadow-[0_0_15px_rgba(21,104,116,0.1)]"
            >
              <div className="flex gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#156874]/20 text-xs text-[#156874]">
                  ✓
                </span>
                <span>{tip}</span>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.section>

      <motion.section {...cardAnimation} transition={{ duration: 0.35, delay: 0.25 }} className="neon-panel p-6">
        <h3 className="font-['Anton'] text-xl font-semibold text-[#174b53]">AI Summary</h3>
        <ul className="mt-4 space-y-2 text-sm text-[#3f737d]">
          {summaryPoints.map((point, index) => (
            <li key={`summary-${index}`} className="neon-soft p-3">
              {point}
            </li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
};

export default TripResultView;
