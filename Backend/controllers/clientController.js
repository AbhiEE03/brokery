// controllers/clientController.js
const Client = require("../models/Client");
const mongoose = require("mongoose");


const ClientChangeRequest = require("../models/ClientChangeRequest");
const Property = require("../models/Property");
const {
  BROKER_EDITABLE_FIELDS,
  ADMIN_APPROVAL_FIELDS
} = require("../configs/clientEditRules");

/* =========================================================
   GET CLIENT PROFILE (READ ONLY – FULL DATA)
   ========================================================= */


exports.getClients = async (req, res) => {
  try {
    const {
      q,
      stage,
      priority,
      source,
    } = req.query;

    /* =====================
       BASE FILTER
       Broker sees only
       his own clients
    ===================== */
    const filter = {

    };

    /* =====================
       SEARCH
       name / phone / code
    ===================== */
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { clientCode: { $regex: q, $options: "i" } }, // optional, safe
      ];
    }

    /* =====================
       FILTERS
    ===================== */
    if (stage) {
      filter.pipelineStage = stage;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (source) {
      filter.source = source;
    }

    /* =====================
       QUERY
    ===================== */
    const clients = await Client.find(filter)
      .populate("currentBroker", "name")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: clients.length,
      clients,
    });

  } catch (err) {
    console.error("GET BROKER CRM CLIENTS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
    });
  }
};
const Counter = require("../models/Counter");
exports.addClient = async (req, res) => {
  try {
    const user = req.user;

    /* =========================
       AUTH CHECK
    ========================= */
    // const brokerId = new mongoose.Types.ObjectId(user.id);
    if (!user || user.role !== "broker") {
      return res.status(403).json({
        success: false,
        message: "Only brokers can add clients",
      });
    }

    const brokerId = new mongoose.Types.ObjectId(user._id);
    console.log("Broker is broker", brokerId)

    /* =========================
       BASIC VALIDATION
    ========================= */
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Client name is required",
      });
    }

    /* =========================
       GENERATE CLIENT CODE
    ========================= */
    const counter = await Counter.findOneAndUpdate(
      { key: "client" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const clientCode = `CL-${new Date().getFullYear()}-${String(
      counter.seq
    ).padStart(6, "0")}`;

    /* =========================
       CREATE CLIENT
    ========================= */
    const client = new Client({

      /* ---------- IDENTITY ---------- */
      clientCode,
      name: req.body.name,

      clientType: req.body.clientType || "buyer",
      entityType: req.body.entityType || "individual",
      companyName:
        req.body.entityType === "company"
          ? req.body.companyName || undefined
          : undefined,

      /* ---------- CONTACT ---------- */
      phone: req.body.phone || undefined,
      alternatePhone: req.body.alternatePhone || undefined,
      email: req.body.email || undefined,
      whatsappAvailable:
        typeof req.body.whatsappAvailable === "boolean"
          ? req.body.whatsappAvailable
          : true,
      preferredContactMode: req.body.preferredContactMode || "call",
      bestTimeToContact: req.body.bestTimeToContact || "morning",

      /* ---------- ADDRESS ---------- */
      addressDetails: {
        city: req.body.city,
        sector: req.body.sector,
        block: req.body.block,
        pocket: req.body.pocket,
        fullAddress: req.body.fullAddress,
        nativeCity: req.body.nativeCity,
      },

      /* ---------- LEAD SOURCE ---------- */
      source: req.body.source || "call",
      referredBy: req.body.referredBy || undefined,
      sourceQuality: req.body.sourceQuality || "warm",
      firstContactChannel: req.body.firstContactChannel || "call",

      inquiryType: req.body.inquiryType || "buy",
      leadQuality: req.body.leadQuality || "qualified",

      /* ---------- OWNERSHIP ---------- */
      owningCompany: "Main Company",
      currentBroker: brokerId,
      createdBy: brokerId,

      /* ---------- PIPELINE ---------- */
      pipelineStage: "lead",
      status: "active",
      priority: req.body.priority || "warm",

      /* ---------- REQUIREMENT PROFILE ---------- */
      requirementProfile: {
        propertyCategory: req.body.propertyCategory
          ? [req.body.propertyCategory]
          : [],
        preferredCity: req.body.preferredCity || undefined,
        preferredSectors: req.body.preferredSectors
          ? req.body.preferredSectors.split(",")
          : [],
        bhkPreference: req.body.bhkPreference || undefined,
        areaRange: {
          min: Number(req.body.areaMin) || undefined,
          max: Number(req.body.areaMax) || undefined,
        },
        facingPreference: req.body.facingPreference || undefined,
        floorPreference: req.body.floorPreference || undefined,
        furnishingPreference: req.body.furnishing || undefined,
        urgencyLevel: req.body.urgency || undefined,
      },

      /* ---------- BUDGET ---------- */
      budget: {
        min: Number(req.body.budgetMin) || 0,
        max: Number(req.body.budgetMax) || 0,
        verified: false,
      },

      priceSensitivity: req.body.priceSensitivity || undefined,

      /* ---------- ACTIVITY ---------- */
      totalSiteVisits: Number(req.body.totalSiteVisits) || 0,
      lastSiteVisitDate: req.body.lastSiteVisitDate || undefined,
      clientFeedback: req.body.clientFeedback || undefined,
      rejectionReason: req.body.rejectionReason || undefined,

      /* ---------- NEGOTIATION ---------- */
      negotiation: {
        currentStage: req.body.negotiationStage || "inquiry",
        offerMade: Boolean(req.body.offerMade) || false,
        offerAmount: undefined,
        counterNotes: undefined,
        decisionProbability: req.body.decisionProbability || undefined,
      },

      /* ---------- FOLLOW UP ---------- */
      clientStatus: "active",
      followUpPriority: req.body.followUpPriority || "medium",

      /* ---------- INTERNAL ---------- */
      dealerNotes: req.body.dealerNotes || undefined,
      redFlags: req.body.redFlags || undefined,
      reliabilityScore: req.body.reliabilityScore || undefined,
      repeatClient: Boolean(req.body.repeatClient) || false,
      referralPotential: req.body.referralPotential || undefined,

      /* ---------- AUDIT ---------- */
      lastUpdatedBy: brokerId,
    });

    await client.save();

    await client.populate("currentBroker", "name email role");

    return res.status(201).json({
      success: true,
      message: "Client added successfully",
      client,
      clientId: client._id // 🔒 extra safety
    });

  } catch (err) {
    console.error("ADD CLIENT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to add client",
    });
  }
};







