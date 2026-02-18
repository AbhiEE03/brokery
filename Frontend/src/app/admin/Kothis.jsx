import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";
import { useNavigate } from "react-router-dom";

export default function Kothis() {
      const type = "kothi";  // ✅ ADD THIS LINE
  const navigate = useNavigate();
  const [kothis, setKothis] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    api.get("/admin/kothis")
      .then((res) => {
        setKothis(res.kothis || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get("/admin/kothis/meta")
      .then((res) => {
        setMeta(res.filters || {});
      })
      .catch(console.error);
  }, []);

  /* ================= FILTER LOGIC ================= */

  const filteredKothis = useMemo(() => {
    return kothis.filter((k) => {
      const fullText = Object.values(k)
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (search && !fullText.includes(search.toLowerCase()))
        return false;

      for (const key in filters) {
        if (filters[key] && String(k[key]) !== String(filters[key]))
          return false;
      }

      return true;
    });
  }, [kothis, search, filters]);

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
        title="Kothis"
        subtitle="Independent house listings"
      />

      {/* ================= FILTER SECTION ================= */}
      <div className="px-4 mb-10 rounded-2xl bg-white/70 dark:bg-neutral-900/40 backdrop-blur-lg border border-slate-200/60 dark:border-neutral-800/70 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]">

        {/* SEARCH */}
        <div className="px-6 pt-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all fields..."
            className="w-full px-4 py-3 rounded-xl text-[13px] bg-slate-50/80 dark:bg-neutral-800/40 border border-slate-200 dark:border-neutral-700"
          />
        </div>

        {/* FILTER DROPDOWNS */}
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
                className="h-9 px-4 rounded-full text-[13px] bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700"
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
            className="h-9 px-4 text-[13px]"
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
          Loading kothis…
        </div>
      ) : filteredKothis.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No kothis found.
        </div>
      ) : (
        <div className="px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredKothis.map((k) => (
            <div
              key={k._id}
              className="group rounded-2xl overflow-hidden bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg border border-slate-200/60 dark:border-neutral-800/70 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)] hover:shadow-xl transition-all duration-300"
            >
              <div className="px-5 pt-5 pb-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">

                <h3 className="text-[15px] font-semibold">
                  Sector {k.sector} - {k.block}
                </h3>

                <p className="text-xs text-slate-500">
                  {[k.propertyNumber, k.pocket, k.altCity]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                {k.askingPrice && (
                  <div className="text-lg font-semibold">
                    ₹ {k.askingPrice}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-y-2 pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs">
                  {k.size && <div>{k.size} sqyd</div>}
                  {k.bhk && <div>{k.bhk} BHK</div>}
                  {k.stories && <div>{k.stories}</div>}
                  {k.oldNew && <div>{k.oldNew}</div>}
                  {k.facing && <div>{k.facing}</div>}
                  {k.road && <div>{k.road} ft Road</div>}
                </div>

                {k.contactName && (
                  <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs">
                    <div>{k.contactName}</div>
                    {k.mobilePrimary && (
                      <div className="font-medium">
                        {k.mobilePrimary}
                      </div>
                    )}
                  </div>
                )}

                {k.listingDate && (
                  <div className="text-xs text-slate-400 pt-2">
                    Listed on{" "}
                    {new Date(k.listingDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-right text-slate-400 mt-12">
        Powered By{" "}
        <span className="text-black dark:text-white">
          BackendBots
        </span>
      </p>
    </AdminLayout>
  );
}
