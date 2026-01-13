// controllers/adminController.js
const User = require("../models/User");
const Property = require("../models/Property");

// const User = require("../models/User");
// const Property = require("../models/Property");
// const Lead = require("../models/Lead");
// const Deal = require("../models/Deal");

// const Property = require("../models/Property");
// const User = require("../models/User");
const Client = require("../models/Client");
const PropertyChangeRequest = require("../models/PropertyChangeRequest");

/* ======================
   ADMIN DASHBOARD
====================== */
exports.dashboard = async (req, res) => {
  try {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const [
      totalProperties,
      totalBrokers,
      totalClients,
      activeDeals
    ] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments({ role: "broker", isActive: true }),
      Client.countDocuments(),
      Client.countDocuments({ pipelineStage: "negotiation" })
    ]);

    const [monthlyClients, monthlyConversions] = await Promise.all([
      Client.countDocuments({
        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth }
      }),
      Client.countDocuments({
        pipelineStage: "deal_closed",
        "deal.closedAt": { $gte: startOfMonth, $lt: startOfNextMonth }
      })
    ]);

    const conversionRate =
      monthlyClients === 0
        ? 0
        : Number(((monthlyConversions / monthlyClients) * 100).toFixed(1));

    const leadsAgg = await Client.aggregate([
      { $match: { createdAt: { $gte: last7Days[0] } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      }
    ]);

    const leadsChart = last7Days.map(d => {
      const key = d.toISOString().slice(0, 10);
      return leadsAgg.find(l => l._id === key)?.count ?? 0;
    });

    const revenueAgg = await Client.aggregate([
      {
        $match: {
          pipelineStage: "deal_closed",
          "deal.closedAt": { $gte: last7Days[0] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$deal.closedAt" } },
          total: { $sum: "$deal.dealValue" }
        }
      }
    ]);

    const revenueChart = last7Days.map(d => {
      const key = d.toISOString().slice(0, 10);
      const total = revenueAgg.find(r => r._id === key)?.total ?? 0;
      return Math.round(total / 100000);
    });

    const inventory = { plot: 0, flat: 0, kothi: 0, commercial: 0 };

    const inventoryAgg = await Property.aggregate([
      { $match: { category: { $in: Object.keys(inventory) } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    inventoryAgg.forEach(i => (inventory[i._id] = i.count));

    res.json({
      success: true,
      stats: {
        totalProperties,
        totalBrokers,
        totalClients,
        activeDeals,
        conversionRate
      },
      charts: {
        leads: leadsChart,
        revenue: revenueChart,
        inventory
      }
    });
  } catch (err) {
    console.error("Admin Dashboard Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard"
    });
  }
};




exports.getClients = async (req, res) => {
  try {
    const {
      q,
      broker,
      pipelineStage,
      priority,
      status,
    } = req.query;

    const filter = {};

    /* =====================
       SEARCH (name / phone)
    ===================== */
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }

    /* =====================
       FILTERS
    ===================== */
    if (broker) {
      // support both fields safely
      filter.$or = [

        { currentBroker: broker },
      ];
    }

    if (pipelineStage) {
      filter.pipelineStage = pipelineStage;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (status) {
      filter.status = status;
    }

    /* =====================
       QUERY CLIENTS
    ===================== */
    const clients = await Client.find(filter)

      .populate("currentBroker", "name")
      .sort({ createdAt: -1 });

    /* =====================
       QUERY BROKERS (for filters)
    ===================== */
    const brokers = await User.find({ role: "broker" })
      .select("name")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      clients,
      brokers,
    });

  } catch (err) {
    console.error("GET CLIENTS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
    });
  }
};




// const Property = require("../models/Property");

exports.getAdminPropertyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id).lean();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    /* =========================
       NORMALIZE DEALER OBJECT
       (matches frontend usage)
    ========================= */
    property.dealer = {
      type: property.dealerType,
      name: property.dealerName,
      mobile: property.dealerMobile,
      source: property.dealerSource,
      referredBy: property.referredBy
    };

    /* =========================
       IMAGE SAFETY
    ========================= */
    property.images = Array.isArray(property.images)
      ? property.images
      : [];

    /* =========================
       FLOOR INFO SAFETY
    ========================= */
    property.floorInfo = property.floorInfo || null;

    /* =========================
       LOCATION SAFETY
    ========================= */
    property.location = property.location || {};

    /* =========================
       AMENITIES SAFETY
    ========================= */
    property.amenities = property.amenities || {};

    return res.json({
      success: true,
      property
    });

  } catch (err) {
    console.error("ADMIN PROPERTY DETAILS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load property"
    });
  }
};


