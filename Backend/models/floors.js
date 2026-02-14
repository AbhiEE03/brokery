const mongoose = require("mongoose");

const floorsSchema = new mongoose.Schema(
  {
    listingDate: Date,        // DATE

    block: String,            // BLOCK
    pocket: String,           // POCKET
    propertyNumber: String,   // NO
    sector: Number,           // SECTOR
    size: Number,             // SIZE

    floor: String,            // FLOOR
    bhk: String,              // BHK
    oldNew: String,           // OLD/NEW

    title: String,            // TITLE
    category: String,         // GEN/COR

    status: String,           // STATUS
    status1: String,          // STATUS.1
    status2: String,          // STATUS.2

    road: String,             // ROAD
    facing: String,           // FACE

    askingPrice: Number,      // ASKING
    netPrice: String,         // NET PRICE

    dealerType: String,       // DEALER
    source: String,           // THROUGH

    contactName: String,      // NAME
    mobilePrimary: String,    // MOBILE
    mobileSecondary: String,  // MOBILE.1

    altBlock: String,         // BLOCK.1
    altPocket: String,        // POCKET.1
    altNumber: String,        // NUMBER
    altSector: String,        // SECTOR.1
    city: String              // CITY
  },
  {
    timestamps: true
  }
);
const realestateDB = mongoose.connection.useDb("realestate_db");

module.exports = realestateDB.model("Floor", floorsSchema);
