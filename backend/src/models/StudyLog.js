import mongoose from "mongoose";

// Was: Firestore collection "studyLogs", one doc per log entry, field "uid" for ownership.
// Now: one doc per log, "user" is an ObjectId ref instead of a plain uid string.
const studyLogSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        subject: { type: String, required: true },
        hours: { type: Number, required: true },
        topic: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now },
    },
    { timestamps: true }
);

// Mirrors the old `where("uid","==",uid).orderBy("date","desc")` Firestore query
studyLogSchema.index({ user: 1, date: -1 });

export default mongoose.model("StudyLog", studyLogSchema);
