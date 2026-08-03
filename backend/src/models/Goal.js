import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        title: { type: String, required: true },
        target: { type: Number, required: true },
        progress: { type: Number, default: 0 },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

export default mongoose.model("Goal", goalSchema);