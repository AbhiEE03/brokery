

// import { useEffect, useMemo, useState } from "react";
// import api from "../../services/api";
// import AdminLayout from "../../components/layout/AdminLayout";
// import SectionHeader from "./components/SectionHeader";
// import { useNavigate } from "react-router-dom";

// export default function Floors() {
//       const type = "floor";  // ✅ ADD THIS LINE
//   const navigate = useNavigate();
//   const [floors, setFloors] = useState([]);
//   const [meta, setMeta] = useState({});
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({});

//   /* =========================
//      FETCH FLOORS
//   ========================= */
//   useEffect(() => {
//   api
//     .get("/admin/floors")
//     .then((res) => {
//       console.log("FLOORS RESPONSE:", res);
//       setFloors(res.floors || []);
//     })
//     .catch((err) => {
//       console.log("FLOORS ERROR:", err.response?.data || err.message);
//     })
//     .finally(() => setLoading(false));
// }, []);

// useEffect(() => {
//   api
//     .get("/admin/floors/meta")
//     .then((res) => {
//       console.log("META RESPONSE:", res);
//       setMeta(res.filters || {});
//     })
//     .catch((err) => {
//       console.log("META ERROR:", err.response?.data || err.message);
//     });
// }, []);

//   /* =========================
//      FILTER LOGIC
//   ========================= */
// //  const filteredFloors = useMemo(() => {
// //   return floors.filter((f) => {
// //     // Global Search
// //     const fullText = Object.values(f)
// //       .filter(Boolean)
// //       .join(" ")
// //       .toLowerCase();

// //     if (search && !fullText.includes(search.toLowerCase()))
// //       return false;

// //     // Dynamic filters
// //     for (const key in filters) {
// //       if (!filters[key]) continue;

// //       const floorValue = f[key];

// //       if (!floorValue) return false;

// //       if (
// //         String(floorValue).trim().toLowerCase() !==
// //         String(filters[key]).trim().toLowerCase()
// //       ) {
// //         return false;
// //       }
// //     }

// //     return true;
// //   });
// // }, [floors, search, filters]);
// const filteredFloors = useMemo(() => {
//   return floors.filter((f) => {
//     // Global search
//     const fullText = Object.values(f)
//       .filter(Boolean)
//       .join(" ")
//       .toLowerCase();

//     if (search && !fullText.includes(search.toLowerCase()))
//       return false;

//     // Dynamic filters
//     for (const key in filters) {
//       if (!filters[key]) continue;

//       const floorValue = f[key];
//       if (floorValue === undefined || floorValue === null)
//         return false;

//       // 🧠 Smart comparison
//       const a = String(floorValue).trim().toLowerCase();
//       const b = String(filters[key]).trim().toLowerCase();

//       if (!a.includes(b)) {
//         return false;
//       }
//     }

//     return true;
//   });
// }, [floors, search, filters]);


//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setFilters({});
//   };

//   return (
//     <AdminLayout>
//       <SectionHeader
//         title="Floors"
//         subtitle="Builder floor listings"
//       />

//       {/* ================= FILTER SECTION ================= */}
//       <div
//         className="
//           px-4 mb-10
//           rounded-2xl
//           bg-white/70 dark:bg-neutral-900/40
//           backdrop-blur-lg
//           border border-slate-200/60 dark:border-neutral-800/70
//           shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]
//         "
//       >
//         {/* SEARCH */}
//         <div className="relative px-6 pt-5">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search across all fields..."
//             className="
//               w-full px-4 py-3 rounded-xl text-[13px]
//               bg-slate-50/80 dark:bg-neutral-800/40
//               border border-slate-200 dark:border-neutral-700
//               focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
//             "
//           />
//         </div>

//         {/* FILTERS */}
//         <div className="mt-4 px-6 pb-5 flex flex-wrap gap-3">
//           {Object.keys(meta).map((key) => {
//             const values = meta[key] || [];
//             if (!values.length) return null;

//             return (
//               <select
//                 key={key}
//                 value={filters[key] || ""}
//                 onChange={(e) =>
//                   handleFilterChange(key, e.target.value)
//                 }
//                 className="
//                   h-9 px-4 rounded-full text-[13px]
//                   bg-white dark:bg-neutral-800
//                   border border-slate-200 dark:border-neutral-700
//                   appearance-auto
//                 "
//               >
//                 <option value="">
//                   All {key.replace(/([A-Z])/g, " $1")}
//                 </option>