exports.getClientProfile = async (req, res) => {
  try {
    console.log("▶️ GET CLIENT PROFILE");
    console.log("Client ID:", req.params.id);
    console.log("Requested by user:", req.user?._id);
    console.log("Requested by user consloing :", req.user);

    // 1️⃣ Check client exists BEFORE populate
    const exists = await Client.findById(req.params.id).select("_id createdBy");
    console.log("Client exists:", !!exists);

    if (!exists) {
      console.warn("❌ Client not found:", req.params.id);
      return res.status(404).json({ message: "Client not found" });
    }

    // 2️⃣ Main fetch + populate
    console.log("⏳ Fetching client with relations...");

    const client = await Client.findById(req.params.id)
      .select("+addressDetails")
      .populate("currentBroker", "name email")
      .populate("createdBy", "name email")
      .populate("assignedDealer", "name")
      .populate("deal.property")
      // ✅ SAFE NESTED POPULATE
      .populate({
        path: "interestedIn",
        populate: {
          path: "property",
          model: "Property"
        }
      })
      .populate("shortlistedProperties");

    console.log("✅ Client fetched");
    console.log(client)

    // 3️⃣ Debug populated fields (without dumping data)
    console.log("Has interestedIn:", Array.isArray(client.interestedIn));
    console.log(
      "Interested properties populated:",
      client.interestedIn?.map(i => ({
        id: i.property?._id,
        populated: !!i.property
      }))
    );

    // 4️⃣ Permission check
    const canEditDirect = client.currentBroker?.equals(req.user._id);
    console.log("Can edit directly:", canEditDirect);

    return res.json({
      client,
      permissions: {
        canEditDirect,
        requiresApproval: ADMIN_APPROVAL_FIELDS
      }
    });

  } catch (err) {
    console.error("🔥 GET CLIENT PROFILE ERROR");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Stack:", err.stack);

    res.status(500).json({
      message: "Failed to fetch client profile",
      error: err.message
    });
  }
};





// exports.getClientProfile = async (req, res) => {
//   try {
//     const client = await Client.findById(req.params.id)
//       .populate("currentBroker", "name email")
//       .populate("createdBy", "name email")
//       .populate("assignedDealer", "name")
//       .populate("deal.property")
//       .populate("interestedIn.property")
//       .populate("shortlistedProperties");

//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     return res.json({
//       client,
//       permissions: {
//         canEditDirect: client.createdBy?.equals(req.user.id),
//         requiresApproval: ADMIN_APPROVAL_FIELDS
//       }
//     });

