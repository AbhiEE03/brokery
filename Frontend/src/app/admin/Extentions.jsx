// import { useEffect, useMemo, useState } from "react";
// import api from "../../services/api";
// import AdminLayout from "../../components/layout/AdminLayout";
// import SectionHeader from "./components/SectionHeader";
// import { useNavigate } from "react-router-dom";

// export default function Extentions() {
  
//     const type = "extentions";  // ✅ ADD THIS LINE
//   const navigate = useNavigate();
//   const [extentions, setExtentions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({});

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     api
//       .get("/admin/extentions")
//       .then((res) => {
//         console.log("EXTENTION API:", res);
//         setExtentions(res.extentions || []);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   /* ================= UNIQUE FILTER VALUES ================= */

//   const uniqueValues = useMemo(() => {
//     if (!extentions.length) return {};

//     const keys = Object.keys(extentions[0]).filter(
//       (key) =>
//         !["_id", "__v", "createdAt", "updatedAt"].includes(key)
//     );

//     const result = {};

//     keys.forEach((key) => {
//       result[key] = [
//         ...new Set(
//           extentions.map((d) => d[key]).filter(Boolean)
//         ),
//       ];
//     });

//     return result;
//   }, [extentions]);

//   /* ================= FILTER LOGIC ================= */

//   const filteredExtentions = useMemo(() => {
//     return extentions.filter((d) => {
//       const fullText = Object.values(d)
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//       if (search && !fullText.includes(search.toLowerCase()))
//         return false;

//       for (const key in filters) {
//         if (filters[key] && String(d[key]) !== filters[key]) {
//           return false;
//         }
//       }

//       return true;
//     });
//   }, [extentions, search, filters]);

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
//         title="Extentions"
//         subtitle="Extention property listings"
//       />

//       {/* ================= SEARCH + FILTER ================= */}
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
//             "
//           />
//         </div>

//         {/* FILTERS */}
//         <div className="mt-4 px-6 pb-5 flex flex-wrap gap-3">
//           {Object.keys(uniqueValues).map((key) => (
//             <select
//               key={key}
//               value={filters[key] || ""}
//               onChange={(e) =>
//                 handleFilterChange(key, e.target.value)
//               }
//               className="
//                 h-9 px-4 rounded-full text-[12px]
//                 bg-white dark:bg-neutral-800
//                 border border-slate-200 dark:border-neutral-700
//               "
//             >
//               <option value="">
//                 All {key.replace(/([A-Z])/g, " $1")}
//               </option>
//               {uniqueValues[key].map((value) => (
//                 <option key={value} value={value}>
//                   {String(value)}
//                 </option>
//               ))}
//             </select>
//           ))}

//           <div className="ml-auto">
//             <button
//               onClick={clearFilters}
//               className="h-9 px-4 text-[13px]"
//             >
//               Clear
//             </button>
//                             <button
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
//           </div>
//         </div>




//       </div>

//       {/* ================= STATES ================= */}

//       {loading ? (
//         <div className="py-20 text-center text-slate-500">
//           Loading extentions…
//         </div>
//       ) : filteredExtentions.length === 0 ? (
//         <div className="py-20 text-center text-slate-500">
//           No extentions found.
//         </div>
//       ) : (
//         <div className="px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {filteredExtentions.map((e) => (
//             <div
//               key={e._id}
//               className="
//                 group
//                 rounded-2xl
//                 bg-white dark:bg-neutral-950
//                 border border-slate-200 dark:border-neutral-800
//                 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]
//                 hover:shadow-xl
//                 transition-all duration-300
//                 p-6
//                 space-y-3
//               "
//             >
//               {/* HEADER */}
//               <div className="text-[15px] font-semibold">
//                 Sector {e.sector} {e.block && `- ${e.block}`}
//               </div>

//               {/* ADDRESS */}
//               <p className="text-xs text-slate-500">
//                 Plot {e.propertyNumber} | {e.area} sqyd
//               </p>

//               {/* PRICE */}
//               {e.demand && (
//                 <div className="text-lg font-semibold">
//                   ₹ {e.demand}
//                 </div>
//               )}

//               {/* DETAILS GRID */}
//               <div className="grid grid-cols-2 gap-y-2 text-xs pt-3 border-t border-slate-200 dark:border-neutral-800">
//                 {e.status && <div>Status: {e.status}</div>}
//                 {e.category && <div>Type: {e.category}</div>}
//                 {e.facing && <div>Facing: {e.facing}</div>}
//                 {e.road && <div>Road: {e.road}</div>}
//                 {e.through && <div>Through: {e.through}</div>}
//                 {e.dealerSource && <div>Dealer: {e.dealerSource}</div>}
//               </div>

//               {/* CONTACT */}
//               <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs">
//                 {e.contactName && (
//                   <div>Contact: {e.contactName}</div>
//                 )}
//                 {e.mobilePrimary && (
//                   <div>{e.mobilePrimary}</div>
//                 )}
//               </div>

//               {/* DATE */}
//               {e.listingDate && (
//                 <div className="text-[11px] text-slate-400 pt-2">
//                   {new Date(e.listingDate).toLocaleDateString()}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       <p className="text-xs text-right text-slate-400 mt-12">
//         Powered By{" "}
//         <span className="text-black dark:text-white">
//           BackendBots
//         </span>
//       </p>
//     </AdminLayout>
//   );
// }




