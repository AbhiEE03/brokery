const mongoose = require("mongoose");

const kothiSchema = new mongoose.Schema(
  {
    listingDate: Date,        // DATE

    block: String,            // B
    pocket: String,           // P
    propertyNumber: String,   // NO
    sector: String,           // SEC
    size: Number,             // SIZE

    stories: String,          // STORIES
    bhk: String,              // BHK
    oldNew: String,           // OLD/NEW

    title: String,            // TITLE
    category: String,         // GEN/COR

    status: String,           // STATUS

    road: String,             // ROAD
    facing: String,           // FACE

    askingPrice: Number,      // ASKING
    netPrice: Number,         // NET PRICE

    through: String,          // THROUGH
    sourceOffice: String,     // BHAVAY PROP

    contactName: String,      // NAME
    mobilePrimary: String,    // MOBILE
    mobileSecondary: String,  // MOBILE.1

    altBlock: String,         // B.1
    altPocket: String,        // P.1
    altNumber: String,        // NO.1
    altSector: String,        // AREA
    altCity: String           // AREA.1
  },
  {
    timestamps: true
  }
);
const realestateDB = mongoose.connection.useDb("realestate_db");

module.exports = realestateDB.model("Kothi", kothiSchema);
