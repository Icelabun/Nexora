import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import streakRoutes from "./routes/streak.js";
import { requestLogger } from "./middleware/logger.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load the backend .env from this folder (not the process cwd).
dotenv.config({ path: path.join(__dirname, '.env') });
const app = express();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Middleware
app.use(express.json());
app.use(requestLogger);
const allowedOrigins = [
  "https://studyssphere-frontend.onrender.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser clients/tools that don't send an Origin header
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Password"],
  credentials: true,
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log("\n✅ MongoDB Connected");
  const { host, port, name } = mongoose.connection;
  console.log(`📊 Database Details: Host: ${host}, Port: ${port}, Database: ${name}`);
})
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to StudySphere API' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/streak", streakRoutes);

// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});

