import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import BrokerLayout from "../../components/layout/BrokerLayout";

import PropertyListView from "./components/PropertyListViewBroker";


export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    city: "",
    minPrice: "",
  });

  useEffect(() => {
    api
      .get("/broker/properties")
      .then((res) => {

        setProperties(res.properties || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);





  /* =========================
     SEARCH + FILTER LOGIC
  ========================= */
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const text = [
        p.propertyName,
        p.propertyCode,
        p.description,
        p.location?.city,
        p.location?.address,
        p.location?.locality,
      ]
        .join(" ")
        .toLowerCase();

      if (search && !text.includes(search.toLowerCase())) return false;
      if (filters.category && p.propertyType !== filters.category) return false;
      if (filters.status && p.availabilityStatus !== filters.status) return false;
      if (filters.city && !p.location?.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.minPrice && p.priceLakhs < Number(filters.minPrice)) return false;

      return true;
    });
  }, [properties, search, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setSearch("");
    setFilters({
      category: "",
      status: "",
      city: "",
      minPrice: "",
    });
  };

  return (
    <BrokerLayout>
      <>

        {/* SEARCH */}
        <div className="relative px-6 pt-5">
          <span
            className="
        pointer-events-none
        absolute left-9 top-1/2 -translate-y-1/2
        text-slate-400 dark:text-slate-500
      "
          >
            <i className="fas fa-search text-xs" />
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, address or description"
            className="
        w-full
        pl-12 pr-4 py-3
        rounded-xl
        text-[13px]
        bg-slate-50/80 dark:bg-neutral-800/40
        border border-slate-200 dark:border-neutral-700
        text-slate-800 dark:text-slate-200
        placeholder-slate-400
        focus:outline-none
        focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10
        transition
      "
          />
        </div>

        {/* FILTERS + VIEW */}
        <div
          className="
      mt-4
      px-6 pb-5
      flex flex-wrap items-center gap-3
    "
        >
          {/* CATEGORY */}
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="
        h-9 px-4
        rounded-full
        text-[13px]
        bg-slate-100/80 dark:bg-neutral-800/70
        border border-slate-200 dark:border-neutral-700
        text-slate-700 dark:text-slate-300
        focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10
      "
          >
            <option value="">All Types</option>
            {["builder_floor", "flat", "kothi", "plot", "shop", "office"].map((c) => (
              <option key={c} value={c}>
                {c.replace("_", " ")}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="
        h-9 px-4
        rounded-full
        text-[13px]
        bg-slate-100/80 dark:bg-neutral-800/70
        border border-slate-200 dark:border-neutral-700
        text-slate-700 dark:text-slate-300
      "
          >
            <option value="">Any Status</option>
            {["available", "hold", "sold", "rented"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* CITY */}
          <input
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="City"
            className="
        h-9 px-4
        rounded-full
        text-[13px]
        bg-slate-100/80 dark:bg-neutral-800/70
        border border-slate-200 dark:border-neutral-700
        text-slate-700 dark:text-slate-300
        placeholder-slate-400
      "
          />

          {/* PRICE */}
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min ₹ (L)"
            className="
        h-9 px-4
        rounded-full
        text-[13px]
        bg-slate-100/80 dark:bg-neutral-800/70
        border border-slate-200 dark:border-neutral-700
        text-slate-700 dark:text-slate-300
        placeholder-slate-400
      "
          />

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-3">
            {/* CLEAR */}
            <button
              onClick={clearFilters}
              className="
          h-9 px-4
          rounded-full
          text-[13px] font-medium
          text-slate-500 dark:text-slate-400
          hover:bg-slate-100 dark:hover:bg-neutral-800
          hover:text-slate-900 dark:hover:text-white
          transition
        "
            >
              Clear
            </button>

            {/* VIEW TOGGLE (APPLE STYLE) */}
            <div
              className="
          inline-flex items-center
          rounded-xl
          bg-white/60 dark:bg-neutral-900/50
          backdrop-blur-md
          border border-slate-200/60 dark:border-neutral-800/70
          p-1
        "
            >
              <button
                onClick={() => setView("grid")}
                className={`
            flex h-8 w-8 items-center justify-center
            rounded-lg
            transition-all
            ${view === "grid"
                    ? "bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }
          `}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
                </svg>
              </button>

              <button
                onClick={() => setView("list")}
                className={`
            flex h-8 w-8 items-center justify-center
            rounded-lg
            transition-all
            ${view === "list"
                    ? "bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }
          `}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="5" width="16" height="3" rx="1.5" fill="currentColor" />
                  <rect x="4" y="11" width="16" height="3" rx="1.5" fill="currentColor" />
                  <rect x="4" y="17" width="16" height="3" rx="1.5" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </>




      {
        loading ? (
          <div className="py-20 text-center text-slate-500">
            Loading properties…
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            No properties found.
          </div>
        ) : view === "grid" ? (
          <div className="px-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProperties.map((p) => {
              const cover = p.cover ||
                p.images?.find((i) => i.type === "cover")?.url ||
                "/placeholder.jpg";

              return (
                <div
                  key={p._id}
                  className="
    group
    rounded-2xl overflow-hidden
    bg-white dark:bg-neutral-950
    border border-slate-200/80 dark:border-neutral-800
    transition-all duration-300
    hover:-translate-y-1
    hover:border-slate-300 dark:hover:border-neutral-600
  "
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <img
                      src={cover}
                      alt={p.propertyName}
                      className="
        w-full h-52 sm:h-56
        object-cover
        transition-transform duration-500
        group-hover:scale-105
      "
                    />

                    {/* IMAGE OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    {/* CITY */}
                    <div
                      className="
        absolute top-4 left-4
        bg-black/60 backdrop-blur-md
        text-white
        px-3 py-1
        text-xs tracking-wide
        rounded-full
      "
                    >
                      {p.city || p.location?.city || "Location"}
                    </div>

                    {/* STATUS */}
                    <div
                      className="
        absolute bottom-4 left-4
        bg-white/90 text-black
        px-4 py-1
        text-[11px]
        font-semibold tracking-wide
        rounded-full
      "
                    >
                      {p.availabilityStatus?.toUpperCase()}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="px-5 pt-5 pb-4 space-y-4">
                    {/* TITLE */}
                    <div className="space-y-1">
                      <h3 className="
        text-[15px] sm:text-base
        font-semibold
        tracking-tight
        text-slate-800 dark:text-slate-100
        leading-snug
      ">
                        {p.propertyName || "Premium Property"}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {p.address || p.location?.address || p.location?.locality || "—"}
                      </p>
                    </div>

                    {/* PRICE */}
                    <div className="
      text-lg sm:text-xl
      font-semibold
      tracking-wide
      text-slate-900 dark:text-white
    ">
                      ₹ {p.priceLakhs?.toLocaleString()} L
                    </div>

                    {/* META */}
                    <div
                      className="
        grid grid-cols-2 gap-y-2
        pt-3
        border-t border-slate-200/70 dark:border-neutral-800
        text-xs
        text-slate-600 dark:text-slate-400
      "
                    >
                      <div>{p.areaSqFt} sq.ft</div>
                      <div className="capitalize">{p.propertyType?.replace("_", " ")}</div>
                      <div>{p.bedrooms || 0} Beds</div>
                      <div>{p.bathrooms || 0} Baths</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/broker/properties/${p._id}`}
                    className="
      block text-center
      py-3
      text-sm font-semibold tracking-widest
      bg-slate-900 text-white
      dark:bg-neutral-900 dark:text-slate-100
      hover:bg-white hover:text-black
      dark:hover:bg-white dark:hover:text-black
      transition
    "
                  >
                    VIEW DETAILS
                  </Link>
                </div>

              );
            })}
          </div>
        ) : (
          <div className="px-10">
            <PropertyListView properties={filteredProperties} />
          </div>
          /* ✅ LIST VIEW COMPONENT */

        )


      }

      <p className="text-xs text-right text-slate-400 mt-12">
        Crafted with care ·{" "}
        <span className="text-black dark:text-white">
          BackendBots
        </span>
      </p>
    </BrokerLayout >
  );
}
