import { useState, useEffect } from "react";
import axios from "axios"; // unchanged: direct calls to the public Codeforces API, no auth needed
import api from "../api/axios"; // our own backend, for storing handle + rating history

import RatingChart from "../components/RatingChart";

function CFTracker() {

    const [handle, setHandle] = useState("");
    const [rating, setRating] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [contestHistory, setContestHistory] = useState([]);

    const [solvedStats, setSolvedStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0 });
    const [tagStats, setTagStats] = useState({});
    const [accuracy, setAccuracy] = useState(0);

    const [targetRating, setTargetRating] = useState(
        Number(localStorage.getItem("cfTarget")) || 1600
    );

    useEffect(() => { localStorage.setItem("cfTarget", targetRating); }, [targetRating]);

    const currentRating = history.length > 0 ? history[history.length - 1].rating : 0;
    const peakRating = history.length > 0 ? Math.max(...history.map(item => item.rating)) : 0;
    const expertProgress = currentRating > 0 ? Math.min((currentRating / targetRating) * 100, 100).toFixed(1) : 0;

    let weeklyGain = 0;
    if (history.length >= 2) {
        const last = history[history.length - 1].rating;
        const prev = history[Math.max(history.length - 8, 0)].rating;
        weeklyGain = last - prev;
    }

    let weakestTopic = "N/A";
    if (Object.keys(tagStats).length > 0) {
        weakestTopic = Object.entries(tagStats).sort((a, b) => a[1] - b[1])[0][0];
    }

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const res = await api.get("/cf-rating");
                if (res.data) {
                    setHistory(res.data.history || []);
                    setHandle(res.data.handle || "");
                }
            } catch (err) { console.log("History load error:", err); }
        };
        loadHistory();
    }, []);

    const fetchRating = async () => {
        if (!handle.trim()) { alert("Enter Codeforces handle"); return; }

        try {
            setLoading(true);

            const res = await axios.get(`https://codeforces.com/api/user.info?handles=${handle.trim()}`);
            const userRating = res.data.result[0].rating || 0;
            setRating(userRating);

            const newHistory = [...history, { rating: userRating, date: new Date() }];

            await api.put("/cf-rating", {
                handle: handle.trim(),
                currentRating: userRating,
                maxRating: Math.max(userRating, ...newHistory.map(h => h.rating)),
                history: newHistory,
            });

            setHistory(newHistory);

            const subRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle.trim()}`);
            const submissions = subRes.data.result;

            const solvedSet = new Set();
            const tagCount = {};
            let accepted = 0;
            let total = submissions.length;
            let easy = 0, medium = 0, hard = 0;

            submissions.forEach(sub => {
                if (sub.verdict === "OK") {
                    accepted++;
                    const key = sub.problem.contestId + "-" + sub.problem.index;
                    if (!solvedSet.has(key)) {
                        solvedSet.add(key);
                        const r = sub.problem.rating || 0;
                        if (r > 0 && r < 1200) easy++;
                        else if (r >= 1200 && r < 1800) medium++;
                        else if (r >= 1800) hard++;
                        sub.problem.tags.forEach(tag => { tagCount[tag] = (tagCount[tag] || 0) + 1; });
                    }
                }
            });

            setAccuracy(((accepted / total) * 100).toFixed(1));
            setSolvedStats({ total: solvedSet.size, easy, medium, hard });
            setTagStats(tagCount);

            const contestRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle.trim()}`);
            setContestHistory(contestRes.data.result.slice(-10));

        } catch (error) {
            alert("Invalid Codeforces handle");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-cloud dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-8 font-nunito">

            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-900 text-ink-900 dark:text-white">
                    Codeforces Tracker
                </h1>
                <p className="text-ink-500 dark:text-slate-400 text-sm sm:text-base font-700">
                    Analyze your competitive programming journey
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                    { label: "Current", value: currentRating },
                    { label: "Peak", value: peakRating },
                    { label: "Target %", value: `${expertProgress}%` },
                    { label: "Weekly", value: `${weeklyGain >= 0 ? "▲" : "▼"} ${weeklyGain}` },
                    { label: "Solved", value: solvedStats.total },
                    { label: "Easy", value: solvedStats.easy },
                    { label: "Medium", value: solvedStats.medium },
                    { label: "Accuracy", value: `${accuracy}%` },
                    { label: "Weak Topic", value: weakestTopic }
                ].map((item, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-3xl p-3 sm:p-4 shadow-card"
                    >
                        <p className="text-[10px] sm:text-xs font-700 text-ink-500 dark:text-slate-400">{item.label}</p>
                        <p className="text-base sm:text-xl font-900 text-ink-900 dark:text-white truncate">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-card">
                <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Enter CF handle"
                        className="px-4 py-2.5 rounded-2xl border-2 border-sky-100 bg-sky-50/60 dark:bg-slate-900 dark:border-white/10 dark:text-white font-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition text-sm sm:text-base"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                    />

                    <button
                        onClick={fetchRating}
                        disabled={loading}
                        className="bg-gradient-to-r from-sky-700 to-coral-600 text-white px-5 py-2.5 rounded-2xl shadow-soft font-900 hover:opacity-90 disabled:opacity-50 text-sm sm:text-base"
                    >
                        {loading ? "Fetching..." : "Fetch Rating"}
                    </button>

                    <div className="flex items-center gap-2 sm:ml-auto">
                        <span className="text-ink-500 dark:text-slate-400 text-xs sm:text-sm font-800">🎯 Target</span>
                        <input
                            type="number"
                            value={targetRating}
                            onChange={(e) => setTargetRating(Number(e.target.value))}
                            className="w-20 sm:w-24 px-3 py-2 rounded-2xl border-2 border-sky-100 bg-sky-50/60 dark:bg-slate-900 dark:border-white/10 dark:text-white font-700 outline-none focus:border-sky-400 transition text-sm"
                        />
                    </div>
                </div>
            </div>

            {history.length > 0 && (
                <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-4 sm:p-6 shadow-card mb-6 sm:mb-8">
                    <h2 className="text-base sm:text-lg font-900 text-ink-900 dark:text-white mb-4">
                        📈 Rating Progress
                    </h2>
                    <RatingChart history={history} target={targetRating} />
                </div>
            )}

            {contestHistory.length > 0 && (
                <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-4 sm:p-6 shadow-card">
                    <h2 className="text-base sm:text-lg font-900 text-ink-900 dark:text-white mb-4">
                        🏆 Recent Contest Performance
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm">
                            <thead className="bg-sky-50 dark:bg-slate-800">
                                <tr>
                                    <th className="p-2.5 sm:p-3 text-left font-800 text-ink-700 dark:text-slate-300">Contest</th>
                                    <th className="p-2.5 sm:p-3 font-800 text-ink-700 dark:text-slate-300">Rank</th>
                                    <th className="p-2.5 sm:p-3 font-800 text-ink-700 dark:text-slate-300">Δ Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contestHistory.map((c, index) => {
                                    const diff = c.newRating - c.oldRating;
                                    return (
                                        <tr key={index} className="border-t border-sky-100 dark:border-white/10 text-center">
                                            <td className="p-2.5 sm:p-3 text-left font-700 text-ink-900 dark:text-white">{c.contestName}</td>
                                            <td className="p-2.5 sm:p-3 font-700 text-ink-900 dark:text-white">{c.rank}</td>
                                            <td className={`p-2.5 sm:p-3 font-900 ${diff >= 0 ? "text-sky-600" : "text-coral-500"}`}>
                                                {diff}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}

export default CFTracker;