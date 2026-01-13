// import mongoose from "mongoose";
const mongoose = require("mongoose");


const propertySchema = new mongoose.Schema(
  {
    /* =====================
       BASIC INFO
    ===================== */
    propertyName: String, // ➕ from PDF
    propertyTitle: {
      type: String,
      enum: ["FREEHOLD", "LEASEHOLD"],
    },

    category: {
      type: String,
      enum: ["residential", "commercial", "land", "industrial", "rent"],
    },

    propertyType: {
      type: String,
      enum: [
        "builder_floor",
        "flat",
        "kothi",
        "shop",
        "office",
        "showroom",
        "plot",
        "warehouse",
      ],
    },

    description: String,

    /* =====================
       DATES (BUSINESS)
    ===================== */
    propertyAddedDate: Date,   // ➕ PDF
    propertyUpdatedDate: Date, // ➕ PDF

    /* =====================
       CONFIGURATION
    ===================== */
    bhk: { type: Number, enum: [1, 2, 3, 4] },
    layout: {
      type: String,
      enum: ["1/1", "2+1/1", "3+1/1", "3+1/2", "4+1/2", "4+1/3"],
    },

    bedrooms: Number,
    bathrooms: Number,
    balconies: Number,
    floorNumber: Number,
    totalFloors: Number,

    /* =====================
       PRICING
    ===================== */
    areaSqFt: Number,
    priceLakhs: Number,
    netPrice: Number,
    demand: String,

    /* =====================
       FURNISHING
    ===================== */
    facing: {
      type: String,
      enum: ["north", "south", "east", "west"],
    },

    furnishing: {
      type: String,
      enum: ["furnished", "semi-furnished", "unfurnished"],
    },

    /* =====================
       LOCATION
    ===================== */
    city: String,
    sector: String,
    block: String,
    pocket: String,
    road: String,
    locality: String,
    address: String,
    pincode: String,

    mapLocationText: String, // ➕ PDF text-based map info

    /* =====================
       STATUS (ALL TYPES)
    ===================== */
    status: {
      type: String,
      enum: ["active", "inactive"], // ➕ PDF
      default: "active",
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "hold", "sold", "rented"],
      default: "available",
    },

    legalStatus: {
      type: String,
      enum: ["map_pass", "old_map", "with_roof", "mcd", "janta_faced"],
    },

    approvalStatus: {
      type: String,
      enum: ["approved", "pending"],
      default: "pending",
    },

    /* =====================
       EXTRA INFO
    ===================== */
    propertySource: String,
    comments: String,
    parkingStatus: String, // ➕ derived from PDF examples

    /* =====================
       DEALER / OWNER
    ===================== */
    dealerType: {
      type: String,
      enum: ["dealer", "owner", "party", "builder", "person"], // ➕ merged
      default: "dealer",
    },

    dealerName: String,
    dealerMobile: String,
    dealerSource: String,
    referredBy: String,

    /* =====================
       AMENITIES
    ===================== */
    amenities: {
      swimmingPool: { type: Boolean, default: false },
      garden: { type: Boolean, default: false },
      garage: { type: Boolean, default: false },
      lift: { type: Boolean, default: false },
      powerBackup: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
    },

    /* =====================
       MEDIA
    ===================== */
    cover: { type: String, required: true },
    gallery: [String],
    map: String,
    floorPlan: String,
    documents: [String],

    /* =====================
       AUDIT
    ===================== */
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
