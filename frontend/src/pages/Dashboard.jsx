import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../api/axios";
import { achievementList } from "../utils/achievementRules";

// ================= ICONS =================
const FireIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M183.89 153.34a56 56 0 0 1-111.78 0c0-53 39.87-95.5 55.9-113.34a8 8 0 0 1 12 0c16 17.84 55.88 60.36 55.88 113.34Z" /></svg>;
const TrophyIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M232 64h-24V56a16 16 0 0 0-16-16H64a16 16 0 0 0-16 16v8H24a16 16 0 0 0-16 16v8a48.05 48.05 0 0 0 41.34 47.53A80.15 80.15 0 0 0 120 191.61v24.79H88a8 8 0 0 0 0 16h80a8 8 0 0 0 0-16h-32v-24.79a80.15 80.15 0 0 0 70.66-72.08A48.05 48.05 0 0 0 248 88v-8a16 16 0 0 0-16-16Z" /></svg>;
const BookIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M224 48H144a24 24 0 0 0-16 6.24A24 24 0 0 0 112 48H32a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h80.66a8 8 0 0 0 6-2.62A8 8 0 0 0 128 216V80a8 8 0 0 1 8-8h88Z" /></svg>;
const StarIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="m234.5 114.38-45.1 39.36 13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31-51.11 31a16 16 0 0 1-23.84-17.34l13.51-58.6-45.1-39.36a16 16 0 0 1 9.11-28.06l59.46-5.15 23.21-55.36a16 16 0 0 1 29.52 0l23.21 55.36 59.46 5.15a16 16 0 0 1 9.11 28.06Z" /></svg>;

