import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyze.js";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to Database
connectDB();

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

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;