import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../context/AuthContext";

const links = [
    { to: "/app", label: "Dashboard" },
    { to: "/app/cf", label: "CF" },
    { to: "/app/gate", label: "GATE" },
    { to: "/app/study", label: "Study" },
    { to: "/app/goals", label: "Goals" },
    { to: "/app/achievements", label: "🏅 Achievements" },
    { to: "/app/profile", label: "Profile" },
];

const FeatherIcon = (props) => (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}><path d="M223.68 32.32a8 8 0 0 0-6-2.32c-45.62 2.06-80.7 14.83-104.27 38a91.31 91.31 0 0 0-16.66 21.9c-24.68-6.13-52.85-1.7-73.11 18.56C1.05 130.85 8 195.42 8 224a8 8 0 0 0 8 8c28.58 0 93.15 6.95 115.54-16.64 20.26-20.26 24.69-48.43 18.56-73.11a91.31 91.31 0 0 0 21.9-16.66c23.17-23.57 35.94-58.65 38-104.27a8 8 0 0 0-2.32-6ZM120.4 203.94A56.28 56.28 0 0 1 90.61 216a72.42 72.42 0 0 1-24.29-3.06 72.14 72.14 0 0 1-3.06-24.29 56.28 56.28 0 0 1 12.06-29.79 40 40 0 1 1 45.08 45.08Z" /></svg>
);
const MenuIcon = (props) => (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}><path d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8ZM40 72h176a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16Zm176 112H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Z" /></svg>
);
const CloseIcon = (props) => (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}><path d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z" /></svg>
);

function Navbar() {
    const { logout } = useAuth();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);

    return (
        <>
            <nav className="
        sticky top-0 z-50
        bg-white/75 dark:bg-slate-900/75 backdrop-blur-md
        border-b border-sky-100 dark:border-white/10
        px-3 sm:px-6 h-16
        flex justify-between items-center
        font-nunito
      ">

                {/* BRAND */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-400 to-coral-400 flex items-center justify-center shadow-soft">
                        <FeatherIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-900 text-ink-900 dark:text-white text-sm">
                        Habitor
                    </span>
                </div>

                {/* DESKTOP LINKS */}
                <div className="hidden md:flex flex-wrap items-center gap-1.5 text-sm font-800">
                    {links.map(({ to, label }) => {
                        const active = pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`
                  px-3 py-1.5 rounded-full whitespace-nowrap transition
                  ${active
                                        ? "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
                                        : "text-ink-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-white/5 hover:text-sky-600"
                                    }
                `}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* DESKTOP RIGHT SIDE */}
                <div className="hidden md:flex gap-3 items-center">
                    <DarkModeToggle />
                    <button
                        onClick={logout}
                        className="text-sm font-800 text-coral-500 hover:text-coral-600 bg-coral-300/10 hover:bg-coral-300/20 px-3 py-1.5 rounded-full transition"
                    >
                        Logout
                    </button>
                </div>

                {/* MOBILE: hamburger only */}
                <button
                    onClick={() => setOpen(true)}
                    className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-ink-700 dark:text-white hover:bg-sky-50 dark:hover:bg-white/10 transition"
                    aria-label="Open menu"
                >
                    <MenuIcon className="w-6 h-6" />
                </button>

            </nav>

            {/* ================= MOBILE DRAWER ================= */}

            {/* backdrop */}
            <div
                onClick={() => setOpen(false)}
                className={`
          md:hidden fixed inset-0 z-[60] bg-ink-900/40 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
            />

            {/* sliding panel */}
            <aside
                className={`
          md:hidden fixed top-0 right-0 z-[70] h-full w-72 max-w-[80%]
          bg-white dark:bg-slate-900
          shadow-card
          flex flex-col
          font-nunito
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
            >
                {/* drawer header */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-sky-100 dark:border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-sky-400 to-coral-400 flex items-center justify-center">
                            <FeatherIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-900 text-ink-900 dark:text-white text-sm">
                            Habitor
                        </span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-ink-500 hover:bg-sky-50 dark:hover:bg-white/10 transition"
                        aria-label="Close menu"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* drawer links */}
                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1.5">
                    {links.map(({ to, label }) => {
                        const active = pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setOpen(false)}
                                className={`
                  px-4 py-3 rounded-2xl font-800 text-sm transition
                  ${active
                                        ? "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
                                        : "text-ink-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-white/5"
                                    }
                `}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* drawer footer */}
                <div className="px-4 py-4 border-t border-sky-100 dark:border-white/10 flex items-center justify-between">
                    <DarkModeToggle />
                    <button
                        onClick={() => { setOpen(false); logout(); }}
                        className="text-sm font-800 text-coral-500 hover:text-coral-600 bg-coral-300/10 hover:bg-coral-300/20 px-4 py-2 rounded-full transition"
                    >
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Navbar;