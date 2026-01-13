import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";
import api from "../../services/api";

/* =========================
   CONSTANTS
========================= */
const CATEGORY_MAP = {
  residential: ["builder_floor", "flat", "kothi"],
  commercial: ["shop", "office", "showroom"],
  land: ["plot"],
  industrial: ["warehouse"],
  rent: ["builder_floor", "flat", "shop"],
};

const AMENITIES = [
  "swimmingPool",
  "garden",
  "garage",
  "lift",
  "powerBackup",
  "security",
];

const LAYOUTS = ["1/1", "2+1/1", "3+1/1", "3+1/2", "4+1/2", "4+1/3"];

export default function AdminAddProperty() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const normalizeFiles = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  };

  /* =========================
     FORM STATE
  ========================= */
  const [form, setForm] = useState({
    /* BASIC */
    propertyTitle: "",
    category: "",
    propertyType: "",
    description: "",

    /* CONFIGURATION */
    bhk: "",
    layout: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    floorNumber: "",
    totalFloors: "",

    /* PRICING */
    areaSqFt: "",
    priceLakhs: "",
    netPrice: "",
    demand: "",

    /* FURNISHING */
    facing: "",
    furnishing: "",

    /* LOCATION */
    city: "",
    sector: "",
    block: "",
    pocket: "",
    road: "",
    locality: "",
    address: "",
    pincode: "",

    /* STATUS */
    availabilityStatus: "available",
    legalStatus: "",
    approvalStatus: "approved",

    /* EXTRA */
    propertySource: "",
    comments: "",

    /* DEALER / OWNER */
    dealerType: "dealer",
    dealerName: "",
    dealerMobile: "",
    dealerSource: "",
    referredBy: "",

    /* AMENITIES */
    amenities: {},
  });

  const [files, setFiles] = useState({
    cover: null,
    gallery: [],
    map: null,
    floorPlan: null,
    documents: [],
  });

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAmenity = (name) => {
    setForm({
      ...form,
      amenities: {
        ...form.amenities,
        [name]: !form.amenities[name],
      },
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;

    setFiles((prev) => ({
      ...prev,
      [name]:
        name === "gallery" || name === "documents"
          ? Array.from(selectedFiles) // ✅ always real array
          : selectedFiles[0] || null,
    }));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    setLoading(true);

    try {
      // 🔴 REQUIRED CHECK
      if (!files.cover) {
        alert("Cover image is required");
        setLoading(false);
        return;
      }

      const data = new FormData();

      // -------------------------
      // TEXT + NON-FILE FIELDS
      // -------------------------
      Object.entries(form).forEach(([key, value]) => {
        if (key === "amenities") {
          Object.entries(value).forEach(([a, v]) => {
            if (v) data.append(`amenities[${a}]`, true);
          });
        } else {
          data.append(key, value);
        }
      });

      // -------------------------
      // FILE FIELDS (ONLY HERE)
      // -------------------------
      data.append("cover", files.cover);

      normalizeFiles(files.gallery).forEach((file) => {
        data.append("gallery", file);
      });

      normalizeFiles(files.documents).forEach((file) => {
        data.append("documents", file);
      });

      if (files.map) data.append("map", files.map);
      if (files.floorPlan) data.append("floorPlan", files.floorPlan);

      // -------------------------
      // ✅ CORRECT ENDPOINT
      // -------------------------
      await api.post("/admin/add-property", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Property added successfully");
      window.location.href = "/admin/properties";

    } catch (err) {
      console.error("ADD PROPERTY ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };


  /* =========================
     UI
  ========================= */
  return (
    <AdminLayout>
      <SectionHeader
        title="Add New Property"
        subtitle="Create and publish a new property listing"
      />

      {/* STEP INDICATOR */}
      <div className="flex items-center gap-4 mb-8 max-w-3xl">
        {[1, 2, 3, 4].map((s, i) => (
          <>
            <div
              key={s}
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-semibold
                ${step === s
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-slate-300 dark:border-border text-slate-400"
                }`}
            >
              {s}
            </div>
            {i < 3 && (
              <div className="flex-1 h-[2px] bg-slate-200 dark:bg-border" />
            )}
          </>
        ))}
      </div>

      <div className="bg-white dark:bg-black border dark:border-border rounded-xl p-6 max-w-6xl">

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Basic Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <select name="propertyTitle" onChange={handleChange} className="input">
                <option value="">Ownership</option>
                <option value="FREEHOLD">Freehold</option>
                <option value="LEASEHOLD">Leasehold</option>
              </select>

              <select name="category" onChange={handleChange} className="input">
                <option value="">Category</option>
                {Object.keys(CATEGORY_MAP).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select name="propertyType" onChange={handleChange} className="input">
                <option value="">Property Type</option>
                {CATEGORY_MAP[form.category]?.map((p) => (
                  <option key={p} value={p}>{p.replace("_", " ")}</option>
                ))}
              </select>

              <textarea
                name="description"
                placeholder="Property description"
                onChange={handleChange}
                className="input md:col-span-2"
              />
            </div>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Configuration & Pricing</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <select name="bhk" onChange={handleChange} className="input">
                <option value="">BHK</option>
                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} BHK</option>)}
              </select>

              <select name="layout" onChange={handleChange} className="input">
                <option value="">Layout</option>
                {LAYOUTS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>

              <select name="facing" onChange={handleChange} className="input">
                <option value="">Facing</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>

              <select name="furnishing" onChange={handleChange} className="input">
                <option value="">Furnishing</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>

              <input type="number" name="bedrooms" placeholder="Bedrooms" className="input" onChange={handleChange} />
              <input type="number" name="bathrooms" placeholder="Bathrooms" className="input" onChange={handleChange} />
              <input type="number" name="balconies" placeholder="Balconies" className="input" onChange={handleChange} />
              <input type="number" name="floorNumber" placeholder="Floor Number" className="input" onChange={handleChange} />
              <input type="number" name="totalFloors" placeholder="Total Floors" className="input" onChange={handleChange} />

              <input type="number" name="areaSqFt" placeholder="Area (Sq Ft)" className="input" onChange={handleChange} />
              <input type="number" name="priceLakhs" placeholder="Price (Lakhs)" className="input" onChange={handleChange} />
              <input type="number" name="netPrice" placeholder="Net Price" className="input" onChange={handleChange} />
              <input name="demand" placeholder="Demand" className="input" onChange={handleChange} />
            </div>
          </>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Location & Amenities</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {["city", "sector", "block", "pocket", "road", "locality", "pincode"].map(f => (
                <input key={f} name={f} placeholder={f} className="input" onChange={handleChange} />
              ))}
            </div>

            <textarea
              name="address"
              placeholder="Full address"
              className="input mb-4"
              onChange={handleChange}
            />

            <div className="grid md:grid-cols-3 gap-3">
              {AMENITIES.map(a => (
                <label key={a} className="flex gap-2 items-center">
                  <input type="checkbox" onChange={() => handleAmenity(a)} />
                  {a.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>
          </>
        )}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <>
            <h2 className="text-lg font-semibold mb-6">Media, Status & Owner / Dealer</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">

              {/* COVER IMAGE */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Cover Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="cover"
                  required
                  onChange={handleFileChange}
                  className="input"
                />
                <p className="text-xs text-slate-500 dark:text-muted">
                  Main image shown on property cards & listings
                </p>
              </div>

              {/* MAP IMAGE */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Property Map / Location Image
                </label>
                <input
                  type="file"
                  name="map"
                  onChange={handleFileChange}
                  className="input"
                />
                <p className="text-xs text-slate-500 dark:text-muted">
                  Location map or plotted layout (HD preferred)
                </p>
              </div>

              {/* GALLERY */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-medium">
                  Gallery Images
                </label>
                <input
                  type="file"
                  name="gallery"
                  multiple
                  onChange={handleFileChange}
                  className="input"
                />
                <p className="text-xs text-slate-500 dark:text-muted">
                  Multiple interior / exterior photos (optional)
                </p>
              </div>

              {/* FLOOR PLAN */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-medium">
                  Floor Plan (Optional)
                </label>
                <input
                  type="file"
                  name="floorPlan"
                  onChange={handleFileChange}
                  className="input"
                />
                <p className="text-xs text-slate-500 dark:text-muted">
                  Architectural drawing or unit layout
                </p>
              </div>

            </div>


            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <select name="availabilityStatus" onChange={handleChange} className="input">
                <option value="available">Available</option>
                <option value="hold">Hold</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>

              <select name="legalStatus" onChange={handleChange} className="input">
                <option value="">Legal Status</option>
                <option value="map_pass">Map Pass</option>
                <option value="old_map">Old Map</option>
                <option value="with_roof">With Roof</option>
                <option value="mcd">MCD</option>
                <option value="janta_faced">Janta Faced</option>
              </select>

              <select name="approvalStatus" onChange={handleChange} className="input">
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <input
              name="propertySource"
              placeholder="Property Source"
              className="input mb-3"
              onChange={handleChange}
            />

            <div className="border-t dark:border-border pt-4">
              <div className="flex gap-6 mb-4">
                {["dealer", "owner"].map(v => (
                  <label key={v} className="flex gap-2 items-center">
                    <input type="radio" name="dealerType" value={v} checked={form.dealerType === v} onChange={handleChange} />
                    {v}
                  </label>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input name="dealerName" placeholder="Name" className="input" onChange={handleChange} />
                <input name="dealerMobile" placeholder="Mobile" className="input" onChange={handleChange} />
                <input name="dealerSource" placeholder="Source" className="input" onChange={handleChange} />
                <input name="referredBy" placeholder="Referred By" className="input" onChange={handleChange} />
              </div>

              <input type="file" name="documents" multiple onChange={handleFileChange} className="input" />
            </div>

            <textarea
              name="comments"
              placeholder="Comments / remarks"
              className="input mt-4"
              onChange={handleChange}
            />
          </>
        )}

        {/* NAV */}
        <div className="flex justify-between mt-8">
          <button disabled={step === 1} onClick={() => setStep(step - 1)} className="px-4 py-2 border rounded">
            Back
          </button>

          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="px-6 py-2 bg-black dark:bg-neutral-400/60 text-white rounded">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-emerald-600 text-white rounded">
              {loading ? "Saving..." : "Save Property"}
            </button>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
