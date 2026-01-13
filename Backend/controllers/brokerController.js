const mongoose = require("mongoose");
const Client = require("../models/Client");
const Property = require("../models/Property");
const path = require("path");

/* ======================
   BROKER DASHBOARD
====================== */
// exports.dashboard = async (req, res) => {
//   try {
//     const brokerId = new mongoose.Types.ObjectId(req.user.id);

//     /* KPI STATS */
//     const statsAgg = await Client.aggregate([
//       { $match: { currentBroker: brokerId } },
//       {
//         $group: {
//           _id: null,
//           totalClients: { $sum: 1 },
//           activeLeads: {
//             $sum: {
//               $cond: [
//                 {
//                   $in: [
//                     "$pipelineStage",
//                     ["lead", "contacted", "site_visit", "negotiation"]
//                   ]
//                 },
//                 1,
//                 0
//               ]
//             }
//           },
//           hotLeads: {
//             $sum: { $cond: [{ $eq: ["$priority", "hot"] }, 1, 0] }
//           },
//           dealsClosed: {
//             $sum: { $cond: [{ $eq: ["$pipelineStage", "deal_closed"] }, 1, 0] }
//           },
//           revenue: { $sum: "$deal.dealValue" },
//           commission: { $sum: "$deal.commission" }
//         }
//       }
//     ]);

//     const stats = statsAgg[0] || {
//       totalClients: 0,
//       activeLeads: 0,
//       hotLeads: 0,
//       dealsClosed: 0,
//       revenue: 0,
//       commission: 0
//     };

//     /* PIPELINE */
//     const pipelineAgg = await Client.aggregate([
//       { $match: { currentBroker: brokerId } },
//       { $group: { _id: "$pipelineStage", count: { $sum: 1 } } }
//     ]);

//     const pipeline = {
//       lead: 0,
//       contacted: 0,
//       site_visit: 0,
//       negotiation: 0,
//       deal_closed: 0,
//       deal_lost: 0
//     };

//     pipelineAgg.forEach(p => {
//       pipeline[p._id] = p.count;
//     });

//     /* ACTIONS */
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const staleDate = new Date();
//     staleDate.setDate(staleDate.getDate() - 5);

//     const actions = {
//       followUpsToday: await Client.countDocuments({
//         currentBroker: brokerId,
//         nextFollowUpAt: { $gte: today }
//       }),
//       staleLeads: await Client.countDocuments({
//         currentBroker: brokerId,
//         pipelineStage: { $in: ["lead", "contacted"] },
//         lastContactedAt: { $lte: staleDate }
//       }),
//       pendingNegotiations: await Client.countDocuments({
//         currentBroker: brokerId,
//         pipelineStage: "negotiation"
//       })
//     };

//     /* INVENTORY */
//     const inventoryAgg = await Property.aggregate([
//       { $match: { status: "available" } },
//       {
//         $group: {
//           _id: null,
//           available: { $sum: 1 },
//           keysAvailable: { $sum: { $cond: ["$keyAvailable", 1, 0] } },
//           residential: {
//             $sum: {
//               $cond: [
//                 { $in: ["$category", ["floor", "flat", "kothi"]] },
//                 1,
//                 0
//               ]
//             }
//           },
//           commercial: {
//             $sum: { $cond: [{ $eq: ["$category", "commercial"] }, 1, 0] }
//           }
//         }
//       }
//     ]);

//     const inventory = inventoryAgg[0] || {
//       available: 0,
//       keysAvailable: 0,
//       residential: 0,
//       commercial: 0
//     };

//     /* RECENT EVENTS */
//     const recentClients = await Client.find({ currentBroker: brokerId })
//       .sort({ updatedAt: -1 })
//       .limit(5)
//       .select("pipelineStage deal updatedAt");

//     const events = recentClients.map(c => ({
//       title:
//         c.pipelineStage === "deal_closed"
//           ? `Deal Closed – ₹${(c.deal?.dealValue || 0).toLocaleString()}`
//           : `Pipeline Updated → ${c.pipelineStage.replace("_", " ")}`,
//       time: c.updatedAt
//     }));

//     res.json({
//       success: true,
//       stats,
//       pipeline,
//       actions,
//       inventory,
//       events
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Broker dashboard failed"
//     });
//   }
// };


// const Property = require("../models/Property");




exports.dashboard = async (req, res) => {
  try {
    const brokerId = req.user._id;

    /* =========================
       CLIENT STATS
    ========================= */
    const clients = await Client.find({ createdBy: brokerId }).lean();

    const totalClients = clients.length;

    const pipeline = {
      lead: 0,
      contacted: 0,
      site_visit: 0,
      negotiation: 0,
      deal_closed: 0,
      deal_lost: 0
    };

    let hotLeads = 0;
    let dealsClosed = 0;
    let revenue = 0;
    let commission = 0;

    clients.forEach(c => {
      if (c.pipelineStage && pipeline[c.pipelineStage] !== undefined) {
        pipeline[c.pipelineStage]++;
      }

      if (c.priority === "high") hotLeads++;

      if (c.pipelineStage === "deal_closed") {
        dealsClosed++;
        revenue += Number(c.dealValue || 0);
        commission += Number(c.commission || 0);
      }
    });

    /* =========================
       WEEKLY DELTA (LAST 7 DAYS)
    ========================= */
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const weeklyClients = clients.filter(
      c => new Date(c.createdAt) >= since
    );

    const weeklyPipeline = {
      lead: 0,
      contacted: 0,
      site_visit: 0,
      negotiation: 0,
      deal_closed: 0,
      deal_lost: 0
    };

    let weeklyHotLeads = 0;
    let weeklyDealsClosed = 0;
    let weeklyRevenue = 0;

    weeklyClients.forEach(c => {
      if (c.pipelineStage && weeklyPipeline[c.pipelineStage] !== undefined) {
        weeklyPipeline[c.pipelineStage]++;
      }

      if (c.priority === "high") weeklyHotLeads++;

      if (c.pipelineStage === "deal_closed") {
        weeklyDealsClosed++;
        weeklyRevenue += Number(c.dealValue || 0);
      }
    });

    /* =========================
       INVENTORY MIX
    ========================= */
    const properties = await Property.find({ createdBy: brokerId }).lean();

    const inventory = {
      residential: properties.filter(p => p.category === "residential").length,
      commercial: properties.filter(p => p.category === "commercial").length
    };

    /* =========================
       FINAL RESPONSE
    ========================= */
    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        role: req.user.role
      },
      stats: {
        totalClients,
        activeLeads: pipeline.lead + pipeline.contacted,
        hotLeads,
        dealsClosed,
        revenue,
        commission
      },
      pipeline,
      weekly: {
        stats: {
          newClients: weeklyClients.length,
          newHotLeads: weeklyHotLeads,
          dealsClosed: weeklyDealsClosed,
          revenue: weeklyRevenue
        },
        pipeline: weeklyPipeline
      },
      inventory,
      events: []
    });

  } catch (err) {
    console.error("BROKER DASHBOARD ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard"
    });
  }
};


