import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import StudyHeatmap from "../components/StudyHeatmap";
import SkeletonCard from "../components/SkeletonCard";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

// ================= ICONS =================
const PlayIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82 16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128Z" /></svg>;
const PauseIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M216 48v160a16 16 0 0 1-16 16h-40a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h40a16 16 0 0 1 16 16ZM96 32H56a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h40a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16Z" /></svg>;
const CheckIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" /></svg>;

// ================= TIMER FORMAT =================
function formatTime(totalSeconds) {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

// ================= LIVE STUDY TIMER =================
function StudyTimer({ subjects, onLogged }) {

    const [subject, setSubject] = useState("OS");
    const [running, setRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [showTopicPrompt, setShowTopicPrompt] = useState(false);
    const [topic, setTopic] = useState("");
    const [saving, setSaving] = useState(false);

    const intervalRef = useRef(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [running]);

    const start = () => {
        setSeconds(0);
        setRunning(true);
    };

    const stop = () => {
        setRunning(false);
        if (seconds < 60) {
            // too short to bother logging — just reset silently
            setSeconds(0);
            return;
        }
        setShowTopicPrompt(true);
    };

    const confirmLog = async () => {
        if (!topic.trim()) { alert("What did you study?"); return; }

        setSaving(true);
        try {
            const hours = Number((seconds / 3600).toFixed(2));
            await api.post("/study-logs", { subject, hours, topic: topic.trim() });
            setShowTopicPrompt(false);
            setTopic("");
            setSeconds(0);
            onLogged();
        } catch (err) {
            console.error("Timer log failed:", err);
            alert(err.response?.data?.error || "Failed to save session.");
        }
        setSaving(false);
    };

    const discard = () => {
        setShowTopicPrompt(false);
        setTopic("");
        setSeconds(0);
    };

    return (
        <div className="relative bg-gradient-to-br from-sky-700 to-coral-600 rounded-4xl p-5 sm:p-7 mb-5 shadow-soft overflow-hidden">

            <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "18px 18px" }}
            />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5">

                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-3xl sm:text-5xl font-900 text-white tabular-nums tracking-tight">
                        {formatTime(seconds)}
                    </div>

                    {!running && (
                        <select
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            disabled={running}
                            className="bg-white/20 backdrop-blur text-white font-800 text-sm px-3 py-2 rounded-xl border-2 border-white/30 outline-none"
                        >
                            {subjects.map(s => <option key={s} className="text-ink-900">{s}</option>)}
                        </select>
                    )}

                    {running && (
                        <span className="text-white/90 font-800 text-sm bg-white/15 px-3 py-1.5 rounded-full">
                            {subject}
                        </span>
                    )}
                </div>

                <button
                    onClick={running ? stop : start}
                    className="group flex items-center gap-2 bg-white text-ink-900 font-900 px-5 sm:px-6 py-3 rounded-2xl shadow-lg active:scale-95 transition"
                >
                    {running ? (
                        <>
                            <PauseIcon className="w-4 h-4 text-coral-500" />
                            Stop
                        </>
                    ) : (
                        <>
                            <PlayIcon className="w-4 h-4 text-sky-600" />
                            Start Session
                        </>
                    )}
                </button>

            </div>

            {showTopicPrompt && (
                <div className="relative mt-5 bg-white/95 backdrop-blur rounded-3xl p-4 sm:p-5">
                    <p className="font-800 text-ink-900 text-sm mb-2">
                        Nice — {formatTime(seconds)} of {subject}. What did you cover?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            autoFocus
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            placeholder="e.g. Process scheduling"
                            className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-sky-100 bg-sky-50/60 font-700 text-ink-900 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition text-sm"
                            onKeyDown={e => e.key === "Enter" && confirmLog()}
                        />
                        <button
                            onClick={confirmLog}
                            disabled={saving}
                            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-sky-700 to-coral-600 text-white font-900 px-4 py-2.5 rounded-2xl text-sm disabled:opacity-60"
                        >
                            <CheckIcon className="w-4 h-4" />
                            {saving ? "Saving..." : "Log it"}
                        </button>
                        <button
                            onClick={discard}
                            className="text-ink-500 font-700 text-sm px-3"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ================= PROGRESS RING =================
function ProgressRing({ percent }) {
    const radius = 34;
    const stroke = 6;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
        <svg height="80" width="80">
            <circle stroke="#e0f2fe" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx="40" cy="40" />
            <circle
                stroke="url(#studyGrad)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="40"
                cy="40"
            />
            <defs>
                <linearGradient id="studyGrad" x1="0" y1="0" x2="1" y2="1">
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

function StudyLog() {

    const [subject, setSubject] = useState("OS");
    const [hours, setHours] = useState("");
    const [topic, setTopic] = useState("");

    const [logs, setLogs] = useState([]);
    const [todayHours, setTodayHours] = useState(0);
    const [weeklyHours, setWeeklyHours] = useState(0);

    const [weeklyData, setWeeklyData] = useState([]);
    const [subjectStats, setSubjectStats] = useState([]);

    const [weeklyTarget, setWeeklyTarget] = useState(20);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [showManual, setShowManual] = useState(false);

    const subjects = ["OS", "CN", "DBMS", "COA", "TOC", "DSA", "Aptitude"];
    const COLORS = ["#0ea5e9", "#f43f5e", "#38bdf8", "#fb7185", "#0369a1", "#fda4af", "#7dd3fc"];

    const productivityScore = weeklyTarget
        ? Math.min(Math.round((weeklyHours / weeklyTarget) * 100), 100)
        : 0;

    const loadLogs = async () => {
        try {
            setLoading(true);
            const res = await api.get("/study-logs");
            setLogs(res.data);
            calculateStats(res.data);
        } catch (err) { console.error("StudyLog load error:", err); }
        setLoading(false);
    };

    useEffect(() => { loadLogs(); }, []);

    const calculateStats = (data) => {
        const today = new Date();
        let todayTotal = 0, weekTotal = 0;
        const weekMap = {}, subjectMap = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            weekMap[d.toLocaleDateString()] = 0;
        }

        data.forEach(log => {
            if (!log.date) return;
            const logDate = new Date(log.date);
            const dateKey = logDate.toLocaleDateString();
            const diff = (today - logDate) / (1000 * 60 * 60 * 24);

            if (logDate.toDateString() === today.toDateString()) todayTotal += log.hours;
            if (diff <= 7 && weekMap[dateKey] !== undefined) {
                weekMap[dateKey] += log.hours;
                weekTotal += log.hours;
            }
            subjectMap[log.subject] = (subjectMap[log.subject] || 0) + log.hours;
        });

        setTodayHours(todayTotal);
        setWeeklyHours(weekTotal);
        setWeeklyData(Object.keys(weekMap).map(d => ({ date: d, hours: weekMap[d] })));
        setSubjectStats(Object.keys(subjectMap).map(k => ({ name: k, value: subjectMap[k] })));
    };

    const addLog = async () => {
        if (!hours || !topic) { alert("Fill all fields"); return; }
        try {
            await api.post("/study-logs", { subject, hours: Number(hours), topic });
            setHours(""); setTopic("");
            loadLogs();
        } catch (err) {
            console.error("Add log failed:", err);
            alert(err.response?.data?.error || "Failed to save log.");
        }
    };

    const exportPDF = async () => {
        if (!logs.length || exporting) return;
        setExporting(true);

        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.width;

        pdf.setFillColor(3, 105, 161);
        pdf.rect(0, 0, width, 28, "F");
        pdf.setTextColor(255);
        pdf.setFontSize(18);
        pdf.text("CP + GATE Study Report", 14, 18);
        pdf.setTextColor(0);

        let y = 40;
        autoTable(pdf, {
            startY: y,
            head: [["Metric", "Value"]],
            body: [
                ["Today", `${todayHours} hrs`],
                ["Weekly", `${weeklyHours} hrs`],
                ["Target", `${weeklyTarget} hrs`],
                ["Productivity", `${productivityScore}%`]
            ],
            headStyles: { fillColor: [3, 105, 161] }
        });

        y = pdf.lastAutoTable.finalY + 10;

        const weeklyEl = document.getElementById("weeklyChart");
        const subjectEl = document.getElementById("subjectChart");

        if (weeklyEl) {
            const canvas = await html2canvas(weeklyEl, { scale: 2 });
            pdf.addImage(canvas.toDataURL(), "PNG", 14, y, 180, 65);
            y += 75;
        }
        if (subjectEl) {
            const canvas2 = await html2canvas(subjectEl, { scale: 2 });
            pdf.addImage(canvas2.toDataURL(), "PNG", 14, y, 180, 65);
        }

        pdf.save("Study_Report.pdf");
        setExporting(false);
    };

    return (
        <div className="min-h-screen px-3 sm:px-6 py-4 sm:py-6 bg-cloud dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-nunito">

            <div className="flex justify-between items-center mb-4 sm:mb-5">
                <h1 className="text-xl sm:text-2xl font-900 text-ink-900 dark:text-white">
                    📘 Study Dashboard
                </h1>
                <button
                    onClick={exportPDF}
                    disabled={exporting}
                    className="bg-gradient-to-r from-sky-700 to-coral-600 text-white px-3 sm:px-4 py-2 rounded-2xl shadow-soft font-800 text-xs sm:text-sm"
                >
                    {exporting ? "Generating..." : "Export PDF"}
                </button>
            </div>

            <StudyTimer subjects={subjects} onLogged={loadLogs} />

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 p-4 rounded-3xl shadow-card">
                        <p className="text-xs font-700 text-ink-500 dark:text-slate-400">Today</p>
                        <h2 className="text-lg sm:text-xl font-900 text-sky-600">{todayHours}h</h2>
                    </div>
                    <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 p-4 rounded-3xl shadow-card">
                        <p className="text-xs font-700 text-ink-500 dark:text-slate-400">Week</p>
                        <h2 className="text-lg sm:text-xl font-900 text-coral-500">{weeklyHours}h</h2>
                    </div>
                    <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 p-4 rounded-3xl shadow-card">
                        <p className="text-xs font-700 text-ink-500 dark:text-slate-400">Target</p>
                        <input
                            value={weeklyTarget}
                            onChange={e => setWeeklyTarget(Number(e.target.value))}
                            className="bg-sky-50/60 dark:bg-slate-800 w-full p-1 rounded-lg border-2 border-sky-100 dark:border-white/10 text-ink-900 dark:text-white font-700 outline-none focus:border-sky-400 text-sm"
                        />
                    </div>
                    <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 flex justify-center items-center rounded-3xl shadow-card">
                        <ProgressRing percent={productivityScore} />
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl mb-5 shadow-card overflow-hidden">
                <button
                    onClick={() => setShowManual(v => !v)}
                    className="w-full flex justify-between items-center px-4 sm:px-5 py-3.5 text-left"
                >
                    <span className="font-800 text-ink-900 dark:text-white text-sm">
                        Log a past session manually
                    </span>
                    <span className="text-ink-500 font-900">{showManual ? "−" : "+"}</span>
                </button>

                {showManual && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <select
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="bg-sky-50/60 dark:bg-slate-800 border-2 border-sky-100 dark:border-white/10 p-2.5 rounded-2xl text-ink-900 dark:text-white font-700 outline-none focus:border-sky-400 text-sm sm:text-base"
                            >
                                {subjects.map(s => <option key={s}>{s}</option>)}
                            </select>
                            <input
                                type="number"
                                placeholder="Hours"
                                value={hours}
                                onChange={e => setHours(e.target.value)}
                                className="bg-sky-50/60 dark:bg-slate-800 border-2 border-sky-100 dark:border-white/10 p-2.5 rounded-2xl text-ink-900 dark:text-white font-700 outline-none focus:border-sky-400 text-sm sm:text-base"
                            />
                            <input
                                placeholder="Topic"
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                className="bg-sky-50/60 dark:bg-slate-800 border-2 border-sky-100 dark:border-white/10 p-2.5 rounded-2xl text-ink-900 dark:text-white font-700 outline-none focus:border-sky-400 flex-1 text-sm sm:text-base"
                            />
                            <button
                                onClick={addLog}
                                className="bg-gradient-to-r from-sky-700 to-coral-600 text-white px-4 py-2.5 rounded-2xl shadow-soft font-900 text-sm sm:text-base"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div id="weeklyChart" className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 p-4 rounded-4xl shadow-card">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={weeklyData}>
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="hours" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div id="subjectChart" className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 p-4 rounded-4xl shadow-card">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={subjectStats} dataKey="value" outerRadius={75} label>
                                {subjectStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {logs.length > 0 && (
                <div className="mt-5">
                    <StudyHeatmap logs={logs} />
                </div>
            )}

        </div>
    );
}

export default StudyLog;