import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-border bg-white">
        {/* 로고 영역 */}
        <div className="flex h-16 items-center px-6 border-b border-border">
          <span
            className="text-2xl text-foreground select-none"
            style={{ fontFamily: '"Moirai One", system-ui' }}
          >
            부수입 매니저
          </span>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-100 text-foreground"
                    : "text-muted-foreground hover:bg-neutral-50 hover:text-foreground",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* 하단 정보 */}
        <div className="border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Side Income Manager
          </p>
        </div>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 ml-60">
        <Outlet />
      </main>
    </div>
  );
}
