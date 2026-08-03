import { Link } from "react-router-dom";

// ================= ICONS =================
const FeatherIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M223.68 32.32a8 8 0 0 0-6-2.32c-45.62 2.06-80.7 14.83-104.27 38a91.31 91.31 0 0 0-16.66 21.9c-24.68-6.13-52.85-1.7-73.11 18.56C1.05 130.85 8 195.42 8 224a8 8 0 0 0 8 8c28.58 0 93.15 6.95 115.54-16.64 20.26-20.26 24.69-48.43 18.56-73.11a91.31 91.31 0 0 0 21.9-16.66c23.17-23.57 35.94-58.65 38-104.27a8 8 0 0 0-2.32-6ZM120.4 203.94A56.28 56.28 0 0 1 90.61 216a72.42 72.42 0 0 1-24.29-3.06 72.14 72.14 0 0 1-3.06-24.29 56.28 56.28 0 0 1 12.06-29.79 40 40 0 1 1 45.08 45.08Z" /></svg>;
const ArrowIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M221.66 133.66l-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32Z" /></svg>;
const CheckIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" /></svg>;
const TimerIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24Zm8 104a8 8 0 0 1-8 8H80a8 8 0 0 1 0-16h40V72a8 8 0 0 1 16 0Z" /></svg>;
const TargetIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24Zm0 168a64 64 0 1 1 64-64 64.07 64.07 0 0 1-64 64Zm0-96a32 32 0 1 0 32 32 32 32 0 0 0-32-32Z" /></svg>;
const StarIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="m234.5 114.38-45.1 39.36 13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31-51.11 31a16 16 0 0 1-23.84-17.34l13.51-58.6-45.1-39.36a16 16 0 0 1 9.11-28.06l59.46-5.15 23.21-55.36a16 16 0 0 1 29.52 0l23.21 55.36 59.46 5.15a16 16 0 0 1 9.11 28.06Z" /></svg>;
const TrophyIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M232 64h-24V56a16 16 0 0 0-16-16H64a16 16 0 0 0-16 16v8H24a16 16 0 0 0-16 16v8a48.05 48.05 0 0 0 41.34 47.53A80.15 80.15 0 0 0 120 191.61v24.79H88a8 8 0 0 0 0 16h80a8 8 0 0 0 0-16h-32v-24.79a80.15 80.15 0 0 0 70.66-72.08A48.05 48.05 0 0 0 248 88v-8a16 16 0 0 0-16-16Z" /></svg>;

function GhostBlobs() {
    return (
        <>
            <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-sky-200/50 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
            <div className="absolute top-40 -right-20 w-80 h-80 rounded-full bg-coral-300/40 blur-3xl animate-[float_9s_ease-in-out_infinite_1s]" />
        </>
    );
}