//                 {values.map((value) => (
//                   <option key={value} value={String(value)}>
//                     {String(value)}
//                   </option>
//                 ))}
//               </select>
//             );
//           })}

//           <button
//             onClick={clearFilters}
//             className="
//               h-9 px-4 text-[13px]
//               text-slate-600 dark:text-slate-300
//               hover:text-black dark:hover:text-white
//             "
//           >
//             Clear
//           </button>
//                           <button
//   onClick={() => {
//     const params = new URLSearchParams();

//     params.append("type", type);

//     Object.keys(filters).forEach((key) => {
//       if (filters[key]) {
//         params.append(key, filters[key]);
//       }
//     });

//     if (search) {
//       params.append("search", search);
//     }

//     navigate(`/shared-listings?${params.toString()}`);
//   }}
// >    
//   Share
// </button>
//         </div>
//       </div>

//       {/* ================= RESULTS ================= */}
//       {loading ? (
//         <div className="py-20 text-center text-slate-500">
//           Loading floors…
//         </div>
//       ) : filteredFloors.length === 0 ? (
//         <div className="py-20 text-center text-slate-500">
//           No floors found.
//         </div>
//       ) : (
//         <div className="px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {filteredFloors.map((f) => (
//             <div
//               key={f._id}
//               className="
//                 group rounded-2xl overflow-hidden
//                 bg-white/80 dark:bg-neutral-950/80
//                 backdrop-blur-lg
//                 border border-slate-200/60 dark:border-neutral-800/70
//                 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]
//                 hover:shadow-xl
//                 transition-all duration-300
//               "
//             >
//               <div className="px-5 pt-5 pb-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">

//                 {/* TITLE */}
//                 <h3 className="text-[15px] font-semibold">
//                   Sector {f.sector} - {f.block}
//                 </h3>

//                 {/* LOCATION */}
//                 <p className="text-xs text-slate-500">
//                   {[
//                     f.propertyNumber && `No. ${f.propertyNumber}`,
//                     f.pocket && `Pocket ${f.pocket}`,
//                     f.city,
//                   ]
//                     .filter(Boolean)
//                     .join(", ")}
//                 </p>

//                 {/* PRICE */}
//                 {f.askingPrice && (
//                   <div className="text-lg font-semibold">
//                     ₹ {f.askingPrice}
//                   </div>
//                 )}

//                 {/* DETAILS GRID */}
//                 <div className="grid grid-cols-2 gap-y-2 pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs">
//                   {f.size && <div>{f.size} sqyd</div>}
//                   {f.bhk && <div>{f.bhk} BHK</div>}
//                   {f.floor && <div>{f.floor}</div>}
//                   {f.oldNew && <div>{f.oldNew}</div>}
//                   {f.facing && <div>{f.facing}</div>}
//                   {f.road && <div>{f.road} ft Road</div>}
//                 </div>

//                 {/* CONTACT */}
//                 {f.contactName && (
//                   <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs">
//                     <div>{f.contactName}</div>
//                     {f.mobilePrimary && (
//                       <div className="font-medium">
//                         {f.mobilePrimary}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* DATE */}
//                 {f.listingDate && (
//                   <div className="text-xs text-slate-400 pt-2">
//                     Listed on{" "}
//                     {new Date(
//                       f.listingDate
//                     ).toLocaleDateString()}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </AdminLayout>
//   );
// }



import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";
import { useNavigate } from "react-router-dom";

