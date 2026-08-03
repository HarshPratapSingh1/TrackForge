import mongoose from "mongoose";

// Was: Firestore doc at studyStreaks/{uid}. Now: one doc per user, "user" is unique.
const studyStreakSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        currentStreak: { type: Number, default: 0 },
        bestStreak: { type: Number, default: 0 },
        lastDate: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model("StudyStreak", studyStreakSchema);
