import { useEffect, useState } from "react";
import api from "../api/axios";

const FireIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M183.89 153.34a56 56 0 0 1-111.78 0c0-53 39.87-95.5 55.9-113.34a8 8 0 0 1 12 0c16 17.84 55.88 60.36 55.88 113.34Z" /></svg>;
const TrophyIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M232 64h-24V56a16 16 0 0 0-16-16H64a16 16 0 0 0-16 16v8H24a16 16 0 0 0-16 16v8a48.05 48.05 0 0 0 41.34 47.53A80.15 80.15 0 0 0 120 191.61v24.79H88a8 8 0 0 0 0 16h80a8 8 0 0 0 0-16h-32v-24.79a80.15 80.15 0 0 0 70.66-72.08A48.05 48.05 0 0 0 248 88v-8a16 16 0 0 0-16-16Z" /></svg>;
const StarIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="m234.5 114.38-45.1 39.36 13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31-51.11 31a16 16 0 0 1-23.84-17.34l13.51-58.6-45.1-39.36a16 16 0 0 1 9.11-28.06l59.46-5.15 23.21-55.36a16 16 0 0 1 29.52 0l23.21 55.36 59.46 5.15a16 16 0 0 1 9.11 28.06Z" /></svg>;
const TargetIcon = (p) => <svg viewBox="0 0 256 256" fill="currentColor" {...p}><path d="M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24Zm0 168a64 64 0 1 1 64-64 64.07 64.07 0 0 1-64 64Zm0-96a32 32 0 1 0 32 32 32 32 0 0 0-32-32Z" /></svg>;

function StatCard({ title, value, Icon, tint }) {
    return (
        <div className="relative p-4 sm:p-5 rounded-4xl bg-white dark:bg-white/5 ring-1 ring-sky-100 dark:ring-white/10 shadow-card hover:-translate-y-0.5 transition overflow-hidden">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs sm:text-sm font-700 text-ink-500 dark:text-slate-400">{title}</p>
                    <p className="text-xl sm:text-3xl font-900 text-ink-900 dark:text-white mt-1 sm:mt-2">{value}</p>
                </div>
                <div className={`bg-gradient-to-br ${tint} p-2 sm:p-3 rounded-2xl shadow-soft shrink-0`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
            </div>
        </div>
    );
}

function Profile() {

    const [profileData, setProfileData] = useState({
        streak: 0,
        bestStreak: 0,
        cfRating: 0,
        gateProgress: 0
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const [streakRes, cfRes, gateRes] = await Promise.all([
                    api.get("/study-logs/streak"),
                    api.get("/cf-rating"),
                    api.get("/gate-progress"),
                ]);

                const streak = streakRes.data?.currentStreak || 0;
                const best = streakRes.data?.bestStreak || 0;

                let cfRating = 0;
                const hist = cfRes.data?.history || [];
                if (hist.length) cfRating = hist.at(-1).rating;

                let gateProgress = 0;
                const subjects = gateRes.data;
                if (subjects) {
                    let total = 0, done = 0;
                    Object.values(subjects).forEach(subject =>
                        Object.values(subject).forEach(topic =>
                            Object.values(topic).forEach(val => {
                                total++;
                                if (val === true) done++;
                            })
                        )
                    );
                    gateProgress = total ? Math.round((done / total) * 100) : 0;
                }

                setProfileData({ streak, bestStreak: best, cfRating, gateProgress });
            } catch (err) {
                console.error("Profile load error:", err);
            }
        };

        loadProfile();
    }, []);

    return (
        <div className="min-h-screen px-3 sm:px-8 py-5 sm:py-6 bg-cloud dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-nunito">

            <div className="mb-6 sm:mb-10">
                <h1 className="text-2xl sm:text-3xl font-900 text-ink-900 dark:text-white">
                    👤 Profile Summary
                </h1>
                <p className="text-ink-500 dark:text-slate-400 mt-1 text-sm sm:text-base font-700">
                    Your performance overview
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <StatCard title="Current Streak" value={`${profileData.streak} days`} Icon={FireIcon} tint="from-coral-400 to-coral-600" />
                <StatCard title="Best Streak" value={`${profileData.bestStreak} days`} Icon={TrophyIcon} tint="from-sky-400 to-sky-600" />
                <StatCard title="Codeforces Rating" value={profileData.cfRating} Icon={StarIcon} tint="from-sky-500 to-coral-500" />
                <StatCard title="GATE Progress" value={`${profileData.gateProgress}%`} Icon={TargetIcon} tint="from-coral-500 to-sky-600" />
            </div>

        </div>
    );
}

export default Profile;