function Dashboard() {

    const [streak, setStreak] = useState({ current: 0, best: 0, lastDate: null });
    const [weeklyHours, setWeeklyHours] = useState(0);
    const [gateProgress, setGateProgress] = useState(0);
    const [cfRating, setCfRating] = useState(0);

    const [planner, setPlanner] = useState({ remaining: 0, perDay: 0, status: "" });
    const [goalSummary, setGoalSummary] = useState({ total: 0, completed: 0, active: 0, progress: 0 });

    const WEEKLY_TARGET = 20;

    const updateAchievements = async (stats) => {
        const unlocked = {};
        achievementList.forEach(a => { unlocked[a.id] = a.check(stats); });
        try { await api.put("/achievements", unlocked); } catch (err) { console.error("Achievement update failed:", err); }
    };

    useEffect(() => {

        const loadDashboard = async () => {

            const today = new Date();

            try {
                let currentStreak = 0;
                let bestStreak = 0;

                const streakRes = await api.get("/study-logs/streak");
                if (streakRes.data) {
                    currentStreak = streakRes.data.currentStreak || 0;
                    bestStreak = streakRes.data.bestStreak || 0;
                    setStreak({ current: currentStreak, best: bestStreak, lastDate: streakRes.data.lastDate });
                }

                const logsRes = await api.get("/study-logs");
                let weeklyTotal = 0;
                logsRes.data.forEach(log => {
                    if (!log.date) return;
                    const logDate = new Date(log.date);
                    const diff = (today - logDate) / (1000 * 60 * 60 * 24);
                    if (diff <= 7) weeklyTotal += log.hours;
                });
                setWeeklyHours(weeklyTotal);

                const remaining = Math.max(WEEKLY_TARGET - weeklyTotal, 0);
                const day = today.getDay() || 7;
                const daysLeft = Math.max(7 - day + 1, 1);
                const perDay = Math.ceil(remaining / daysLeft);
                let status = "On Track";
                if (remaining === 0) status = "Completed";
                else if (perDay <= 2) status = "Ahead";
                else if (perDay >= 5) status = "Behind";
                setPlanner({ remaining, perDay, status });

                let done = 0, curTotal = 0;
                const gateRes = await api.get("/gate-progress");
                if (gateRes.data) {
                    Object.values(gateRes.data).forEach(subject =>
                        Object.values(subject).forEach(topic =>
                            Object.values(topic).forEach(val => { curTotal++; if (val === true) done++; })
                        )
                    );
                }
                const percent = curTotal ? Math.round((done / curTotal) * 100) : 0;
                setGateProgress(percent);

                const cfRes = await api.get("/cf-rating");
                if (cfRes.data?.history?.length) setCfRating(cfRes.data.history.at(-1).rating);

                const goalsRes = await api.get("/goals");
                const goalsList = goalsRes.data;
                let total = goalsList.length, completed = 0, progressSum = 0;
                goalsList.forEach(g => {
                    if (g.completed) completed++;
                    progressSum += Math.min(Math.round((g.progress / g.target) * 100), 100);
                });
                const avgProgress = total ? Math.round(progressSum / total) : 0;
                setGoalSummary({ total, completed, active: total - completed, progress: avgProgress });

                updateAchievements({ streak: currentStreak, weeklyHours: weeklyTotal, gateProgress: percent, completedGoals: completed });

            } catch (err) {
                console.log(err);
            }
        };

        loadDashboard();

    }, []);

    const exportPDF = () => {
        const pdf = new jsPDF();
        pdf.text("CP + GATE Progress Report", 14, 18);
        autoTable(pdf, {
            startY: 30,
            head: [["Metric", "Value"]],
            body: [
                ["Current Streak", streak.current],
                ["Best Streak", streak.best],
                ["Weekly Hours", weeklyHours],
                ["Goals Completed", `${goalSummary.completed}/${goalSummary.total}`],
                ["GATE Progress", `${gateProgress}%`],
                ["Codeforces", cfRating]
            ],
            headStyles: { fillColor: [3, 105, 161] } // sky-700
        });
        pdf.save("progress_report.pdf");
    };

    return (
        <div className="min-h-screen bg-cloud dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-6 sm:py-10 font-nunito transition-colors">

            <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6 sm:space-y-10">

                {/* HEADER */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-900 text-ink-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-ink-500 dark:text-slate-400 mt-1 text-sm sm:text-base font-700">
                            Track your consistency & performance
                        </p>
                    </div>

                    <button
                        onClick={exportPDF}
                        className="bg-gradient-to-r from-sky-700 to-coral-600 hover:opacity-90 transition px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-white font-900 shadow-soft text-sm sm:text-base"
                    >
                        📄 Export Report
                    </button>
                </div>

                {/* KPI GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {[
                        { label: "Current Streak", value: streak.current, Icon: FireIcon, tint: "from-coral-400 to-coral-600" },
                        { label: "Best Streak", value: streak.best, Icon: TrophyIcon, tint: "from-sky-400 to-sky-600" },
                        { label: "Weekly Study", value: `${weeklyHours} hrs`, Icon: BookIcon, tint: "from-sky-500 to-coral-500" },
                        { label: "Codeforces", value: cfRating, Icon: StarIcon, tint: "from-coral-500 to-sky-600" }
                    ].map((card, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-4 sm:p-6 hover:-translate-y-0.5 transition shadow-card"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-ink-500 dark:text-slate-400 text-xs sm:text-sm font-700">{card.label}</p>
                                    <p className="text-xl sm:text-3xl font-900 text-ink-900 dark:text-white mt-1 sm:mt-2">{card.value}</p>
                                </div>
                                <div className={`bg-gradient-to-br ${card.tint} p-2 sm:p-3 rounded-2xl shadow-soft shrink-0`}>
                                    <card.Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MIDDLE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                    <div className="lg:col-span-2 bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-5 sm:p-7 shadow-card">
                        <h2 className="text-ink-900 dark:text-white text-base sm:text-lg font-900 mb-4 sm:mb-6">
                            📅 Weekly Planner
                        </h2>

                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <p className="text-ink-500 dark:text-slate-400 text-xs sm:text-sm font-700">Remaining</p>
                                <p className="text-lg sm:text-xl font-900 text-ink-900 dark:text-white">{planner.remaining} hrs</p>
                            </div>
                            <div>
                                <p className="text-ink-500 dark:text-slate-400 text-xs sm:text-sm font-700">Daily Target</p>
                                <p className="text-lg sm:text-xl font-900 text-ink-900 dark:text-white">{planner.perDay} hrs</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-ink-500 dark:text-slate-400 text-xs sm:text-sm font-700">Status</p>
                                <span className={`inline-block mt-1 px-4 py-1 rounded-full text-xs sm:text-sm font-800
                                    ${planner.status === "Completed" && "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"}
                                    ${planner.status === "Ahead" && "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"}
                                    ${planner.status === "Behind" && "bg-coral-300/20 dark:bg-coral-500/20 text-coral-600 dark:text-coral-400"}
                                    ${planner.status === "On Track" && "bg-coral-300/10 dark:bg-yellow-500/20 text-ink-700 dark:text-yellow-400"}
                                `}>
                                    {planner.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-5 sm:p-7 shadow-card">
                        <h2 className="text-ink-900 dark:text-white text-base sm:text-lg font-900 mb-3 sm:mb-4">
                            🎯 Goals Progress
                        </h2>
                        <p className="text-2xl sm:text-3xl font-900 text-ink-900 dark:text-white">
                            {goalSummary.completed}/{goalSummary.total}
                        </p>
                        <div className="mt-4 h-3 bg-sky-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-sky-500 to-coral-500 rounded-full transition-all"
                                style={{ width: `${goalSummary.progress}%` }}
                            />
                        </div>
                        <p className="text-ink-500 dark:text-slate-400 mt-2 text-xs sm:text-sm font-700">
                            {goalSummary.progress}% completed
                        </p>
                    </div>

                </div>

                {/* GATE */}
                <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-5 sm:p-7 shadow-card">
                    <h2 className="text-ink-900 dark:text-white text-base sm:text-lg font-900 mb-3">
                        🎯 GATE Progress
                    </h2>
                    <p className="text-3xl sm:text-4xl font-900 text-ink-900 dark:text-white">{gateProgress}%</p>
                    <div className="mt-4 h-3 bg-sky-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-sky-700 to-coral-600 rounded-full transition-all"
                            style={{ width: `${gateProgress}%` }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;