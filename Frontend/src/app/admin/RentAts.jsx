import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";
    import { useNavigate } from "react-router-dom";

export default function RentAts() {
    const type = "rentAts";  // ✅ ADD THIS LINE
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    api.get("/admin/rentats")
      .then((res) => {
        setRecords(res.rentAts || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get("/admin/rentats/meta")
      .then((res) => {
        setMeta(res.filters || {});
      })
      .catch(console.error);
  }, []);

  /* ================= FILTER LOGIC ================= */

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const fullText = Object.values(r)
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (search && !fullText.includes(search.toLowerCase()))
        return false;

      for (const key in filters) {
        if (filters[key] && String(r[key]) !== String(filters[key]))
          return false;
      }

      return true;
    });
  }, [records, search, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearch("");
    setFilters({});
  };

  return (
    <AdminLayout>
      <SectionHeader
        title="Rent Agreements"
        subtitle="Rental agreements & commission records"
      />

      {/* ================= FILTER SECTION ================= */}

      <div className="px-4 mb-10 rounded-2xl bg-white/70 dark:bg-neutral-900/40 backdrop-blur-lg border border-slate-200/60 dark:border-neutral-800/70 shadow-sm">

        <div className="px-6 pt-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all fields..."
            className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700"
          />
        </div>

        <div className="mt-4 px-6 pb-5 flex flex-wrap gap-3">
          {Object.keys(meta).map((key) => {
            const values = meta[key] || [];
            if (!values.length) return null;

            return (
              <select
                key={key}
                value={filters[key] || ""}
                onChange={(e) =>
                  handleFilterChange(key, e.target.value)
                }
                className="h-9 px-4 rounded-full text-sm bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700"
              >
                <option value="">
                  All {key.replace(/([A-Z])/g, " $1")}
                </option>

                {values.map((val) => (
                  <option key={val} value={String(val)}>
                    {String(val)}
                  </option>
                ))}
              </select>
            );
          })}

          <button
            onClick={clearFilters}
            className="h-9 px-4 text-sm"
          >
            Clear
          </button>
                                      <button
  onClick={() => {
    const params = new URLSearchParams();

    params.append("type", type);

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    if (search) {
      params.append("search", search);
    }

    navigate(`/shared-listings?${params.toString()}`);
  }}
>    
  Share
</button>
        </div>
      </div>

      {/* ================= RESULTS ================= */}

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          Loading rent records…
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No rent records found.
        </div>
      ) : (
        <div className="px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRecords.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg border border-slate-200/60 dark:border-neutral-800/70 shadow-sm p-5 text-sm space-y-4"
            >
              <div>
                <h3 className="font-semibold">
                  Sector {r.sector} - {r.block}
                </h3>
                <p className="text-xs text-slate-500">
                  {r.propertyNumber}, Pocket {r.pocket}, Floor {r.floor}
                </p>
              </div>

              <div className="text-xs border-t pt-3">
                <div>Rent: ₹ {r.rentAmount}</div>
                <div>Security: ₹ {r.securityAmount}</div>
                <div>Status: {r.status}</div>
              </div>

              <div className="text-xs border-t pt-3">
                <div>Owner: {r.ownerName}</div>
                <div>{r.ownerMobile}</div>
                <div>Tenant: {r.tenantName}</div>
                <div>{r.tenantMobile}</div>
              </div>

              {r.startDate && (
                <div className="text-xs text-slate-400 border-t pt-3">
                  From: {new Date(r.startDate).toLocaleDateString()}
                  <br />
                  To: {r.endDate && new Date(r.endDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
