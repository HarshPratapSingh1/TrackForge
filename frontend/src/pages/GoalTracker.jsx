import { useEffect, useState } from "react";
import api from "../api/axios";

function launchConfetti() {
    const duration = 1200;
    const end = Date.now() + duration;
    const interval = setInterval(() => {
        if (Date.now() > end) { clearInterval(interval); return; }
        window.confetti({
            particleCount: 35,
            spread: 70,
            startVelocity: 25,
            origin: { x: Math.random(), y: 0.6 }
        });
    }, 220);
}

function ProgressRing({ percent }) {
    const radius = 30;
    const stroke = 6;
    const normalizedRadius = radius - stroke;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <svg width="72" height="72">
            <circle stroke="#e0f2fe" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx="36" cy="36" />
            <circle
                stroke="url(#goalGrad)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset: offset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="36"
                cy="36"
            />
            <defs>
                <linearGradient id="goalGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
            </defs>
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-ink-900 dark:fill-white" fontSize="13" fontWeight="900">
                {percent}%
            </text>
        </svg>
    );
}

function GoalTracker() {

    const [title, setTitle] = useState("");
    const [target, setTarget] = useState("");
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    const loadGoals = () => {
        api.get("/goals")
            .then(res => setGoals(res.data.map(g => ({ ...g, id: g._id }))))
            .catch(err => console.error("GoalTracker load error:", err));
    };

    useEffect(() => { loadGoals(); }, []);

    const addGoal = async () => {
        if (!title || !target) { alert("Fill all fields"); return; }
        try {
            setLoading(true);
            await api.post("/goals", { title: title.trim(), target: Number(target) });
            setTitle(""); setTarget("");
            loadGoals();
        } catch { alert("Failed to create goal"); }
        setLoading(false);
    };

    const updateProgress = async (id, value, targetVal) => {
        const newValue = Math.min(Number(value), targetVal);
        const completed = newValue >= targetVal;

        await api.patch(`/goals/${id}`, {
            progress: newValue,
            completed,
            completedAt: completed ? new Date() : null
        });

        loadGoals();

        if (completed) {
            setRemovingId(id);
            launchConfetti();
            setTimeout(() => setRemovingId(null), 1500);
        }
    };

    const visibleGoals = goals.filter(g => !g.completed || g.id === removingId);

    return (
        <div className="min-h-screen px-3 sm:px-6 py-4 sm:py-6 bg-cloud dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-nunito">

            <div className="mb-5 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-900 text-ink-900 dark:text-white">🎯 Goal Tracker</h1>
                <p className="text-ink-500 dark:text-slate-400 mt-1 text-sm sm:text-base font-700">
                    Track long-term study & CP goals
                </p>
            </div>

            <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-4 sm:p-5 mb-5 sm:mb-6 shadow-card">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                        placeholder="Goal title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="bg-sky-50/60 dark:bg-slate-800 border-2 border-sky-100 dark:border-white/10 p-2.5 rounded-2xl text-ink-900 dark:text-white font-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition text-sm sm:text-base"
                    />
                    <input
                        type="number"
                        placeholder="Target"
                        value={target}
                        onChange={e => setTarget(e.target.value)}
                        className="bg-sky-50/60 dark:bg-slate-800 border-2 border-sky-100 dark:border-white/10 p-2.5 rounded-2xl text-ink-900 dark:text-white font-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition text-sm sm:text-base"
                    />
                    <button
                        onClick={addGoal}
                        disabled={loading}
                        className="bg-gradient-to-r from-sky-700 to-coral-600 rounded-2xl font-900 py-2.5 text-white shadow-soft text-sm sm:text-base"
                    >
                        {loading ? "Creating..." : "Add Goal"}
                    </button>
                </div>
            </div>

            {visibleGoals.length === 0 && (
                <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-8 text-center text-ink-500 dark:text-slate-400 font-700 shadow-card">
                    🚀 No active goals. Create your next milestone!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                {visibleGoals.map(goal => {
                    const percent = Math.min(Math.round((goal.progress / goal.target) * 100), 100);

                    return (
                        <div
                            key={goal.id}
                            className={`bg-white dark:bg-white/5 ring-1 rounded-4xl p-4 sm:p-5 shadow-card transition-all duration-700
                            ${goal.completed ? "ring-sky-400/40 scale-[1.01]" : "ring-sky-100 dark:ring-white/10"}
                            ${removingId === goal.id ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}
                        `}>

                            <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <div className="min-w-0">
                                    <h3 className="font-900 text-ink-900 dark:text-white text-base sm:text-lg truncate">{goal.title}</h3>
                                    <p className="text-xs sm:text-sm font-700 text-ink-500 dark:text-slate-400">
                                        {goal.progress} / {goal.target}
                                    </p>
                                </div>
                                <ProgressRing percent={percent} />
                            </div>

                            <div className="w-full h-2 bg-sky-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                                <div
                                    className="h-full bg-gradient-to-r from-sky-500 to-coral-500 transition-all duration-500"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>

                            <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-800
                                ${goal.completed
                                    ? "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"
                                    : percent < 40
                                        ? "bg-coral-300/20 text-coral-600"
                                        : percent < 75
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"}
                            `}>
                                {goal.completed ? "Completed 🎉" :
                                    percent < 40 ? "Behind" :
                                        percent < 75 ? "In Progress" : "Almost There"}
                            </span>

                            {!goal.completed && (
                                <input
                                    type="range"
                                    min="0"
                                    max={goal.target}
                                    value={goal.progress}
                                    onChange={e => updateProgress(goal.id, e.target.value, goal.target)}
                                    className="w-full mt-4 accent-sky-500"
                                />
                            )}
                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default GoalTracker;