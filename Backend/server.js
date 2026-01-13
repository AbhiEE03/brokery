// server.js — API ONLY VERSION (React Ready)

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load env
dotenv.config();

// DB & cron
// require("./config/dbs");
require("./configs/dbs")
// require("./cron");

// Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const brokerRoutes = require("./routes/broker");

const app = express();

/* =======================
   CORE MIDDLEWARE
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   CORS (THIS FIXES NETWORK ERROR)
======================= */
app.use(
   cors({
      origin: "https://batra-associates-ba.vercel.app", // React
      credentials: true
   })
);

/* =======================
   STATIC FILES
======================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =======================
   API ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/broker", brokerRoutes);

/* =======================
   HEALTH CHECK
======================= */
app.get("/api/health", (req, res) => {
   res.json({ status: "ok" });
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`🚀 API running at http://localhost:${PORT}`);
});
