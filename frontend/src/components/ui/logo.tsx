import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

export function Logo({ className, collapsed = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-[34px] w-[34px] shrink-0"
        fill="none"
      >
        <defs>
          {/* Note Document Layer Gradient */}
          <linearGradient
            id="logo-back"
            x1="4"
            y1="6"
            x2="20"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6366f1" /> {/* Indigo 500 */}
            <stop offset="1" stopColor="#4338ca" /> {/* Indigo 700 */}
          </linearGradient>
          {/* Income/Chart Layer Gradient */}
          <linearGradient
            id="logo-front"
            x1="12"
            y1="10"
            x2="28"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#10b981" /> {/* Emerald 500 */}
            <stop offset="1" stopColor="#0ea5e9" /> {/* Sky 500 */}
          </linearGradient>
          <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="-1"
              dy="3"
              stdDeviation="2.5"
              floodColor="#020617"
              floodOpacity="0.4"
            />
          </filter>
        </defs>

        {/* Back Card: Document/Note Metaphor */}
        <path
          d="M5 9c0-1.6 1.4-3 3-3h6c1.6 0 3 1.4 3 3v11c0 1.6-1.4 3-3 3H8c-1.6 0-3-1.4-3-3V9z"
          fill="url(#logo-back)"
        />
        {/* Document lines */}
        <path
          d="M8 10h5"
          stroke="white"
          strokeOpacity="0.4"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 14h3"
          stroke="white"
          strokeOpacity="0.4"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Front Card: Chart/Growth Metaphor */}
        <path
          d="M11 13c0-1.6 1.4-3 3-3h10c1.6 0 3 1.4 3 3v11c0 1.6-1.4 3-3 3H14c-1.6 0-3-1.4-3-3v-11z"
          fill="url(#logo-front)"
          filter="url(#logo-shadow)"
        />
        {/* Trend line and point */}
        <path
          d="M15 21l3-4.5 2 1.5 4.5-5.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="25" cy="12.5" r="2" fill="white" />
      </svg>

      {!collapsed && (
        <div className="flex flex-col justify-center translate-y-[1.px]">
          <span className="text-[20px] font-extrabold tracking-tight leading-none text-white drop-shadow-sm">
            수입노트
          </span>
          <span className="text-[10px] font-bold tracking-[0.24em] text-emerald-400 uppercase mt-[2px] opacity-90">
            Income Note
          </span>
        </div>
      )}
    </div>
  );
}
