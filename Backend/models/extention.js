const mongoose = require("mongoose");

const extentionSchema = new mongoose.Schema(
  {
    listingDate: Date,        // NAME

    block: String,            // BLK
    pocket: Number,           // PKT
    propertyNumber: String,   // NUM
    sector: Number,           // SEC
    area: Number,             // AREA

    stories: String,          // STORIES
    bhk: String,              // BHK (currently empty)
    oldNew: String,           // OLD/NEW (currently empty)

    status: String,           // STATUS
    category: String,         // G/C

    status1: String,          // STATUS.1
    status2: String,          // STATUS.2
    status3: String,          // STATUS.3

    road: String,             // ROAD
    facing: String,           // FACE

    demand: Number,           // DEMAND
    fixRate: Number,          // FIX RATE

    through: String,          // THROUGH
    dealerSource: String,     // DEALER

    contactName: String,      // NAME.1
    mobilePrimary: String,    // MOBILE
    mobileSecondary: String,  // MOBILE.1

    otherCity: String,        // BLK.1 (Ghaziabad)
    otherNumber: Number,      // NO
    otherLocation: String,    // SEC.1
    state: String             // Unnamed: 27
  },
  {
    timestamps: true
  }
);

const realestateDB = mongoose.connection.useDb("realestate_db");
module.exports = realestateDB.model("Extention", extentionSchema);
