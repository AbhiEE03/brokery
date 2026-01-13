// models/ClientChangeRequest.js
const mongoose = require("mongoose");

const clientChangeRequestSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },

  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  requestedChanges: {
    type: Object,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  adminComment: String,

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  reviewedAt: Date

}, { timestamps: true });

module.exports = mongoose.model("ClientChangeRequest", clientChangeRequestSchema);
