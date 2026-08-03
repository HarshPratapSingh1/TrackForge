import mongoose from "mongoose";

// Was: Firestore doc at cfRatings/{uid}
const cfRatingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        handle: { type: String },
        currentRating: { type: Number, default: 0 },
        maxRating: { type: Number, default: 0 },
        history: { type: [mongoose.Schema.Types.Mixed], default: [] },
    },
    { timestamps: true }
);

export default mongoose.model("CfRating", cfRatingSchema);
