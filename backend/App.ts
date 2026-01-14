import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/auth.js";
import scoreRoutes from "./src/routes/score.js";
import typingRoutes from "./src/routes/typing.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

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
  res.json({ status: "ok", message: "Server is running" });
});

// Serve static files from frontend dist in production
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendDistPath));

  // Catch all handler: send back React's index.html file for client-side routing
  // Use middleware instead of route for Express 5 compatibility
  app.use((req, res, next) => {
    // Don't serve index.html for API routes or health check
    if (req.path.startsWith("/api") || req.path === "/health") {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
