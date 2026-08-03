import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const subjectWeightage = {
    "Engineering Mathematics": 15,
    "Digital Logic": 10,
    "COA": 10,
    "Programming & Data Structures": 15,
    "Algorithms": 15,
    "TOC": 10,
    "Compiler Design": 5,
    "Operating Systems": 10,
    "DBMS": 10,
    "Computer Networks": 10,
    "Aptitude": 15
};

const TargetIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24Zm0 168a64 64 0 1 1 64-64 64.07 64.07 0 0 1-64 64Zm0-96a32 32 0 1 0 32 32 32 32 0 0 0-32-32Z" /></svg>;
const CheckIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" /></svg>;
const AlertIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M236.8 188.09 149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19 23.51 23.51 0 0 0 .02-23.72ZM120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z" /></svg>;

function GateTracker() {

    const [progress, setProgress] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/gate-progress")
            .then(res => setProgress(res.data))
            .catch(err => console.error("GateTracker load error:", err));
    }, []);

    const subjectProgress = (subject) => {
        const topics = progress?.[subject];
        if (!topics) return 0;
        let done = 0, total = 0;
        Object.values(topics).forEach(subs => {
            Object.values(subs).forEach(val => { total++; if (val) done++; });
        });
        return total ? Math.round((done / total) * 100) : 0;
    };

    const expectedMarks = () => {
        let weightedScore = 0, totalWeight = 0;
        Object.keys(subjectWeightage).forEach(subject => {
            weightedScore += subjectProgress(subject) * subjectWeightage[subject];
            totalWeight += subjectWeightage[subject];
        });
        return Number((weightedScore / totalWeight).toFixed(1));
    };

    const estimateRank = () => {
        const m = expectedMarks();
        if (m >= 75) return "< 100";
        if (m >= 65) return "100 - 500";
        if (m >= 55) return "500 - 1500";
        if (m >= 45) return "1500 - 4000";
        if (m >= 35) return "4000 - 8000";
        return "> 8000";
    };

    const weakestSubject = () => {
        let min = 101, weak = null;
        Object.keys(subjectWeightage).forEach(subject => {
            const p = subjectProgress(subject);
            if (p < min) { min = p; weak = subject; }
        });
        return min === 100 ? null : weak;
    };

    const weakGain = () => {
        const weak = weakestSubject();
        if (!weak) return 0;
        const weight = subjectWeightage[weak];
        const percent = subjectProgress(weak);
        return (((100 - percent) * weight) / 100).toFixed(1);
    };

    const dailyHours = () => {
        const g = weakGain();
        if (g >= 10) return "3 - 4 hrs/day";
        if (g >= 6) return "2 - 3 hrs/day";
        if (g >= 3) return "1.5 - 2 hrs/day";
        return "1 hr/day";
    };

    return (
        <div className="min-h-screen bg-cloud dark:bg-slate-950 p-4 sm:p-8 font-nunito">

            <h1 className="text-2xl sm:text-3xl font-900 text-ink-900 dark:text-white mb-5 sm:mb-6">
                GATE Performance Predictor
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">

                <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-5 sm:p-6 shadow-card">
                    <p className="text-xs sm:text-sm font-700 text-ink-500 dark:text-slate-400">Expected Marks</p>
                    <h2 className="text-2xl sm:text-3xl font-900 text-sky-600 mt-2">{expectedMarks()} / 100</h2>
                </div>

                <div className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-5 sm:p-6 shadow-card">
                    <p className="text-xs sm:text-sm font-700 text-ink-500 dark:text-slate-400">Estimated Rank</p>
                    <h2 className="text-2xl sm:text-3xl font-900 text-coral-500 mt-2">{estimateRank()}</h2>
                </div>

                {weakestSubject() ? (
                    <div
                        onClick={() => navigate(`/gate/${weakestSubject()}`)}
                        className="cursor-pointer bg-gradient-to-br from-sky-700 to-coral-600 p-5 sm:p-6 rounded-4xl text-white hover:-translate-y-0.5 transition shadow-soft"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <TargetIcon className="w-4 h-4" />
                            <p className="text-xs sm:text-sm font-800 opacity-90">Next Target</p>
                        </div>
                        <h2 className="text-lg sm:text-xl font-900">{weakestSubject()}</h2>
                        <div className="text-xs sm:text-sm mt-3 space-y-1 font-700 opacity-90">
                            <p>📈 Gain: +{weakGain()} marks</p>
                            <p>⏱ Study: {dailyHours()}</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-sky-500 to-sky-700 p-5 sm:p-6 rounded-4xl text-white shadow-soft">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckIcon className="w-4 h-4" />
                            <p className="text-xs sm:text-sm font-800 opacity-90">Syllabus Status</p>
                        </div>
                        <h2 className="text-lg sm:text-xl font-900">All Subjects Completed 🎉</h2>
                        <div className="text-xs sm:text-sm mt-3 space-y-1 font-700 opacity-90">
                            <p>🚀 Focus on Revision</p>
                            <p>📝 Full-Length Mock Tests</p>
                        </div>
                    </div>
                )}

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

                {Object.keys(subjectWeightage).map(subject => {
                    const percent = subjectProgress(subject);
                    const weak = subject === weakestSubject();

                    return (
                        <div
                            key={subject}
                            onClick={() => navigate(`/gate/${subject}`)}
                            className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-4xl p-5 cursor-pointer hover:-translate-y-0.5 transition shadow-card"
                        >
                            <div className="flex justify-between items-start">
                                <h2 className="font-900 text-ink-900 dark:text-white text-sm sm:text-base pr-2">
                                    {subject}
                                </h2>
                                <span className="text-[10px] sm:text-xs font-800 bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 px-2 py-1 rounded-full shrink-0 flex items-center gap-1">
                                    {weak && percent < 100 && <AlertIcon className="w-3 h-3 text-coral-500" />}
                                    {subjectWeightage[subject]} Marks
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm font-700 text-ink-500 dark:text-slate-400 mt-1">
                                {percent}% Completed
                            </p>

                            <div className="mt-3 w-full h-2 bg-sky-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-sky-500 to-coral-500 transition-all duration-700"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default GateTracker;