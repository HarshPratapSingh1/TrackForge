import mongoose from "mongoose";

// Was: Firestore doc at gateProgress/{uid}, shape set ad-hoc per subject via setDoc.
// Now: a flexible per-subject map so GateTracker/GateSubject pages keep working unchanged.
const gateProgressSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        subjects: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

export default mongoose.model("GateProgress", gateProgressSchema);
