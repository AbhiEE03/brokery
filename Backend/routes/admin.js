const router = require("express").Router();
const { verifyToken, isAdmin } = require("../middleware/auth");

const adminController = require("../controllers/adminController");
// const adminClientController = require("../controllers/adminClientController");
const propertyController = require("../controllers/propertyController");
const userController = require("../controllers/userController");
const adminClientController = require("../controllers/adminClientController");
const upload = require("../middleware/upload");
const FormConfig = require("../models/FormConfig");

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
  "/dealers",
  verifyToken,
  isAdmin,
  propertyController.getAllDealersAdmin
);
router.get(
  "/dealers/meta",
  verifyToken,
  isAdmin,
  propertyController.getDealerMeta
);
router.get(
  "/extentions",
  verifyToken,
  isAdmin,
  propertyController.getAllExtentionsAdmin
);

router.get(
  "/extentions/meta",
  verifyToken,
  isAdmin,
  propertyController.getExtentionMeta
);

router.get(
  "/flats",
  verifyToken,
  isAdmin,
  propertyController.getAllFlatsAdmin
);

router.get(
  "/floors",
  verifyToken,
  isAdmin,
  propertyController.getAllFloorsAdmin
);
router.get(
  "/floors/meta",
  verifyToken,
  isAdmin,
  propertyController.getFloorMeta
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




router.get("/form-config/property", async (req, res) => {
  const config = await FormConfig.findOne({ formKey: "property_form" });
  res.json(config);
});



// const FormConfig = require("../models/FormConfig");



router.post("/seed-property-form", async (req, res) => {
  await FormConfig.deleteOne({ formKey: "property_form" });

  const config = await FormConfig.create({
    formKey: "property_form",
    pages: [
      {
        id: "step_1",
        title: "Basic Details",
        fields: [
          {
            key: "propertyTitle",
            label: "Ownership",
            type: "select",
            options: ["FREEHOLD", "LEASEHOLD"]
          },
          {
            key: "category",
            label: "Category",
            type: "select",
            options: []

          },
          {
            key: "propertyType",
            label: "Property Type",
            type: "select",
            options: []
          },
          {
            key: "description",
            label: "Property Description",
            type: "textarea"
          }
        ]
      },

      {
        id: "step_2",
        title: "Configuration & Pricing",
        fields: [
          {
            key: "bhk",
            label: "BHK",
            type: "select",
            options: ["1", "2", "3", "4"]
          },
          {
            key: "layout",
            label: "Layout",
            type: "select",
            options: ["1/1", "2+1/1", "3+1/1", "3+1/2", "4+1/2", "4+1/3"]
          },
          {
            key: "facing",
            label: "Facing",
            type: "select",
            options: ["north", "south", "east", "west"]
          },
          {
            key: "furnishing",
            label: "Furnishing",
            type: "select",
            options: ["furnished", "semi-furnished", "unfurnished"]
          },
          {
            key: "bedrooms",
            label: "Bedrooms",
            type: "number"
          },
          {
            key: "bathrooms",
            label: "Bathrooms",
            type: "number"
          },
          {
            key: "balconies",
            label: "Balconies",
            type: "number"
          },
          {
            key: "floorNumber",
            label: "Floor Number",
            type: "number"
          },
          {
            key: "totalFloors",
            label: "Total Floors",
            type: "number"
          },
          {
            key: "areaSqFt",
            label: "Area (Sq Ft)",
            type: "number"
          },
          {
            key: "priceLakhs",
            label: "Price (Lakhs)",
            type: "number"
          },
          {
            key: "netPrice",
            label: "Net Price",
            type: "number"
          },
          {
            key: "demand",
            label: "Demand",
            type: "text"
          }
        ]
      },

      {
        id: "step_3",
        title: "Location & Amenities",
        fields: [
          {
            key: "city",
            label: "City",
            type: "text"
          },
          {
            key: "sector",
            label: "Sector",
            type: "text"
          },
          {
            key: "block",
            label: "Block",
            type: "text"
          },
          {
            key: "pocket",
            label: "Pocket",
            type: "text"
          },
          {
            key: "road",
            label: "Road",
            type: "text"
          },
          {
            key: "locality",
            label: "Locality",
            type: "text"
          },
          {
            key: "pincode",
            label: "Pincode",
            type: "text"
          },
          {
            key: "address",
            label: "Full Address",
            type: "textarea"
          },
          {
            key: "amenities",
            label: "Amenities",
            type: "amenities"
          }
        ]
      }
    ]
  });

  res.json(config);
});






/**
 * UPDATE PROPERTY FORM CONFIG
 * PUT /admin/form-config/property
 */
router.put("/form-config/property", async (req, res) => {
  try {
    const { pages } = req.body;

    if (!pages || !Array.isArray(pages)) {
      return res.status(400).json({
        success: false,
        message: "Invalid form configuration",
      });
    }

    const updatedConfig = await FormConfig.findOneAndUpdate(
      { formKey: "property_form" },
      {
        formKey: "property_form",
        pages,
      },
      {
        new: true,        // return updated doc
        upsert: true,     // create if not exists
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: updatedConfig,
    });

  } catch (error) {
    console.error("FORM CONFIG UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update form configuration",
    });
  }
});







module.exports = router;