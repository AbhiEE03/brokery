// import { useEffect, useMemo, useState } from "react";
// import api from "../../services/api";
// import AdminLayout from "../../components/layout/AdminLayout";
// import SectionHeader from "./components/SectionHeader";
// import { useNavigate } from "react-router-dom";


// export default function Flats() {
//       const type = "flats";  // ✅ ADD THIS LINE
//   const navigate = useNavigate();
//   const [flats, setFlats] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({});

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     api
//       .get("/admin/flats")
//       .then((res) => {
//         console.log("FLATS API:", res);
//         setFlats(res.flats || []);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   /* ================= UNIQUE VALUES ================= */

//   const uniqueValues = useMemo(() => {
//     if (!flats.length) return {};

//     const keys = Object.keys(flats[0]).filter(
//       (key) =>
//         !["_id", "__v", "createdAt", "updatedAt"].includes(key)
//     );

//     const result = {};

//     keys.forEach((key) => {
//       result[key] = [
//         ...new Set(flats.map((f) => f[key]).filter(Boolean)),
//       ];
//     });

//     return result;
//   }, [flats]);

//   /* ================= FILTER LOGIC ================= */

//   const filteredFlats = useMemo(() => {
//     return flats.filter((f) => {
//       const fullText = Object.values(f)
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//       if (search && !fullText.includes(search.toLowerCase()))
//         return false;

//       for (const key in filters) {
//         if (filters[key] && String(f[key]) !== filters[key])
//           return false;
//       }

//       return true;
//     });
//   }, [flats, search, filters]);

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
//         title="Flats"
//         subtitle="Flat property listings"
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
//           Loading flats…
//         </div>
//       ) : filteredFlats.length === 0 ? (
//         <div className="py-20 text-center text-slate-500">
//           No flats found.
//         </div>
//       ) : (
//         <div className="px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {filteredFlats.map((f) => (
//             <div
//               key={f._id}
//               className="
//                 rounded-2xl
//                 bg-white dark:bg-neutral-950
//                 border border-slate-200 dark:border-neutral-800
//                 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]
//                 hover:shadow-xl
//                 transition-all
//                 p-6
//                 space-y-3
//               "
//             >
//               {/* HEADER */}
//               <div className="text-[15px] font-semibold">
//                 Sector {f.sector} {f.block && `- ${f.block}`}
//               </div>

//               <p className="text-xs text-slate-500">
//                 Flat {f.propertyNumber} | {f.areaType}
//               </p>

//               {/* PRICE */}
//               {f.askingPrice && (
//                 <div className="text-lg font-semibold">
//                   ₹ {f.askingPrice}
//                 </div>
//               )}

//               {/* DETAILS GRID */}
//               <div className="grid grid-cols-2 gap-y-2 text-xs pt-3 border-t border-slate-200 dark:border-neutral-800">
//                 {f.bhk && <div>{f.bhk} BHK</div>}
//                 {f.floor && <div>Floor: {f.floor}</div>}
//                 {f.category && <div>{f.category}</div>}
//                 {f.status && <div>Status: {f.status}</div>}
//                 {f.facing && <div>Facing: {f.facing}</div>}
//                 {f.road && <div>Road: {f.road}</div>}
//               </div>

//               {/* CONTACT */}
//               <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs">
//                 {f.contactName && (
//                   <div>Contact: {f.contactName}</div>
//                 )}
//                 {f.mobilePrimary && (
//                   <div>{f.mobilePrimary}</div>
//                 )}
//               </div>

//               {/* DATE */}
//               {f.listingDate && (
//                 <div className="text-[11px] text-slate-400 pt-2">
//                   {new Date(f.listingDate).toLocaleDateString()}
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

export default function Flats() {
  const type = "flats";
  const navigate = useNavigate();

  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid");

  /* ================= FETCH ================= */
  useEffect(() => {
    api
      .get("/admin/flats")
      .then((res) => {
        setFlats(res.flats || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ================= UNIQUE VALUES ================= */
  const uniqueValues = useMemo(() => {
    if (!flats.length) return {};

    const keys = Object.keys(flats[0]).filter(
      (key) =>
        !["_id", "__v", "createdAt", "updatedAt"].includes(key)
    );

    const result = {};
    keys.forEach((key) => {
      result[key] = [
        ...new Set(flats.map((f) => f[key]).filter(Boolean)),
      ];
    });

    return result;
  }, [flats]);

  /* ================= FILTER ================= */
  const filteredFlats = useMemo(() => {
    return flats.filter((f) => {
      const fullText = Object.values(f)
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (search && !fullText.includes(search.toLowerCase()))
        return false;

      for (const key in filters) {
        if (filters[key] && String(f[key]) !== filters[key])
          return false;
      }

      return true;
    });
  }, [flats, search, filters]);

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
        title="Flats"
        subtitle="Flat property listings"
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

      {/* ================= LIST AREA ================= */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          Loading flats…
        </div>
      ) : filteredFlats.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No flats found.
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "px-10 flex flex-col gap-3"
          }
        >
          {filteredFlats.map((f) => (
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
                  <div className="text-[15px] font-semibold">
                    Sector {f.sector}{" "}
                    {f.block && `- ${f.block}`}
                  </div>

                  <p className="text-xs text-slate-500">
                    Flat {f.propertyNumber} | {f.areaType}
                  </p>

                  {f.askingPrice && (
                    <div className="text-lg font-semibold">
                      ₹ {f.askingPrice}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-y-2 text-xs pt-3 border-t">
                    {f.bhk && <div>{f.bhk} BHK</div>}
                    {f.floor && <div>Floor: {f.floor}</div>}
                    {f.category && <div>{f.category}</div>}
                    {f.status && <div>Status: {f.status}</div>}
                    {f.facing && <div>Facing: {f.facing}</div>}
                    {f.road && <div>Road: {f.road}</div>}
                  </div>

                  <div className="pt-3 border-t text-xs">
                    {f.contactName && (
                      <div>Contact: {f.contactName}</div>
                    )}
                    {f.mobilePrimary && (
                      <div>{f.mobilePrimary}</div>
                    )}
                  </div>

                  {f.listingDate && (
                    <div className="text-[11px] text-slate-400 pt-2">
                      {new Date(
                        f.listingDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-6 text-xs whitespace-nowrap overflow-x-auto">
                  <div className="font-semibold">
                    Sector {f.sector}{" "}
                    {f.block && `- ${f.block}`}
                  </div>

                  <div>Flat {f.propertyNumber}</div>
                  <div>{f.areaType}</div>
                  {f.bhk && <div>{f.bhk} BHK</div>}
                  {f.floor && <div>Floor {f.floor}</div>}
                  {f.category && <div>{f.category}</div>}
                  {f.status && <div>{f.status}</div>}
                  {f.facing && <div>{f.facing}</div>}
                  {f.road && <div>{f.road}</div>}
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

      <p className="text-xs text-right text-slate-400 mt-12">
        Powered By{" "}
        <span className="text-black dark:text-white">
          BackendBots
        </span>
      </p>
    </AdminLayout>
  );
}
