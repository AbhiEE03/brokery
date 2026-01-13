import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BrokerLayout from "../../components/layout/BrokerLayout";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";




const fade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const listItem = {
  hidden: { opacity: 0, y: 4 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03 },
  }),
};

export default function BrokerCRM() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/broker/clients", { params: filters }).then((res) => {
      setClients(res.clients || []);
      setLoading(false);
    });
  }, [filters]);

  const handleChange = (e) =>
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  const clearFilters = () => setFilters({});

  const stageStyle = (stage) => {
    switch (stage) {
      case "deal_closed":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "negotiation":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "site_visit":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "deal_lost":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <BrokerLayout>
      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.05 }}
        className="space-y-8 max-w-7xl mx-auto"
      >
        {/* HEADER */}
        <motion.div variants={fade} className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
            <p className="text-sm text-slate-500 dark:text-muted">
              Manage leads, follow-ups and deals
            </p>
          </div>

          <Link
            to="/broker/add-client"
            className="
              bg-black text-white
              dark:bg-white dark:text-black
              px-4 py-2 rounded-lg
              text-sm font-medium
            "
          >
            + Add Client
          </Link>
        </motion.div>

        {/* FILTERS */}
        <motion.div
          variants={fade}
          className="
            bg-white/60 dark:bg-white/[0.04]
            border border-slate-200/40 dark:border-white/[0.06]
            rounded-2xl p-4
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 text-sm
          "
        >
          <input
            name="q"
            placeholder="Search name / phone / code"
            onChange={handleChange}
            className="
              bg-slate-100/70 dark:bg-white/[0.04]
              border border-slate-200/40 dark:border-white/[0.06]
              rounded-lg px-3 py-2 md:col-span-2
              focus:outline-none
            "
          />

          <select name="stage" onChange={handleChange} className="filter-input">
            <option value="">Pipeline</option>
            {["lead", "contacted", "site_visit", "negotiation", "deal_closed", "deal_lost"].map(
              (s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              )
            )}
          </select>

          <select name="priority" onChange={handleChange} className="filter-input">
            <option value="">Priority</option>
            {["hot", "warm", "cold"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select name="source" onChange={handleChange} className="filter-input">
            <option value="">Source</option>
            {["call", "whatsapp", "walk-in", "website", "referral"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="
              bg-black text-white
              dark:bg-white dark:text-black
              rounded-lg px-4 py-2 font-medium
            "
          >
            Clear
          </button>
        </motion.div>

        {/* MOBILE LIST */}
        {!loading && clients.length > 0 && (
          <div className="md:hidden space-y-3">
            {clients.map((c) => (
              <div
                key={c._id}
                onClick={() => navigate(`/broker/clients/${c._id}/profile`)}
                className="
          bg-white/70 dark:bg-white/[0.04]
          border border-slate-200/40 dark:border-white/[0.06]
          rounded-xl p-4
          active:scale-[0.98]
          transition
        "
              >
                {/* NAME */}
                <p className="text-sm font-semibold tracking-tight">
                  {c.name}
                </p>

                {/* CONTACT */}
                <p className="text-xs text-slate-500 dark:text-muted mt-0.5">
                  {c.phone || "—"} {c.email && `• ${c.email}`}
                </p>

                {/* META */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span
                    className={`
              px-2.5 py-1 rounded-full text-[11px] capitalize
              ${stageStyle(c.pipelineStage)}
            `}
                  >
                    {c.pipelineStage?.replace(/_/g, " ")}
                  </span>

                  <span className="px-2.5 py-1 rounded-full text-[11px] bg-slate-500/10 text-slate-600 dark:text-slate-400">
                    {c.priority || c.followUpPriority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}





        {/* DESKTOP LIST */}
        {!loading && clients.length > 0 && (
          <div className="
          hidden md:block
            rounded-2xl overflow-hidden
            bg-white/60 dark:bg-white/[0.04]
            border border-slate-200/40 dark:border-white/[0.06]
          ">
            <div
              className="
    grid
    grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr_40px]
    px-6 lg:px-10
    py-3
    text-[11px]
    font-medium
    tracking-widest
    uppercase
    text-slate-500 dark:text-muted
    border-b border-slate-200/50 dark:border-white/[0.06]
    bg-white/70 dark:bg-black/40
    backdrop-blur
  "
            >
              <div>Client</div>
              <div>Contact</div>
              <div>Pipeline</div>
              <div>Priority</div>
              <div>Broker</div>
              <div />
            </div>


            {clients.map((c, i) => (
              <motion.div
                key={c._id}
                variants={listItem}
                custom={i}
                initial="hidden"
                animate="show"
                className="
                  group
                  grid grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr_40px]
                  items-center
                  px-16 py-4
                  border-b border-slate-200/40 dark:border-white/[0.06]
                  hover:bg-slate-50/50 dark:hover:bg-white/[0.06]
                  transition
                "
              >
                {/* CLIENT */}
                <div>
                  <button onClick={() => navigate(`/broker/clients/${c._id}/profile`)}>
                    <p className="text-sm font-medium tracking-tight">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-muted">
                      {c.email || "—"}
                    </p>
                  </button>
                </div>

                {/* CONTACT */}
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {c.phone || "—"}
                </div>

                {/* PIPELINE */}
                <div>
                  <span
                    className={`
                      px-2.5 py-1 rounded-full
                      text-[11px] capitalize
                      ${stageStyle(c.pipelineStage)}
                    `}
                  >
                    {c.pipelineStage?.replace(/_/g, " ")}
                  </span>
                </div>

                {/* PRIORITY */}
                <div className="text-[11px] capitalize text-slate-600 dark:text-muted">
                  {c.priority || c.followUpPriority}
                </div>

                {/* BROKER */}
                <div className="text-[11px] text-slate-500 dark:text-muted">
                  {c.currentBroker?.name || "Unassigned"}
                </div>

                {/* ARROW */}
                <div className="
                  text-slate-400
                  group-hover:text-slate-900
                  dark:group-hover:text-white
                ">
                  <Link to={`/broker/clients/${c._id}`}>
                    <i className="fas fa-chevron-right text-sm" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-500 dark:text-muted text-right">
          Powered by <span className="font-semibold">BackendBots</span>
        </p>
      </motion.div>
    </BrokerLayout>
  );
}
