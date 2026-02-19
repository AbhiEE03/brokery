// import { useEffect, useMemo, useState } from "react";
// import api from "../../services/api";
// import AdminLayout from "../../components/layout/AdminLayout";
// import SectionHeader from "./components/SectionHeader";
//     import { useNavigate } from "react-router-dom";

// export default function MCD() {
//     const type = "mcd";  // ✅ ADD THIS LINE
//   const navigate = useNavigate();
//   const [records, setRecords] = useState([]);
//   const [meta, setMeta] = useState({});
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({});

//   /* ================= FETCH RECORDS ================= */

//   useEffect(() => {
//     api
//       .get("/admin/mcd")
//       .then((res) => {
//         console.log("MCD RESPONSE:", res);
//         setRecords(res.mcd || []);
//       })
//       .catch((err) => {
//         console.log("MCD ERROR:", err.response?.data || err.message);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   /* ================= FETCH META ================= */

//   useEffect(() => {
//     api
//       .get("/admin/mcd/meta")
//       .then((res) => {
//         console.log("META RESPONSE:", res);
//         setMeta(res.filters || {});
//       })
//       .catch((err) => {
//         console.log("META ERROR:", err.response?.data || err.message);
//       });
//   }, []);

//   /* ================= FILTER LOGIC ================= */

//   const filteredRecords = useMemo(() => {
//     return records.filter((r) => {
//       const fullText = Object.values(r)
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//       if (search && !fullText.includes(search.toLowerCase()))
//         return false;

//       for (const key in filters) {
//         if (
//           filters[key] &&
//           String(r[key]) !== String(filters[key])
//         ) {
//           return false;
//         }
//       }

//       return true;
//     });
//   }, [records, search, filters]);

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
//         title="MCD Records"
//         subtitle="Municipal booking & demolition records"
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
//         <div className="px-6 pt-5">
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

//         {/* FILTER DROPDOWNS */}
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
//                 "
//               >
//                 <option value="">
//                   All {key.replace(/([A-Z])/g, " $1")}
//                 </option>

//                 {values.map((val) => (
//                   <option key={val} value={String(val)}>
//                     {String(val)}
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
//                                       <button
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
//           Loading records…
//         </div>
//       ) : filteredRecords.length === 0 ? (
//         <div className="py-20 text-center text-slate-500">
//           No records found.
//         </div>
//       ) : (
//         <div className="px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {filteredRecords.map((r) => (
//             <div
//               key={r._id}
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
//               <div className="px-5 pt-5 pb-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">

//                 {/* HEADER */}
//                 <div>
//                   <h3 className="text-[15px] font-semibold">
//                     Sector {r.sector || "-"} - {r.block || "-"}
//                   </h3>

//                   <p className="text-xs text-slate-500">
//                     {[r.propertyNumber && `No. ${r.propertyNumber}`,
//                       r.pocket && `Pocket ${r.pocket}`,
//                       r.society,
//                       r.area
//                     ]
//                       .filter(Boolean)
//                       .join(", ")}
//                   </p>
//                 </div>

//                 {/* BASIC INFO */}
//                 <div className="grid grid-cols-2 gap-y-2 text-xs border-t border-slate-200 dark:border-neutral-800 pt-3">
//                   {r.wardNumber && <div>Ward: {r.wardNumber}</div>}
//                   {r.demolitionStatus && <div>Demolition: {r.demolitionStatus}</div>}
//                   {r.bookingId && <div>Booking ID: {r.bookingId}</div>}
//                   {r.fileNumber && <div>File No: {r.fileNumber}</div>}
//                 </div>

//                 {/* UNAUTHORIZED */}
//                 {r.unauthorizedConstruction && (
//                   <div className="text-xs border-t border-slate-200 dark:border-neutral-800 pt-3">
//                     <div className="font-medium">
//                       Unauthorized Construction
//                     </div>
//                     <div className="text-slate-500 dark:text-slate-400">
//                       {r.unauthorizedConstruction}
//                     </div>
//                   </div>
//                 )}

//                 {/* DATES */}
//                 <div className="border-t border-slate-200 dark:border-neutral-800 pt-3 text-xs space-y-1 text-slate-500 dark:text-slate-400">
//                   {r.bookingDate && (
//                     <div>
//                       Booking Date:{" "}
//                       {new Date(r.bookingDate).toLocaleDateString()}
//                     </div>
//                   )}

//                   {r.orderDate && (
//                     <div>
//                       Order Date:{" "}
//                       {new Date(r.orderDate).toLocaleDateString()}
//                     </div>
//                   )}
//                 </div>

//               </div>
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

