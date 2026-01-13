import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../services/api";

/* =====================================================
   ADMIN CLIENT PROFILE (READ-ONLY MASTER VIEW)
===================================================== */

export default function AdminClientProfile() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/admin/clients/${id}`)
      .then(res => setClient(res.client))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-slate-500">
          Loading client…
        </div>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-red-500">
          Client not found
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto px-4 pb-20 space-y-10">

        {/* ================= HEADER ================= */}
        <header className="bg-white dark:bg-black border dark:border-border rounded-2xl p-6">
          <h1 className="text-2xl font-semibold">
            {client.name}
          </h1>

          <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
            <span>Client Code: {client.clientCode}</span>
            <span>•</span>
            <span>Status: {client.status}</span>
            <span>•</span>
            <span>Pipeline: {client.pipelineStage}</span>
          </div>
        </header>

        {/* ================= IDENTITY ================= */}
        <Section title="Client Identity">
          <Field label="Client Type" value={client.clientType} />
          <Field label="Entity Type" value={client.entityType} />
          <Field label="Company Name" value={client.companyName} />
          <Field label="Owning Company" value={client.owningCompany} />
          <Field label="Current Broker" value={client.currentBroker?.name} />
          <Field label="Repeat Client" value={client.repeatClient ? "Yes" : "No"} />
        </Section>

        {/* ================= CONTACT ================= */}
        <Section title="Contact Details">
          <Field label="Phone" value={client.phone} />
          <Field label="Alternate Phone" value={client.alternatePhone} />
          <Field label="Email" value={client.email} />
          <Field label="WhatsApp Available" value={client.whatsappAvailable ? "Yes" : "No"} />
          <Field label="Preferred Contact Mode" value={client.preferredContactMode} />
          <Field label="Best Time to Contact" value={client.bestTimeToContact} />
        </Section>

        {/* ================= ADDRESS ================= */}
        <Section title="Address">
          <Field label="City" value={client.addressDetails?.city} />
          <Field label="Sector" value={client.addressDetails?.sector} />
          <Field label="Block" value={client.addressDetails?.block} />
          <Field label="Pocket" value={client.addressDetails?.pocket} />
          <Field
            label="Full Address"
            value={client.addressDetails?.fullAddress}
            full
          />
        </Section>

        {/* ================= LEAD SOURCE ================= */}
        <Section title="Lead Source & Quality">
          <Field label="Source" value={client.source} />
          <Field label="Referred By" value={client.referredBy} />
          <Field label="Source Quality" value={client.sourceQuality} />
          <Field label="First Contact Channel" value={client.firstContactChannel} />
        </Section>

        {/* ================= REQUIREMENTS ================= */}
        <Section title="Requirement Profile">
          <Field label="Inquiry Type" value={client.inquiryType} />
          <Field label="Preferred City" value={client.requirementProfile?.preferredCity} />
          <Field label="Preferred Sectors" value={client.requirementProfile?.preferredSectors?.join(", ")} />
          <Field label="BHK Preference" value={client.requirementProfile?.bhkPreference} />
          <Field
            label="Area Range"
            value={`${client.requirementProfile?.areaRange?.min || "—"} - ${client.requirementProfile?.areaRange?.max || "—"} sq.ft`}
          />
          <Field label="Urgency" value={client.requirementProfile?.urgencyLevel} />
        </Section>

        {/* ================= BUDGET & FINANCE ================= */}
        <Section title="Budget & Finance">
          <Field label="Budget Min" value={client.budget?.min} />
          <Field label="Budget Max" value={client.budget?.max} />
          <Field label="Budget Verified" value={client.budget?.verified ? "Yes" : "No"} />
          <Field label="Funding Mode" value={client.fundingMode} />
          <Field label="Loan Status" value={client.loanStatus} />
          <Field label="Price Sensitivity" value={client.priceSensitivity} />
        </Section>

        {/* ================= NEGOTIATION ================= */}
        <Section title="Negotiation">
          <Field label="Stage" value={client.negotiation?.currentStage} />
          <Field label="Offer Made" value={client.negotiation?.offerMade ? "Yes" : "No"} />
          <Field label="Offer Amount" value={client.negotiation?.offerAmount} />
          <Field label="Decision Probability" value={client.negotiation?.decisionProbability} />
        </Section>

        {/* ================= PROPERTY INTEREST ================= */}
        <Section title="Interested Properties">
          {client.interestedIn?.length ? (
            client.interestedIn.map((i, idx) => (
              <div
                key={idx}
                className="md:col-span-2 bg-slate-50 dark:bg-panel border dark:border-border rounded-xl p-4"
              >
                <p className="font-medium">
                  {i.property?.propertyName}
                </p>
                <p className="text-xs text-slate-500">
                  {i.property?.location?.city}
                </p>
                <p className="text-xs mt-1">
                  Interest Level: <strong>{i.interestLevel}</strong>
                </p>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </Section>

        {/* ================= DOCUMENTS ================= */}
        <Section title="Documents">
          {client.documents?.length ? (
            client.documents.map((doc, idx) => (
              <div
                key={idx}
                className="md:col-span-2 flex justify-between items-center border rounded-xl p-4"
              >
                <div>
                  <p className="font-medium">
                    {doc.name || "Document"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>

                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium hover:underline"
                >
                  Download
                </a>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </Section>

        {/* ================= INTERNAL NOTES ================= */}
        <Section title="Internal Intelligence">
          <Field label="Dealer Notes" value={client.dealerNotes} full />
          <Field label="Red Flags" value={client.redFlags} />
          <Field label="Reliability Score" value={client.reliabilityScore} />
          <Field label="Referral Potential" value={client.referralPotential} />
        </Section>

      </div>
    </AdminLayout>
  );
}

/* =====================================================
   UI HELPERS
===================================================== */

function Section({ title, children }) {
  return (
    <section className="bg-white dark:bg-black border dark:border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        {title}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {children}
      </div>
    </section>
  );
}

function Field({ label, value, full }) {
  return (
    <div className={`space-y-1 ${full ? "md:col-span-2" : ""}`}>
      <p className="text-xs uppercase text-slate-500">
        {label}
      </p>
      <div className="px-4 py-2 rounded bg-slate-100 dark:bg-panel text-sm">
        {value || "—"}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="md:col-span-2 text-sm text-slate-500">
      No data available
    </div>
  );
}
