const mongoose = require("mongoose");

const flatsSchema = new mongoose.Schema(
  {
    listingDate: Date,          // DATE

    block: String,              // BLK
    pocket: String,             // PKT
    propertyNumber: String,     // NUM
    sector: String,             // SEC

    areaType: String,           // AREA (MIG, LIG, etc.)
    floor: String,              // FLR
    bhk: String,                // BHK

    title: String,              // TITLE
    category: String,           // GEN/COR

    status: String,             // STATUS
    status1: String,            // STATUS.1
    status2: String,            // STATUS.2

    road: String,               // ROAD
    facing: String,             // FACE

    askingPrice: String,        // ASKING
    netPrice: String,           // NET PRICE

    through: String,            // THROUGH
    officeName: String,         // OFFICE NAME

    contactName: String,        // NAME
    mobilePrimary: String,      // MOBILE
    mobileSecondary: String,    // MOBILE.1

    altBlock: String,           // BLK PKT
    altPocket: String,          // POCKET
    altNumber: String,          // NO
    altSector: String,          // SEC.1
    city: String                // CITY
  },
  {
    timestamps: true
  }
);
const realestateDB = mongoose.connection.useDb("realestate_db");
module.exports = realestateDB.model("Flat", flatsSchema);
