import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BrokerLayout from "../../components/layout/BrokerLayout";
import api from "../../services/api";

export default function ClientProfileEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log("📡 Loading client edit data for ID:", id);

    api.get(`/broker/clients/${id}/profile/edit`)
      .then((res) => {
        console.log("✅ EDIT API RAW RESPONSE:", res);

        console.log("✏️ EDITABLE DATA:", res.editableData);
        console.log("🔒 LOCKED FIELDS:", res?.lockedFields);

        if (!res?.editableData) {
          console.warn("⚠️ No editableData received from backend");
          setForm(null);
          return;
        }

        setForm(res.editableData);
      })
      .catch((err) => {
        console.error(
          "❌ EDIT LOAD ERROR:",
          err.response?.data || err
        );
        alert(err.response?.data?.message || "Not allowed to edit this client");
      })
      .finally(() => {
        console.log("⏹ Edit data load finished");
        setLoading(false);
      });

  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.post(`/broker/clients/${id}/profile/edit`, form);
      alert("Client updated successfully");
      navigate(`/broker/clients/${id}/profile`);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!form) return <div className="p-10">No editable data</div>;

  return (
    <BrokerLayout>
      <div className="max-w-6xl mx-auto space-y-8 px-4">

        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Edit Client</h1>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 rounded bg-black dark:bg-white text-white dark:text-black"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </header>

        {/* ================= CONTACT ================= */}
        <Section title="Contact Details">
          <Input name="phone" label="Primary Phone" value={form.phone} onChange={handleChange} />
          <Input name="alternatePhone" label="Alternate Phone" value={form.alternatePhone} onChange={handleChange} />
          <Input name="email" label="Email" value={form.email} onChange={handleChange} />
          <Select name="preferredContactMode" label="Preferred Contact Mode" value={form.preferredContactMode} onChange={handleChange}>
            <option value="call">Call</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </Select>
        </Section>

        {/* ================= ADDRESS ================= */}
        <Section title="Address Details">
          <Input name="city" label="City" value={form.addressDetails?.city} onChange={handleChange} />
          <Input name="sector" label="Sector" value={form.addressDetails?.sector} onChange={handleChange} />
          <Input name="block" label="Block" value={form.addressDetails?.block} onChange={handleChange} />
          <Input name="pocket" label="Pocket" value={form.addressDetails?.pocket} onChange={handleChange} />
          <Textarea name="fullAddress" label="Full Address" value={form.addressDetails?.fullAddress} onChange={handleChange} />
        </Section>

        {/* ================= LEAD ================= */}
        <Section title="Lead Information">
          <Select name="source" label="Source" value={form.source} onChange={handleChange}>
            <option value="call">Call</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="walk-in">Walk-in</option>
            <option value="website">Website</option>
          </Select>

          <Select name="sourceQuality" label="Source Quality" value={form.sourceQuality} onChange={handleChange}>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </Select>

          <Input name="referredBy" label="Referred By" value={form.referredBy} onChange={handleChange} />
        </Section>

        {/* ================= REQUIREMENTS ================= */}
        <Section title="Requirements">
          <Input name="preferredCity" label="Preferred City" value={form.requirementProfile?.preferredCity} onChange={handleChange} />
          <Input name="preferredSectors" label="Preferred Sectors" value={form.requirementProfile?.preferredSectors?.join(", ")} onChange={handleChange} />
          <Select name="bhkPreference" label="BHK Preference" value={form.requirementProfile?.bhkPreference} onChange={handleChange}>
            <option value="">Any</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
          </Select>
        </Section>

        {/* ================= FOLLOW UP ================= */}
        <Section title="Follow Up">
          <Input type="date" name="nextFollowUpAt" label="Next Follow-up Date" value={form.nextFollowUpAt} onChange={handleChange} />
          <Input name="nextAction" label="Next Action" value={form.nextAction} onChange={handleChange} />
        </Section>

        {/* ================= INTERNAL ================= */}
        <Section title="Internal Notes">
          <Textarea name="dealerNotes" label="Dealer Notes" value={form.dealerNotes} onChange={handleChange} />
          <Textarea name="redFlags" label="Red Flags" value={form.redFlags} onChange={handleChange} />
        </Section>

      </div>
    </BrokerLayout>
  );
}

/* ================= UI HELPERS ================= */

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-black border dark:border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 rounded bg-slate-100 dark:bg-panel border dark:border-border"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="md:col-span-2">
      <label className="text-xs text-slate-500">{label}</label>
      <textarea
        {...props}
        rows={4}
        className="w-full px-4 py-2 rounded bg-slate-100 dark:bg-panel border dark:border-border"
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <select
        {...props}
        className="w-full px-4 py-2 rounded bg-slate-100 dark:bg-panel border dark:border-border"
      >
        {children}
      </select>
    </div>
  );
}
