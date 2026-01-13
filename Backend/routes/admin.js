const router = require("express").Router();
const { verifyToken, isAdmin } = require("../middleware/auth");

const adminController = require("../controllers/adminController");
// const adminClientController = require("../controllers/adminClientController");
const propertyController = require("../controllers/propertyController");
const userController = require("../controllers/userController");
const adminClientController = require("../controllers/adminClientController");
const upload = require("../middleware/upload");

/* =========================
   DASHBOARD
========================= */
router.get("/dashboard", verifyToken, isAdmin, adminController.dashboard);
// router.get("/dashboard", verifyToken, isAdmin, dashboard);

router.get(
  "/properties",
  verifyToken,
  isAdmin,
  propertyController.getAllPropertiesAdmin
);

router.get(
  "/properties/:id",
  verifyToken,
  isAdmin,
  adminController.getAdminPropertyDetails
);

router.get(
  "/clients/:id",
  verifyToken,
  isAdmin,
  adminController.getAdminClientProfile
);

/* The commented out code block is defining a POST route for adding a new property. Here's a breakdown
of what each part of the code is doing: */
router.post(
  "/add-property",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
    { name: "map", maxCount: 1 },
    { name: "floorPlan", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  propertyController.addProperties
);

// router.put(
//   "/properties/:id",
//   verifyToken,
//   isAdmin,
//   upload.fields([
//     { name: "cover", maxCount: 1 },
//     { name: "map", maxCount: 1 },
//     { name: "gallery", maxCount: 10 },
//     { name: "floorPlan", maxCount: 1 },
//   ]),
//   adminController.postEditProperty
// );

// router.delete(
//   "/properties/:id",
//   verifyToken,
//   isAdmin,
//   propertyController.deleteProperty
// );

// /* ======================
//    BROKERS / STAFF
// ====================== */
router.get(
  "/brokers",
  verifyToken,
  isAdmin,
  userController.getAllBrokers
);

router.post(
  "/brokers",
  verifyToken,
  isAdmin,
  userController.addBroker
);

// /* ======================
//    CLIENTS
// ====================== */
router.get(
  "/clients",
  verifyToken,
  isAdmin,
  adminController.getClients
);

// /* ======================
//    PROPERTY CHANGE REQUESTS
// ====================== */
router.get(
  "/requests",
  verifyToken,
  isAdmin,
  adminController.getPropertyChangeRequests
);

router.post(
  "/requests/:id/approve",
  verifyToken,
  isAdmin,
  adminController.approvePropertyChange
);


router.get(
  "/client-change-requests",
  verifyToken,
  isAdmin,
  adminClientController.getPendingRequests
);

router.get(
  "/client-change-requests/:id",
  verifyToken,
  isAdmin,
  adminClientController.getClientChangeForm
);


// // Approve request
router.post(
  "/client-change-requests/:id/approve",
  verifyToken,
  isAdmin,
  adminClientController.approveClientChangeRequest
);

// // Reject request
router.post(
  "/client-change-requests/:id/reject",
  verifyToken,
  isAdmin,
  adminClientController.rejectClientChangeRequest
);








module.exports = router;