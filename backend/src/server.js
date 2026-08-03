import "dotenv/config";
import dns from "dns";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

// Force Node to use public DNS servers to work around local network/router DNS
// resolvers that fail on MongoDB SRV lookups (dev-only workaround — same fix as PalmSathi).
if (process.env.NODE_ENV !== "production") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

import authRoutes from "./routes/authRoutes.js";
import studyLogRoutes from "./routes/studyLogRoutes.js";
import gateRoutes from "./routes/gateRoutes.js";
import cfRoutes from "./routes/cfRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", service: "habitor-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/study-logs", studyLogRoutes);
app.use("/api/gate-progress", gateRoutes);
app.use("/api/cf-rating", cfRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/achievements", achievementRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Habitor backend running on port ${PORT}`));
