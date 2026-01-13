const mongoose = require("mongoose");

const propertyEditRequestSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    changes: Object,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PropertyEditRequest",
  propertyEditRequestSchema
);
