import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ================= ICONS (inline SVG, no external icon lib needed) =================

const FeatherIcon = (props) => (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}><path d="M223.68 32.32a8 8 0 0 0-6-2.32c-45.62 2.06-80.7 14.83-104.27 38a91.31 91.31 0 0 0-16.66 21.9c-24.68-6.13-52.85-1.7-73.11 18.56C1.05 130.85 8 195.42 8 224a8 8 0 0 0 8 8c28.58 0 93.15 6.95 115.54-16.64 20.26-20.26 24.69-48.43 18.56-73.11a91.31 91.31 0 0 0 21.9-16.66c23.17-23.57 35.94-58.65 38-104.27a8 8 0 0 0-2.32-6ZM120.4 203.94A56.28 56.28 0 0 1 90.61 216a72.42 72.42 0 0 1-24.29-3.06 72.14 72.14 0 0 1-3.06-24.29 56.28 56.28 0 0 1 12.06-29.79 40 40 0 1 1 45.08 45.08Z" /></svg>
);
const ShieldIcon = (props) => (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}><path d="M208 40H48a16 16 0 0 0-16 16v58.78c0 89.61 75.82 118.34 91,124a8 8 0 0 0 5-.35c15.22-5.68 91-34.41 91-124V56a16 16 0 0 0-16-16Z" opacity=".18" /><path d="m173.66 98.34-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 137.37l50.34-50.35a8 8 0 0 1 11.32 11.32Z" /></svg>
);
const EnvelopeIcon = (props) => (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}><path d="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8Zm-16.32 16L128 133.25 48.32 64Z" /></svg>
);
const LockIcon = (props) => (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}><path d="M208 80h-24V56a56 56 0 0 0-112 0v24H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16ZM88 56a40 40 0 0 1 80 0v24H88Z" /></svg>
);
const EyeIcon = (props) => (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}><path d="M128 56C48 56 16 128 16 128s32 72 112 72 112-72 112-72-32-72-112-72Zm0 112a40 40 0 1 1 40-40 40 40 0 0 1-40 40Z" /></svg>
);
const ArrowIcon = (props) => (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}><path d="M221.66 133.66l-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32Z" /></svg>
);
const SmileyIcon = (props) => (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm40 88a12 12 0 1 1-12 12 12 12 0 0 1 12-12Zm-80 0a12 12 0 1 1-12 12 12 12 0 0 1 12-12Zm88.24 40c-7.44 15.09-24 24-40.24 24s-32.8-8.91-40.24-24a8 8 0 0 1 14.32-7.1c4.7 9.5 15.6 15.1 25.92 15.1s21.22-5.6 25.92-15.1a8 8 0 1 1 14.32 7.1Z" /></svg>
);

// ================= AMBIENT BLOBS =================

function GhostBlobs() {
    return (
        <>
            <div className="absolute -top-24 -left-16 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-sky-200/60 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
            <div className="absolute top-1/3 -right-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-coral-300/50 blur-3xl animate-[float_9s_ease-in-out_infinite_1s]" />
            <div className="absolute bottom-0 left-1/4 w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-sky-300/40 blur-3xl animate-[float_7s_ease-in-out_infinite_.5s]" />
        </>
    );
}

// ================= MAIN =================

