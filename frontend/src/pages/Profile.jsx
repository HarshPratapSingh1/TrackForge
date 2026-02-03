import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";

function Profile() {

    const [profileData, setProfileData] = useState({
        streak: 0,
        bestStreak: 0,
        weeklyStudy: 0,
        cfRating: 0,
        gateProgress: 0
    });

    useEffect(() => {

        const loadProfile = async () => {

            if (!auth.currentUser) return;

            const uid = auth.currentUser.uid;

            try {

                // 🔥 Streak
                const streakSnap = await getDoc(doc(db, "studyStreaks", uid));

                if (streakSnap.exists()) {
                    setProfileData(prev => ({
                        ...prev,
                        streak: streakSnap.data().currentStreak,
                        bestStreak: streakSnap.data().bestStreak
                    }));
                }

                // ⭐ CF Rating
                const cfSnap = await getDoc(doc(db, "cfRatings", uid));

                if (cfSnap.exists()) {
                    const hist = cfSnap.data().history || [];
                    if (hist.length > 0) {
                        setProfileData(prev => ({
                            ...prev,
                            cfRating: hist[hist.length - 1].rating
                        }));
                    }
                }

                // 🎯 GATE Progress
                const gateSnap = await getDoc(doc(db, "gateProgress", uid));

                if (gateSnap.exists()) {
                    const values = Object.values(gateSnap.data());
                    const avg =
                        values.reduce((a, b) => a + b, 0) / values.length;

                    setProfileData(prev => ({
                        ...prev,
                        gateProgress: Math.round(avg)
                    }));
                }

            } catch (err) {
                console.log("Profile load error:", err);
            }

        };

        loadProfile();

    }, []);

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                Profile Summary
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                <div className="bg-orange-400 dark:bg-orange-800 p-4 rounded shadow">
                    <p className="text-sm">Current Streak</p>
                    <p className="text-xl font-bold">
                        🔥 {profileData.streak}
                    </p>
                </div>

                <div className="bg-purple-400 dark:bg-purple-800 p-4 rounded shadow">
                    <p className="text-sm">Best Streak</p>
                    <p className="text-xl font-bold">
                        🏆 {profileData.bestStreak}
                    </p>
                </div>

                <div className="bg-green-400 dark:bg-green-800 p-4 rounded shadow">
                    <p className="text-sm">Codeforces Rating</p>
                    <p className="text-xl font-bold">
                        ⭐ {profileData.cfRating}
                    </p>
                </div>

                <div className="bg-blue-400 dark:bg-blue-800 p-4 rounded shadow">
                    <p className="text-sm">GATE Progress</p>
                    <p className="text-xl font-bold">
                        🎯 {profileData.gateProgress}%
                    </p>
                </div>

            </div>

        </div>
    );
}

export default Profile;
