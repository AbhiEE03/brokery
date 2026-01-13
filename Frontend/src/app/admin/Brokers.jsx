import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";

/* =========================
   STATUS BADGE
========================= */
function StatusBadge({ active }) {
  return (
    <span
      className={`
        inline-flex px-3 py-1 rounded-full
        text-xs font-semibold
        ${active
          ? "bg-green-500/15 text-green-600 dark:text-green-400"
          : "bg-red-500/15 text-red-600 dark:text-red-400"}
      `}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

/* =========================
   MOBILE CARD
========================= */
function BrokerCard({ broker }) {
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
          {broker.name}
        </p>
        <p className="text-sm text-slate-500 dark:text-white/50">
          {broker.email}
        </p>
      </div>

      {/* META */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-500 dark:text-white/40 uppercase">
            Phone
          </p>
          <p className="font-medium">
            {broker.phone || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500 dark:text-white/40 uppercase">
            Status
          </p>
          <StatusBadge active={broker.isActive} />
        </div>

        <div className="col-span-2">
          <p className="text-xs text-slate-500 dark:text-white/40 uppercase">
            Joined
          </p>
          <p className="text-sm">
            {new Date(broker.createdAt).toDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MAIN PAGE
========================= */
export default function AdminBrokers() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrokers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/brokers");
      setBrokers(res.brokers || []);
    } catch (err) {
      console.error("Failed to load brokers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  return (
    <AdminLayout>
      <SectionHeader
        title="All Brokers"
        subtitle="View and manage all brokers in the system"
        action={
          <Link
            to="/admin/add-broker"
            className="
              inline-flex items-center gap-2
              bg-black text-white
              dark:bg-white dark:text-black
              px-4 py-2 rounded-lg
              text-sm font-medium
            "
          >
            + Add Broker
          </Link>
        }
      />

      {/* STATES */}
      {loading ? (
        <div className="p-10 text-center text-slate-500">
          Loading brokers…
        </div>
      ) : brokers.length === 0 ? (
        <div className="
          p-10 rounded-xl
          bg-white dark:bg-card
          border border-slate-200 dark:border-border
          text-center text-slate-500
        ">
          No brokers found.
        </div>
      ) : (
        <>
          {/* ================= MOBILE ================= */}
          <div className="md:hidden space-y-4">
            {brokers.map((broker) => (
              <BrokerCard key={broker._id} broker={broker} />
            ))}
          </div>

          {/* ================= DESKTOP ================= */}
          <div
            className="
              hidden md:block
              rounded-2xl overflow-hidden
              bg-white dark:bg-black
              border border-slate-200 dark:border-neutral-800
            "
          >
            {/* HEADER */}
            <div
              className="
                grid grid-cols-[2fr_2fr_1.2fr_1fr_1.5fr_40px]
                px-6 py-4
                text-[11px] uppercase tracking-widest
                text-slate-500 dark:text-neutral-500
                border-b border-slate-200 dark:border-neutral-800
              "
            >
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Status</div>
              <div>Joined</div>
              <div />
            </div>

            {brokers.map((broker) => (
              <div
                key={broker._id}
                className="
                  group
                  grid grid-cols-[2fr_2fr_1.2fr_1fr_1.5fr_40px]
                  items-center
                  px-6 py-5
                  border-b border-slate-200 dark:border-neutral-800
                  hover:bg-slate-50 dark:hover:bg-neutral-900/60
                  transition
                "
              >
                <div className="font-semibold">
                  {broker.name}
                </div>

                <div className="text-sm text-slate-600 dark:text-neutral-300">
                  {broker.email}
                </div>

                <div className="text-sm">
                  {broker.phone || "—"}
                </div>

                <StatusBadge active={broker.isActive} />

                <div className="text-sm text-slate-500 dark:text-neutral-400">
                  {new Date(broker.createdAt).toDateString()}
                </div>

                <div className="
                  text-slate-400
                  group-hover:text-slate-900
                  dark:group-hover:text-white
                ">
                  <i className="fas fa-chevron-right text-sm" />
                </div>
              </div>
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
