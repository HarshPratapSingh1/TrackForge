import { useEffect, useState } from "react";
import api from "../api/axios";
import { achievementList } from "../utils/achievementRules";

const LockIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M208 80h-24V56a56 56 0 0 0-112 0v24H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16ZM88 56a40 40 0 0 1 80 0v24H88Z" /></svg>;

function Achievements() {

    const [unlocked, setUnlocked] = useState({});

    useEffect(() => {
        api.get("/achievements")
            .then(res => setUnlocked(res.data || {}))
            .catch(err => console.error("Achievements load error:", err));
    }, []);

    return (
        <div className="min-h-screen bg-cloud dark:bg-slate-950 p-4 sm:p-8 font-nunito">

            <h1 className="text-2xl sm:text-3xl font-900 text-ink-900 dark:text-white mb-5 sm:mb-6">
                🏅 Achievements
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">

                {achievementList.map(a => {
                    const isUnlocked = unlocked[a.id];

                    return (
                        <div
                            key={a.id}
                            className={`p-4 sm:p-5 rounded-4xl text-center transition shadow-card ring-1
                                ${isUnlocked
                                    ? "bg-gradient-to-br from-sky-500 to-coral-500 text-white ring-transparent"
                                    : "bg-white dark:bg-white/5 ring-sky-100 dark:ring-white/10 opacity-70"
                                }`}
                        >
                            <div className="text-2xl sm:text-3xl mb-2 relative inline-block">
                                {isUnlocked ? a.icon : <LockIcon className="w-7 h-7 sm:w-8 sm:h-8 text-ink-500 dark:text-slate-500 mx-auto" />}
                            </div>

                            <p className={`font-900 text-xs sm:text-sm ${isUnlocked ? "text-white" : "text-ink-900 dark:text-white"}`}>
                                {a.name}
                            </p>

                            <p className={`text-[10px] sm:text-xs mt-1 font-700 ${isUnlocked ? "text-white/90" : "text-ink-500 dark:text-slate-400"}`}>
                                {isUnlocked ? "Unlocked ✅" : "Locked"}
                            </p>
                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default Achievements;