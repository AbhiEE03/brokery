import { useState } from "react";
import BrokerLayout from "../../components/layout/BrokerLayout";
// import SectionHeader from "./components/SectionHeader";
import api from "../../services/api";

export default function AdminAddClient() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    /* STEP 1 — IDENTITY */
    clientType: "buyer",
    entityType: "individual",
    name: "",
    companyName: "",

    /* CONTACT */
    phone: "",
    alternatePhone: "",
    whatsappAvailable: true,
    email: "",
    preferredContactMode: "call",
    bestTimeToContact: "morning",

    /* ADDRESS */
    city: "",
    sector: "",
    block: "",
    pocket: "",
    fullAddress: "",
    nativeCity: "",

    /* STEP 2 — LEAD */
    source: "",
    referredBy: "",
    sourceQuality: "warm",
    firstContactChannel: "call",

    /* STEP 3 — REQUIREMENT */
    inquiryType: "buy",
    propertyCategory: "",
    preferredCity: "",
    preferredSectors: "",
    bhkPreference: "",
    areaMin: "",
    areaMax: "",
    budgetMin: "",
    budgetMax: "",
    facingPreference: "",
    floorPreference: "",
    furnishing: "",
    urgency: "",
    budgetVerified: false,
    fundingMode: "",
    loanStatus: "",
    priceSensitivity: "",

    /* STEP 4 — TRACKING */
    totalSiteVisits: "",
    lastSiteVisitDate: "",
    clientFeedback: "",
    rejectionReason: "",
    negotiationStage: "",
    offerMade: false,
    offerAmount: "",
    decisionProbability: "",
    clientStatus: "active",
    followUpPriority: "medium",
    dealerNotes: "",
    redFlags: "",
    repeatClient: false,
    referralPotential: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("Submitting form:", form);

      const res = await api.post("/broker/clients", form);

      console.log("Server response:", res.data);

      const clientId = res?.client?._id;
      if (!clientId) throw new Error("Client ID missing");

      window.location.href = `/broker/clients/${clientId}/profile`;

    } catch (err) {
      console.error("ADD CLIENT ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add client");
    } finally {
      setLoading(false);
    }
  };


  return (
    <BrokerLayout>


      {/* STEP INDICATOR */}
      <div className="flex items-center gap-4 mb-8 max-w-3xl">
        {[1, 2, 3, 4].map((s, i) => (
          <>
            <div
              key={s}
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-semibold
              ${step === s
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                  : "border-slate-300 dark:border-border text-slate-400"
                }`}
            >
              {s}
            </div>
            {i < 3 && <div className="flex-1 h-[2px] bg-slate-200 dark:bg-border" />}
          </>
        ))}
      </div>

      <div className="bg-white dark:bg-black border dark:border-border rounded-xl p-6 max-w-6xl">

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Client Identity</h2>
            <div className="grid md:grid-cols-3 gap-4">

              <select name="clientType" onChange={handleChange} className="input">
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="investor">Investor</option>
                <option value="tenant">Tenant</option>
              </select>

              <select name="entityType" onChange={handleChange} className="input">
                <option value="individual">Individual</option>
                <option value="company">Company</option>
              </select>

              {form.entityType === "company" && (
                <input
                  name="companyName"
                  placeholder="Company Name"
                  className="input"
                  onChange={handleChange}
                />
              )}

              <input
                name="name"
                placeholder="Client Full Name"
                className="input md:col-span-2"
                onChange={handleChange}
              />

              <input name="phone" placeholder="Primary Mobile" className="input" onChange={handleChange} />
              <input name="alternatePhone" placeholder="Alternate Mobile" className="input" onChange={handleChange} />

              <input name="email" placeholder="Email Address" className="input" onChange={handleChange} />

              <select name="preferredContactMode" onChange={handleChange} className="input">
                <option value="call">Call</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>

              <select name="bestTimeToContact" onChange={handleChange} className="input">
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Address & Lead Source</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {["city", "sector", "block", "pocket", "nativeCity"].map(f => (
                <input key={f} name={f} placeholder={f} className="input" onChange={handleChange} />
              ))}

              <textarea
                name="fullAddress"
                placeholder="Full Address"
                className="input md:col-span-3"
                onChange={handleChange}
              />

              <select name="source" onChange={handleChange} className="input">
                <option value="">Lead Source</option>
                <option value="google">Google</option>
                <option value="99acres">99 Acres</option>
                <option value="walk-in">Walk-in</option>
                <option value="reference">Reference</option>
              </select>

              <input name="referredBy" placeholder="Referred By" className="input" onChange={handleChange} />

              <select name="sourceQuality" onChange={handleChange} className="input">
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
          </>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Requirement & Budget</h2>
            <div className="grid md:grid-cols-3 gap-4">

              <select name="propertyCategory" onChange={handleChange} className="input">
                <option value="">Property Category</option>
                <option value="flat">Flat</option>
                <option value="builder_floor">Builder Floor</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
              </select>

              <input name="preferredCity" placeholder="Preferred City" className="input" onChange={handleChange} />
              <input name="preferredSectors" placeholder="Preferred Sectors" className="input" onChange={handleChange} />

              <input name="areaMin" placeholder="Min Area (Sq Ft)" className="input" onChange={handleChange} />
              <input name="areaMax" placeholder="Max Area (Sq Ft)" className="input" onChange={handleChange} />

              <input name="budgetMin" placeholder="Min Budget" className="input" onChange={handleChange} />
              <input name="budgetMax" placeholder="Max Budget" className="input" onChange={handleChange} />

              <select name="urgency" onChange={handleChange} className="input">
                <option value="">Urgency</option>
                <option value="immediate">Immediate</option>
                <option value="1-3 months">1–3 Months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </>
        )}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Tracking & Intelligence</h2>
            <div className="grid md:grid-cols-3 gap-4">

              <input name="totalSiteVisits" placeholder="Total Site Visits" className="input" onChange={handleChange} />
              <input type="date" name="lastSiteVisitDate" className="input" onChange={handleChange} />

              <select name="decisionProbability" onChange={handleChange} className="input">
                <option value="">Decision Probability</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <textarea
                name="dealerNotes"
                placeholder="Dealer Notes"
                className="input md:col-span-3"
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* NAV */}
        <div className="flex justify-between mt-8">
          <button disabled={step === 1} onClick={() => setStep(step - 1)} className="px-4 py-2 border rounded">
            Back
          </button>

          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-emerald-600 text-white rounded">
              {loading ? "Saving..." : "Save Client"}
            </button>
          )}
        </div>
      </div>
    </BrokerLayout>
  );
}
