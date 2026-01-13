const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },

    interestLevel: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium"
    }
  },
  {
    timestamps: { createdAt: "addedAt", updatedAt: false }
  }
);

module.exports = mongoose.model("Match", matchSchema);
