const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =========================
   VERIFY JWT TOKEN
========================= */
exports.verifyToken = async (req, res, next) => {
  try {
    let token;

    // Read token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user (without password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    next();
  } catch (error) {
    console.error("verifyToken error:", error.message);
    return res.status(401).json({
      message: "Not authorized, token invalid"
    });
  }
};

/* =========================
   ADMIN ONLY
========================= */
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Admin only."
  });
};

/* =========================
   BROKER OR ADMIN
========================= */
// exports.isBroker = (req, res, next) => {
//   if (
//     req.user &&
//     (req.user.role === "broker" || req.user.role === "admin")
//   ) {
//     return next();
//   }

//   return res.status(403).json({
//     message: "Access denied. Broker only."
//   });
// };




exports.isBroker = (req, res, next) => {
  try {
    if (req.user.role !== "broker") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next(); // ✅ REQUIRED
  } catch (err) {
    next(err);
  }
};
