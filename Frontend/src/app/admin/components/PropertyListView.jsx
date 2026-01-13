import { Link } from "react-router-dom";

export default function PropertyListView({ properties }) {
  return (
    <div
      className="
    
        rounded-2xl overflow-hidden
        bg-white dark:bg-black
        border border-slate-200 dark:border-neutral-800
      "
    >
      {/* HEADER (HIDDEN ON MOBILE) */}
      <div
        className="
          hidden md:grid
          grid-cols-[2fr_1fr_1fr_1fr_32px]
          px-6 py-4
          text-[11px]
          tracking-widest
          uppercase
          text-slate-500 dark:text-neutral-500
          border-b border-slate-200 dark:border-neutral-800
        "
      >
        <div>Property</div>
        <div>Price</div>
        <div>Location</div>
        <div>Status</div>
        <div />
      </div>

      {/* ROWS */}
      {properties.map((p) => {
        const cover = p.cover ||
          p.images?.find((i) => i.type === "cover")?.url ||
          "/placeholder.jpg";

        return (
          <Link
            key={p._id}
            to={`/admin/properties/${p._id}`}
            className="
              group
              flex flex-col md:grid
              md:grid-cols-[2fr_1fr_1fr_1fr_32px]
              gap-4 md:gap-0
              px-5 md:px-6 py-4 md:py-5
              border-b border-slate-200 dark:border-neutral-800
              hover:bg-slate-50 dark:hover:bg-neutral-900/60
              transition
            "
          >
            {/* PROPERTY */}
            <div className="flex items-center gap-4">
              <img
                src={cover}
                alt={p.propertyName}
                className="h-8 w-8 rounded-md object-cover shrink-0"
              />

              <div>
                <p className="text-sm  text-slate-900 dark:text-white leading-tight">
                  {p.propertyName}
                </p>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  {p.propertyType?.replace("_", " ")}
                </p>
              </div>
            </div>

            {/* PRICE */}
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              ₹ {p.priceLakhs?.toLocaleString()} L
            </div>

            {/* LOCATION */}
            <div className="text-sm text-slate-600 dark:text-neutral-400">
              {p.city || p.location?.city || "—"}
            </div>

            {/* STATUS */}
            <div>
              <span
                className={`
                  inline-flex items-center
                  px-3 py-1
                  rounded-full
                  text-xs font-semibold
                  ${p.availabilityStatus === "available" &&
                  "bg-green-500/15 text-green-600 dark:text-green-400"}
                  ${p.availabilityStatus === "hold" &&
                  "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"}
                  ${p.availabilityStatus === "sold" &&
                  "bg-slate-200 text-slate-700 dark:bg-neutral-700 dark:text-neutral-300"}
                  ${p.availabilityStatus === "rented" &&
                  "bg-blue-500/15 text-blue-600 dark:text-blue-400"}
                `}
              >
                {p.availabilityStatus}
              </span>
            </div>

            {/* ARROW */}
            <div
              className="
                hidden md:flex
                justify-end
                text-slate-400 dark:text-neutral-600
                group-hover:text-slate-900 dark:group-hover:text-white
                transition
              "
            >
              <i className="fas fa-chevron-right text-sm" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
