import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  SquaresFour,
  Wallet,
  List,
  X,
  SignOut,
  User,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

/** 사이드바 네비게이션 항목 */
const NAV_ITEMS = [
  { to: "/dashboard", label: "대시보드", icon: SquaresFour },
  { to: "/income-sources", label: "수입원 관리", icon: Wallet },
];

/** 네비게이션 링크 공통 컴포넌트 */
function NavItem({
  to,
  label,
  icon: Icon,
  collapsed = false,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-300",
          collapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3",
          isActive
            ? "bg-white/10 text-white shadow-sm"
            : "hover:bg-white/[0.05] hover:text-white",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            weight={isActive ? "fill" : "regular"}
            className={cn(
              "transition-transform duration-300 group-hover:scale-110 shrink-0",
              isActive
                ? "text-white"
                : "text-slate-400 group-hover:text-slate-200",
            )}
          />
          {!collapsed && <span className="relative z-10">{label}</span>}
          {isActive && (
            <motion.div
              layoutId="active-nav-indicator"
              className="absolute left-0 h-6 w-1 rounded-r-full bg-slate-300 shadow-[0_0_12px_rgba(203,213,225,0.4)]"
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
  );
}

/** 사이드바 콘텐츠 (로고 + 네비게이션 + 하단 정보) */
function SidebarContent({
  collapsed = false,
  onNavClick,
}: {
  collapsed?: boolean;
  onNavClick?: () => void;
}) {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-full flex-col">
      {/* 로고 영역 */}
      <div
        className={cn(
          "flex h-20 shrink-0 items-center",
          collapsed ? "justify-center px-2" : "px-8",
        )}
      >
        {collapsed ? (
          <span
            className="text-xl font-bold select-none text-white"
            style={{ fontFamily: '"Moirai One", system-ui' }}
          >
            부
          </span>
        ) : (
          <div className="flex flex-col">
            <span
              className="text-2xl font-bold select-none tracking-tight text-white"
              style={{ fontFamily: '"Moirai One", system-ui' }}
            >
              부수입 매니저
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-slate-400 uppercase mt-0.5">
              Side Income Manager
            </span>
          </div>
        )}
      </div>

      {/* 네비게이션 */}
      <nav
        className={cn(
          "flex-1 space-y-1.5 py-6 overflow-y-auto",
          collapsed ? "px-2" : "px-4",
        )}
      >
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavItem
            key={to}
            to={to}
            label={label}
            icon={icon}
            collapsed={collapsed}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* 하단 정보 (유저 프로필 및 로그아웃) */}
      <div
        className={cn(
          "mt-auto shrink-0 border-t border-white/10 py-4",
          collapsed ? "px-2" : "px-4",
        )}
      >
        {!collapsed && user ? (
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                <User size={16} weight="fill" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-slate-200">
                  {user.name}
                </span>
                <span className="truncate text-xs text-slate-400">
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="p-2 shrink-0 text-slate-400 hover:text-white transition-colors"
              title="로그아웃"
            >
              <SignOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="로그아웃"
            >
              <SignOut size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** 앱 전체 레이아웃 (반응형 사이드바 + 메인 컨텐츠) */
export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex min-h-screen w-full">
      {/* ===== 모바일 상단 헤더 (md 미만에서만 표시) ===== */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-slate-900 px-4 md:hidden">
        <span
          className="text-lg font-bold select-none text-white"
          style={{ fontFamily: '"Moirai One", system-ui' }}
        >
          부수입 매니저
        </span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 transition-colors"
          aria-label="메뉴 열기"
        >
          {isMobileMenuOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </header>

      {/* ===== 모바일 드로어 오버레이 (md 미만) ===== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* 슬라이드 드로어 */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-300 md:hidden"
            >
              <SidebarContent onNavClick={() => setIsMobileMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== 태블릿 축소 사이드바 (md ~ lg 사이에서 표시) ===== */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden md:flex lg:hidden w-16 flex-col bg-slate-900 border-r border-white/5 text-slate-300">
        <SidebarContent collapsed />
      </aside>

      {/* ===== 데스크탑 풀 사이드바 (lg 이상에서 표시) ===== */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden lg:flex w-64 flex-col bg-slate-900 border-r border-white/5 text-slate-300">
        <SidebarContent />
      </aside>

      {/* ===== 메인 컨텐츠 영역 ===== */}
      <main
        className={cn(
          "flex-1 flex flex-col w-full min-w-0 overflow-x-hidden bg-slate-50/50 min-h-screen",
          "pt-14 md:pt-0", // 모바일: 상단 헤더 높이만큼 패딩
          "md:ml-16 lg:ml-64", // 태블릿: 축소 사이드바, 데스크탑: 풀 사이드바
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
