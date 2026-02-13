import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/** 사이드바 네비게이션 항목 */
const NAV_ITEMS = [
  { to: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { to: "/income-sources", label: "수입원 관리", icon: Wallet },
];

/** 앱 전체 레이아웃 (사이드바 + 메인 컨텐츠) */
export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* 사이드바 */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#252b3b] border-r border-white/5 text-slate-300">
        {/* 로고 영역 */}
        <div className="flex h-20 items-center px-8">
          <div className="flex flex-col">
            <span
              className="text-2xl font-bold select-none tracking-tight text-white"
              style={{ fontFamily: '"Moirai One", system-ui' }}
            >
              부수입 매니저
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-indigo-300/80 uppercase mt-0.5">
              Side Income Manager
            </span>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-white/10 text-white shadow-sm"
                    : "hover:bg-white/[0.05] hover:text-white",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110",
                      isActive
                        ? "text-indigo-400"
                        : "text-slate-400 group-hover:text-slate-200",
                    )}
                  />
                  <span className="relative z-10">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute left-0 h-6 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* 하단 정보 */}
        <div className="px-8 py-6 opacity-30 hover:opacity-100 transition-opacity">
          <p className="text-[11px] font-light tracking-wider text-slate-400">
            © 2026 SIM ADMIN
          </p>
        </div>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 ml-64 bg-slate-50/50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
