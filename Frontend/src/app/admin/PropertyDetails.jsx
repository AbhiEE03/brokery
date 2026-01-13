// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import AdminLayout from "../../components/layout/AdminLayout";
// import api from "../../services/api";

// /* ===============================
//    SMALL REUSABLE UI PARTS
// ================================ */

// const InfoTile = ({ label, value }) => (
//   <div className="
//     rounded-xl
//     bg-white/80 dark:bg-neutral-900/70
//     backdrop-blur
//     border border-slate-200 dark:border-neutral-800
//     p-5
//   ">
//     <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
//       {label}
//     </p>
//     <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
//       {value ?? "—"}
//     </p>
//   </div>
// );

// const Row = ({ label, value }) => (
//   <div className="flex items-center justify-between py-3">
//     <span className="text-sm text-slate-500 dark:text-slate-400">
//       {label}
//     </span>
//     <span className="text-sm font-medium text-slate-900 dark:text-white">
//       {value ?? "—"}
//     </span>
//   </div>
// );

// const ActionButton = ({ icon, label }) => (
//   <button
//     className="
//       flex items-center gap-2
//       px-4 py-2.5
//       rounded-full
//       bg-black text-white
//       dark:bg-white dark:text-black
//       text-sm font-semibold
//       shadow-lg
//       hover:scale-[1.03]
//       transition
//     "
//   >
//     <i className={`fas fa-${icon}`} />
//     {label}
//   </button>
// );

// /* ===============================
//    MAIN COMPONENT
// ================================ */

