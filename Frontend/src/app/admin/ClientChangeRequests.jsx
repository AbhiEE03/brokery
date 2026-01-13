import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../services/api";

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

/* ================= PAGE ================= */

export default function AdminClientChangeRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/admin/client-change-requests")
      .then((res) => setRequests(res.requests || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-12 text-center text-slate-500">
          Loading change requests…
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-semibold">
            Client Change Requests
          </h1>
          <p className="text-sm text-slate-500">
            Pending approvals from brokers
          </p>
        </header>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="
                rounded-2xl
                bg-white
                dark:bg-black
                border border-slate-200 dark:border-border
                p-4
                space-y-3
              "
            >
              {/* CLIENT */}
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {req.clientId?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-white/50">
                  {req.clientId?.clientCode}
                </p>
              </div>

              {/* META */}
              <div className="text-xs text-slate-500 dark:text-white/50">
                Requested by {req.requestedBy?.email}
              </div>

              {/* INFO ROW */}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Fields</span>
                <span className="font-medium">
                  {Object.keys(req.requestedChanges || {}).length}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Date</span>
                <span>
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* STATUS */}
              <StatusBadge status={req.status} />

              {/* ACTIONS */}
              {req.status === "pending" ? (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/client-change-requests/${req._id}`)
                    }
                    className="
                      flex-1
                      py-2 rounded-lg
                      bg-black text-white
                      dark:bg-white dark:text-black
                      text-sm font-medium
                    "
                  >
                    Review
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/client-change-requests/${req._id}?reject=1`
                      )
                    }
                    className="
                      flex-1
                      py-2 rounded-lg
                      border
                      text-sm
                    "
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 dark:text-white/40">
                  Action completed
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ================= DESKTOP ================= */}
        <div
          className="
            hidden md:block
            bg-white dark:bg-black
            border border-slate-200 dark:border-border
            rounded-2xl overflow-hidden
          "
        >
          {/* TABLE HEADER */}
          <div
            className="
              grid grid-cols-[2fr_2fr_1fr_1fr_1fr_160px]
              px-6 py-3
              text-[11px] uppercase tracking-widest
              text-slate-500 dark:text-muted
              border-b dark:border-border
            "
          >
            <div>Client</div>
            <div>Requested By</div>
            <div>Fields</div>
            <div>Requested At</div>
            <div>Status</div>
            <div />
          </div>

          {/* ROWS */}
          {requests.map((req) => (
            <div
              key={req._id}
              className="
                grid grid-cols-[2fr_2fr_1fr_1fr_1fr_160px]
                px-6 py-4
                items-center
                border-b last:border-b-0
                border-slate-200 dark:border-border
                bg-white dark:bg-black
                hover:bg-slate-50 dark:hover:bg-panel
                transition
              "
            >
              {/* CLIENT */}
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {req.clientId?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-white/50">
                  {req.clientId?.clientCode}
                </p>
              </div>

              {/* REQUESTED BY */}
              <div>
                <p className="text-slate-800 dark:text-white">
                  {req.requestedBy?.email}
                </p>
                <p className="text-xs text-slate-500 dark:text-white/50">
                  Broker
                </p>
              </div>

              {/* FIELDS */}
              <div className="text-sm">
                {Object.keys(req.requestedChanges || {}).length}
              </div>

              {/* DATE */}
              <div className="text-sm text-slate-500 dark:text-white/60">
                {new Date(req.createdAt).toLocaleDateString()}
              </div>

              {/* STATUS */}
              <StatusBadge status={req.status} />

              {/* ACTIONS */}
              <div className="flex justify-end gap-2">
                {req.status === "pending" ? (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/admin/client-change-requests/${req._id}`)
                      }
                      className="
                        px-4 py-1.5 rounded-lg
                        bg-black text-white
                        dark:bg-white dark:text-black
                        text-sm
                      "
                    >
                      Review
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/client-change-requests/${req._id}?reject=1`
                        )
                      }
                      className="px-4 py-1.5 rounded-lg border text-sm"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-white/40">
                    Action completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
