import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "../admin/components/SectionHeader";
import api from "../../services/api";

export default function AddBroker() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBrokers: 0,
    activeBrokers: 0,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    verified: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH STATS ================= */
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const res = await api.get("/admin/brokers");
        const brokers = res.brokers || [];

        setStats({
          totalBrokers: brokers.length,
          activeBrokers: brokers.filter(b => b.isActive).length,
        });
      } catch (err) {
        console.error("Failed to fetch brokers", err);
      }
    };

    fetchBrokers();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!form.verified) {
      return setError("Please confirm broker verification");
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/admin/brokers", form);
      navigate("/admin/brokers");

    } catch (err) {
      setError(err.response?.data?.error || "Failed to add broker");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <SectionHeader
        title="Add New Broker"
        subtitle="Create secure access for a new broker"
      />

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Brokers" value={stats.totalBrokers} />
        <StatCard label="Active Brokers" value={stats.activeBrokers} />

      </div>

      {/* FORM CARD */}
      <div className="border-l border-b
      
      ">

        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-200/60 dark:border-white/10">
          <h2 className="text-lg font-semibold tracking-tight">
            Broker Onboarding
          </h2>
          <p className="text-sm text-slate-500 dark:text-muted">
            Personal and security information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-10">

          {/* ERROR */}
          {error && (
            <div className="
              rounded-xl
              bg-red-500/10 border border-red-500/20
              text-red-600 dark:text-red-400
              px-5 py-4 text-sm
            ">
              {error}
            </div>
          )}

          {/* PERSONAL INFO */}
          <section>
            <h3 className="text-sm font-semibold mb-5 tracking-wide">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name *" name="name" onChange={handleChange} />
              <Input label="Email *" type="email" name="email" onChange={handleChange} />
              <Input label="Phone" name="phone" onChange={handleChange} />
            </div>
          </section>

          {/* SECURITY */}
          <section>
            <h3 className="text-sm font-semibold mb-5 tracking-wide">
              Account Security
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Password *" type="password" name="password" onChange={handleChange} />
              <Input label="Confirm Password *" type="password" name="confirmPassword" onChange={handleChange} />
            </div>
          </section>

          {/* VERIFICATION */}
          <div className="
            rounded-2xl
            bg-slate-50 dark:bg-panel
            border border-slate-200/60 dark:border-white/10
            p-5
          ">
            <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-muted">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) =>
                  setForm({ ...form, verified: e.target.checked })
                }
                className="h-4 w-4 rounded"
              />
              I confirm the broker’s identity has been verified
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/60 dark:border-white/10">
            <Link
              to="/admin/brokers"
              className="
                px-6 py-2 rounded-xl
                border border-slate-300 dark:border-white/20
                text-sm
                hover:bg-slate-50 dark:hover:bg-white/10
                transition
              "
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="
                px-7 py-2.5 rounded-xl
                bg-black text-white
                dark:bg-slate-200/80 dark:text-black
                font-medium
                hover:opacity-90
                active:scale-[0.98]
                transition-all
                disabled:opacity-60
              "
            >
              {loading ? "Adding…" : "Add Broker"}
            </button>
          </div>
        </form>
      </div>

      <p className="text-xs text-right text-slate-400 mt-6">
        Powered by{" "}
        <span className="font-medium text-black dark:text-white">
          BackendBots
        </span>
      </p>
    </AdminLayout>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-1.5 text-sm text-slate-600 dark:text-muted">
        {label}
      </label>
      <input
        {...props}
        className="
          w-full px-4 py-2.5 rounded-xl
          bg-white dark:bg-panel
          border border-slate-300/70 dark:border-white/20
          text-slate-900 dark:text-white
          placeholder:text-slate-400
          focus:outline-none
          focus:border-black/30 dark:focus:border-white/40
          transition
        "
        required={label.includes("*")}
      />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="
      rounded-2xl
      border-b border-l
      p-6
    ">
      <p className="text-sm text-slate-500 dark:text-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">
        {value || 0}
      </p>
    </div>
  );
}