function Landing() {
    return (
        <div className="bg-cloud font-nunito text-ink-900 overflow-x-hidden">

            {/* ================= NAV ================= */}
            <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-sky-100 px-4 sm:px-6 h-16 flex justify-between items-center max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-400 to-coral-400 flex items-center justify-center shadow-soft">
                        <FeatherIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-900 text-sm">Habitor</span>
                </div>

                <Link
                    to="/app"
                    className="bg-ink-900 hover:bg-sky-600 transition text-white font-900 text-sm px-4 sm:px-5 py-2 rounded-full flex items-center gap-1.5"
                >
                    Sign in
                    <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
            </nav>

            {/* ================= HERO ================= */}
            <section className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-24">

                <div
                    className="absolute inset-0 opacity-30 pointer-events-none -z-10"
                    style={{ backgroundImage: "radial-gradient(#7dd3fc 1px, transparent 1px)", backgroundSize: "22px 22px" }}
                />
                <GhostBlobs />

                <div className="text-center max-w-2xl mx-auto">

                    <span className="inline-flex items-center gap-1.5 bg-white shadow-card rounded-full px-4 py-1.5 text-xs sm:text-sm font-800 text-ink-700 mb-6">
                        <StarIcon className="w-3.5 h-3.5 text-coral-500" />
                        Now with a live study timer
                    </span>

                    <h1 className="text-3xl sm:text-5xl font-900 leading-tight tracking-tight mb-5">
                        Track your <span className="text-sky-600">GATE prep</span> and
                        <span className="relative inline-block ml-2">
                            CP grind
                            <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 120 8" fill="none">
                                <path d="M2 6C20 2 40 2 60 4C80 6 100 2 118 3" stroke="#fb7185" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </span>{" "}
                        in one place.
                    </h1>

                    <p className="text-ink-500 font-700 text-sm sm:text-base mb-8">
                        Study logs, Codeforces ratings, syllabus progress, and goals — all tracked,
                        all visualized, no spreadsheets required.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
                        <Link
                            to="/app"
                            state={{ mode: "register" }}
                            className="w-full sm:w-auto bg-gradient-to-r from-sky-700 to-coral-600 text-white font-900 px-6 py-3 rounded-2xl shadow-soft flex items-center justify-center gap-2"
                        >
                            Start tracking free
                            <ArrowIcon className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/app"
                            state={{ mode: "login" }}
                            className="w-full sm:w-auto bg-white ring-1 ring-sky-200 text-ink-900 font-900 px-6 py-3 rounded-2xl"
                        >
                            I already have an account
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-700 text-ink-500">
                        {["Free forever", "No card needed", "Your data stays yours"].map(t => (
                            <span key={t} className="flex items-center gap-1.5">
                                <CheckIcon className="w-4 h-4 text-sky-500" />
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FEATURE GRID ================= */}
            <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">

                <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
                    <span className="inline-block bg-sky-100 text-sky-700 text-xs font-800 px-3 py-1 rounded-full mb-4">
                        Why Habitor
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-900 mb-3">
                        Everything your prep actually needs.
                    </h2>
                    <p className="text-ink-500 font-700 text-sm sm:text-base">
                        Built for GATE aspirants who also grind competitive programming.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {[
                        {
                            Icon: TimerIcon,
                            tint: "from-sky-400 to-sky-600",
                            title: "Live study timer",
                            desc: "Start a session, stop when you're done — hours get logged automatically, no manual entry needed."
                        },
                        {
                            Icon: TargetIcon,
                            tint: "from-coral-400 to-coral-600",
                            title: "GATE syllabus tracker",
                            desc: "Subject-by-subject progress with expected marks and rank estimates based on what you've actually covered."
                        },
                        {
                            Icon: StarIcon,
                            tint: "from-sky-500 to-coral-500",
                            title: "Codeforces sync",
                            desc: "Pull your rating history, solved problems, and weak tags straight from your CF handle."
                        },
                        {
                            Icon: TrophyIcon,
                            tint: "from-coral-500 to-sky-600",
                            title: "Streaks that matter",
                            desc: "Daily and best streaks tracked server-side, so there's no gaming the system client-side."
                        },
                        {
                            Icon: CheckIcon,
                            tint: "from-sky-600 to-sky-400",
                            title: "Personal goals",
                            desc: "Set targets beyond the syllabus — problems solved, mock tests taken, anything measurable."
                        },
                        {
                            Icon: FeatherIcon,
                            tint: "from-coral-600 to-coral-400",
                            title: "One dashboard",
                            desc: "Every metric — study hours, GATE %, CF rating, goals — in a single glance, no tab-switching."
                        },
                    ].map((f, i) => (
                        <div
                            key={i}
                            className="bg-white ring-1 ring-sky-100 rounded-4xl p-5 sm:p-6 shadow-card hover:-translate-y-1 transition"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.tint} flex items-center justify-center mb-4 shadow-soft`}>
                                <f.Icon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-900 text-base sm:text-lg mb-1.5">{f.title}</h3>
                            <p className="text-ink-500 font-700 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
                <div className="relative bg-white rounded-5xl ring-1 ring-sky-100 shadow-card p-8 sm:p-14 text-center overflow-hidden">

                    <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-sky-200/40 blur-3xl" />
                    <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-coral-300/40 blur-3xl" />

                    <div className="relative">
                        <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br from-sky-400 to-coral-400 flex items-center justify-center shadow-soft mb-5">
                            <FeatherIcon className="w-6 h-6 text-white" />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-900 mb-3">
                            Your next study session starts now.
                        </h2>
                        <p className="text-ink-500 font-700 text-sm sm:text-base mb-7">
                            Free to start, no card needed, takes 30 seconds to set up.
                        </p>

                        <Link
                            to="/app"
                            state={{ mode: "register" }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-700 to-coral-600 text-white font-900 px-6 sm:px-7 py-3 rounded-2xl shadow-soft"
                        >
                            Create your account
                            <ArrowIcon className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="bg-ink-900 text-sky-50 py-8">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm font-700">
                    <span>© 2026 Habitor. Made by CodingLagg.</span>
                    <span className="text-sky-300">Built with React, Node.js, Express, MongoDB.</span>
                </div>
            </footer>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-14px) rotate(1.5deg); }
                }
            `}</style>

        </div>
    );
}

export default Landing;