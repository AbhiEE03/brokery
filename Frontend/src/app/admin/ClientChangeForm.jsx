import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../services/api";

/* ===============================
   FIELD GROUPING (UI ONLY)
================================ */
const SECTIONS = {
  Identity: ["name", "clientType", "entityType", "companyName"],
  Contact: [
    "phone",
    "alternatePhone",
    "email",
    "preferredContactMode",
    "bestTimeToContact",
    "whatsappAvailable",
  ],
  Address: [
    "addressDetails.city",
    "addressDetails.sector",
    "addressDetails.block",
    "addressDetails.pocket",
    "addressDetails.fullAddress",
    "addressDetails.nativeCity",
  ],
  Lead: [
    "source",
    "sourceQuality",
    "referredBy",
    "firstContactChannel",
  ],
  Requirements: [
    "requirementProfile.propertyCategory",
    "requirementProfile.preferredCity",
    "requirementProfile.preferredSectors",
    "requirementProfile.bhkPreference",
    "requirementProfile.areaRange.min",
    "requirementProfile.areaRange.max",
    "requirementProfile.facingPreference",
    "requirementProfile.floorPreference",
    "requirementProfile.furnishingPreference",
    "requirementProfile.urgencyLevel",
  ],
  Finance: [
    "budget.min",
    "budget.max",
    "priceSensitivity",
    "fundingMode",
    "loanStatus",
  ],
  Pipeline: [
    "pipelineStage",
    "priority",
    "clientStatus",
  ],
  Internal: [
    "dealerNotes",
    "redFlags",
    "reliabilityScore",
    "referralPotential",
  ],
};


/* ===============================
   ENUM OPTIONS (UI ONLY)
================================ */
const ENUM_OPTIONS = {
  /* ================= IDENTITY ================= */
  clientType: ["buyer", "seller", "investor", "tenant"],
  entityType: ["individual", "company"],

  /* ================= CONTACT ================= */
  preferredContactMode: ["call", "whatsapp", "email"],
  bestTimeToContact: ["morning", "afternoon", "evening"],

  /* ================= LEAD ================= */
  source: [
    "call",
    "whatsapp",
    "walk-in",
    "website",
    "referral",
    "99acres",
    "google"
  ],
  sourceQuality: ["hot", "warm", "cold"],
  firstContactChannel: ["call", "visit", "online"],
  inquiryType: ["buy", "rent", "invest"],
  leadQuality: ["qualified", "unqualified", "junk"],

  /* ================= PIPELINE ================= */
  pipelineStage: [
    "lead",
    "contacted",
    "site_visit",
    "negotiation",
    "deal_closed",
    "deal_lost"
  ],

  /* ================= REQUIREMENTS ================= */
  "requirementProfile.floorPreference": ["low", "mid", "high"],
  "requirementProfile.furnishingPreference": [
    "furnished",
    "semi",
    "unfurnished"
  ],
  "requirementProfile.urgencyLevel": [
    "immediate",
    "1-3 months",
    "flexible"
  ],

  /* ================= FINANCE ================= */
  priceSensitivity: ["high", "medium", "low"],
  fundingMode: ["self", "loan", "mixed"],
  loanStatus: ["approved", "in_process", "not_required"],

  /* ================= ACTIVITY ================= */
  rejectionReason: ["price", "location", "size", "other"],

  /* ================= NEGOTIATION ================= */
  "negotiation.currentStage": [
    "inquiry",
    "shortlist",
    "negotiation",
    "closing"
  ],
  "negotiation.decisionProbability": ["high", "medium", "low"],

  /* ================= FOLLOW-UP ================= */
  clientStatus: ["active", "in_discussion", "closed", "dropped"],
  followUpPriority: ["high", "medium", "low"],

  /* ================= INTERNAL ================= */
  reliabilityScore: ["low", "medium", "high"],
  referralPotential: ["low", "medium", "high"]
};





