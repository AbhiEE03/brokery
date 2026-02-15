const mongoose = require("mongoose");

const partiesSchema = new mongoose.Schema(
  {
    inquiryDate: Date,        // NOT

    block: String,            // BLOCK
    pocket: String,           // POCKET
    propertyNumber: String,   // NUMBER
    sector: String,           // SECTOR

    area: String,             // AREA
    areaDetail: String,       // AREA.1

    floorPreference: String,  // FLOOR
    bhkPreference: String,    // BHK
    roadPreference: String,   // ROAD

    propertyType: String,     // COMMENT
    type: String,             // TYPE

    reason1: String,          // REASON 1
    reason2: String,          // REASON 2

    day: Number,              // DATE
    month: String,            // MONTH
    year: Number,             // YEAR

    budget: String,           // BUDGET

    leadSource: String,       // C/O
    followUpStatus: String,   // Unnamed: 19

    clientName: String,       // NAME
    mobilePrimary: String,    // MOBILE
    mobileSecondary: String,  // MOBILE.1

    address: String,          // ADDRESS
    propertiesVisited: String // PROPERTIES VISITED
  },
  {
    timestamps: true
  }
);
const realestateDB = mongoose.connection.useDb("realestate_db");
module.exports = realestateDB.model("Party", partiesSchema);
