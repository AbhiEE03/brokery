import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";

const FEATURES = [
  "swimmingPool",
  "garden",
  "garage",
  "lift",
  "powerBackup",
  "security",
];

export default function AdminEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    propertyCode: "",
    title: "",
    category: "",
    propertyType: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    floor: "",
    totalFloors: "",
    facing: "",
    furnishingStatus: "",
    city: "",
    locality: "",
    address: "",
    description: "",
    features: {},
  });

  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState({});

  /* ---------------- FETCH PROPERTY ---------------- */
  useEffect(() => {
    api.get(`/admin/properties/${id}/edit`).then((res) => {
      const p = res.property;
      // console.log("edit", p)

      setForm({
        propertyCode: p.propertyCode,
        title: p.title,
        category: p.category,
        propertyType: p.propertyType,
        price: p.price,
        area: p.area,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        floor: p.floor,
        totalFloors: p.totalFloors,
        facing: p.facing,
        furnishingStatus: p.furnishingStatus,
        city: p.location?.city || "",
        locality: p.location?.locality || "",
        address: p.location?.address || "",
        description: p.description || "",
        features: p.features || {},
      });

      setExistingImages(p.images || []);
      setLoading(false);
    });
  }, [id]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFeatureChange = (f) =>
    setForm({
      ...form,
      features: { ...form.features, [f]: !form.features[f] },
    });

  const handleFileChange = (e) =>
    setFiles({ ...files, [e.target.name]: e.target.files });

  const submit = async () => {
    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (k === "features") {
        Object.entries(v).forEach(([fk, fv]) => fd.append(fk, fv));
      } else {
        fd.append(k, v);
      }
    });

    Object.entries(files).forEach(([k, v]) => {
      [...v].forEach((file) => fd.append(k, file));
    });

    await api.put(`/admin/properties/${id}`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // -------------------------
    // REDIRECT
    // -------------------------
    navigate(`/admin/properties/${id}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-slate-500">
          Loading property…
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SectionHeader
        title="Edit Property"
        subtitle={`Property Code: ${form.propertyCode}`}
      />

      {/* STEP INDICATOR */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold border
              ${step === s
                ? "bg-teal-600 text-white border-teal-600"
                : "border-slate-300 text-slate-500"
              }`}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-card border dark:border-border rounded-xl p-6 space-y-6">

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={form.propertyCode}
                disabled
                className="input bg-slate-100 dark:bg-panel"
              />

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input"
                placeholder="Title"
              />

              <select name="category" value={form.category} onChange={handleChange} className="input">
                {["floor", "kothi", "plot", "flat", "commercial", "rent"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select name="propertyType" value={form.propertyType} onChange={handleChange} className="input">
                {["1BHK", "2BHK", "3BHK", "4BHK", "shop", "office", "warehouse"].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <input name="price" type="number" value={form.price} onChange={handleChange} className="input" />
              <input name="area" type="number" value={form.area} onChange={handleChange} className="input" />
            </div>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold">Configuration & Location</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["bedrooms", "bathrooms", "floor", "totalFloors"].map(f => (
                <input
                  key={f}
                  name={f}
                  value={form[f]}
                  onChange={handleChange}
                  className="input"
                  placeholder={f}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="facing" value={form.facing} onChange={handleChange} className="input">
                <option value="">Facing</option>
                {["north", "south", "east", "west"].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              <select
                name="furnishingStatus"
                value={form.furnishingStatus}
                onChange={handleChange}
                className="input"
              >
                {["unfurnished", "semi-furnished", "fully-furnished"].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              <input name="city" value={form.city} onChange={handleChange} className="input" />
              <input name="locality" value={form.locality} onChange={handleChange} className="input" />
              <input name="address" value={form.address} onChange={handleChange} className="input md:col-span-2" />
            </div>
          </>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold">Features & Media</h2>

            {/* FEATURES */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {FEATURES.map(f => (
                <label key={f} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!form.features[f]}
                    onChange={() => handleFeatureChange(f)}
                  />
                  {f.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>

            {/* EXISTING IMAGES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map(img => (
                <img
                  key={img._id}
                  src={img.url}
                  className="h-28 w-full object-cover rounded border"
                />
              ))}
            </div>

            {/* FILE INPUTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <File label="Replace Cover Image" name="cover" onChange={handleFileChange} />
              <File label="Replace Map" name="map" onChange={handleFileChange} />
              <File label="Add Gallery Images" name="gallery" multiple onChange={handleFileChange} />
              <File label="Replace Floor Plan" name="floorPlan" onChange={handleFileChange} />
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="input"
            />
          </>
        )}

        {/* NAV */}
        <div className="flex justify-between pt-4 border-t">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-4 py-2 border rounded"
          >
            Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submit}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Update Property
            </button>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

/* ------------------ SMALL FILE COMPONENT ------------------ */
function File({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type="file" className="input" {...props} />
    </div>
  );
}