// const Client = require("../models/Client");

/**
 * GET /admin/clients/:id
 * Full admin-only client profile
 */
exports.getAdminClientProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id)
      .populate("currentBroker", "name email phone")
      .populate("createdBy", "name email")
      .populate("assignedDealer", "name")
      .populate({
        path: "interestedIn.property",
        select: "propertyName location priceLakhs availabilityStatus"
      })
      .populate({
        path: "documents.uploadedBy",
        select: "name email"
      })
      .lean(); // IMPORTANT for performance

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    res.json({
      success: true,
      client
    });

  } catch (err) {
    console.error("ADMIN GET CLIENT PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load client profile"
    });
  }
};













exports.clientDetails = async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Client details for ${id}` });
};

exports.getBrokers = async (req, res) => {
  res.json({ message: "Get all brokers" });
};

exports.addBroker = async (req, res) => {
  res.json({ message: "Broker added" });
};

exports.reports = async (req, res) => {
  res.json({ message: "Admin reports" });
};

// const Property = require("../models/Property");
const PropertyEditRequest = require("../models/PropertyChangeRequest");
function buildDiff(original = {}, proposed = {}) {
  const diff = {};

  if (!original || !proposed) return diff;

  for (const key of Object.keys(proposed)) {
    const oldVal = original[key];
    const newVal = proposed[key];

    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      diff[key] = {
        old: oldVal ?? null,
        new: newVal ?? null
      };
    }
  }

  return diff;
}


exports.getPropertyChangeRequests = async (req, res) => {
  try {
    const requests = await PropertyEditRequest.find()
      .populate("property", "propertyName propertyCode")
      .populate("broker", "name")
      .sort({ createdAt: -1 })
      .lean();

    const enriched = await Promise.all(
      requests.map(async (r) => {
        let changes = {};

        if (r.property) {
          const property = await Property.findById(r.property._id).lean();
          changes = buildDiff(property, r.proposedChanges);
        }

        return {
          _id: r._id,
          property: r.property,
          requestedBy: r.broker,
          createdAt: r.createdAt,
          status: r.status,
          changes
        };
      })
    );

    res.json({
      success: true,
      requests: enriched
    });

  } catch (err) {
    console.error("ADMIN GET REQUESTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests"
    });
  }
};



exports.approvePropertyChange = async (req, res) => {
  try {
    const adminId = req.user._id;
    const requestId = req.params.id;

    /* =======================
       LOAD REQUEST
    ======================= */
    const request = await PropertyEditRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.status(404).json({
        success: false,
        message: "Request not found or already processed"
      });
    }

    /* =======================
       LOAD PROPERTY
    ======================= */
    const property = await Property.findById(request.property);

    if (!property) {
      request.status = "rejected";
      request.reviewedBy = adminId;
      request.reviewNotes = "Property no longer exists";
      await request.save();

      return res.status(404).json({
        success: false,
        message: "Property not found — request rejected"
      });
    }

    /* =======================
       APPLY CHANGES (SAFE)
    ======================= */
    const updates = { ...request.proposedChanges };

    // 🔑 dealer normalization safety (if old data exists)
    if (updates.dealer) {
      updates.dealerType = updates.dealer.type;
      updates.dealerName = updates.dealer.name;
      updates.dealerMobile = updates.dealer.mobile;
      updates.dealerSource = updates.dealer.source;
      delete updates.dealer;
    }

    Object.assign(property, updates);
    await property.save();

    /* =======================
       MARK REQUEST APPROVED
    ======================= */
    request.status = "approved";
    request.reviewedBy = adminId;
    await request.save();

    return res.json({
      success: true,
      message: "Property updated successfully"
    });

  } catch (err) {
    console.error("APPROVE PROPERTY CHANGE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to approve property change"
    });
  }
};


exports.rejectPropertyChange = async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Property change request ${id} rejected` });
};