export default function Floors() {
  const type = "floor";
  const navigate = useNavigate();

  const [floors, setFloors] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid");

  /* ================= FETCH ================= */
  useEffect(() => {
    api
      .get("/admin/floors")
      .then((res) => {
        setFloors(res.floors || []);
      })
      .catch((err) => {
        console.log("FLOORS ERROR:", err.response?.data || err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api
      .get("/admin/floors/meta")
      .then((res) => {
        setMeta(res.filters || {});
      })
      .catch((err) => {
        console.log("META ERROR:", err.response?.data || err.message);
      });
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredFloors = useMemo(() => {
    return floors.filter((f) => {
      const fullText = Object.values(f)
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (search && !fullText.includes(search.toLowerCase()))
        return false;

      for (const key in filters) {
        if (!filters[key]) continue;

        const floorValue = f[key];
        if (floorValue === undefined || floorValue === null)
          return false;

        const a = String(floorValue).trim().toLowerCase();
        const b = String(filters[key]).trim().toLowerCase();

        if (!a.includes(b)) return false;
      }

      return true;
    });
  }, [floors, search, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setSearch("");
    setFilters({});
  };

  return (
    <AdminLayout>
      <SectionHeader
        title="Floors"
        subtitle="Builder floor listings"
      />

      {/* ================= FILTER SECTION ================= */}
      <div className="px-4 mb-10 rounded-2xl bg-white/70 dark:bg-neutral-900/40 border shadow-sm">
        <div className="px-6 pt-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all fields..."
            className="w-full px-4 py-3 rounded-xl text-[13px] border"
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
                className="h-9 px-4 rounded-full text-[13px]"
              >
                <option value="">
                  All {key.replace(/([A-Z])/g, " $1")}
                </option>
                {values.map((value) => (
                  <option key={value} value={String(value)}>
                    {String(value)}
                  </option>
                ))}
              </select>
            );
          })}

          <div className="ml-auto flex gap-2">
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

            <button
              onClick={() =>
                setViewMode(
                  viewMode === "grid" ? "horizontal" : "grid"
                )
              }
              className="h-9 px-4 text-[13px]"
            >
              {viewMode === "grid"
                ? "Horizontal View"
                : "Card View"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= RESULTS ================= */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          Loading floors…
        </div>
      ) : filteredFloors.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No floors found.
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "px-10 flex flex-col gap-3"
          }
        >
          {filteredFloors.map((f) => (
            <div
              key={f._id}
              className={`rounded-2xl bg-white dark:bg-neutral-950 border hover:shadow-lg transition ${
                viewMode === "horizontal"
                  ? "w-full px-6 py-4"
                  : "p-6 space-y-3"
              }`}
            >
              {viewMode === "grid" ? (
                <>
                  <h3 className="text-[15px] font-semibold">
                    Sector {f.sector} - {f.block}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {[
                      f.propertyNumber &&
                        `No. ${f.propertyNumber}`,
                      f.pocket && `Pocket ${f.pocket}`,
                      f.city,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {f.askingPrice && (
                    <div className="text-lg font-semibold">
                      ₹ {f.askingPrice}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-y-2 pt-3 border-t text-xs">
                    {f.size && <div>{f.size} sqyd</div>}
                    {f.bhk && <div>{f.bhk} BHK</div>}
                    {f.floor && <div>{f.floor}</div>}
                    {f.oldNew && <div>{f.oldNew}</div>}
                    {f.facing && <div>{f.facing}</div>}
                    {f.road && <div>{f.road} ft Road</div>}
                  </div>

                  {f.contactName && (
                    <div className="pt-3 border-t text-xs">
                      <div>{f.contactName}</div>
                      {f.mobilePrimary && (
                        <div className="font-medium">
                          {f.mobilePrimary}
                        </div>
                      )}
                    </div>
                  )}

                  {f.listingDate && (
                    <div className="text-xs text-slate-400 pt-2">
                      Listed on{" "}
                      {new Date(
                        f.listingDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-6 text-xs whitespace-nowrap overflow-x-auto">
                  <div className="font-semibold">
                    Sector {f.sector} - {f.block}
                  </div>

                  {f.propertyNumber && (
                    <div>No. {f.propertyNumber}</div>
                  )}
                  {f.pocket && <div>Pocket {f.pocket}</div>}
                  {f.city && <div>{f.city}</div>}
                  {f.size && <div>{f.size} sqyd</div>}
                  {f.bhk && <div>{f.bhk} BHK</div>}
                  {f.floor && <div>{f.floor}</div>}
                  {f.oldNew && <div>{f.oldNew}</div>}
                  {f.facing && <div>{f.facing}</div>}
                  {f.road && <div>{f.road} ft</div>}
                  {f.askingPrice && (
                    <div className="font-semibold">
                      ₹ {f.askingPrice}
                    </div>
                  )}
                  {f.contactName && (
                    <div>{f.contactName}</div>
                  )}
                  {f.mobilePrimary && (
                    <div>{f.mobilePrimary}</div>
                  )}
                  {f.listingDate && (
                    <div className="text-slate-400">
                      {new Date(
                        f.listingDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
