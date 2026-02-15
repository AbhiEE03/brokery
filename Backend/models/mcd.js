const mongoose = require("mongoose");

const mcdSchema = new mongoose.Schema(
  {
    bookingDate: Date,            // DATE

    block: String,                // BLK
    pocket: String,               // PKT
    propertyNumber: String,       // NO
    sector: String,               // SECTOR
    society: String,              // SOCITY
    area: String,                 // AREA
    wardNumber: Number,           // WARD NO

    orderDate: Date,              // DATE OF ORDER

    unauthorizedConstruction: String,   // UNAUTHORISED CONSTRUCTION
    fileNumber: String,                 // FILE NO.
    bookingId: String,                  // BOOKING ID
    demolitionStatus: String            // DEMOLITION
  },
  {
    timestamps: true
  }
);


const realestateDB = mongoose.connection.useDb("realestate_db");

module.exports = realestateDB.model("MCD", mcdSchema);