//   } catch (err) {
//     console.error("GET CLIENT PROFILE ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
/* =========================================================
   GET CLIENT PROFILE (EDITABLE FIELDS ONLY)
   → ONLY CREATOR BROKER
========================================================= */
exports.getClientProfileEdit = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // 🔒 only creator broker can edit
    if (!client.currentBroker.equals(req.user._id)) {
      return res.status(403).json({
        message: "You are not allowed to edit this client"
      });
    }

    const editableData = {
      /* ================= CONTACT ================= */
      phone: client.phone,
      alternatePhone: client.alternatePhone,
      email: client.email,
      whatsappAvailable: client.whatsappAvailable,
      preferredContactMode: client.preferredContactMode,
      bestTimeToContact: client.bestTimeToContact,

      /* ================= ADDRESS ================= */
      addressDetails: {
        city: client.addressDetails?.city,
        sector: client.addressDetails?.sector,
        block: client.addressDetails?.block,
        pocket: client.addressDetails?.pocket,
        fullAddress: client.addressDetails?.fullAddress,
        nativeCity: client.addressDetails?.nativeCity,
      },

      /* ================= LEAD ================= */
      source: client.source,
      sourceQuality: client.sourceQuality,
      referredBy: client.referredBy,
      firstContactChannel: client.firstContactChannel,

      /* ================= REQUIREMENTS ================= */
      requirementProfile: {
        propertyCategory: client.requirementProfile?.propertyCategory || [],
        preferredCity: client.requirementProfile?.preferredCity,
        preferredSectors: client.requirementProfile?.preferredSectors || [],
        bhkPreference: client.requirementProfile?.bhkPreference,
        areaRange: client.requirementProfile?.areaRange || {},
        facingPreference: client.requirementProfile?.facingPreference,
        floorPreference: client.requirementProfile?.floorPreference,
        furnishingPreference: client.requirementProfile?.furnishingPreference,
        urgencyLevel: client.requirementProfile?.urgencyLevel,
      },

      /* ================= ACTIVITY ================= */
      clientFeedback: client.clientFeedback,
      totalSiteVisits: client.totalSiteVisits,
      lastSiteVisitDate: client.lastSiteVisitDate,
      rejectionReason: client.rejectionReason,

      /* ================= FOLLOW UP ================= */
      nextFollowUpAt: client.nextFollowUpAt,
      nextAction: client.nextAction,
      followUpPriority: client.followUpPriority,

      /* ================= INTERNAL ================= */
      dealerNotes: client.dealerNotes,
      redFlags: client.redFlags,
    };

    return res.json({
      clientId: client._id,
      editableData,
      lockedFields: ADMIN_APPROVAL_FIELDS
    });

  } catch (err) {
    console.error("CLIENT EDIT LOAD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================================================
   REQUEST CLIENT EDIT (SENSITIVE FIELDS)
========================================================= */
exports.getClientProfileRequestEdit = async (req, res) => {
  try {
    const { changes } = req.body;

    if (!changes || Object.keys(changes).length === 0) {
      return res.status(400).json({ message: "No changes provided" });
    }

    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (!client.createdBy.equals(req.user._id)) {
      return res.status(403).json({
        message: "Only creator broker can request edits"
      });
    }

    // 🚨 Validate sensitive fields
    const invalidFields = Object.keys(changes).filter(
      field => !ADMIN_APPROVAL_FIELDS.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid or non-requestable fields",
        invalidFields
      });
    }

    // 🧠 Create change request
    const request = await ClientChangeRequest.create({
      clientId: client._id,
      requestedBy: req.user._id,
      requestedChanges: changes
    });

    res.json({
      message: "Edit request sent for admin approval",
      requestId: request._id
    });

  } catch (err) {
    console.error("REQUEST EDIT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   UPDATE CLIENT (DIRECT – SAFE FIELDS)
========================================================= */
exports.updateClientDirect = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // 🔒 Only creator broker
    if (!client.currentBroker.equals(req.user._id)) {
      return res.status(403).json({
        message: "You are not allowed to update this client"
      });
    }

    const updates = {};

    // ✅ Only allow safe fields
    BROKER_EDITABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields to update"
      });
    }

    updates.lastUpdatedBy = req.user._id;

    await Client.findByIdAndUpdate(
      client._id,
      { $set: updates },
      { new: true }
    );

    res.json({
      message: "Client updated successfully",
      updatedFields: Object.keys(updates)
    });

  } catch (err) {
    console.error("DIRECT UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================================================
   REQUEST CLIENT EDIT (ADMIN APPROVAL REQUIRED)
========================================================= */
exports.requestClientEdit = async (req, res) => {
  try {
    const { proposedChanges, reason } = req.body;

    if (!proposedChanges || Object.keys(proposedChanges).length === 0) {
      return res.status(400).json({ message: "No changes provided" });
    }

    if (!reason?.trim()) {
      return res.status(400).json({ message: "Reason is required" });
    }

    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (!client.createdBy.equals(req.user.id)) {
      return res.status(403).json({
        message: "Only creator broker can request edits"
      });
    }

    // 🚫 prevent duplicate pending request
    const existing = await ClientChangeRequest.findOne({
      clientId: client._id,
      status: "pending"
    });

    if (existing) {
      return res.status(409).json({
        message: "A request is already pending"
      });
    }

    // ✅ IMPORTANT: save FLAT suggested values
    const request = await ClientChangeRequest.create({
      clientId: client._id,
      requestedBy: req.user.id,
      requestedChanges: proposedChanges, // 👈 FLAT OBJECT
      reason,
      status: "pending"
    });

    return res.status(201).json({
      success: true,
      message: "Change request submitted",
      requestId: request._id
    });

  } catch (err) {
    console.error("REQUEST CLIENT EDIT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};




exports.addClientInterest = async (req, res) => {
  try {
    const brokerId = req.user._id;
    const { id: clientId } = req.params;
    const { propertyId, interestLevel } = req.body;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const property = await Property.findById(propertyId).select("_id");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // prevent duplicate interest
    const exists = client.interestedIn?.some(
      i => i.property?.toString() === propertyId
    );

    if (exists) {
      return res.status(409).json({
        message: "Interest already added"
      });
    }

    client.interestedIn.push({
      property: propertyId,
      interestLevel: interestLevel || "medium",
      addedAt: new Date()
    });
    // 🛡️ ensure enum-safe save
    if (!client.status) {
      client.status = "active";
    }

    await client.save();

    res.json({
      success: true,
      message: "Interest added"
    });

  } catch (err) {
    console.error("ADD INTEREST ERROR:", err);
    res.status(500).json({ message: "Failed to add interest" });
  }
};










exports.getClientDetails = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate("interestedIn.property", "propertyName location.city")
      .lean();

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({ client });
  } catch (err) {
    console.error("GET CLIENT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch client" });
  }
};


exports.updateClientStage = async (req, res) => {
  try {
    const { stage, note } = req.body;

    await Client.findByIdAndUpdate(req.params.id, {
      pipelineStage: stage,
      $push: note
        ? {
          notes: {
            text: note,
            createdAt: new Date()
          }
        }
        : {}
    });

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE STAGE ERROR:", err);
    res.status(500).json({ message: "Failed to update stage" });
  }
};

// exports.addClientInterest = async (req, res) => {
//   try {
//     const { propertyId, level } = req.body;

//     const client = await Client.findById(req.params.id);
//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     const exists = client.interestedIn?.some(
//       i => i.property?.toString() === propertyId
//     );

//     if (exists) {
//       return res.status(409).json({ message: "Interest already exists" });
//     }

//     client.interestedIn.push({
//       property: propertyId,
//       interestLevel: level || "medium",
//       addedAt: new Date()
//     });

//     await client.save();

//     res.json({ success: true });
//   } catch (err) {
//     console.error("ADD INTEREST ERROR:", err);
//     res.status(500).json({ message: "Failed to add interest" });
//   }
// };


exports.searchProperties = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) return res.json({ properties: [] });

    const properties = await Property.find({
      propertyName: { $regex: q, $options: "i" }
    })
      .select("propertyName location.city")
      .limit(10)
      .lean();

    res.json({ properties });
  } catch (err) {
    console.error("PROPERTY SEARCH ERROR:", err);
    res.status(500).json({ message: "Search failed" });
  }
};



const path = require("path");

exports.uploadClientDocument = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const file = req.file;

    client.documents.push({
      type: req.body.type,
      name: req.body.name,
      fileUrl: `/uploads/${file.filename}`,
      uploadedAt: new Date()
    });

    await client.save();

    res.json({ success: true });
  } catch (err) {
    console.error("UPLOAD DOC ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};



// controllers/clientController.js
// const Client = require("../models/Client");
// const ClientChangeRequest = require("../models/ClientChangeRequest");


/* =========================================================
   GET CLIENT PROFILE (READ ONLY – FULL DATA)
========================================================= */
// exports.getClientProfile = async (req, res) => {
//   try {
//     const client = await Client.findById(req.params.id)
//       .populate("currentBroker", "name email")
//       .populate("createdBy", "name email")
//       .populate("assignedDealer", "name")
//       .populate("deal.property")
//       .populate("interestedIn.property")
//       .populate("shortlistedProperties");

//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     return res.json({
//       client,
//       permissions: {
//         canEditDirect: client.createdBy?.equals(req.user._id),
//         requiresApproval: ADMIN_APPROVAL_FIELDS
//       }
//     });

//   } catch (err) {
//     console.error("GET CLIENT PROFILE ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

