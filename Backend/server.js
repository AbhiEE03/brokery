// server.js — API ONLY VERSION (React Ready)

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load env
dotenv.config();

// DB & cron
// require("./config/dbs");
require("./configs/dbs");
// require("./cron");

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
   CORS (THIS FIXES NETWORK ERROR)
======================= */
const allowedOrigins = [
	"http://localhost:5173", // For local testing on your laptop
	"http://localhost:3000",
	"https://brokeryfrontend.vercel.app", // Your live Vercel site
];

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
);
// const allowedOrigins = [
// 	"http://localhost:5173", // Vite
// 	"http://localhost:3000", // CRA (if used)
// 	"https://batra-associates-ba.vercel.app",
// ];

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	}),
);
//  "http://localhost:5173" ||
// "https://batra-associates-ba.vercel.app" ||
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