function Login() {
    const { login, register } = useAuth();
    const location = useLocation();

    const [mode, setMode] = useState(location.state?.mode === "register" ? "register" : "login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (mode === "login") {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Try again.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-cloud font-nunito relative overflow-hidden px-3 sm:px-4 py-6 sm:py-10">

            {/* dot-grid texture */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(#7dd3fc 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                }}
            />

            <GhostBlobs />

            {/* halo + card */}
            <div className="relative z-10 w-full max-w-3xl">

                <Link
                    to="/"
                    className="relative z-10 inline-flex items-center gap-1.5 text-ink-500 hover:text-sky-600 font-800 text-xs sm:text-sm mb-3 sm:mb-4 transition"
                >
                    ← Back to home
                </Link>

                <div className="absolute -inset-3 bg-gradient-to-br from-sky-200 to-coral-200 rounded-5xl blur-2xl opacity-70" />

                <div className="relative bg-white rounded-4xl sm:rounded-5xl shadow-card ring-1 ring-sky-100 overflow-hidden flex flex-col sm:flex-row">

                    {/* ============ ILLUSTRATION ASIDE ============ */}
                    <div className="sm:w-[220px] shrink-0 bg-gradient-to-br from-sky-700 via-sky-700 to-coral-600 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden min-h-[100px] sm:min-h-0">

                        <div
                            className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: "radial-gradient(white 1px, transparent 1px)",
                                backgroundSize: "16px 16px",
                            }}
                        />
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/15" />

                        <div className="relative flex items-center justify-between">
                            <Link
                                to="/"
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition"
                            >
                                <FeatherIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </Link>
                            <span className="text-[9px] sm:text-[10px] font-800 tracking-wide bg-white/20 text-white px-2 py-1 rounded-full">
                                beta
                            </span>
                        </div>

                        <p className="relative text-white font-800 text-xs sm:text-sm leading-snug">
                            Build the study habit you've been imagining.
                            <br className="hidden sm:block" />
                            <span className="text-white/80 font-700"> Small steps, tracked daily.</span>
                        </p>
                    </div>

                    {/* ============ FORM PANEL ============ */}
                    <div className="flex-1 p-5 sm:p-7 md:p-9">

                        <div className="flex items-center justify-between mb-1">
                            <h1 className="text-xl sm:text-2xl font-900 text-ink-900">
                                {mode === "login" ? "Sign in" : "Create account"}
                            </h1>
                            {mode === "login" && (
                                <SmileyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-coral-500" />
                            )}
                        </div>

                        <p className="text-ink-500 font-700 text-xs sm:text-sm mb-5 sm:mb-6">
                            {mode === "login" ? (
                                <>
                                    New here?{" "}
                                    <button
                                        type="button"
                                        onClick={() => { setMode("register"); setError(""); }}
                                        className="text-sky-700 underline"
                                    >
                                        Create an account
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => { setMode("login"); setError(""); }}
                                        className="text-sky-700 underline"
                                    >
                                        Sign in
                                    </button>
                                </>
                            )}
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">

                            {mode === "register" && (
                                <div>
                                    <label className="text-xs font-800 text-ink-700 mb-1 block">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 sm:py-3 rounded-2xl border-2 border-sky-100 bg-sky-50/60 font-700 text-ink-900 text-sm sm:text-base outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-800 text-ink-700 mb-1 block">
                                    Work email
                                </label>
                                <div className="relative">
                                    <EnvelopeIcon className="w-4 h-4 text-sky-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        placeholder="you@studio.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-2xl border-2 border-sky-100 bg-sky-50/60 font-700 text-ink-900 text-sm sm:text-base outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-800 text-ink-700">
                                        Password
                                    </label>
                                    {mode === "login" && (
                                        <button type="button" className="text-xs text-sky-700 font-700">
                                            Forgot?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <LockIcon className="w-4 h-4 text-sky-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showPw ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="w-full pl-11 pr-11 py-2.5 sm:py-3 rounded-2xl border-2 border-sky-100 bg-sky-50/60 font-700 text-ink-900 text-sm sm:text-base outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(v => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-coral-600 bg-coral-300/20 rounded-xl px-3 py-2 text-xs sm:text-sm font-700">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full bg-gradient-to-r from-sky-700 to-coral-600 text-white font-900 py-2.5 sm:py-3 rounded-2xl shadow-soft flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-60 text-sm sm:text-base"
                            >
                                {loading ? "Please wait..." : "Continue"}
                                {!loading && (
                                    <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition" />
                                )}
                            </button>

                        </form>

                    </div>

                </div>

                {/* SOC2-style trust chip */}
                <div className="relative -mt-4 ml-3 sm:ml-6 inline-flex items-center gap-2 bg-white rounded-full shadow-card px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-800 text-ink-700 animate-[float_6s_ease-in-out_infinite]">
                    <ShieldIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500" />
                    Your data stays yours
                </div>

            </div>

            {/* footer joke, matching brand voice */}
            <div className="absolute bottom-2 sm:bottom-4 text-ink-500 text-xs sm:text-sm font-700 tracking-wide">
                Made by <span className="font-900 text-ink-900">CodingLagg</span>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-14px) rotate(1.5deg); }
                }
            `}</style>

        </div>
    );
}

export default Login;