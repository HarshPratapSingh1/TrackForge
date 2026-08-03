import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        unlocked: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);