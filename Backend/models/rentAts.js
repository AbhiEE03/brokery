const mongoose = require("mongoose");

const rentAtsSchema = new mongoose.Schema(
  {
    startDate: Date,          // START DATE
    endDate: Date,            // END DATE

    block: String,            // BLK
    pocket: String,           // PKT
    propertyNumber: String,   // NO
    floor: String,            // FLOOR
    sector: Number,           // SEC

    policeVerification: String,   // P VERI
    agreementDate: String,        // RENT ATS
    rentIncreaseInfo: String,     // RENT INCREASE

    status: String,               // STATUS
    statusDetail: String,         // STATUS.1

    rentAmount: String,           // RENT
    securityAmount: Number,       // SECURITY

    ownerCommission: String,      // O. COM
    tenantCommission: String,     // T. COM
    dealerShare: Number,          // DEALER 2
    commission: Number,           // COM
    extraCommission: Number,      // Unnamed: 18

    ownerName: String,            // OWNER NAME
    ownerMobile: String,          // OWNER MOBILE

    tenantName: String,           // NAME TENENT
    tenantMobile: String,         // TENENT MOBILE
    tenantMobile2: String,        // MOBILE 2
    tenantEmail: String           // EMAIL
  },
  {
    timestamps: true
  }
);
const realestateDB = mongoose.connection.useDb("realestate_db");
module.exports = realestateDB.model("RentAts", rentAtsSchema);
