// import { useEffect, useMemo, useState } from "react";
// import api from "../../services/api";
// import AdminLayout from "../../components/layout/AdminLayout";
// import SectionHeader from "./components/SectionHeader";
// import { useNavigate } from "react-router-dom";
// export default function Parties() {
//     const type = "parties";  // ✅ ADD THIS LINE
//   const navigate = useNavigate();
//   const [parties, setParties] = useState([]);
//   const [meta, setMeta] = useState({});
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({});

//   /* ================= FETCH DATA ================= */

//   useEffect(() => {
//     api
//       .get("/admin/parties")
//       .then((res) => {
//         console.log("PARTIES RESPONSE:", res);
//         setParties(res.parties || []);
//       })
//       .catch((err) => {
//         console.log("PARTIES ERROR:", err.response?.data || err.message);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     api
//       .get("/admin/parties/meta")
//       .then((res) => {
//         console.log("META RESPONSE:", res);
//         setMeta(res.filters || {});
//       })
//       .catch((err) => {
//         console.log("META ERROR:", err.response?.data || err.message);
//       });
//   }, []);

//   /* ================= FILTER LOGIC ================= */

//   const filteredParties = useMemo(() => {
//     return parties.filter((p) => {
//       const fullText = Object.values(p)
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//       if (search && !fullText.includes(search.toLowerCase()))
//         return false;

//       for (const key in filters) {
//         if (filters[key] && String(p[key]) !== String(filters[key])) {
//           return false;
//         }
//       }

//       return true;
//     });
//   }, [parties, search, filters]);

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

//   /* ================= UI ================= */

//   return (
//     <AdminLayout>
//       <SectionHeader
//         title="Party Inquiries"
//         subtitle="Client requirements & follow-ups"
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
//             className="h-9 px-4 text-[13px] text-slate-600 dark:text-slate-300"
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
//           Loading inquiries…
//         </div>
//       ) : filteredParties.length === 0 ? (
//         <div className="py-20 text-center text-slate-500">
//           No inquiries found.
//         </div>
//       ) : (
//         <div className="px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {filteredParties.map((p) => (
//             <div
//               key={p._id}
//               className="
//                 rounded-2xl overflow-hidden
//                 bg-white/80 dark:bg-neutral-950/80
//                 backdrop-blur-lg
//                 border border-slate-200/60 dark:border-neutral-800/70
//                 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]
//                 hover:shadow-xl transition-all duration-300
//               "
//             >
//               <div className="p-5 space-y-4 text-sm text-slate-700 dark:text-slate-300">

//                 {/* CLIENT INFO */}
//                 <div>
//                   <h3 className="text-[15px] font-semibold">
//                     {p.clientName || "Unnamed Client"}
//                   </h3>
//                   <div className="text-xs text-slate-500">
//                     {p.mobilePrimary}
//                   </div>
//                   {p.mobileSecondary && (
//                     <div className="text-xs text-slate-400">
//                       Alt: {p.mobileSecondary}
//                     </div>
//                   )}
//                 </div>

//                 {/* LOCATION */}
//                 <div className="text-xs border-t pt-3 border-slate-200 dark:border-neutral-800">
//                   <div>
//                     Sector {p.sector} - {p.block}
//                   </div>
//                   <div>
//                     Pocket {p.pocket} | No. {p.propertyNumber}
//                   </div>
//                   {p.address && <div>{p.address}</div>}
//                 </div>

//                 {/* REQUIREMENTS */}
//                 <div className="grid grid-cols-2 gap-y-2 text-xs border-t pt-3 border-slate-200 dark:border-neutral-800">
//                   {p.bhkPreference && <div>{p.bhkPreference} BHK</div>}
//                   {p.floorPreference && <div>{p.floorPreference}</div>}
//                   {p.roadPreference && <div>{p.roadPreference}</div>}
//                   {p.area && <div>{p.area}</div>}
//                   {p.areaDetail && <div>{p.areaDetail}</div>}
//                   {p.budget && <div>Budget: {p.budget}</div>}
//                 </div>

//                 {/* PROPERTY TYPE */}
//                 <div className="text-xs border-t pt-3 border-slate-200 dark:border-neutral-800">
//                   {p.propertyType && <div>Type: {p.propertyType}</div>}
//                   {p.type && <div>Category: {p.type}</div>}
//                 </div>

//                 {/* REASONS */}
//                 <div className="text-xs border-t pt-3 border-slate-200 dark:border-neutral-800">
//                   {p.reason1 && <div>Reason 1: {p.reason1}</div>}
//                   {p.reason2 && <div>Reason 2: {p.reason2}</div>}
//                 </div>

//                 {/* LEAD INFO */}
//                 <div className="text-xs border-t pt-3 border-slate-200 dark:border-neutral-800">
//                   {p.leadSource && <div>Source: {p.leadSource}</div>}
//                   {p.followUpStatus && (
//                     <div>Follow Up: {p.followUpStatus}</div>
//                   )}
//                 </div>

//                 {/* VISITS */}
//                 {p.propertiesVisited && (
//                   <div className="text-xs border-t pt-3 border-slate-200 dark:border-neutral-800">
//                     Visited: {p.propertiesVisited}
//                   </div>
//                 )}

//                 {/* DATE */}
//                 {(p.inquiryDate || p.day) && (
//                   <div className="text-xs text-slate-400 border-t pt-3 border-slate-200 dark:border-neutral-800">
//                     {p.inquiryDate
//                       ? `Inquiry: ${new Date(
//                           p.inquiryDate
//                         ).toLocaleDateString()}`
//                       : `Inquiry: ${p.day}-${p.month}-${p.year}`}
//                   </div>
//                 )}
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

