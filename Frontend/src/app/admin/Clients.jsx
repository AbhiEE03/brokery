import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";

/* =========================
   STATUS BADGE
========================= */
function StatusBadge({ status }) {
  const styles = {
    active: "bg-green-500/15 text-green-600 dark:text-green-400",
    closed: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    lost: "bg-red-500/15 text-red-600 dark:text-red-400",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
         min-w-[32px]
        px-3 py-2
        rounded-full
        text-xs font-semibold capitalize
        leading-none
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
}

/* =========================
   MOBILE CARD
========================= */
function ClientCard({ client }) {
  return (
    <div
      className="
        rounded-2xl
        bg-white dark:bg-black
        border border-slate-200 dark:border-border
        p-5 space-y-4
      "
    >
      {/* HEADER */}
      <div>
        <p className="text-base font-semibold text-slate-900 dark:text-white">
          {client.name}
        </p>
        <p className="text-sm text-slate-500 dark:text-white/50">
          {client.phone || "—"}
        </p>
      </div>

      {/* META */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs uppercase text-slate-500 dark:text-white/40">
            Broker
          </p>
          <p className="font-medium">
            {client.currentBroker?.name || "Unassigned"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-500 dark:text-white/40">
            Pipeline
          </p>
          <p className="capitalize">
            {client.pipelineStage?.replace("_", " ") || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-500 dark:text-white/40">
            Priority
          </p>
          <p className="capitalize">
            {client.followUpPriority || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-500 dark:text-white/40">
            Status
          </p>
          <StatusBadge status={client.status} />
        </div>
      </div>

      {/* ACTION */}
      <div className="pt-2 text-right">
        <Link
          to={`/admin/client/${client._id}`}
          className="
            text-sm font-medium
            text-black dark:text-white
            hover:underline
          "
        >
          View client →
        </Link>
      </div>
    </div>
  );
}

/* =========================
   MAIN PAGE
========================= */
export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    q: "",
    pipelineStage: "",
    priority: "",
    status: "",
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/clients", { params: filters });
      setClients(res.clients || []);
    } catch (err) {
      console.error("Failed to load clients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchClients();
  };

  const clearFilters = () => {
    setFilters({
      q: "",
      pipelineStage: "",
      priority: "",
      status: "",
    });
    setTimeout(fetchClients, 0);
  };

  return (
    <AdminLayout>
      <SectionHeader
        title="Clients"
        subtitle="View and manage all clients across the organisation"
      />

      {/* FILTER BAR */}
      <form
        onSubmit={handleSubmit}
        className="
          mx-4 mb-6
          rounded-2xl
          bg-white dark:bg-black
          border border-slate-200 dark:border-border
          p-4
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-sm
        "
      >
        <input
          name="q"
          placeholder="Search name / phone"
          value={filters.q}
          onChange={handleChange}
          className="input"
        />

        <select
          name="pipelineStage"
          value={filters.pipelineStage}
          onChange={handleChange}
          className="input"
        >
          <option value="">Pipeline Stage</option>
          {["lead", "contacted", "site_visit", "negotiation", "deal_closed", "deal_lost"].map(
            (s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            )
          )}
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          className="input"
        >
          <option value="">Priority</option>
          {["hot", "warm", "cold"].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="input"
        >
          <option value="">Status</option>
          {["active", "closed", "lost"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 w-full">
            Filter
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="border rounded-lg px-4 py-2 w-full"
          >
            Clear
          </button>
        </div>
      </form>

      {/* STATES */}
      {loading ? (
        <div className="p-10 text-center text-slate-500">
          Loading clients…
        </div>
      ) : clients.length === 0 ? (
        <div className="
          mx-4 p-10 rounded-xl
          bg-white dark:bg-card
          border border-slate-200 dark:border-border
          text-center text-slate-500
        ">
          No clients found.
        </div>
      ) : (
        <>
          {/* ================= MOBILE ================= */}
          <div className="md:hidden space-y-4 px-4">
            {clients.map((c) => (
              <ClientCard key={c._id} client={c} />
            ))}
          </div>

          {/* ================= DESKTOP ================= */}
          <div
            className="
              hidden md:block mx-4
              rounded-2xl overflow-hidden
              bg-white dark:bg-black
              border border-slate-200 dark:border-neutral-800
            "
          >
            {/* HEADER */}
            <div
              className="
                grid grid-cols-[2fr_1.2fr_1.5fr_1fr_1fr_40px]
                px-6 py-4
                text-[11px] uppercase tracking-widest
                text-slate-500 dark:text-neutral-500
                border-b border-slate-200 dark:border-neutral-800
              "
            >
              <div>Client</div>
              <div>Phone</div>
              <div>Broker</div>
              <div>Pipeline</div>
              <div>Status</div>
              <div />
            </div>

            {clients.map((c) => (
              <Link
                key={c._id}
                to={`/admin/client/${c._id}`}
                className="
                  group
                  grid grid-cols-[2fr_1.2fr_1.5fr_1fr_1fr_40px]
                  items-center
                  px-6 py-5
                  border-b border-slate-200 dark:border-neutral-800
                  hover:bg-slate-50 dark:hover:bg-neutral-900/60
                  transition
                "
              >
                <div>
                  <p className="font-semibold">
                    {c.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    Priority: {c.followUpPriority || "—"}
                  </p>
                </div>

                <div>{c.phone || "—"}</div>

                <div>
                  {c.currentBroker?.name || "Unassigned"}
                </div>

                <div className="capitalize">
                  {c.pipelineStage?.replace("_", " ")}
                </div>

                <StatusBadge status={c.status} />

                <div className="
                  text-slate-400
                  group-hover:text-slate-900
                  dark:group-hover:text-white
                ">
                  <i className="fas fa-chevron-right text-sm" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-right text-slate-400 mt-6">
        Powered by{" "}
        <span className="text-black dark:text-white">
          BackendBots
        </span>
      </p>
    </AdminLayout>
  );
}