// export default function AdminPropertyDetails() {
//   const { id } = useParams();
//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get(`/admin/properties/${id}`)
//       .then(res =>
//         setProperty(res.property)
//         // console.log("res", res)
//       )
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) {
//     return (
//       <AdminLayout>
//         <div className="h-[60vh] flex items-center justify-center text-slate-500">
//           Loading property…
//         </div>
//       </AdminLayout>
//     );
//   }

//   if (!property) {
//     return (
//       <AdminLayout>
//         <div className="h-[60vh] flex items-center justify-center text-red-500">
//           Property not found
//         </div>
//       </AdminLayout>
//     );
//   }

//   const cover =
//     property.images?.find(i => i.type === "cover")?.url ||
//     "/placeholder.jpg";

//   const fullAddress =
//     property.location?.address ||
//     [
//       property.location?.road,
//       property.location?.block,
//       property.location?.sector,
//       property.location?.locality,
//       property.location?.city,
//       property.location?.pincode
//     ].filter(Boolean).join(", ");

//   return (
//     <AdminLayout>

//       {/* ================= HERO ================= */}
//       <div className="relative h-[540px] rounded-[28px] overflow-hidden mb-20">
//         <img
//           src={property.cover || cover}
//           alt={property.propertyName}
//           className="absolute inset-0 w-full h-full object-cover"
//         />

//         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

//         <div className="absolute bottom-0 p-12 max-w-5xl">
//           <p className="uppercase tracking-[0.3em] text-xs text-white/60">
//             {property.category} · {property.propertyType?.replace("_", " ")}
//           </p>

//           <h1 className="mt-2 text-5xl font-semibold text-white leading-tight">
//             {property.propertyName}
//           </h1>

//           <p className="mt-4 text-white/70 max-w-2xl">
//             {fullAddress}
//           </p>

//           <div className="mt-6 flex flex-wrap gap-3">
//             <span className="px-6 py-2 rounded-full bg-white text-black text-sm font-semibold">
//               ₹ {property.priceLakhs?.toLocaleString()} L
//             </span>

//             <span className="px-6 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm">
//               {property.availabilityStatus?.toUpperCase()}
//             </span>

//             {property.legalStatus && (
//               <span className="px-6 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm">
//                 {property.legalStatus.replace("_", " ")}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ================= DECISION BAR ================= */}
//       <div className="sticky top-6 z-20 mb-20">
//         <div className="
//           grid sm:grid-cols-4 gap-4
//           rounded-2xl
//           bg-white/80 dark:bg-neutral-900/70
//           backdrop-blur
//           border border-slate-200 dark:border-neutral-800
//           p-4
//         ">
//           <InfoTile label="Price" value={`₹ ${property.priceLakhs} L`} />
//           <InfoTile label="Area" value={`${property.areaSqFt} sq.ft`} />
//           <InfoTile label="BHK" value={property.bhk} />
//           <InfoTile label="Facing" value={property.facing} />
//         </div>
//       </div>

//       {/* ================= CONFIGURATION ================= */}
//       <section className="mb-20">
//         <h2 className="text-2xl font-semibold mb-6">Configuration</h2>

//         <div className="
//           max-w-3xl
//           rounded-2xl
//           bg-white/80 dark:bg-neutral-900/70
//           backdrop-blur
//           border border-slate-200 dark:border-neutral-800
//           divide-y divide-slate-200 dark:divide-neutral-800
//           px-6
//         ">
//           <Row label="Bedrooms" value={property.bedrooms} />
//           <Row label="Bathrooms" value={property.bathrooms} />
//           <Row label="Balconies" value={property.balconies} />
//           <Row
//             label="Floor"
//             value={property ||
//               property.floorInfo
//               ? `${property.floorNumber || property.floorInfo.floorNumber} / ${property.totalFloors || property.floorInfo.totalFloors}`
//               : "—"
//             }
//           />
//           <Row label="Furnishing" value={property.furnishing} />
//           <Row label="Ownership" value={property.propertyTitle} />
//         </div>
//       </section>

//       {/* ================= DESCRIPTION ================= */}
//       <section className="mb-20">
//         <h2 className="text-2xl font-semibold mb-6">Description</h2>

//         <div className="
//           max-w-3xl
//           rounded-2xl
//           bg-white/80 dark:bg-neutral-900/70
//           backdrop-blur
//           border border-slate-200 dark:border-neutral-800
//           p-8
//         ">
//           <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
//             {property.description || "No description provided."}
//           </p>
//         </div>
//       </section>

//       {/* ================= AMENITIES ================= */}
//       <section className="mb-20">
//         <h2 className="text-2xl font-semibold mb-6">Amenities</h2>

//         <div className="flex flex-wrap gap-3">
//           {Object.entries(property.amenities || {})
//             .filter(([, v]) => v)
//             .map(([key]) => (
//               <span
//                 key={key}
//                 className="
//                   px-4 py-1.5
//                   rounded-full
//                   text-sm font-medium
//                   bg-neutral-100 dark:bg-neutral-800
//                   text-neutral-800 dark:text-neutral-200
//                 "
//               >
//                 {key.replace(/([A-Z])/g, " $1")}
//               </span>
//             ))}
//         </div>
//       </section>

//       {/* ================= DEALER ================= */}
//       <section className="mb-24">
//         <h2 className="text-2xl font-semibold mb-6">Dealer / Owner</h2>

//         <div className="
//           rounded-3xl
//           bg-neutral-900
//           text-white
//           p-8
//           max-w-xl
//         ">
//           <p className="uppercase tracking-widest text-xs text-white/60">
//             {property.dealer?.type}
//           </p>

//           <h3 className="text-2xl font-semibold mt-2">
//             {property.dealer?.name}
//           </h3>

//           <p className="mt-4 text-white/80">
//             {property.dealer?.mobile}
//           </p>

//           <p className="text-white/60 text-sm mt-1">
//             Source: {property.dealer?.source}
//           </p>

//           {property.dealer?.referredBy && (
//             <p className="text-white/60 text-sm mt-1">
//               Referred By: {property.dealer?.referredBy}
//             </p>
//           )}
//         </div>
//       </section>

//       {/* ================= FLOATING ACTIONS ================= */}
//       <div className="fixed bottom-8 right-8 flex gap-3 z-40">
//         <ActionButton icon="edit" label="Edit" />
//         <ActionButton icon="exchange-alt" label="Status" />
//         <ActionButton icon="comment" label="Comment" />
//       </div>

//       {/* ================= FOOTER ================= */}
//       <p className="text-xs text-right text-slate-400 mt-32">
//         Powered By Bac
//       </p>

//     </AdminLayout>
//   );
// }



















import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../services/api";

/* ===============================
   SMALL UI BLOCKS
================================ */

const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-white dark:bg-neutral-900 border p-4">
    <p className="text-xs uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-1 text-xl font-semibold">
      {value ?? "—"}
    </p>
  </div>
);