import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";
import { useNavigate } from "react-router-dom";

export default function Extentions() {
  const type = "extentions";
  const navigate = useNavigate();

  const [extentions, setExtentions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  const [viewMode, setViewMode] = useState("grid"); // grid | horizontal

  /* ================= FETCH ================= */
  useEffect(() => {
    api
      .get("/admin/extentions")
      .then((res) => {
        console.log("EXTENTION API:", res);
        setExtentions(res.extentions || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ================= UNIQUE FILTER VALUES ================= */
  const uniqueValues = useMemo(() => {
    if (!extentions.length) return {};

    const keys = Object.keys(extentions[0]).filter(
      (key) =>
        !["_id", "__v", "createdAt", "updatedAt"].includes(key)
    );

    const result = {};

    keys.forEach((key) => {
      result[key] = [
        ...new Set(extentions.map((d) => d[key]).filter(Boolean)),
      ];
    });

    return result;
  }, [extentions]);

  /* ================= FILTER LOGIC ================= */
  const filteredExtentions = useMemo(() => {
    return extentions.filter((d) => {
      const fullText = Object.values(d)
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (search && !fullText.includes(search.toLowerCase()))
        return false;

      for (const key in filters) {
        if (filters[key] && String(d[key]) !== filters[key]) {
          return false;
        }
      }

      return true;
    });
  }, [extentions, search, filters]);

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
        title="Extentions"
        subtitle="Extention property listings"
      />

      {/* ================= SEARCH + FILTER ================= */}
      <div className="px-4 mb-10 rounded-2xl bg-white/70 dark:bg-neutral-900/40 border shadow-sm">
        <div className="relative px-6 pt-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all fields..."
            className="w-full px-4 py-3 rounded-xl text-[13px] border"
          />
        </div>

        <div className="mt-4 px-6 pb-5 flex flex-wrap gap-3">
          {Object.keys(uniqueValues).map((key) => (
            <select
              key={key}
              value={filters[key] || ""}
              onChange={(e) =>
                handleFilterChange(key, e.target.value)
              }
              className="h-9 px-4 rounded-full text-[12px]"
            >
              <option value="">
                All {key.replace(/([A-Z])/g, " $1")}
              </option>
              {uniqueValues[key].map((value) => (
                <option key={value} value={value}>
                  {String(value)}
                </option>
              ))}
            </select>
          ))}

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

      {/* ================= STATES ================= */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          Loading extentions…
        </div>
      ) : filteredExtentions.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No extentions found.
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "px-10 flex flex-col gap-3"
          }
        >
          {filteredExtentions.map((e) => (
            <div
              key={e._id}
              className={`rounded-2xl bg-white dark:bg-neutral-950 border hover:shadow-lg transition ${
                viewMode === "horizontal"
                  ? "w-full px-6 py-4"
                  : "p-6 space-y-3"
              }`}
            >
              {viewMode === "grid" ? (
                <>
                  <div className="text-[15px] font-semibold">
                    Sector {e.sector} {e.block && `- ${e.block}`}
                  </div>

                  <p className="text-xs text-slate-500">
                    Plot {e.propertyNumber} | {e.area} sqyd
                  </p>

                  {e.demand && (
                    <div className="text-lg font-semibold">
                      ₹ {e.demand}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-y-2 text-xs pt-3 border-t">
                    {e.status && <div>Status: {e.status}</div>}
                    {e.category && <div>Type: {e.category}</div>}
                    {e.facing && <div>Facing: {e.facing}</div>}
                    {e.road && <div>Road: {e.road}</div>}
                    {e.through && <div>Through: {e.through}</div>}
                    {e.dealerSource && (
                      <div>Dealer: {e.dealerSource}</div>
                    )}
                  </div>

                  <div className="pt-3 border-t text-xs">
                    {e.contactName && (
                      <div>Contact: {e.contactName}</div>
                    )}
                    {e.mobilePrimary && (
                      <div>{e.mobilePrimary}</div>
                    )}
                  </div>

                  {e.listingDate && (
                    <div className="text-[11px] text-slate-400 pt-2">
                      {new Date(
                        e.listingDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-6 text-xs whitespace-nowrap overflow-x-auto">
                  <div className="font-semibold">
                    Sector {e.sector}{" "}
                    {e.block && `- ${e.block}`}
                  </div>

                  <div>Plot {e.propertyNumber}</div>
                  <div>{e.area} sqyd</div>
                  {e.demand && (
                    <div className="font-semibold">
                      ₹ {e.demand}
                    </div>
                  )}
                  {e.status && <div>{e.status}</div>}
                  {e.category && <div>{e.category}</div>}
                  {e.facing && <div>{e.facing}</div>}
                  {e.road && <div>{e.road}</div>}
                  {e.through && <div>{e.through}</div>}
                  {e.dealerSource && (
                    <div>{e.dealerSource}</div>
                  )}
                  {e.contactName && (
                    <div>{e.contactName}</div>
                  )}
                  {e.mobilePrimary && (
                    <div>{e.mobilePrimary}</div>
                  )}
                  {e.listingDate && (
                    <div className="text-slate-400">
                      {new Date(
                        e.listingDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
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
