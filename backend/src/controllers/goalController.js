import Goal from "../models/Goal.js";

export async function getGoals(req, res) {
    try {
        const goals = await Goal.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function addGoal(req, res) {
    try {
        const { title, target } = req.body;
        if (!title || !target) {
            return res.status(400).json({ error: "title and target are required." });
        }

        const goal = await Goal.create({
            user: req.userId,
            title: title.trim(),
            target: Number(target),
            progress: 0,
            completed: false,
            completedAt: null,
        });
        res.status(201).json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateGoal(req, res) {
    try {
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!goal) return res.status(404).json({ error: "Goal not found." });
        res.json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}