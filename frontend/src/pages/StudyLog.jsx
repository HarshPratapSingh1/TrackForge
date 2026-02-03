import { useState, useEffect } from "react";
import { db, auth } from "../firebase/config";
import StudyHeatmap from "../components/StudyHeatmap";

import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy
} from "firebase/firestore";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

// ================= PROGRESS RING =================

function ProgressRing({ percent }) {

    const radius = 38;
    const stroke = 6;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset =
        circumference - (percent / 100) * circumference;

    return (
        <svg height="90" width="90">
            <circle
                stroke="#e5e7eb"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx="45"
                cy="45"
                className="dark:stroke-slate-700"
            />
            <circle
                stroke="#22c55e"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="45"
                cy="45"
            />
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="fill-gray-900 dark:fill-white"
                fontSize="13"
                fontWeight="bold"
            >
                {percent}%
            </text>
        </svg>
    );
}

// ================= MAIN =================

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

    const subjects = ["OS", "CN", "DBMS", "COA", "TOC", "DSA", "Aptitude"];

    const COLORS = [
        "#2563eb",
        "#22c55e",
        "#facc15",
        "#ef4444",
        "#a855f7",
        "#14b8a6",
        "#fb7185"
    ];

    const productivityScore = weeklyTarget
        ? Math.min(Math.round((weeklyHours / weeklyTarget) * 100), 100)
        : 0;

    // ================= LOAD LOGS =================

    const loadLogs = async () => {

        if (!auth.currentUser) return;

        const q = query(
            collection(db, "studyLogs"),
            where("uid", "==", auth.currentUser.uid),
            orderBy("date", "desc")
        );

        const snap = await getDocs(q);

        const data = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setLogs(data);
        calculateStats(data);
    };

    useEffect(() => {
        loadLogs();
    }, []);

    // ================= STATS =================

    const calculateStats = (data) => {

        const today = new Date();

        let todayTotal = 0;
        let weekTotal = 0;

        const weekMap = {};
        const subjectMap = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            weekMap[d.toLocaleDateString()] = 0;
        }

        data.forEach(log => {

            if (!log.date) return;

            const logDate = new Date(log.date.seconds * 1000);
            const dateKey = logDate.toLocaleDateString();

            const diff =
                (today - logDate) / (1000 * 60 * 60 * 24);

            if (logDate.toDateString() === today.toDateString()) {
                todayTotal += log.hours;
            }

            if (diff <= 7 && weekMap[dateKey] !== undefined) {
                weekMap[dateKey] += log.hours;
                weekTotal += log.hours;
            }

            subjectMap[log.subject] =
                (subjectMap[log.subject] || 0) + log.hours;
        });

        setTodayHours(todayTotal);
        setWeeklyHours(weekTotal);

        setWeeklyData(
            Object.keys(weekMap).map(d => ({
                date: d,
                hours: weekMap[d]
            }))
        );

        setSubjectStats(
            Object.keys(subjectMap).map(k => ({
                name: k,
                value: subjectMap[k]
            }))
        );
    };

    // ================= ADD LOG =================

    const addLog = async () => {

        if (!hours || !topic) {
            alert("Fill all fields");
            return;
        }

        if (!auth.currentUser) return;

        await addDoc(collection(db, "studyLogs"), {
            uid: auth.currentUser.uid,
            subject,
            hours: Number(hours),
            topic,
            date: new Date()
        });

        setHours("");
        setTopic("");

        loadLogs();
    };

    // ================= UI =================

    return (

        <div className="
      min-h-screen px-3 sm:px-6 py-4
      bg-gradient-to-br from-slate-50 via-white to-slate-100
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
      text-gray-900 dark:text-white
      transition-colors
    ">

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

                <h1 className="text-2xl sm:text-3xl font-bold">
                    📘 Study Dashboard
                </h1>

                <button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base transition"
                >
                    Export PDF
                </button>

            </div>

            {/* KPI GRID */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">

                <div className="glass p-4 rounded-xl hover:scale-[1.02] transition">
                    <p className="text-xs opacity-70">Today</p>
                    <h2 className="text-xl font-bold text-emerald-500">
                        {todayHours}h
                    </h2>
                </div>

                <div className="glass p-4 rounded-xl hover:scale-[1.02] transition">
                    <p className="text-xs opacity-70">Week</p>
                    <h2 className="text-xl font-bold text-blue-500">
                        {weeklyHours}h
                    </h2>
                </div>

                <div className="glass p-4 rounded-xl hover:scale-[1.02] transition">
                    <p className="text-xs opacity-70">Target</p>
                    <input
                        value={weeklyTarget}
                        onChange={e => setWeeklyTarget(Number(e.target.value))}
                        className="
              bg-white dark:bg-slate-800
              border border-gray-200 dark:border-white/10
              mt-1 w-full p-1 rounded text-sm
              text-gray-900 dark:text-white
            "
                    />
                </div>

                <div className="glass flex items-center justify-center rounded-xl">
                    <ProgressRing percent={productivityScore} />
                </div>

            </div>

            {/* ADD LOG */}

            <div className="glass p-4 rounded-xl mb-5">

                <h2 className="font-semibold mb-2 text-sm">
                    ➕ Add Session
                </h2>

                <div className="flex flex-col sm:flex-row gap-2">

                    <select
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="
              bg-white dark:bg-slate-800
              text-gray-900 dark:text-white
              border border-gray-200 dark:border-white/10
              p-2 rounded
            "
                    >
                        {subjects.map(s => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Hours"
                        value={hours}
                        onChange={e => setHours(e.target.value)}
                        className="
              bg-white dark:bg-slate-800
              text-gray-900 dark:text-white
              border border-gray-200 dark:border-white/10
              p-2 rounded
            "
                    />

                    <input
                        placeholder="Topic"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        className="
              bg-white dark:bg-slate-800
              text-gray-900 dark:text-white
              border border-gray-200 dark:border-white/10
              p-2 rounded flex-1
            "
                    />

                    <button
                        onClick={addLog}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm transition"
                    >
                        Save
                    </button>

                </div>

            </div>

            {/* CHARTS */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                <div className="glass p-4 rounded-xl">

                    <h2 className="font-semibold mb-2 text-sm">
                        Weekly Study
                    </h2>

                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={weeklyData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="hours"
                                fill="#3b82f6"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>

                </div>

                <div className="glass p-4 rounded-xl">

                    <h2 className="font-semibold mb-2 text-sm">
                        Subject Distribution
                    </h2>

                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={subjectStats}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={85}
                                label
                            >
                                {subjectStats.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={COLORS[i % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                </div>

            </div>

            {/* HEATMAP */}

            {logs.length > 0 && (

                <div className="glass p-4 rounded-xl mt-5">

                    <h2 className="font-semibold mb-2 text-sm">
                        Consistency
                    </h2>

                    <StudyHeatmap logs={logs} />

                </div>

            )}

        </div>
    );
}

export default StudyLog;