const PropertyEditRequest = require("../models/PropertyChangeRequest");

const Match = require("../models/Match");

exports.getBrokerMatches = async (req, res) => {
  try {
    const brokerId = req.user._id;

    const clients = await Client.find({ createdBy: brokerId })
      .populate("interestedIn.property", "propertyName location.city priceLakhs availabilityStatus")
      .select("name email interestedIn")
      .lean();

    const matches = [];

    clients.forEach(client => {
      (client.interestedIn || []).forEach(i => {
        if (!i.property) return;

        matches.push({
          client: {
            _id: client._id,
            name: client.name,
            email: client.email
          },
          property: {
            _id: i.property._id,
            name: i.property.propertyName,
            city: i.property.location?.city,
            priceLakhs: i.property.priceLakhs,
            status: i.property.availabilityStatus
          },
          interestLevel: i.interestLevel,
          addedAt: i.addedAt
        });
      });
    });

    res.json({
      success: true,
      matches
    });

  } catch (err) {
    console.error("GET BROKER MATCHES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch matches"
    });
  }
};



exports.getBrokerPropertyDetails = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const brokerId = req.user._id;

    /* =======================
       FETCH PROPERTY
    ======================= */
    const property = await Property.findById(propertyId).lean();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    /* =======================
       CHECK PENDING REQUEST
    ======================= */
    const pendingRequest = await PropertyEditRequest.exists({
      property: propertyId,
      broker: brokerId,
      status: "pending"
    });

    /* =======================
       SHAPE DEALER INFO
       (matches frontend)
    ======================= */
    const dealer = {
      type: property.dealerType,
      name: property.dealerName,
      mobile: property.dealerMobile,
      source: property.dealerSource,
      referredBy: property.referredBy
    };

    return res.json({
      success: true,
      property: {
        ...property,
        dealer // 👈 frontend uses property.dealer?.name etc.
      },
      pendingRequest: !!pendingRequest
    });

  } catch (err) {
    console.error("GET BROKER PROPERTY DETAILS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch property details"
    });
  }
};



/* ======================
   UPDATE CLIENT STAGE
====================== */
exports.updateClientStage = async (req, res) => {
  try {
    const { stage } = req.body;

    await Client.findByIdAndUpdate(req.params.id, {
      pipelineStage: stage,
      lastUpdatedBy: req.user.id,
      $push: {
        activityLog: {
          action: `Stage updated to ${stage}`,
          createdBy: req.user.id
        }
      }
    });

    res.json({
      success: true,
      message: "Client stage updated"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Stage update failed"
    });
  }
};

/* ======================
   UPLOAD CLIENT DOCUMENT
====================== */
exports.uploadClientDocument = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    client.documents.push({
      originalName: req.file.originalname,
      type: req.body.type,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      uploadedBy: req.user.id,
      uploadedAt: new Date()
    });

    await client.save();

    res.json({
      success: true,
      message: "Document uploaded"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Document upload failed"
    });
  }
};

/* ======================
   DOWNLOAD CLIENT DOCUMENT
====================== */
exports.downloadClientDocument = async (req, res) => {
  try {
    const { clientId, docId } = req.params;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    const doc = client.documents.id(docId);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    res.download(path.resolve(doc.fileUrl), doc.originalName);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Download failed"
    });
  }
};

/* ======================
   ADD CLIENT (DATA ONLY)
====================== */
exports.addClientPage = async (req, res) => {
  const properties = await Property.find({ status: "available" });
  res.json({
    success: true,
    properties
  });
};




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



exports.getClientDocuments = async (req, res) => {
  try {
    const brokerId = req.user._id;

    // 1️⃣ Fetch only clients handled by this broker
    const clients = await Client.find({
      createdBy: brokerId
    })
      .select("name documents")
      .lean();

    // 2️⃣ Group documents by client
    const documentsByClient = clients
      .filter(c => Array.isArray(c.documents) && c.documents.length > 0)
      .map(client => ({
        client: {
          _id: client._id,
          name: client.name
        },
        documents: client.documents.map(doc => ({
          _id: doc._id,
          originalName: doc.name,
          type: doc.type,
          uploadedAt: doc.uploadedAt,
          fileUrl: doc.fileUrl
        }))
      }));

    return res.json({
      success: true,
      documentsByClient
    });

  } catch (err) {
    console.error("BROKER DOCUMENTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch client documents"
    });
  }
};
