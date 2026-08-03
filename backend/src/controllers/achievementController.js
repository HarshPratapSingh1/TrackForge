import Achievement from "../models/Achievement.js";

export async function getAchievements(req, res) {
    try {
        const record = await Achievement.findOne({ user: req.userId });
        res.json(record?.unlocked || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function setAchievements(req, res) {
    try {
        const unlocked = req.body;
        const record = await Achievement.findOneAndUpdate(
            { user: req.userId },
            { $set: { unlocked } },
            { upsert: true, new: true }
        );
        res.json(record.unlocked);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}