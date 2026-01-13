// const mongoose = require('../config/db');
const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({

  /* =========================
     IDENTITY (SHEET SYNC)
  ========================== */
  clientCode: {
    type: String,

    unique: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    index: true
  },

  clientType: {                      // ✅ NEW (PDF)
    type: String,
    enum: ['buyer', 'seller', 'investor', 'tenant'],
    default: 'buyer'
  },

  entityType: {                      // ✅ NEW (PDF)
    type: String,
    enum: ['individual', 'company'],
    default: 'individual'
  },

  companyName: String,               // ✅ NEW (PDF)

  email: {
    type: String,
    lowercase: true
  },

  phone: {
    type: String,
    index: true
  },

  alternatePhone: String,

  whatsappAvailable: {               // ✅ NEW (PDF)
    type: Boolean,
    default: true
  },

  preferredContactMode: {            // ✅ NEW (PDF)
    type: String,
    enum: ['call', 'whatsapp', 'email']
  },

  bestTimeToContact: {               // ✅ NEW (PDF)
    type: String,
    enum: ['morning', 'afternoon', 'evening']
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  priority: {
    type: String,
    enum: ["hot", "warm", "cold"]
  },
  deal: {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    },
    dealValue: Number,
    commission: Number,
    closedAt: Date
  },
  shortlistedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  /* =========================
     ADDRESS DETAILS
  ========================== */
  addressDetails: {                  // ✅ NEW (PDF)
    city: String,
    sector: String,
    block: String,
    pocket: String,
    fullAddress: String,
    nativeCity: String
  },

  /* =========================
     LEAD SOURCE & TYPE
  ========================== */
  source: {
    type: String,
    enum: ['call', 'whatsapp', 'walk-in', 'website', 'referral', '99acres', 'reference'],
    default: 'call',
    index: true
  },

  referredBy: String,                // ✅ NEW (PDF)

  sourceQuality: {                   // ✅ NEW (PDF)
    type: String,
    enum: ['hot', 'warm', 'cold']
  },

  firstContactChannel: {             // ✅ NEW (PDF)
    type: String,
    enum: ['call', 'visit', 'online']
  },

  inquiryType: {
    type: String,
    enum: ['buy', 'rent', 'invest'],
    default: 'buy',
    index: true
  },

  leadQuality: {
    type: String,
    enum: ['qualified', 'unqualified', 'junk'],
    default: 'qualified'
  },

  /* =========================
     COMPANY OWNERSHIP
  ========================== */
  owningCompany: {
    type: String,
    default: 'Main Company'
  },

  currentBroker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  brokerHistory: [{
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    from: Date,
    to: Date
  }],

  /* =========================
     CRM PIPELINE
  ========================== */
  pipelineStage: {
    type: String,
    enum: [
      'lead',
      'contacted',
      'site_visit',
      'negotiation',
      'deal_closed',
      'deal_lost'
    ],
    default: 'lead',
    index: true
  },

  /* =========================
     REQUIREMENT PROFILING
  ========================== */
  requirementProfile: {              // ✅ NEW (PDF)
    propertyCategory: [String],
    preferredCity: String,
    preferredSectors: [String],
    bhkPreference: String,
    areaRange: {
      min: Number,
      max: Number
    },
    facingPreference: String,
    floorPreference: {
      type: String,
      enum: ['low', 'mid', 'high']
    },
    furnishingPreference: {
      type: String,
      enum: ['furnished', 'semi', 'unfurnished']
    },
    urgencyLevel: {
      type: String,
      enum: ['immediate', '1-3 months', 'flexible']
    }
  },

  interestedIn: [{
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    },
    interestLevel: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    notes: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],



  //documents

  documents: [{ name: String, type: { type: String, enum: ['id', 'address', 'agreement', 'payment', 'other'] }, fileUrl: String, publicId: String, uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, uploadedAt: { type: Date, default: Date.now } }],

  /* =========================
     BUDGET & FINANCE
  ========================== */
  budget: {
    min: Number,
    max: Number,
    verified: {
      type: Boolean,
      default: false
    }
  },

  fundingMode: {                     // ✅ NEW (PDF)
    type: String,
    enum: ['self', 'loan', 'mixed']
  },

  loanStatus: {                      // ✅ NEW (PDF)
    type: String,
    enum: ['approved', 'in_process', 'not_required']
  },

  priceSensitivity: {                // ✅ NEW (PDF)
    type: String,
    enum: ['high', 'medium', 'low']
  },

  /* =========================
     ACTIVITY TRACKING
  ========================== */
  totalSiteVisits: Number,            // ✅ NEW (PDF)

  lastSiteVisitDate: Date,            // ✅ NEW (PDF)

  clientFeedback: String,             // ✅ NEW (PDF)

  rejectionReason: {                 // ✅ NEW (PDF)
    type: String,
    enum: ['price', 'location', 'size', 'other']
  },

  /* =========================
     NEGOTIATION SIGNALS
  ========================== */
  negotiation: {                     // ✅ NEW (PDF)
    currentStage: {
      type: String,
      enum: ['inquiry', 'shortlist', 'negotiation', 'closing']
    },
    offerMade: Boolean,
    offerAmount: Number,
    counterNotes: String,
    decisionProbability: {
      type: String,
      enum: ['high', 'medium', 'low']
    }
  },

  /* =========================
     FOLLOW-UP CONTROL
  ========================== */
  clientStatus: {                    // ✅ NEW (PDF)
    type: String,
    enum: ['active', 'in_discussion', 'closed', 'dropped']
  },

  followUpPriority: {                // ✅ NEW (PDF)
    type: String,
    enum: ['high', 'medium', 'low']
  },

  assignedDealer: {                  // ✅ NEW (PDF)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  /* =========================
     INTERNAL INTELLIGENCE
  ========================== */
  dealerNotes: String,               // ✅ NEW (PDF)
  redFlags: String,                  // ✅ NEW (PDF)

  reliabilityScore: {                // ✅ NEW (PDF)
    type: String,
    enum: ['low', 'medium', 'high']
  },

  repeatClient: Boolean,             // ✅ NEW (PDF)

  referralPotential: {               // ✅ NEW (PDF)
    type: String,
    enum: ['low', 'medium', 'high']
  },

  /* =========================
     META & AUDIT
  ========================== */
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, { timestamps: true });

const Counter = require("./Counter");

clientSchema.pre("save", async function (next) {


  try {
    const counter = await Counter.findOneAndUpdate(
      { key: "client" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.clientCode = `CL-${String(counter.seq).padStart(6, "0")}`;

    next();
  } catch (err) {
    console.error(err);
  }
});


module.exports = mongoose.model('Client', clientSchema);
