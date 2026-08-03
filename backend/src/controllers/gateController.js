import GateProgress from "../models/GateProgress.js";

// Was: onSnapshot(doc(db,"gateProgress", uid), ...) — live listener.
// REST has no push updates; frontend refetches after a save instead.
export async function getGateProgress(req, res) {
    try {
        const progress = await GateProgress.findOne({ user: req.userId });
        res.json(progress?.subjects || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Was: setDoc(ref, {...}, { merge: true })
export async function updateGateProgress(req, res) {
    try {
        const updates = req.body;
        const progress = await GateProgress.findOneAndUpdate(
            { user: req.userId },
            { $set: Object.fromEntries(Object.entries(updates).map(([k, v]) => [`subjects.${k}`, v])) },
            { upsert: true, new: true }
        );
        res.json(progress.subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Was: setDoc(ref, { [subject]: { [topic]: { [sub]: newValue } } }, { merge: true })
// Deep single-field version GateSubject.jsx needs — a naive top-level $set would wipe
// every other topic for that subject.
export async function toggleGateItem(req, res) {
    try {
        const { subject, topic, sub, value } = req.body;
        if (!subject || !topic || !sub) {
            return res.status(400).json({ error: "subject, topic, and sub are required." });
        }

        const path = `subjects.${subject}.${topic}.${sub}`;
        const progress = await GateProgress.findOneAndUpdate(
            { user: req.userId },
            { $set: { [path]: value } },
            { upsert: true, new: true }
        );
        res.json(progress.subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}