import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";
import BrokerLayout from "../../components/layout/BrokerLayout";

/* ================= ENUM OPTIONS ================= */
const ENUMS = {
  source: ["sheet", "manual"],
  propertyTitle: ["FREEHOLD", "LEASEHOLD"],
  category: ["residential", "commercial", "land", "industrial", "rent"],
  propertyType: [
    "builder_floor",
    "flat",
    "kothi",
    "plot",
    "shop",
    "office",
    "showroom",
    "warehouse"
  ],
  furnishing: ["furnished", "semi-furnished", "unfurnished"],
  facing: ["north", "south", "east", "west"],
  availabilityStatus: ["available", "hold", "sold", "rented"],
  legalStatus: ["map_pass", "old_map", "with_roof", "mcd", "janta_faced"],
  dealerType: ["dealer", "owner"]
};

export default function BrokerRequestEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/broker/properties/${id}`).then(res => {
      const p = res.property;

      setForm({
        propertyName: p.propertyName,
        propertyTitle: p.propertyTitle,
        category: p.category,
        propertyType: p.propertyType,
        description: p.description,

        bhk: p.bhk,
        layout: p.layout,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        balconies: p.balconies,
        floorInfo: {
          floorNumber: p.floorNumber || p.floorInfo?.floorNumber,
          totalFloors: p.totalFloors || p.floorInfo?.totalFloors
        },

        areaSqFt: p.areaSqFt,
        priceLakhs: p.priceLakhs,
        netPrice: p.netPrice,
        demand: p.demand,

        furnishing: p.furnishing,
        facing: p.facing,

        location: { ...p.location },
        mapLocation: { ...p.mapLocation },

        amenities: { ...p.amenities },

        dealer: { ...p.dealer },

        availabilityStatus: p.availabilityStatus,
        legalStatus: p.legalStatus
      });

      setLoading(false);
    });
  }, [id]);

  const setValue = (path, value) => {
    setForm(prev => {
      const updated = structuredClone(prev);
      let ref = updated;
      const keys = path.split(".");
      keys.slice(0, -1).forEach(k => {
        if (!ref[k]) ref[k] = {};
        ref = ref[k];
      });
      ref[keys.at(-1)] = value;
      return updated;
    });
  };

  const submit = async () => {
    if (!reason.trim()) {
      alert("Reason is required");
      return;
    }

    await api.post(`/broker/properties/${id}/request-edit`, {
      proposedChanges: form,
      reason
    });

    navigate(`/broker/properties/${id}`);
  };

  if (loading) {
    return (
      <BrokerLayout>
        <div className="py-32 text-center text-slate-400">
          Loading…
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-10">

        {/* HEADER */}
        <header className="space-y-2">
          <Link
            to={`/broker/properties/${id}`}
            className="text-sm text-slate-400 hover:underline"
          >
            ← Back to Property
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight">
            Request Property Update
          </h1>

          <p className="text-sm text-slate-500">
            Changes will be reviewed and approved by Admin
          </p>
        </header>

        {/* ================= FORM ================= */}
        <GlassCard title="Basic Information">
          <Grid>
            <Input label="Property Name" value={form.propertyName} onChange={v => setValue("propertyName", v)} />
            <Select label="Ownership" options={ENUMS.propertyTitle} value={form.propertyTitle} onChange={v => setValue("propertyTitle", v)} />
            <Select label="Category" options={ENUMS.category} value={form.category} onChange={v => setValue("category", v)} />
            <Select label="Property Type" options={ENUMS.propertyType} value={form.propertyType} onChange={v => setValue("propertyType", v)} />
          </Grid>
        </GlassCard>

        <GlassCard title="Pricing & Size">
          <Grid>
            <Input label="Area (sq ft)" type="number" value={form.areaSqFt} onChange={v => setValue("areaSqFt", v)} />
            <Input label="Price (Lakhs)" type="number" value={form.priceLakhs} onChange={v => setValue("priceLakhs", v)} />
            <Input label="Net Price" value={form.netPrice} onChange={v => setValue("netPrice", v)} />
            <Input label="Demand Notes" value={form.demand} onChange={v => setValue("demand", v)} />
          </Grid>
        </GlassCard>

        <GlassCard title="Configuration">
          <Grid>
            <Input label="BHK" type="number" value={form.bhk} onChange={v => setValue("bhk", v)} />
            <Input label="Bedrooms" type="number" value={form.bedrooms} onChange={v => setValue("bedrooms", v)} />
            <Input label="Bathrooms" type="number" value={form.bathrooms} onChange={v => setValue("bathrooms", v)} />
            <Input label="Balconies" type="number" value={form.balconies} onChange={v => setValue("balconies", v)} />
            <Input label="Floor Number" type="number" value={form.floorInfo.floorNumber} onChange={v => setValue("floorInfo.floorNumber", v)} />
            <Input label="Total Floors" type="number" value={form.floorInfo.totalFloors} onChange={v => setValue("floorInfo.totalFloors", v)} />
          </Grid>
        </GlassCard>

        <GlassCard title="Furnishing & Facing">
          <Grid>
            <Select label="Furnishing" options={ENUMS.furnishing} value={form.furnishing} onChange={v => setValue("furnishing", v)} />
            <Select label="Facing" options={ENUMS.facing} value={form.facing} onChange={v => setValue("facing", v)} />
          </Grid>
        </GlassCard>

        <GlassCard title="Amenities">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {Object.keys(form.amenities).map(a => (
              <label key={a} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.amenities[a]}
                  onChange={() => setValue(`amenities.${a}`, !form.amenities[a])}
                />
                {a.replace(/([A-Z])/g, " $1")}
              </label>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Dealer Information">
          <Grid>
            <Select label="Dealer Type" options={ENUMS.dealerType} value={form.dealer.type} onChange={v => setValue("dealer.type", v)} />
            <Input label="Dealer Name" value={form.dealer.name} onChange={v => setValue("dealer.name", v)} />
            <Input label="Mobile" value={form.dealer.mobile} onChange={v => setValue("dealer.mobile", v)} />
            <Input label="Source" value={form.dealer.source} onChange={v => setValue("dealer.source", v)} />
          </Grid>
        </GlassCard>

        <GlassCard title="Location">
          <Grid>
            {["city", "sector", "block", "pocket", "road", "locality", "address", "pincode"].map(f => (
              <Input key={f} label={f} value={form.location[f]} onChange={v => setValue(`location.${f}`, v)} />
            ))}
          </Grid>
        </GlassCard>

        <GlassCard title="Description">
          <textarea
            rows={4}
            value={form.description || ""}
            onChange={e => setValue("description", e.target.value)}
            className="w-full input"
          />
        </GlassCard>

        <GlassCard title="Reason for Change">
          <textarea
            rows={3}
            required
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Explain why this change is required"
            className="w-full input"
          />
        </GlassCard>

        <div className="flex justify-end gap-4">
          <Link to={`/broker/properties/${id}`} className="px-4 py-2 border rounded-xl">
            Cancel
          </Link>

          <button
            onClick={submit}
            className="px-6 py-2 bg-green-300/40 border dark:text-white rounded-xl font-medium"
          >
            Submit for Approval
          </button>
        </div>

      </div>
    </BrokerLayout>
  );
}

/* ================= UI HELPERS ================= */

function GlassCard({ title, children }) {
  return (
    <div className="bg-slate/70 backdrop-blur border-r border- border-b rounded-2xl p-6 space-y-4">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {children}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        className="w-full input"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <select
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        className="w-full input"
      >
        <option value="">— Select —</option>
        {options.map(o => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
