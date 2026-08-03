import CfRating from "../models/CfRating.js";

// Was: getDoc(doc(db,"cfRatings", uid))
export async function getCfRating(req, res) {
    try {
        const rating = await CfRating.findOne({ user: req.userId });
        res.json(rating || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Was: setDoc(doc(db,"cfRatings", uid), {...})
export async function upsertCfRating(req, res) {
    try {
        const { handle, currentRating, maxRating, history } = req.body;
        const rating = await CfRating.findOneAndUpdate(
            { user: req.userId },
            { handle, currentRating, maxRating, history },
            { upsert: true, new: true }
        );
        res.json(rating);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