export default function MCD() {
  const type = "mcd";
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid");

  /* ================= FETCH ================= */

  useEffect(() => {
    api
      .get("/admin/mcd")
      .then((res) => {
        setRecords(res.mcd || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api
      .get("/admin/mcd/meta")
      .then((res) => {
        setMeta(res.filters || {});
      })
      .catch(console.error);
  }, []);

  /* ================= FILTER ================= */

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const fullText = Object.values(r)
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (search && !fullText.includes(search.toLowerCase()))
        return false;

      for (const key in filters) {
        if (
          filters[key] &&
          String(r[key]) !== String(filters[key])
        ) {
          return false;
        }
      }

      return true;
    });
  }, [records, search, filters]);

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
        title="MCD Records"
        subtitle="Municipal booking & demolition records"
      />

      {/* ================= FILTER SECTION ================= */}
<div className="max-w-7xl mx-auto px-4 mb-10 rounded-2xl bg-white/70 dark:bg-neutral-900/40 border shadow-sm">

  {/* SEARCH */}
  <div className="px-6 pt-5">
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search across all fields..."
      className="w-full max-w-3xl px-4 py-3 rounded-xl text-[13px] border"
    />
  </div>

  {/* FILTERS */}
  <div className="mt-4 px-6 pb-5 flex flex-wrap gap-3 items-center">

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
          className="h-9 px-4 rounded-full text-[13px] w-[180px] max-w-full truncate"
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

    {/* ACTION BUTTONS */}
    <div className="ml-auto flex gap-2 flex-wrap">
      <button
        onClick={clearFilters}
        className="h-9 px-4 text-[13px] whitespace-nowrap"
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
        className="h-9 px-4 text-[13px] whitespace-nowrap"
      >
        Share
      </button>

      <button
        onClick={() =>
          setViewMode(
            viewMode === "grid" ? "horizontal" : "grid"
          )
        }
        className="h-9 px-4 text-[13px] whitespace-nowrap"
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
          Loading records…
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No records found.
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "px-10 flex flex-col gap-3"
          }
        >
          {filteredRecords.map((r) => (
            <div
              key={r._id}
              className={`rounded-2xl bg-white dark:bg-neutral-950 border hover:shadow-lg transition ${
                viewMode === "horizontal"
                  ? "w-full px-6 py-4"
                  : "p-6 space-y-4"
              }`}
            >
              {viewMode === "grid" ? (
                /* ================= GRID VIEW ================= */
                <>
                  <h3 className="text-[15px] font-semibold">
                    Sector {r.sector || "-"} - {r.block || "-"}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {[r.propertyNumber && `No. ${r.propertyNumber}`,
                      r.pocket && `Pocket ${r.pocket}`,
                      r.society,
                      r.area
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  <div className="grid grid-cols-2 gap-y-2 text-xs border-t pt-3">
                    {r.wardNumber && <div>Ward: {r.wardNumber}</div>}
                    {r.demolitionStatus && (
                      <div>Demolition: {r.demolitionStatus}</div>
                    )}
                    {r.bookingId && (
                      <div>Booking ID: {r.bookingId}</div>
                    )}
                    {r.fileNumber && (
                      <div>File No: {r.fileNumber}</div>
                    )}
                  </div>

                  {r.unauthorizedConstruction && (
                    <div className="text-xs border-t pt-3">
                      <div className="font-medium">
                        Unauthorized Construction
                      </div>
                      <div className="text-slate-500">
                        {r.unauthorizedConstruction}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* ================= HORIZONTAL VIEW ================= */
                <div className="flex items-center gap-6 text-xs whitespace-nowrap overflow-x-auto">

                  <div className="font-semibold">
                    Sector {r.sector || "-"} - {r.block || "-"}
                  </div>

                  {r.propertyNumber && (
                    <div>No. {r.propertyNumber}</div>
                  )}

                  {r.wardNumber && <div>Ward {r.wardNumber}</div>}

                  {r.demolitionStatus && (
                    <div>{r.demolitionStatus}</div>
                  )}

                  {r.bookingId && <div>{r.bookingId}</div>}

                  {r.fileNumber && <div>{r.fileNumber}</div>}

                  {/* Properly Controlled Long Text */}
               {r.unauthorizedConstruction && (
  <div className="max-w-[300px] whitespace-normal break-words text-red-500">
    {r.unauthorizedConstruction}
  </div>
)}


                  {r.bookingDate && (
                    <div>
                      {new Date(
                        r.bookingDate
                      ).toLocaleDateString()}
                    </div>
                  )}

                  {r.orderDate && (
                    <div>
                      {new Date(
                        r.orderDate
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
