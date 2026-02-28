// server.js — API ONLY VERSION (React Ready)

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load env
dotenv.config();

// DB
require("./configs/dbs");

// Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const brokerRoutes = require("./routes/broker");
const shareListing = require("./routes/sharedListings");

const app = express();

/* =======================
   CORE MIDDLEWARE
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   CORS (CLEAN & SECURE)
======================= */
const allowedOrigins = [
	"http://localhost:5173", // For local testing
	"http://localhost:3000",
	"https://brokeryfrontend.vercel.app", //  live Vercel site
];

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
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
app.use("/api/shared-listings", shareListing);

/* =======================
   HEALTH & ROOT ROUTES
======================= */
// Welcome msg on Render!
app.get("/", (req, res) => {
	res.send("Brokery API is running perfectly! 🚀");
});

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
