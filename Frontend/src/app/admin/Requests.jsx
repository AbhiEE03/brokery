import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";

/* ================= UTILS ================= */

function formatValue(val) {
  if (val === null || val === undefined) return "—";

  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "string" || typeof val === "number") return val;
  if (Array.isArray(val)) return val.length ? val.join(", ") : "—";

  if (val.floorNumber !== undefined && val.totalFloors !== undefined) {
    return `${val.floorNumber} / ${val.totalFloors}`;
  }

  if (val.city || val.locality || val.address) {
    return [val.address, val.locality, val.city].filter(Boolean).join(", ");
  }

  return Object.values(val).filter(Boolean).join(" • ") || "—";
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    approved: "bg-green-500/15 text-green-600 dark:text-green-400",
    rejected: "bg-red-500/15 text-red-600 dark:text-red-400",
  };

  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1 rounded-full
        text-xs font-semibold capitalize
        ${styles[status] || ""}
      `}
    >
      {status}
    </span>
  );
}

/* ================= MOBILE CARD ================= */

function ChangeRequestCard({ req, onApprove, onReject }) {
  const changes = req.changes || {};

  return (
    <div
      className="
        rounded-2xl
        bg-white
        dark:bg-black
        border border-slate-200 dark:border-border
        p-4 space-y-4
      "
    >
      {/* HEADER */}
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">
          {req.property?.propertyName || "Property Removed"}
        </p>
        <p className="text-xs text-slate-500 dark:text-white/50 font-mono">
          Code: {req.property?.propertyCode || "—"}
        </p>
      </div>

      {/* META */}
      <div className="text-xs text-slate-500 dark:text-white/50">
        Requested by{" "}
        <span className="font-medium">
          {req.requestedBy?.name || "Unknown"}
        </span>{" "}
        • {new Date(req.createdAt).toDateString()}
      </div>

      {/* CHANGES */}
      <div className="space-y-2">
        {Object.keys(changes).length === 0 ? (
          <p className="text-xs text-slate-400">
            No field-level changes
          </p>
        ) : (
          Object.entries(changes).map(([field, value]) => (
            <div
              key={field}
              className="
                grid grid-cols-3 gap-2
                text-xs
                border-b border-slate-200 dark:border-border
                pb-2 last:border-none
              "
            >
              <span className="font-medium capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="text-slate-500 truncate">
                {formatValue(value.old)}
              </span>
              <span className="font-medium truncate">
                {formatValue(value.new)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* STATUS + ACTIONS */}
      <div className="flex items-center justify-between pt-2">
        <StatusBadge status={req.status} />

        {req.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => onReject(req._id)}
              className="px-3 py-1.5 text-xs border rounded-lg"
            >
              Reject
            </button>
            <button
              onClick={() => onApprove(req._id)}
              className="
                px-3 py-1.5 text-xs rounded-lg
                bg-black text-white
                dark:bg-white dark:text-black
              "
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */

export default function AdminChangeRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/requests");
      setRequests(res.requests || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    await api.post(`/admin/requests/${id}/approve`);
    fetchRequests();
  };

  const rejectRequest = async (id) => {
    await api.post(`/admin/requests/${id}/reject`);
    fetchRequests();
  };

  return (
    <AdminLayout>
      <SectionHeader
        title="Property Change Requests"
        subtitle="Review and approve property updates requested by brokers"
      />

      {loading ? (
        <div className="p-10 text-center text-slate-500">
          Loading change requests…
        </div>
      ) : requests.length === 0 ? (
        <div className="p-10 rounded-xl bg-white dark:bg-card border text-center text-slate-500">
          No pending change requests.
        </div>
      ) : (
        <>
          {/* MOBILE */}
          <div className="md:hidden space-y-4">
            {requests.map((req) => (
              <ChangeRequestCard
                key={req._id}
                req={req}
                onApprove={approveRequest}
                onReject={rejectRequest}
              />
            ))}
          </div>

          {/* DESKTOP */}
          <div
            className="
              hidden md:block
              rounded-2xl overflow-hidden
              bg-white dark:bg-black
              border border-slate-200 dark:border-neutral-800
            "
          >
            <div
              className="
                grid grid-cols-[2fr_1.2fr_1fr_1fr_40px]
                px-6 py-4
                text-[11px] uppercase tracking-widest
                text-slate-500 dark:text-neutral-500
                border-b border-slate-200 dark:border-neutral-800
              "
            >
              <div>Property</div>
              <div>Requested By</div>
              <div>Date</div>
              <div>Status</div>
              <div />
            </div>

            {requests.map((req) => (
              <div
                key={req._id}
                className="
                  grid grid-cols-[2fr_1.2fr_1fr_1fr_40px]
                  px-6 py-5 items-center
                  border-b border-slate-200 dark:border-neutral-800
                  hover:bg-slate-50 dark:hover:bg-neutral-900/60
                  transition
                "
              >
                <div>
                  <p className="font-semibold">
                    {req.property?.propertyName || "Property Removed"}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Code: {req.property?.propertyCode || "—"}
                  </p>
                </div>

                <div className="text-sm">
                  {req.requestedBy?.name || "Unknown"}
                </div>

                <div className="text-sm text-slate-500">
                  {new Date(req.createdAt).toDateString()}
                </div>

                <StatusBadge status={req.status} />

                <div className="flex justify-end gap-2">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => rejectRequest(req._id)}
                        className="text-xs px-3 py-1 border rounded-lg"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveRequest(req._id)}
                        className="
                          text-xs px-3 py-1 rounded-lg
                          bg-black text-white
                          dark:bg-white dark:text-black
                        "
                      >
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-right text-slate-400 mt-6">
        Powered by <span className="text-black dark:text-white">BackendBots</span>
      </p>
    </AdminLayout>
  );
}
