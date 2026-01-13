import { useEffect, useState } from "react";
import { href, useParams } from "react-router-dom";
import BrokerLayout from "../../components/layout/BrokerLayout";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";


/* =====================================================
   FIELD PERMISSIONS (SYNC WITH BACKEND)
===================================================== */
const LOCKED_FIELDS = [
  "budget",
  "fundingMode",
  "loanStatus",
  "deal",
  "currentBroker",
  "status",
  "priority",
  "owningCompany"
];

export default function ClientProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/broker/clients/${id}/profile`)
      .then(res =>
        // console.log("res", res))
        setClient(res.client))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!client) return <div className="p-10">Client not found</div>;

  return (
    <BrokerLayout>
      <div className="flex gap-6 max-w-[1600px] mx-auto px-4">

        {/* ================= SIDE NAV ================= */}
        <aside className="hidden lg:block w-64 sticky top-20 h-fit">
          <div className="bg-white dark:bg-black border dark:border-border rounded-xl p-4 space-y-2 text-sm">
            {[
              "Identity",
              "Contact",
              "Address",
              "Lead",
              "Requirements",
              "Budget",
              "Activity",
              "Negotiation",
              "Follow-ups",
              "Documents",
              "Internal"
            ].map(s => (
              <a
                key={s}
                href={`#${s}`}
                className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-panel"
              >
                {s}
              </a>
            ))}
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex-1 space-y-10 tracking-tight dark:text-slate-100">

          {/* HEADER */}
          <header className="flex justify-between items-center gap-3">
            {/* EDIT CLIENT */}
            <button
              onClick={() => navigate(`/broker/clients/${id}/profile/edit`)}
              className="
      px-6 py-2 rounded-lg
      bg-black dark:bg-white
      text-white dark:text-black
      font-medium
      hover:opacity-90
      transition
    "
            >
              Edit Client
            </button>

            {/* REQUEST EDIT */}
            <button
              onClick={() => navigate(`/broker/clients/${id}/profile/requestEdit`)}
              className="
      px-6 py-2 rounded-lg
      border border-slate-300 dark:border-border
      bg-white dark:bg-black
      text-slate-900 dark:text-white
      font-medium
      hover:bg-slate-100 dark:hover:bg-panel
      transition
    "
            >
              Request Edit
            </button>
          </header>


          <div className="bg-white dark:bg-black border dark:border-border rounded-xl p-6">
            <h1 className="text-2xl dark:text-slate-200">
              {client.name || "Unnamed Client"}
            </h1>
            <p className="text-sm text-slate-500">
              Client Code: {client.clientCode}
            </p>
          </div>

          {/* ================= IDENTITY ================= */}
          <Section id="Identity" title="Client Identity">
            <Field label="Client Type" value={client.clientType} />
            <Field label="Entity Type" value={client.entityType} />
            <Field
              label="Company Name"
              value={client.companyName}
              placeholder="—"
              hidden={client.entityType !== "company"}
            />
            <Field label="Current Broker" value={client.currentBroker?.name} />
            <Field label="Owning Company" value={client.owningCompany} locked />
          </Section>

          {/* ================= CONTACT ================= */}
          <Section id="Contact" title="Contact Details">
            <Field label="Primary Phone" value={client.phone} />
            <Field label="Alternate Phone" value={client.alternatePhone} />
            <Field label="WhatsApp Available" value={client.whatsappAvailable ? "Yes" : "No"} />
            <Field label="Email" value={client.email} />
            <Field label="Preferred Contact Mode" value={client.preferredContactMode} />
            <Field label="Best Time to Contact" value={client.bestTimeToContact} />
          </Section>

          {/* ================= ADDRESS ================= */}
          <Section id="Address" title="Address Details">
            <Field label="City" value={client.addressDetails?.city} />
            <Field label="Sector" value={client.addressDetails?.sector} />
            <Field label="Block" value={client.addressDetails?.block} />
            <Field label="Pocket" value={client.addressDetails?.pocket} />
            <Field label="Native City" value={client.addressDetails?.nativeCity} />
            <Field
              label="Full Address"
              value={client.addressDetails?.fullAddress}
              full
            />
          </Section>

          {/* ================= LEAD ================= */}
          <Section id="Lead" title="Lead Source & Quality">
            <Field label="Source" value={client.source} />
            <Field label="Referred By" value={client.referredBy} />
            <Field label="Source Quality" value={client.sourceQuality} />
            <Field label="First Contact Channel" value={client.firstContactChannel} />
          </Section>

          {/* ================= REQUIREMENTS ================= */}
          <Section id="Requirements" title="Requirement Profiling">
            <Field label="Inquiry Type" value={client.inquiryType} />
            <Field label="Property Category" value={client.requirementProfile?.propertyCategory?.join(", ")} />
            <Field label="Preferred City" value={client.requirementProfile?.preferredCity} />
            <Field label="Preferred Sectors" value={client.requirementProfile?.preferredSectors?.join(", ")} />
            <Field label="BHK Preference" value={client.requirementProfile?.bhkPreference} />
            <Field label="Area Range" value={`${client.requirementProfile?.areaRange?.min || "—"} - ${client.requirementProfile?.areaRange?.max || "—"} sq ft`} />
            <Field label="Facing Preference" value={client.requirementProfile?.facingPreference} />
            <Field label="Floor Preference" value={client.requirementProfile?.floorPreference} />
            <Field label="Furnishing" value={client.requirementProfile?.furnishingPreference} />
            <Field label="Urgency" value={client.requirementProfile?.urgencyLevel} />
          </Section>

          {/* ================= BUDGET ================= */}
          <Section id="Budget" title="Budget & Finance">
            <Field label="Budget Range" value={`${client.budget?.min || "—"} - ${client.budget?.max || "—"}`} locked />
            <Field label="Budget Verified" value={client.budget?.verified ? "Yes" : "No"} locked />
            <Field label="Funding Mode" value={client.fundingMode} locked />
            <Field label="Loan Status" value={client.loanStatus} locked />
            <Field label="Price Sensitivity" value={client.priceSensitivity} />
          </Section>

          {/* ================= ACTIVITY ================= */}
          <Section id="Activity" title="Activity Tracking">
            <Field label="Total Site Visits" value={client.
              totalSiteVisits
            } />
            <Field label="Last Site Visit" value={client.lastSiteVisitDate} />
            <Field label="Client Feedback" value={client.clientFeedback} full />
            <Field label="Rejection Reason" value={client.rejectionReason} />
          </Section>

          {/* ================= NEGOTIATION ================= */}
          <Section id="Negotiation" title="Negotiation Signals">
            <Field label="Stage" value={client.negotiation?.currentStage} />
            <Field label="Offer Made" value={client.negotiation?.offerMade ? "Yes" : "No"} />
            <Field label="Offer Amount" value={client.negotiation?.offerAmount} locked />
            <Field label="Decision Probability" value={client.negotiation?.decisionProbability} />
          </Section>

          {/* ================= FOLLOW UPS ================= */}
          <Section id="Follow-ups" title="Follow-up Control">
            <Field label="Client Status" value={client.clientStatus} locked />
            <Field label="Follow-up Priority" value={client.followUpPriority} />
            <Field label="Next Follow-up" value={client.nextFollowUpAt} />
          </Section>

          {/* ================= INTERNAL ================= */}
          <Section id="Internal" title="Internal Intelligence">
            <Field label="Dealer Notes" value={client.dealerNotes} full />
            <Field label="Red Flags" value={client.redFlags} />
            <Field label="Reliability Score" value={client.reliabilityScore} />
            <Field label="Repeat Client" value={client.repeatClient ? "Yes" : "No"} />
            <Field label="Referral Potential" value={client.referralPotential} />
          </Section>

        </div>
      </div>
    </BrokerLayout>
  );
}

/* =====================================================
   REUSABLE UI BLOCKS
===================================================== */

function Section({ title, children, id }) {
  return (
    <section id={id} className="bg-white dark:bg-black border dark:border-border rounded-xl p-6">
      <h2 className="text-lg  mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {children}
      </div>
    </section>
  );
}

function Field({ label, value, locked, full, hidden }) {
  if (hidden) return null;

  return (
    <div className={`space-y-1 ${full ? "md:col-span-2" : ""}`}>
      <label className="text-xs text-slate-500 flex gap-2">
        {label}
        {locked && <span className="text-red-500">🔒</span>}
      </label>
      <div className="px-4 py-2 rounded bg-slate-100 dark:bg-panel text-sm">
        {value || "—"}
      </div>
    </div>
  );
}
