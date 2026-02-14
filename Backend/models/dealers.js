const mongoose = require("mongoose");
// const realestateDB = mongoose.connection.useDb("realestate_db");
const dealerSchema = new mongoose.Schema(
  {
    verificationStatus: String,

    dealerType: String,

    company: String,

    contactPerson: String,

    whatsapp: String,

    mobile: String,

    block: String,

    pocket: String,

    propertyNumber: String,

    sector: String,

    city: String,

    email: String,

    landline: String,

    officeType: String
  },
  {
    timestamps: true
  }
);
const realestateDB = mongoose.connection.useDb("realestate_db");
module.exports = realestateDB.model("Dealer", dealerSchema);
