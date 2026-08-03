import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

import syllabus from "../data/syllabus";

const CheckIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" /></svg>;
const AlertIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M236.8 188.09 149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19 23.51 23.51 0 0 0 .02-23.72ZM120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z" /></svg>;

function GateSubject() {

    const { subject } = useParams();

    const [data, setData] = useState({});
    const [openTopic, setOpenTopic] = useState(null);

    const loadProgress = () => {
        api.get("/gate-progress")
            .then(res => {
                const subjectData = res.data?.[subject] || {};
                const filled = {};
                Object.keys(syllabus[subject]).forEach(topic => {
                    filled[topic] = {};
                    syllabus[subject][topic].forEach(sub => {
                        filled[topic][sub] = subjectData?.[topic]?.[sub] || false;
                    });
                });
                setData(filled);
            })
            .catch(err => console.error("GateSubject load error:", err));
    };

    useEffect(() => { loadProgress(); }, [subject]);

    const toggle = async (topic, sub) => {
        const newValue = !data?.[topic]?.[sub];
        setData(prev => ({ ...prev, [topic]: { ...prev[topic], [sub]: newValue } }));
        try {
            await api.put("/gate-progress/toggle", { subject, topic, sub, value: newValue });
        } catch (err) {
            console.error("Toggle failed:", err);
            loadProgress();
        }
    };

    const topicProgress = (topic) => {
        const syllabusSubs = syllabus[subject][topic];
        if (!syllabusSubs) return 0;
        let done = 0;
        syllabusSubs.forEach(sub => { if (data?.[topic]?.[sub] === true) done++; });
        return Math.round((done / syllabusSubs.length) * 100);
    };

    const weakTopic = () => {
        let weakest = null, min = 100;
        Object.keys(syllabus[subject]).forEach(topic => {
            const percent = topicProgress(topic);
            if (percent < min) { min = percent; weakest = topic; }
        });
        return min === 100 ? null : weakest;
    };

    return (
        <div className="min-h-screen bg-cloud dark:bg-slate-950 pb-24 font-nunito">

            <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-sky-100 dark:border-white/10 p-4 sm:p-5 z-20">
                <h1 className="font-900 text-ink-900 dark:text-white text-base sm:text-lg">{subject}</h1>

                {weakTopic() ? (
                    <p className="text-xs font-700 text-coral-500 flex items-center gap-1 mt-1">
                        <AlertIcon className="w-3.5 h-3.5" /> Weak Topic: {weakTopic()}
                    </p>
                ) : (
                    <p className="text-xs font-700 text-sky-600 flex items-center gap-1 mt-1">
                        <CheckIcon className="w-3.5 h-3.5" /> All topics completed
                    </p>
                )}
            </div>

            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-w-3xl mx-auto">

                {Object.keys(syllabus[subject]).map(topic => {
                    const percent = topicProgress(topic);
                    const weak = topic === weakTopic();

                    return (
                        <div
                            key={topic}
                            className="bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 rounded-3xl overflow-hidden shadow-card"
                        >
                            <div
                                onClick={() => setOpenTopic(openTopic === topic ? null : topic)}
                                className="flex justify-between items-center px-4 sm:px-5 py-4 cursor-pointer"
                            >
                                <div>
                                    <p className="font-800 text-ink-900 dark:text-white text-sm sm:text-base">{topic}</p>
                                    <p className="text-xs font-700 text-ink-500 dark:text-slate-400">{percent}% completed</p>
                                </div>

                                <div className="flex gap-2 items-center">
                                    {percent === 100 && <CheckIcon className="w-4 h-4 text-sky-600" />}
                                    {weak && percent < 100 && <AlertIcon className="w-4 h-4 text-coral-500" />}
                                    <span className="text-ink-500 font-900">{openTopic === topic ? "−" : "+"}</span>
                                </div>
                            </div>

                            {openTopic === topic && (
                                <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
                                    <div className="w-full h-2 bg-sky-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-sky-500 to-coral-500 transition-all duration-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>

                                    {syllabus[subject][topic].map(sub => (
                                        <label
                                            key={sub}
                                            className="flex gap-3 items-center text-ink-700 dark:text-slate-300 font-700 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={Boolean(data?.[topic]?.[sub])}
                                                onChange={() => toggle(topic, sub)}
                                                className="accent-sky-500 w-5 h-5 rounded"
                                            />
                                            {sub}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default GateSubject;