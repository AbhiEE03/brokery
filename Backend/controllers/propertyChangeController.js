const Property = require("../models/Property");
const PropertyEditRequest = require("../models/PropertyChangeRequest");

exports.requestPropertyEdit = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const brokerId = req.user._id;
    const { proposedChanges, reason } = req.body;

    if (!reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reason is required"
      });
    }

    /* =======================
       PROPERTY EXISTS
    ======================= */
    const property = await Property.findById(propertyId).select("_id");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    /* =======================
       PREVENT DUPLICATES
    ======================= */
    const existing = await PropertyEditRequest.findOne({
      property: propertyId,
      broker: brokerId,
      status: "pending"
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A pending request already exists"
      });
    }

    /* =======================
       NORMALIZE DEALER DATA
       (CRITICAL)
    ======================= */
    if (proposedChanges.dealer) {
      proposedChanges.dealerType = proposedChanges.dealer.type;
      proposedChanges.dealerName = proposedChanges.dealer.name;
      proposedChanges.dealerMobile = proposedChanges.dealer.mobile;
      proposedChanges.dealerSource = proposedChanges.dealer.source;

      delete proposedChanges.dealer;
    }

    /* =======================
       CREATE REQUEST
    ======================= */
    await PropertyEditRequest.create({
      property: propertyId,
      broker: brokerId,
      proposedChanges,
      reason
    });

    return res.json({
      success: true,
      message: "Property update request submitted"
    });

  } catch (err) {
    console.error("PROPERTY EDIT REQUEST ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit request"
    });
  }
};