export default function AdminReviewClientChangeRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState({});
  const [request, setRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ===============================
     HELPERS
  ================================ */
  const getValue = (obj, path) =>
    path.split(".").reduce((o, k) => o?.[k], obj);

  const getSuggestedValue = (path) => {
    if (!request?.requestedChanges) return undefined;
    return path.split(".").reduce(
      (o, k) => o?.[k],
      request.requestedChanges
    );
  };

  const setValue = (path, value) => {
    setClient(prev => {
      const updated = structuredClone(prev);
      let ref = updated;
      const keys = path.split(".");
      keys.slice(0, -1).forEach(k => {
        if (!ref[k]) ref[k] = {};
        ref = ref[k];
      });
      ref[keys.at(-1)] = value;
      return updated;
    });
  };

  /* ===============================
     FETCH DATA
  ================================ */
  useEffect(() => {
    api.get(`/admin/client-change-requests/${id}`)
      .then(res => {
        console.log(res)
        setClient(res.client);
        setRequest(res.request);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const requestedFields = Object.keys(request.requestedChanges || {});
  console.log("requested changes ", requestedFields)

  /* ===============================
     APPROVE
  ================================ */
  const approve = async () => {
    setSaving(true);
    try {
      await api.post(
        `/admin/client-change-requests/${id}/approve`,
        { updatedClient: client }
      );
      navigate("/admin/ClientChangeRequests");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-slate-500">
          Loading request…
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className=" h-[calc(100vh-64px)] flex overflow-hidden">

        {/* ================= SIDE NAV ================= */}
        <aside className="w-64 shrink-0 border-r dark:border-border bg-white dark:bg-black">
          <div className="sticky top-0 p-4 space-y-1 text-sm">
            {Object.keys(SECTIONS).map(sec => (
              <a
                key={sec}
                href={`#${sec}`}
                className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-panel"
              >
                {sec}
              </a>
            ))}
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">

          {/* ===== HEADER ===== */}
          <div className="
            bg-white dark:bg-black
            border dark:border-border
            rounded-xl p-6
            flex justify-between items-start
          ">
            <div>
              <h1 className="text-2xl font-semibold">
                Review Client Changes
              </h1>
              <p className="text-sm text-slate-500">
                Client: {client.name}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Requested by: {request.requestedBy?.email}
              </p>
              <p className="text-xs mt-2">
                <span className="font-medium">Reason:</span>{" "}
                {request.reason}
              </p>
            </div>

            <button
              onClick={approve}
              disabled={saving}
              className="
                px-8 py-2 rounded-lg
                bg-emerald-600 text-white
                font-semibold
                disabled:opacity-60
              "
            >
              {saving ? "Saving…" : "Approve Changes"}
            </button>
          </div>

          {/* ===== SECTIONS ===== */}
          {Object.entries(SECTIONS).map(([section, fields]) => (
            <section
              key={section}
              id={section}
              className="
                bg-white dark:bg-black
                border dark:border-border
                rounded-xl p-6
              "
            >
              <h2 className=" text-lg font-semibold mb-4">
                {section}
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {fields.map(path => {
                  const isRequested = requestedFields.includes(path);
                  const currentValue = getValue(client, path);
                  const suggestedValue = getSuggestedValue(path);

                  const renderFieldInput = (path, value, onChange, isRequested) => {
                    const options = ENUM_OPTIONS[path];

                    if (options) {
                      return (
                        <select
                          value={value ?? ""}
                          onChange={e => onChange(e.target.value)}
                          className={`
          w-full px-4 py-2 rounded
          bg-slate-100 dark:bg-panel
          border
          ${isRequested
                              ? "border-black-400 dark:border-black-500"
                              : "dark:border-border"}
          focus:outline-none focus:ring-2 focus:ring-blue-500/30
        `}
                        >
                          <option value="">— Select —</option>
                          {options.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      );
                    }

                    return (
                      <input
                        value={value ?? ""}
                        onChange={e => onChange(e.target.value)}
                        className="
        w-full px-4 py-2 rounded
        bg-slate-100 dark:bg-panel
        border border-white-400 dark:border-white-500
        focus:outline-none focus:ring-2 focus:ring-white-500/30
      "
                      />
                    );
                  };


                  return (
                    <div key={path} className="space-y-2">

                      <label className="text-xs  flex gap-2">
                        {path.split(".").at(-1)}
                        {isRequested && (
                          <span className="text-yellow-600 font-semibold">
                            Broker Suggested
                          </span>
                        )}
                      </label>

                      <div className="text-xs text-slate-400 px-3 py-1 rounded bg-slate-50 dark:bg-black border dark:border-border">
                        Current: {currentValue ?? "—"}
                      </div>

                      {isRequested && (
                        <div className="text-xs text-yellow-700 dark:text-black-400 px-3 py-1 rounded bg-black-50 dark:bg-black-900/20 border border-black-300 dark:border-black-500">
                          Suggested: {suggestedValue ?? "—"}
                        </div>
                      )}
                      {renderFieldInput(
                        path,
                        currentValue,
                        val => setValue(path, val),
                        isRequested
                      )}


                    </div>
                  );
                })}
              </div>
            </section>
          ))}

        </div>
      </div>
    </AdminLayout>
  );
}
