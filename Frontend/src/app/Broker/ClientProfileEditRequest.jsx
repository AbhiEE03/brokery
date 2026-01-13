import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BrokerLayout from "../../components/layout/BrokerLayout";
import api from "../../services/api";

/* =========================
   ADMIN APPROVAL FIELDS
========================= */
const ADMIN_APPROVAL_FIELDS = [
  "name",
  "companyName",
  "clientType",
  "entityType",
  "budget",
  "priceSensitivity",
  "fundingMode",
  "loanStatus",
  "pipelineStage",
  "status",
  "priority",
  "clientStatus",
  "deal",
  "currentBroker",
  "assignedDealer",
  "owningCompany"
];

/* =========================
   ENUM OPTIONS (FROM SCHEMA)
========================= */
const ENUM_OPTIONS = {
  clientType: ["buyer", "seller", "investor", "tenant"],
  entityType: ["individual", "company"],

  priceSensitivity: ["high", "medium", "low"],
  fundingMode: ["self", "loan", "mixed"],
  loanStatus: ["approved", "in_process", "not_required"],

  pipelineStage: [
    "lead",
    "contacted",
    "site_visit",
    "negotiation",
    "deal_closed",
    "deal_lost"
  ],

  status: ["active", "closed", "lost"],
  priority: ["hot", "warm", "cold"],
  clientStatus: ["active", "in_discussion", "closed", "dropped"]
};

export default function RequestClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [proposed, setProposed] = useState({});
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* =========================
     LOAD CLIENT
  ========================= */
  useEffect(() => {
    api
      .get(`/broker/clients/${id}/profile`)
      .then((res) => setClient(res.client))
      .finally(() => setLoading(false));
  }, [id]);

  /* =========================
     HANDLERS
  ========================= */
  const setField = (field, value) => {
    setProposed((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const setBudget = (key, value) => {
    setProposed((prev) => ({
      ...prev,
      budget: {
        ...prev.budget,
        [key]: Number(value)
      }
    }));
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert("Reason is mandatory for admin approval");
      return;
    }

    if (Object.keys(proposed).length === 0) {
      alert("Please propose at least one change");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/broker/clients/${id}/profile/requestEdit`, {
        proposedChanges: proposed,
        reason: reason
      });

      alert("Edit request submitted to admin");
      navigate(`/broker/clients/${id}/profile`);
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10">Loading…</div>;
  if (!client) return <div className="p-10">Client not found</div>;

  return (
    <BrokerLayout>
      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* ================= HEADER ================= */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Request Admin Approval</h1>
            <p className="text-sm text-slate-500">
              Sensitive changes require admin review
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="
              px-6 py-2 rounded-lg
              bg-black dark:bg-white
              text-white dark:text-black
              font-medium
              disabled:opacity-50
            "
          >
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
        </header>

        {/* ================= TABLE ================= */}
        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block bg-white dark:bg-black border dark:border-border rounded-xl overflow-hidden">

          <div className="
            grid grid-cols-[1.2fr_1.2fr_1.6fr]
            px-6 py-3
            text-[11px]
            tracking-widest uppercase
            text-slate-500 dark:text-muted
            border-b dark:border-border
          ">
            <div>Field</div>
            <div>Current</div>
            <div>Proposed</div>
          </div>

          {/* ===== Budget (Special Case) ===== */}
          {ADMIN_APPROVAL_FIELDS.includes("budget") && (
            <div className="grid grid-cols-[1.2fr_1.2fr_1.6fr] px-6 py-4 border-b dark:border-border text-sm">
              <div className="font-medium">Budget</div>

              <div className="text-slate-500">
                {client.budget?.min ?? "—"} – {client.budget?.max ?? "—"}
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  onChange={(e) => setBudget("min", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-100 dark:bg-panel border"
                />
                <input
                  type="number"
                  placeholder="Max"
                  onChange={(e) => setBudget("max", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-100 dark:bg-panel border"
                />
              </div>
            </div>
          )}

          {/* ===== Other Fields ===== */}
          {ADMIN_APPROVAL_FIELDS
            .filter((f) => f !== "budget")
            .map((field) => (
              <Row
                key={field}
                field={field}
                current={client[field]}
                onChange={(val) => setField(field, val)}
              />
            ))}
        </div>

        {/* ================= MOBILE VIEW ================= */}
        <div className="md:hidden space-y-4">

          {/* ===== Budget ===== */}
          {ADMIN_APPROVAL_FIELDS.includes("budget") && (
            <div className="bg-white dark:bg-black border dark:border-border rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold">Budget</p>

              <p className="text-xs text-slate-500">
                Current: {client.budget?.min ?? "—"} – {client.budget?.max ?? "—"}
              </p>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  onChange={(e) => setBudget("min", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-100 dark:bg-panel border"
                />
                <input
                  type="number"
                  placeholder="Max"
                  onChange={(e) => setBudget("max", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-100 dark:bg-panel border"
                />
              </div>
            </div>
          )}

          {/* ===== Other Fields ===== */}
          {ADMIN_APPROVAL_FIELDS
            .filter(f => f !== "budget")
            .map(field => {
              const options = ENUM_OPTIONS[field];

              return (
                <div
                  key={field}
                  className="bg-white dark:bg-black border dark:border-border rounded-xl p-4 space-y-3"
                >
                  <p className="text-sm font-semibold capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </p>

                  <p className="text-xs text-slate-500">
                    Current: {formatValue(client[field])}
                  </p>

                  {options ? (
                    <select
                      onChange={(e) => setField(field, e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-100 dark:bg-panel border dark:border-border"
                    >
                      <option value="">Select new value</option>
                      {options.map(opt => (
                        <option key={opt} value={opt}>
                          {opt.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      placeholder="Enter new value"
                      onChange={(e) => setField(field, e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-100 dark:bg-panel border dark:border-border"
                    />
                  )}
                </div>
              );
            })}
        </div>


        {/* ================= REASON ================= */}
        <div className="bg-white dark:bg-black border dark:border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">Reason for Change</h2>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why admin should approve this request…"
            className="
              w-full px-4 py-3 rounded-lg
              bg-slate-100 dark:bg-panel
              border dark:border-border
            "
          />
        </div>

      </div>
    </BrokerLayout>
  );
}

/* =========================
   ROW COMPONENT
========================= */
function Row({ field, current, onChange }) {
  const options = ENUM_OPTIONS[field];

  return (
    <div className="grid grid-cols-[1.2fr_1.2fr_1.6fr] px-6 py-4 border-b last:border-b-0 dark:border-border text-sm items-center">
      <div className="font-medium capitalize">
        {field.replace(/([A-Z])/g, " $1")}
      </div>

      <div className="text-slate-500 truncate">
        {formatValue(current)}
      </div>

      {options ? (
        <select
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-panel border dark:border-border"
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      ) : (
        <input
          placeholder="Enter new value"
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-panel border dark:border-border"
        />
      )}
    </div>
  );
}

/* =========================
   HELPERS
========================= */
function formatValue(val) {
  if (val === null || val === undefined) return "—";
  if (typeof val === "object") return "Complex value";
  return String(val);
}
