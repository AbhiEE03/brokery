// import { useEffect, useMemo, useState } from "react";
// import api from "../../services/api";
// import AdminLayout from "../../components/layout/AdminLayout";
// import SectionHeader from "./components/SectionHeader";

// export default function Dealers() {
//   const [dealers, setDealers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({});

// useEffect(() => {
//   api
//     .get("/admin/dealers")
//     .then((res) => {
//   console.log("API RESPONSE:", res);
//   setDealers(res.dealers || []);
// })

//     .catch((err) => {
//       console.log("ERROR:", err.response?.data || err.message);
//     })
//     .finally(() => setLoading(false));
// }, []);



//   /* =========================
//      EXTRACT UNIQUE VALUES
//   ========================= */

//   const uniqueValues = useMemo(() => {
//     const getUnique = (key) =>
//       [...new Set(dealers.map((d) => d[key]).filter(Boolean))];

//     return {
//       verificationStatus: getUnique("verificationStatus"),
//       dealerType: getUnique("dealerType"),
//       city: getUnique("city"),
//       sector: getUnique("sector"),
//       block: getUnique("block"),
//       officeType: getUnique("officeType"),
//     };
//   }, [dealers]);

//   /* =========================
//      SEARCH + FILTER LOGIC
//   ========================= */

//   const filteredDealers = useMemo(() => {
//     return dealers.filter((d) => {
//       // GLOBAL SEARCH (all keys)
//       const fullText = Object.values(d)
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//       if (search && !fullText.includes(search.toLowerCase()))
//         return false;

//       // Dynamic filter matching
//       for (const key in filters) {
//         if (filters[key] && d[key] !== filters[key]) {
//           return false;
//         }
//       }

//       return true;
//     });
//   }, [dealers, search, filters]);

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
//         title="Dealers"
//         subtitle="Registered real estate agents & partners"
//       />

//       {/* ================= SEARCH + FILTER ================= */}
//       <div className="px-4 mb-10 rounded-2xl bg-white/70 dark:bg-neutral-900/40 border shadow-sm">

//         {/* SEARCH */}
//         <div className="relative px-6 pt-5">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search across all dealer fields..."
//             className="w-full px-4 py-3 rounded-xl text-[13px] border"
//           />
//         </div>

//         {/* DYNAMIC FILTERS */}
//         <div className="mt-4 px-6 pb-5 flex flex-wrap gap-3">

//           {Object.keys(uniqueValues).map((key) => (
//             <select
//               key={key}
//               value={filters[key] || ""}
//               onChange={(e) => handleFilterChange(key, e.target.value)}
//               className="h-9 px-4 rounded-full text-[13px]"
//             >
//               <option value="">
//                 All {key.replace(/([A-Z])/g, " $1")}
//               </option>
//               {uniqueValues[key].map((value) => (
//                 <option key={value} value={value}>
//                   {value}
//                 </option>
//               ))}
//             </select>
//           ))}

//           <div className="ml-auto">
//             <button onClick={clearFilters} className="h-9 px-4 text-[13px]">
//               Clear
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= STATES ================= */}

//       {loading ? (
//         <div className="py-20 text-center text-slate-500">
//           Loading dealers…
//         </div>
//       ) : filteredDealers.length === 0 ? (
//         <div className="py-20 text-center text-slate-500">
//           No dealers found.
//         </div>
//       ) : (
//         <div className="px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {filteredDealers.map((d) => (
//             <div
//               key={d._id}
//               className="rounded-2xl bg-white dark:bg-neutral-950 border hover:shadow-lg transition"
//             >
//               <div className="px-5 pt-5 pb-4 space-y-3">

//                 <h3 className="text-[15px] font-semibold">
//                   {d.company || "Unnamed Company"}
//                 </h3>

//                 {d.contactPerson && (
//                   <p className="text-xs text-slate-500">
//                     Contact: {d.contactPerson}
//                   </p>
//                 )}

//                 <p className="text-xs text-slate-500">
//                   {[d.block, d.sector && `Sector ${d.sector}`, d.city]
//                     .filter(Boolean)
//                     .join(", ")}
//                 </p>

//                 {d.mobile && (
//                   <div className="text-sm font-medium">{d.mobile}</div>
//                 )}