const Field = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2 text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-right">
      {value ?? "—"}
    </span>
  </div>
);

/* ===============================
   MAIN
================================ */

export default function AdminPropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    api.get(`/admin/properties/${id}`).then(res => {
      setProperty(res.property);
      // console.log("res", res)
      const cover =
        res.property.images?.find(i => i.type === "cover") ||
        res.property.images?.[0];
      setActiveImage(property.cover);
    });
  }, [id]);

  if (!property) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-slate-500">
          Loading property…
        </div>
      </AdminLayout>
    );
  }

  const address = [
    property.location?.address,
    property.location?.sector,
    property.location?.city
  ].filter(Boolean).join(", ");

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 space-y-10">

        {/* ================= IMAGE PREVIEW ================= */}
        <section className="space-y-4">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-200 dark:bg-neutral-800">
            {activeImage || '' ? (
              <img
                src={property.cover}
                alt={property.propertyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No image available
              </div>
            )}
          </div>

          {/* THUMBNAILS */}
          {property.gallery?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {property.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`
                    w-28 h-20 rounded-lg overflow-hidden border
                    ${activeImage === img
                      ? "border-black dark:border-white"
                      : "border-slate-200 dark:border-neutral-700"}
                  `}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ================= HEADER ================= */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">
            {property.propertyName}
          </h1>
          <p className="text-sm text-slate-500">
            {property.category} · {address}
          </p>
        </header>

        {/* ================= STICKY TABS ================= */}
        <div className="sticky top-16 z-20 bg-background py-2">
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            {["Overview", "Details", "Amenities", "Dealer", "Documents"].map(t => (
              <a
                key={t}
                href={`#${t}`}
                className="hover:text-black dark:hover:text-white"
              >
                {t}
              </a>
            ))}
          </div>
        </div>

        {/* ================= OVERVIEW ================= */}
        <section id="Overview" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Price" value={`₹ ${property.priceLakhs} L`} />
          <Stat label="Area" value={`${property.areaSqFt} sq.ft`} />
          <Stat label="BHK" value={property.bhk} />
          <Stat label="Status" value={property.availabilityStatus} />
        </section>

        {/* ================= DETAILS ================= */}
        <section
          id="Details"
          className="bg-white dark:bg-neutral-900 border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Property Details</h2>
          <Field label="Facing" value={property.facing} />
          <Field label="Furnishing" value={property.furnishing} />
          <Field label="Ownership" value={property.propertyTitle} />
          <Field
            label="Floor"
            value={
              property
                ? `${property.floorNumber || property.floorInfo.floorNumber}/${property.totalFloors || property.floorInfo.totalFloors}`
                : "—"
            }
          />
        </section>

        {/* ================= AMENITIES ================= */}
        <section id="Amenities">
          <h2 className="text-lg font-semibold mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(property.amenities || {})
              .filter(([, v]) => v)
              .map(([k]) => (
                <span
                  key={k}
                  className="px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-neutral-800"
                >
                  {k.replace(/([A-Z])/g, " $1")}
                </span>
              ))}
          </div>
        </section>

        {/* ================= DEALER ================= */}
        <section
          id="Dealer"
          className="bg-white dark:bg-neutral-900 border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Dealer / Owner</h2>
          <Field label="Type" value={property.dealer?.type} />
          <Field label="Name" value={property.dealer?.name} />
          <Field label="Mobile" value={property.dealer?.mobile} />
          <Field label="Source" value={property.dealer?.source} />
        </section>

        {/* ================= DOCUMENTS ================= */}
        <section
          id="Documents"
          className="bg-white dark:bg-neutral-900 border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-2">Documents</h2>
          <p className="text-sm text-slate-500">
            Agreement copies, approvals, ownership proofs will appear here.
          </p>
        </section>

        {/* ================= ADMIN ACTIONS ================= */}
        <section className="bg-neutral-900 text-white rounded-2xl p-6 flex flex-col md:flex-row gap-4 justify-between">
          <p className="text-sm">
            Administrative Actions
          </p>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded bg-white text-black text-sm">
              Edit Property
            </button>
            <button className="px-4 py-2 rounded border border-white/30 text-sm">
              Change Status
            </button>
          </div>
        </section>

      </div>
    </AdminLayout>
  );
}
