import "dotenv/config";
import express, {} from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import scoreRoutes from "./src/routes/score.js";
import typingRoutes from "./src/routes/typing.js";
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/typing", typingRoutes);
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Backend API is running" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=App.js.map