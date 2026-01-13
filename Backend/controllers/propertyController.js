// controllers/propertyController.js


const Property = require("../models/Property");


exports.getAllPropertiesAdmin = async (req, res) => {
  try {
    const {
      q,
      category,
      city,
      status,            // active / inactive
      approvalStatus,    // approved / pending
      availabilityStatus,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    /* =====================
       SEARCH
    ===================== */
    if (q) {
      filter.$or = [
        { propertyName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { dealerName: { $regex: q, $options: "i" } },
      ];
    }

    /* =====================
       FILTERS
    ===================== */
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    if (availabilityStatus) filter.availabilityStatus = availabilityStatus;

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.priceLakhs = {};
      if (minPrice) filter.priceLakhs.$gte = Number(minPrice);
      if (maxPrice) filter.priceLakhs.$lte = Number(maxPrice);
    }

    /* =====================
       QUERY
    ===================== */
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });

  } catch (err) {
    console.error("GET PROPERTIES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
};


exports.getAllPropertiesBroker = async (req, res) => {
  try {
    const {
      q,
      category,
      city,
      approvalStatus,     // approved / pending
      availabilityStatus,
      minPrice,
      maxPrice,
    } = req.query;

    /* =====================
       BASE FILTER (BROKER)
    ===================== */
    const filter = {
      // 🔐 broker restriction
    };

    /* =====================
       SEARCH
    ===================== */
    if (q) {
      filter.$or = [
        { propertyName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    /* =====================
       FILTERS
    ===================== */
    if (category) filter.category = category;
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    if (availabilityStatus) filter.availabilityStatus = availabilityStatus;

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.priceLakhs = {};
      if (minPrice) filter.priceLakhs.$gte = Number(minPrice);
      if (maxPrice) filter.priceLakhs.$lte = Number(maxPrice);
    }

    /* =====================
       QUERY
    ===================== */
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });

  } catch (err) {
    console.error("GET BROKER PROPERTIES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch broker properties",
    });
  }
};




exports.addProperties = async (req, res) => {
  try {
    /* =========================
       FILE HANDLING
    ========================= */
    if (!req.files || !req.files.cover) {
      return res.status(400).json({
        success: false,
        message: "Cover image is required",
      });
    }

    const cover = req.files.cover[0].path; // Cloudinary URL

    const gallery = req.files.gallery
      ? req.files.gallery.map(f => f.path)
      : [];

    const documents = req.files.documents
      ? req.files.documents.map(f => f.path)
      : [];

    const map = req.files.map ? req.files.map[0].path : null;
    const floorPlan = req.files.floorPlan ? req.files.floorPlan[0].path : null;


    /* =========================
       AMENITIES (checkboxes)
    ========================= */
    const amenities = {
      swimmingPool: !!req.body["amenities[swimmingPool]"],
      garden: !!req.body["amenities[garden]"],
      garage: !!req.body["amenities[garage]"],
      lift: !!req.body["amenities[lift]"],
      powerBackup: !!req.body["amenities[powerBackup]"],
      security: !!req.body["amenities[security]"],
    };

    /* =========================
       CREATE PROPERTY
    ========================= */

    const propertyName = `${req.body.category?.charAt(0).toUpperCase() + req.body.category?.slice(1)} ${req.body.propertyType?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`.trim();

    const property = await Property.create({
      /* BASIC */
      propertyName: propertyName,
      propertyTitle: req.body.propertyTitle,
      category: req.body.category,
      propertyType: req.body.propertyType,
      description: req.body.description,

      /* DATES */
      propertyAddedDate: new Date(),
      propertyCode: `PROP-${Date.now()}`,

      /* CONFIG */
      bhk: req.body.bhk,
      layout: req.body.layout,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      balconies: req.body.balconies,
      floorNumber: req.body.floorNumber,
      totalFloors: req.body.totalFloors,

      /* PRICING */
      areaSqFt: req.body.areaSqFt,
      priceLakhs: req.body.priceLakhs,
      netPrice: req.body.netPrice,
      demand: req.body.demand,

      /* FURNISHING */
      facing: req.body.facing,
      furnishing: req.body.furnishing,

      /* LOCATION */
      city: req.body.city,
      sector: req.body.sector,
      block: req.body.block,
      pocket: req.body.pocket,
      road: req.body.road,
      locality: req.body.locality,
      address: req.body.address,
      pincode: req.body.pincode,
      mapLocationText: req.body.mapLocationText,

      /* STATUS */
      status: "active",
      availabilityStatus: req.body.availabilityStatus,
      legalStatus: req.body.legalStatus,
      approvalStatus: req.body.approvalStatus,

      /* EXTRA */
      propertySource: req.body.propertySource,
      comments: req.body.comments,
      parkingStatus: req.body.parkingStatus,

      /* DEALER */
      dealerType: req.body.dealerType,
      dealerName: req.body.dealerName,
      dealerMobile: req.body.dealerMobile,
      dealerSource: req.body.dealerSource,
      referredBy: req.body.referredBy,

      /* AMENITIES */
      amenities,

      /* MEDIA */
      cover,
      gallery,
      map,
      floorPlan,
      documents,

      /* AUDIT */
      createdBy: req.user._id,
      approvedBy:
        req.body.approvalStatus === "approved" ? req.user._id : null,
      approvedAt:
        req.body.approvalStatus === "approved" ? new Date() : null,
    });

    return res.status(201).json({
      success: true,
      message: "Property added successfully",
      property,
    });

  } catch (err) {
    console.error("ADD PROPERTY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to add property",
    });
  }
};


exports.PropertyDetails = async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Property details for ${id}` });
};

exports.getPropertyEdit = async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Edit property ${id}` });
};

exports.getPropertyEditUpdate = async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Property ${id} updated` });
};
