const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
console.log("authController:", authController);
console.log("authController.login type:", typeof authController.login);

// router.get("/login", authController.getLogin);
router.post("/login", authController.login);
// router.post("/logout", authController.logout);
// router.get("/me", authController.me);

module.exports = router;
