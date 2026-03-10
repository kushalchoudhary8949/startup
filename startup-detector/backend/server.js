import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyze.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Check if Groq API key is loaded
if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY is missing in .env file");
} else {
  console.log("✅ Groq API key loaded");
}

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// API routes
app.use("/api", analyzeRoutes);

// health check route
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Startup Detector API running",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});