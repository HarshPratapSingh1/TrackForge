import StudyLog from "../models/StudyLog.js";
import StudyStreak from "../models/StudyStreak.js";

// Was: query(collection(db,"studyLogs"), where("uid","==",uid), orderBy("date","desc"))
export async function getLogs(req, res) {
    try {
        const logs = await StudyLog.find({ user: req.userId }).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Was: the updateStreak() function inside StudyLog.jsx, run in the browser.
// Same day/consecutive-day/break logic, now server-side so it can't be tampered with client-side.
async function updateStreak(userId) {
    let streak = await StudyStreak.findOne({ user: userId });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let current = 1;
    let best = 1;

    if (streak) {
        const last = new Date(streak.lastDate);
        last.setHours(0, 0, 0, 0);

        const diffDays = (today - last) / (1000 * 60 * 60 * 24);

        if (diffDays === 0) return streak; // already logged today, no change
        if (diffDays === 1) {
            current = streak.currentStreak + 1;
            best = Math.max(current, streak.bestStreak);
        } else {
            current = 1;
            best = streak.bestStreak;
        }

        streak.currentStreak = current;
        streak.bestStreak = best;
        streak.lastDate = new Date();
        await streak.save();
        return streak;
    }

    streak = await StudyStreak.create({
        user: userId,
        currentStreak: current,
        bestStreak: best,
        lastDate: new Date(),
    });
    return streak;
}

// Was: addDoc(collection(db,"studyLogs"), {...}) followed by a separate updateStreak() call
export async function addLog(req, res) {
    try {
        const { subject, hours, topic } = req.body;
        if (!subject || !hours || !topic) {
            return res.status(400).json({ error: "subject, hours, and topic are required." });
        }

        const log = await StudyLog.create({
            user: req.userId,
            subject,
            hours: Number(hours),
            topic,
            date: new Date(),
        });

        const streak = await updateStreak(req.userId);

        res.status(201).json({ log, streak });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Was: getDoc(doc(db,"studyStreaks", uid))
export async function getStreak(req, res) {
    try {
        const streak = await StudyStreak.findOne({ user: req.userId });
        res.json(streak || { currentStreak: 0, bestStreak: 0, lastDate: null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
