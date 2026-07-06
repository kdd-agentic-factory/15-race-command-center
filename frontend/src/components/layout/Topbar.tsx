import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Radio, Clock, MapPin, Gauge, ChevronLeft, ChevronRight, Globe, Check } from "lucide-react";
import { RACE_MODULES } from "../../config/raceCommandModules";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "it", label: "IT" },
  { code: "de", label: "DE" },
  { code: "pt", label: "PT" },
  { code: "fr", label: "FR" },
];

export function Topbar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [lap, setLap] = useState(14);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("en");

  const navigate = useNavigate();
  const location = useLocation();

  // Find current module index for arrow navigation
  const allRoutes = RACE_MODULES.map((m) => m.route);
  const currentIndex = allRoutes.indexOf(location.pathname);

  const goPrev = () => {
    if (currentIndex > 0) navigate(allRoutes[currentIndex - 1]);
  };
  const goNext = () => {
    if (currentIndex < allRoutes.length - 1) navigate(allRoutes[currentIndex + 1]);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setLap((l) => l + (Math.random() > 0.97 ? 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handler = () => setLangOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [langOpen]);

  return (
    <header className="relative flex items-center justify-between border-b border-kdd-border bg-kdd-bg px-6 py-3">
      {/* Left section: live indicator + location */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-kdd-green" />
          <span className="font-medium text-kdd-green">LIVE</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-kdd-dim">
          <MapPin className="h-3.5 w-3.5 text-kdd-accent" />
          <span className="font-kdd-sans">Jerez · FP2</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-kdd-dim">
          <Gauge className="h-3.5 w-3.5" />
          <span>
            Lap <strong className="text-kdd-text">{lap}</strong>
          </span>
        </div>
      </div>

      {/* Center: arrow navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={goPrev}
          disabled={currentIndex <= 0}
          className="flex items-center gap-1 rounded-kdd-md px-2 py-1 text-xs text-kdd-dim hover:bg-kdd-hover hover:text-kdd-text disabled:cursor-not-allowed disabled:opacity-30"
          title="Previous module"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <span className="text-[10px] font-kdd-mono text-kdd-dim">
          {currentIndex >= 0
            ? `${currentIndex + 1} / ${allRoutes.length}`
            : "— / —"}
        </span>

        <button
          onClick={goNext}
          disabled={currentIndex < 0 || currentIndex >= allRoutes.length - 1}
          className="flex items-center gap-1 rounded-kdd-md px-2 py-1 text-xs text-kdd-dim hover:bg-kdd-hover hover:text-kdd-text disabled:cursor-not-allowed disabled:opacity-30"
          title="Next module"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Right section: session info + language + clock */}
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-xs text-kdd-dim sm:flex">
          <Radio className="h-3.5 w-3.5" />
          <span className="font-kdd-mono">jerez-fp2-2026-05-03</span>
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLangOpen(!langOpen);
            }}
            className="flex items-center gap-1.5 rounded-kdd-md px-2 py-1 text-xs font-medium text-kdd-dim hover:bg-kdd-hover hover:text-kdd-text"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{LANGUAGES.find((l) => l.code === lang)?.label ?? "EN"}</span>
          </button>

          {langOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-1 w-24 rounded-kdd-lg border border-kdd-border bg-kdd-surface p-1 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setLangOpen(false);
                  }}
                  className={[
                    "flex w-full items-center justify-between rounded-kdd-md px-3 py-1.5 text-xs transition-colors",
                    lang === l.code
                      ? "bg-kdd-accent-dim text-kdd-accent"
                      : "text-kdd-dim hover:bg-kdd-hover hover:text-kdd-text",
                  ].join(" ")}
                >
                  {l.label}
                  {lang === l.code && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clock */}
        <div className="flex items-center gap-1.5 text-sm text-kdd-dim">
          <Clock className="h-3.5 w-3.5 text-kdd-dim" />
          <span className="font-kdd-mono text-xs text-kdd-text">{time}</span>
        </div>
      </div>
    </header>
  );
}
