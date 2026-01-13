// config/clientEditRules.js

module.exports = {

  /* =====================================================
     BROKER CAN EDIT DIRECTLY (NO APPROVAL)
     - Non-financial
     - Non-ownership
     - Low risk
  ===================================================== */
  BROKER_EDITABLE_FIELDS: [

    /* ---------- CONTACT (SAFE ONLY) ---------- */
    "phone",
    "alternatePhone",
    "email",
    "preferredContactMode",
    "bestTimeToContact",
    "whatsappAvailable",

    /* ---------- ADDRESS ---------- */
    // Broker can update address details directly
    "addressDetails",

    /* ---------- LEAD INFO ---------- */
    "source",
    "sourceQuality",
    "referredBy",
    "firstContactChannel",

    /* ---------- REQUIREMENT PROFILE ---------- */
    // Broker can refine requirements
    "requirementProfile",

    /* ---------- ACTIVITY / FOLLOW-UP ---------- */
    "clientFeedback",
    "nextFollowUpAt",
    "nextAction",
    "totalSiteVisits",
    "lastSiteVisitDate",
    "rejectionReason",

    /* ---------- INTERNAL NOTES ---------- */
    "dealerNotes",
    "redFlags"
  ],


  /* =====================================================
     FIELDS THAT REQUIRE ADMIN APPROVAL
     - Financial
     - Ownership
     - Status changing
  ===================================================== */
  ADMIN_APPROVAL_FIELDS: [

    /* ---------- IDENTITY ---------- */
    "name",
    "companyName",
    "clientType",
    "entityType",

    /* ---------- SENSITIVE CONTACT ---------- */
    // contact reassignment / misuse risk
    // (email/phone already allowed above → do NOT repeat)

    /* ---------- FINANCIAL ---------- */
    "budget",
    "priceSensitivity",
    "fundingMode",
    "loanStatus",

    /* ---------- PIPELINE / STATUS ---------- */
    "pipelineStage",
    "status",
    "priority",
    "clientStatus",

    /* ---------- DEAL ---------- */
    "deal",

    /* ---------- OWNERSHIP / ASSIGNMENT ---------- */
    "currentBroker",
    "assignedDealer",
    "owningCompany"
  ]
};