//                 {d.verificationStatus && (
//                   <div className="inline-block mt-2 px-3 py-1 text-[11px] rounded-full bg-black text-white">
//                     {d.verificationStatus}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <p className="text-xs text-right text-slate-400 mt-12">
//         Powered By <span className="text-black dark:text-white">BackendBots</span>
//       </p>
//     </AdminLayout>
//   );
// }



import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";
import { useNavigate } from "react-router-dom";
export default function Dealers() {
    
    const type = "dealers";  // ✅ ADD THIS LINE
  const navigate = useNavigate();
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
 
  /* =========================
     FETCH DEALERS
  ========================= */
useEffect(() => {
  api
    .get("/admin/dealers")
    .then((res) => {
  console.log("API RESPONSE:", res);
  setDealers(res.dealers || []);
})

    .catch((err) => {
      console.log("ERROR:", err.response?.data || err.message);
    })
    .finally(() => setLoading(false));
}, []);


  /* =========================
     EXTRACT UNIQUE VALUES FOR EVERY FIELD
  ========================= */
  const uniqueValues = useMemo(() => {
    const getUnique = (key) =>
      [...new Set(dealers.map((d) => d[key]).filter(Boolean))];

    return {
      verificationStatus: getUnique("verificationStatus"),
      dealerType: getUnique("dealerType"),
      company: getUnique("company"),
      contactPerson: getUnique("contactPerson"),
      whatsapp: getUnique("whatsapp"),
      mobile: getUnique("mobile"),
      block: getUnique("block"),
      pocket: getUnique("pocket"),
      propertyNumber: getUnique("propertyNumber"),
      sector: getUnique("sector"),
      city: getUnique("city"),
      email: getUnique("email"),
      landline: getUnique("landline"),
      officeType: getUnique("officeType"),
    };
  }, [dealers]);

  /* =========================
     SEARCH + FILTER LOGIC
  ========================= */
  const filteredDealers = useMemo(() => {
    return dealers.filter((d) => {
      // Global search across all values
      const fullText = Object.values(d)
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (search && !fullText.includes(search.toLowerCase()))
        return false;

      // Filter by every key
      for (const key in filters) {
        if (filters[key] && d[key] !== filters[key]) {
          return false;
        }
      }

      return true;
    });
  }, [dealers, search, filters]);

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
        title="Dealers"
        subtitle="Complete dealer directory"
      />

      {/* ================= SEARCH + FILTER ================= */}
      <div className="px-4 mb-10 rounded-2xl bg-white/70 dark:bg-neutral-900/40 border shadow-sm">

        {/* SEARCH */}
        <div className="relative px-6 pt-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all dealer fields..."
            className="w-full px-4 py-3 rounded-xl text-[13px] border"
          />
        </div>

        {/* DYNAMIC FILTERS */}
        <div className="mt-4 px-6 pb-5 flex flex-wrap gap-3 max-h-60 overflow-auto">

          {Object.keys(uniqueValues).map((key) => (
            <select
              key={key}
              value={filters[key] || ""}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="h-9 px-4 rounded-full text-[12px]"
            >
              <option value="">
                All {key.replace(/([A-Z])/g, " $1")}
              </option>
              {uniqueValues[key].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          ))}

          <div className="ml-auto">
            <button onClick={clearFilters} className="h-9 px-4 text-[13px]">
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
      </div>

      {/* ================= STATES ================= */}

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          Loading dealers…
        </div>
      ) : filteredDealers.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No dealers found.
        </div>
      ) : (
        <div className="px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDealers.map((d) => (
            <div
              key={d._id}
              className="rounded-2xl bg-white dark:bg-neutral-950 border hover:shadow-lg transition"
            >
              <div className="px-5 pt-5 pb-4 space-y-2 text-xs">

                <h3 className="text-[14px] font-semibold text-sm">
                  {d.company || "Unnamed Company"}
                </h3>

                {Object.entries(d).map(([key, value]) => {
                  if (
                    key === "_id" ||
                    key === "__v" ||
                    key === "createdAt" ||
                    key === "updatedAt"
                  )
                    return null;

                  if (!value) return null;

                  return (
                    <div key={key} className="flex justify-between gap-2">
                      <span className="font-medium text-slate-500">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="text-right break-all">
                        {value}
                      </span>
                    </div>
                  );
                })}

              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-right text-slate-400 mt-12">
        Powered By <span className="text-black dark:text-white">BackendBots</span>
      </p>
    </AdminLayout>
  );
}
