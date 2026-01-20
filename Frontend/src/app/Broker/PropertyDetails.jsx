import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BrokerLayout from "../../components/layout/BrokerLayout";
import api from "../../services/api";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [loading, setLoading] = useState(true);


  const Field = ({ label, value }) => (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-right">
        {value ?? "—"}
      </span>
    </div>
  );

  useEffect(() => {
    api.get(`/broker/properties/${id}`).then(res => {
      setProperty(res.property);
      setPendingRequest(res.pendingRequest);
      setLoading(false);
      // console.log("res", res)
    });
  }, [id]);

  if (loading) {
    return (
      <BrokerLayout>
        <div className="py-32 text-center text-slate-400">
          Loading property…
        </div>
      </BrokerLayout>
    );
  }

  if (!property) {
    return (
      <BrokerLayout>
        <div className="py-32 text-center text-red-500">
          Property not found
        </div>
      </BrokerLayout>
    );
  }

  const cover = property.images?.find(i => i.type === "cover");
  const gallery = property.images?.filter(i => i.type === "gallery") || [];
  const mapImage = property.images?.find(i => i.type === "map");

  return (
    <BrokerLayout>
      <div className="max-w-7xl mx-auto px-4 py-1 space-y-12">

        {/* ================= HEADER ================= */}
        <header className="space-y-2">
          <Link
            to="/broker/properties"
            className="text-md dark:text-slate-200 dark:hover:text-slate-300"
          >
            ← Back to Properties
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight">
            {property.propertyName}
          </h1>

          <p className="text-sm text-slate-500">
            <span className="font-mono">{property.propertyCode}</span> ·{" "}
            {property.category} · {property.propertyType}
          </p>

          <p className="text-sm text-slate-500 flex items-center gap-2">
            📍 {property.address || property.location?.address},{" "}
            {property.location || property.location?.locality},{" "}
            {property.city || property.location?.city}
          </p>
        </header>

        {/* ================= COVER & GALLERY ================= */}
        <GlassCard>
          {cover || property.cover ? (
            <img
              src={property.cover || cover.url}
              className="w-full h-[340px] object-cover rounded-xl"
            />
          ) : (
            <div className="h-[340px] flex items-center justify-center text-slate-400">
              No Cover Image
            </div>
          )}

          {gallery.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
              {gallery.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  className="h-20 w-full object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </GlassCard>

        {/* ================= CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ========== LEFT ========== */}
          <div className="lg:col-span-2 space-y-8">

            <GlassCard title="Property Overview">
              <Grid>
                <Detail label="Price" value={`₹ ${property.priceLakhs?.toLocaleString()} Lakhs`} />
                <Detail label="Area" value={`${property.areaSqFt} sq ft`} />
                <Detail label="BHK" value={property.bhk || "—"} />
                <Detail label="Bedrooms" value={property.bedrooms || "—"} />
                <Detail label="Bathrooms" value={property.bathrooms || "—"} />
                <Detail label="Balconies" value={property.balconies || "—"} />
                <Detail
                  label="Floor"
                  value={`${property.floorNumber || property.floorInfo?.floorNumber || "—"} / ${property.totalFloors || property.floorInfo?.totalFloors || "—"}`}
                />
                <Detail label="Facing" value={property.facing || "—"} />
                <Detail label="Furnishing" value={property.furnishing} />
              </Grid>
            </GlassCard>

            <GlassCard title="Description">
              <p className="text-slate-600 leading-relaxed">
                {property.description || "No description provided."}
              </p>
            </GlassCard>

            <GlassCard title="Amenities">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                {Object.entries(property.amenities || {}).some(([, v]) => v)
                  ? Object.entries(property.amenities).map(
                    ([k, v]) =>
                      v && (
                        <span key={k} className="flex items-center gap-2">
                          ✔ {k.replace(/([A-Z])/g, " $1")}
                        </span>
                      )
                  )
                  : <span className="text-slate-400">No amenities listed</span>}
              </div>
            </GlassCard>


            <GlassCard>
              {property.customFields &&
                Object.keys(property.customFields).length > 0 && (
                  <section
                    id="custom-fields"
                    className="bg-white dark:bg-neutral-900 rounded-2xl p-6"
                  >
                    <h2 className="text-lg font-semibold mb-4">
                      Newly Added Data
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
                      {Object.entries(property.customFields).map(([key, value]) => (
                        <Field
                          key={key}
                          label={key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, c => c.toUpperCase())}
                          value={
                            value === true
                              ? "Yes"
                              : value === false
                                ? "No"
                                : value || "—"
                          }
                        />
                      ))}
                    </div>
                  </section>
                )}
            </GlassCard>

            {mapImage && (
              <GlassCard title="Location Map">
                <img
                  src={mapImage.url}
                  className="w-full rounded-xl border"
                />
              </GlassCard>
            )}
          </div>

          {/* ========== RIGHT ========== */}
          <div className="space-y-6">

            <GlassCard title="Availability">
              <StatusBadge status={property.availabilityStatus} />
            </GlassCard>




            <GlassCard title="Dealer / Owner">
              <p className="text-sm">
                <strong>Type:</strong> {property.dealer?.type}
              </p>
              <p className="text-sm">
                <strong>Name:</strong> {property.dealer?.name || "—"}
              </p>
              <p className="text-sm">
                <strong>Mobile:</strong> {property.dealer?.mobile || "—"}
              </p>
            </GlassCard>

            <GlassCard title="Property Updates">
              {pendingRequest ? (
                <div className="text-sm bg-slate-100 rounded-xl p-4">
                  ⏳ Change request under admin review
                </div>
              ) : (
                <Link
                  to={`/broker/property/${property._id}/request-edit`}
                  className="dark:hover:bg-slate-400 block dark:text-black text-center bg-slate-300 text-white py-2 rounded-xl font-medium"
                >
                  Request Property Change
                </Link>
              )}
            </GlassCard>

          </div>
        </div>
      </div>
    </BrokerLayout>
  );
}

/* ================= UI HELPERS ================= */

function GlassCard({ title, children }) {
  return (
    <div className="bg-slate/40 backdrop- border-b border-l rounded-2xl p-6 space-y-4">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {children}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
      {children}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    available: "bg-emerald-100 text-emerald-800",
    hold: "bg-yellow-100 text-yellow-800",
    sold: "bg-red-100 text-red-800",
    rented: "bg-slate-200 text-slate-800"
  };

  return (
    <span className={`inline-flex px-4 py-1 rounded-full text-xs font-medium capitalize ${map[status]}`}>
      {status}
    </span>
  );
}
