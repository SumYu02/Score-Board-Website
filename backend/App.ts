import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
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
  // Try multiple path resolution strategies
  // Strategy 1: From __dirname (backend/dist) go up to project root
  let frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

  // Strategy 2: If that doesn't exist, try from process.cwd()
  // When Railway runs "cd backend && npm start", cwd is backend directory
  if (!fs.existsSync(frontendDistPath)) {
    const cwd = process.cwd();
    // If cwd is backend, go up one level; otherwise use cwd as project root
    const projectRoot =
      cwd.endsWith("backend") || cwd.endsWith("backend/")
        ? path.resolve(cwd, "..")
        : cwd;
    frontendDistPath = path.resolve(projectRoot, "frontend", "dist");
  }

  // Verify the directory exists
  if (!fs.existsSync(frontendDistPath)) {
    console.error(
      `Frontend dist directory not found. Tried: ${frontendDistPath}`
    );
    console.error(`Current working directory: ${process.cwd()}`);
    console.error(`__dirname: ${__dirname}`);
    console.error(`NODE_ENV: ${process.env.NODE_ENV}`);
  } else {
    console.log(`Serving static files from: ${frontendDistPath}`);
    app.use(express.static(frontendDistPath));

    // Catch all handler: send back React's index.html file for client-side routing
    // Use middleware instead of route for Express 5 compatibility
    app.use((req, res, next) => {
      // Don't serve index.html for API routes or health check
      if (req.path.startsWith("/api") || req.path === "/health") {
        return next();
      }
      const indexPath = path.resolve(frontendDistPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error(`index.html not found at: ${indexPath}`);
        res.status(404).json({ error: "Frontend not built" });
      }
    });
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