export default function Parties() {
  const type = "parties";
  const navigate = useNavigate();

  const [parties, setParties] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid");

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    api
      .get("/admin/parties")
      .then((res) => {
        setParties(res.parties || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api
      .get("/admin/parties/meta")
      .then((res) => {
        setMeta(res.filters || {});
      })
      .catch(console.error);
  }, []);

  /* ================= FILTER LOGIC ================= */

  const filteredParties = useMemo(() => {
    return parties.filter((p) => {
      const fullText = Object.values(p)
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (search && !fullText.includes(search.toLowerCase()))
        return false;

      for (const key in filters) {
        if (filters[key] && String(p[key]) !== String(filters[key])) {
          return false;
        }
      }

      return true;
    });
  }, [parties, search, filters]);

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
        title="Party Inquiries"
        subtitle="Client requirements & follow-ups"
      />

      {/* ================= FILTER SECTION ================= */}
      <div className="px-10 mb-8 rounded-2xl bg-white dark:bg-neutral-950 border p-6">

        {/* SEARCH */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all fields..."
            className="w-full px-4 py-3 rounded-xl text-[13px] border"
          />
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 items-center">

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
                className="h-9 px-4 rounded-full text-[13px] border"
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
            className="h-9 px-4 text-[13px] border rounded-lg"
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
            className="h-9 px-4 text-[13px] border rounded-lg"
          >
            Share
          </button>

          {/* VIEW TOGGLE */}
          <button
            onClick={() =>
              setViewMode(viewMode === "grid" ? "horizontal" : "grid")
            }
            className="h-9 px-4 text-[13px] border rounded-lg ml-auto"
          >
            {viewMode === "grid" ? "Horizontal View" : "Card View"}
          </button>

        </div>
      </div>

      {/* ================= RESULTS ================= */}

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          Loading inquiries…
        </div>
      ) : filteredParties.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No inquiries found.
        </div>
      ) : (
        <div className="px-10 space-y-6">
          {filteredParties.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl bg-white dark:bg-neutral-950 border shadow-sm p-6"
            >

              {viewMode === "grid" ? (

                /* ================= CARD VIEW ================= */
                <div className="space-y-4 text-sm">

                  <div>
                    <h3 className="text-[16px] font-semibold">
                      {p.clientName || "Unnamed Client"}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {p.mobilePrimary}
                    </div>
                    {p.mobileSecondary && (
                      <div className="text-xs text-slate-400">
                        Alt: {p.mobileSecondary}
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-3 text-xs">
                    <div>Sector {p.sector} - {p.block}</div>
                    <div>Pocket {p.pocket} | No. {p.propertyNumber}</div>
                    {p.address && <div>{p.address}</div>}
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs border-t pt-3">
                    {p.bhkPreference && <div>{p.bhkPreference} BHK</div>}
                    {p.floorPreference && <div>{p.floorPreference}</div>}
                    {p.roadPreference && <div>{p.roadPreference}</div>}
                    {p.area && <div>{p.area}</div>}
                    {p.areaDetail && <div>{p.areaDetail}</div>}
                    {p.budget && <div>Budget: {p.budget}</div>}
                  </div>

                  <div className="text-xs border-t pt-3">
                    {p.propertyType && <div>Type: {p.propertyType}</div>}
                    {p.type && <div>Category: {p.type}</div>}
                  </div>

                  <div className="text-xs border-t pt-3">
                    {p.reason1 && <div>Reason 1: {p.reason1}</div>}
                    {p.reason2 && <div>Reason 2: {p.reason2}</div>}
                  </div>

                  <div className="text-xs border-t pt-3">
                    {p.leadSource && <div>Source: {p.leadSource}</div>}
                    {p.followUpStatus && <div>Follow Up: {p.followUpStatus}</div>}
                  </div>

                  {p.propertiesVisited && (
                    <div className="text-xs border-t pt-3">
                      Visited: {p.propertiesVisited}
                    </div>
                  )}

                  {(p.inquiryDate || p.day) && (
                    <div className="text-xs text-slate-400 border-t pt-3">
                      {p.inquiryDate
                        ? `Inquiry: ${new Date(p.inquiryDate).toLocaleDateString()}`
                        : `Inquiry: ${p.day}-${p.month}-${p.year}`}
                    </div>
                  )}

                </div>

              ) : (

                /* ================= HORIZONTAL VIEW (FULL DATA) ================= */
                <div className="grid md:grid-cols-4 gap-6 text-sm">

                  <div className="space-y-1">
                    <div className="font-semibold">{p.clientName}</div>
                    <div>{p.mobilePrimary}</div>
                    {p.mobileSecondary && <div>{p.mobileSecondary}</div>}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div>Sector: {p.sector}</div>
                    <div>Block: {p.block}</div>
                    <div>Pocket: {p.pocket}</div>
                    <div>Property No: {p.propertyNumber}</div>
                    {p.address && <div>{p.address}</div>}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div>BHK: {p.bhkPreference}</div>
                    <div>Floor: {p.floorPreference}</div>
                    <div>Road: {p.roadPreference}</div>
                    <div>Area: {p.area}</div>
                    <div>Budget: {p.budget}</div>
                    <div>Type: {p.propertyType}</div>
                    <div>Category: {p.type}</div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div>Reason 1: {p.reason1}</div>
                    <div>Reason 2: {p.reason2}</div>
                    <div>Source: {p.leadSource}</div>
                    <div>Follow Up: {p.followUpStatus}</div>
                    <div>Visited: {p.propertiesVisited}</div>
                    {p.inquiryDate && (
                      <div>
                        Inquiry: {new Date(p.inquiryDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                </div>

              )}

            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
