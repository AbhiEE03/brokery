const express = require("express");
const router = express.Router();
const upload = require('../utils/upload')

const { verifyToken, isBroker } = require("../middleware/auth");

const propertyController = require("../controllers/propertyController");
const clientController = require("../controllers/clientController");
const brokerController = require("../controllers/brokerController");
const propertyChangeController = require("../controllers/propertyChangeController");

// const uploadClientDocument = require("../utils/clientDocumentUpload");

// /* ======================
//    BROKER DASHBOARD (API)
// ====================== */
router.get(
   "/dashboard",
   verifyToken,
   isBroker,
   brokerController.dashboard
);

// /* ======================
//    PROPERTY BROWSING (API)
// ====================== */
router.get(
   "/properties",
   verifyToken,
   isBroker,
   propertyController.getAllPropertiesBroker
);

router.get(
   "/properties/:id",
   verifyToken,
   isBroker,
   brokerController.getBrokerPropertyDetails
);


// /* ======================
//    PROPERTY CHANGE REQUEST
// ====================== */
router.post(
   "/properties/:id/request-edit",
   verifyToken,
   isBroker,
   propertyChangeController.requestPropertyEdit
);

router.get(
   "/matches",
   verifyToken,
   isBroker,
   brokerController.getBrokerMatches
);

// /* ======================
//    CLIENT MANAGEMENT (API)
// ====================== */
router.get(
   "/clients",
   verifyToken,
   isBroker,
   clientController.getClients
);

router.post(
   "/clients",
   verifyToken,
   isBroker,
   clientController.addClient
);

// router.get(
//    "/clients/:id",
//    verifyToken,
//    isBroker,
//    clientController.getClientDetails
// );

// /* ======================
//    CLIENT → PROPERTY LINKS
// ====================== */
router.post(
   "/clients/:id/interest",
   verifyToken,
   isBroker,
   clientController.addClientInterest
);

router.get(
   "/documents",
   verifyToken,
   isBroker,
   brokerController.getClientDocuments
);
// router.post(
//    "/properties/:id/assign-client",
//    verifyToken,
//    isBroker,
//    clientController.assignPropertyToClient
// );

// /* ======================
//    CLIENT DOCUMENTS (API)
// ====================== */
// router.post(
//    "/clients/:id/documents",
//    verifyToken,
//    isBroker,
//    uploadClientDocument.single("document"),
//    brokerController.uploadClientDocument
// );

// router.get(
//    "/clients/:clientId/documents/:docId",
//    verifyToken,
//    isBroker,
//    brokerController.downloadClientDocument
// );

// /* ======================
//    CLIENT PIPELINE STAGE
// ====================== */
// router.post(
//    "/clients/:id/stage",
//    verifyToken,
//    isBroker,
//    brokerController.updateClientStage
// );

router.get("/clients/:id/profile", verifyToken, isBroker, clientController.getClientProfile);
router.get("/clients/:id/profile/edit", verifyToken, isBroker, clientController.getClientProfileEdit);
router.get("/clients/:id/profile/requestEdit", verifyToken, isBroker, clientController.getClientProfileRequestEdit);



router.post(
   "/clients/:id/profile/edit",
   verifyToken,
   isBroker,
   clientController.updateClientDirect
);

// Sensitive fields → admin approval
router.post(
   "/clients/:id/profile/requestEdit",
   verifyToken,
   isBroker,
   clientController.requestClientEdit
);






router.get("/clients/:id", verifyToken, isBroker, clientController.getClientDetails);
router.post("/clients/:id/stage", verifyToken, isBroker, clientController.updateClientStage);
router.post("/clients/:id/interest", verifyToken, isBroker, clientController.addClientInterest);
router.post(
   "/clients/:id/documents",
   verifyToken,
   isBroker,
   upload.single("document"),
   clientController.uploadClientDocument
);

router.get("/properties", verifyToken, isBroker, brokerController.searchProperties);









module.exports = router;
