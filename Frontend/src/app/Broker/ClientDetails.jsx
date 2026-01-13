import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BrokerLayout from "../../components/layout/BrokerLayout";
import api from "../../services/api";

const STAGES = [
  "lead",
  "contacted",
  "site_visit",
  "negotiation",
  "deal_closed",
  "deal_lost",
];

const INTEREST_LEVELS = ["low", "medium", "high"];

export default function ClientDetails() {
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [stage, setStage] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  const [propertyQuery, setPropertyQuery] = useState("");
  const [propertyResults, setPropertyResults] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [interestLevel, setInterestLevel] = useState("medium");

  const fetchClient = async () => {
    const res = await api.get(`/broker/clients/${id}`);
    const data = res?.client;
    setClient(data);
    setStage(data?.pipelineStage || "lead");
    setLoading(false);
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  const updateStage = async (e) => {
    e.preventDefault();
    await api.post(`/broker/clients/${id}/stage`, { stage, note });
    setNote("");
    fetchClient();
  };

  useEffect(() => {
    if (!propertyQuery) {
      setPropertyResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      const res = await api.get("/broker/properties", {
        params: { q: propertyQuery },
      });
      setPropertyResults(res?.properties || []);
    }, 300);

    return () => clearTimeout(delay);
  }, [propertyQuery]);

  const addInterest = async () => {
    if (!selectedProperty) return;

    await api.post(`/broker/clients/${id}/interest`, {
      propertyId: selectedProperty._id,
      level: interestLevel,
    });

    fetchClient();
    setSelectedProperty(null);
    setPropertyQuery("");
  };

  if (loading) {
    return (
      <BrokerLayout>
        <PageWrapper>
          <div className="py-20 text-center text-slate-400 dark:text-white/40">
            Loading client…
          </div>
        </PageWrapper>
      </BrokerLayout>
    );
  }

  if (!client) {
    return (
      <BrokerLayout>
        <PageWrapper>
          <div className="py-20 text-center text-red-500">
            Client not found
          </div>
        </PageWrapper>
      </BrokerLayout>
    );
  }


  const uploadDocument = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);

      // 🔐 API call
      await api.post(
        `/broker/clients/${id}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ Refresh client to show uploaded doc
      await fetchClient();

      // 🧹 Reset form
      e.target.reset();
    } catch (err) {
      console.error("Upload document failed:", err);
      alert("Failed to upload document");
    }
  };


  return (
    <BrokerLayout>
      <PageWrapper>
        <div className="max-w-6xl mx-auto space-y-10">

          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-medium text-slate-900 dark:text-white">
              {client.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-white/40">
              Client profile & deal management
            </p>
          </div>

          {/* INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Info label="Phone" value={client.phone || "—"} />
            <Info label="Inquiry Type" value={client.inquiryType || "—"} />
            <Info
              label="Budget"
              value={`₹ ${client.budget?.min || 0} – ₹ ${client.budget?.max || "∞"}`}
            />
            <Info label="Priority" value={client.priority || "—"} />
          </div>

          {/* PIPELINE */}
          <Card>
            <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-6">
              Pipeline Stage
            </h2>

            <div className="flex gap-3 mb-6">
              {STAGES.map((s) => {
                const active = STAGES.indexOf(s) <= STAGES.indexOf(stage);
                return (
                  <div key={s} className="flex-1">
                    <div
                      className={`h-1 rounded-full ${active
                        ? "bg-slate-900 dark:bg-white"
                        : "bg-slate-200 dark:bg-white/[0.06]"
                        }`}
                    />
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-white/40 capitalize text-center">
                      {s.replace("_", " ")}
                    </p>
                  </div>
                );
              })}
            </div>

            <form onSubmit={updateStage} className="flex gap-3">
              <select className="input" value={stage} onChange={(e) => setStage(e.target.value)}>
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>

              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Internal note"
                className="input flex-1"
              />

              <button className="px-4 border border-slate-300 dark:border-white/[0.06] rounded-lg">
                Update
              </button>
            </form>
          </Card>

          <Card>
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-medium text-slate-900 dark:text-white">
                  Client Documents
                </h2>
                <p className="text-xs text-slate-500 dark:text-white/40">
                  Upload and manage client documents securely
                </p>
              </div>
            </div>

            {/* UPLOAD FORM */}
            <form
              onSubmit={uploadDocument}
              className="
      grid grid-cols-1 sm:grid-cols-4 gap-3
      bg-slate-50/60 dark:bg-white/[0.03]
      border border-slate-200/40 dark:border-white/[0.06]
      rounded-2xl p-4
    "
            >
              {/* DOCUMENT TYPE */}
              <select
                name="type"
                required
                className="
        input
        bg-transparent
      "
              >
                <option value="">Document type</option>
                <option value="id">ID Proof</option>
                <option value="address">Address Proof</option>
                <option value="agreement">Agreement</option>
                <option value="payment">Payment Receipt</option>
                <option value="other">Other</option>
              </select>

              {/* FILE INPUT */}
              <input
                type="file"
                name="document"
                required
                className="input bg-transparent"
              />

              {/* OPTIONAL NAME */}
              <input
                type="text"
                name="name"
                placeholder="Document name (optional)"
                className="input bg-transparent"
              />

              {/* SUBMIT */}
              <button
                type="submit"
                className="
        rounded-xl px-4 py-2 text-sm font-medium
        bg-slate-900 text-white
        dark:bg-white dark:text-black
        hover:opacity-90 transition
      "
              >
                Upload
              </button>
            </form>

            {/* DOCUMENT LIST */}
            <div className="mt-6 space-y-3">
              {client.documents?.length > 0 ? (
                client.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="
            flex items-center justify-between gap-4
            bg-slate-50/60 dark:bg-white/[0.03]
            border border-slate-200/40 dark:border-white/[0.06]
            rounded-xl p-4
          "
                  >
                    {/* INFO */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {doc.name || "Document"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-white/40 capitalize">
                        {doc.type} •{" "}
                        {doc.uploadedAt
                          ? new Date(doc.uploadedAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>

                    {/* ACTION */}
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="
              text-xs font-medium
              text-slate-900 dark:text-white
              hover:underline
            "
                    >
                      Download
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 dark:text-white/40">
                  No documents uploaded yet.
                </p>
              )}
            </div>
          </Card>



          {/* PROPERTY INTEREST */}
          <Card>
            <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
              Property Interest
            </h2>

            <div className="relative space-y-4">
              <input
                value={propertyQuery}
                onChange={(e) => setPropertyQuery(e.target.value)}
                placeholder="Search property"
                className="input"
              />

              {propertyResults.length > 0 && (
                <div className="
                  absolute z-50 mt-3 w-full
                  rounded-2xl
                  bg-white dark:bg-black/95
                  backdrop-blur-xl
                  border border-slate-200/40 dark:border-white/[0.06]
                  p-3
                ">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {propertyResults.map((p) => (
                      <PropertyResultCard
                        key={p._id}
                        property={p}
                        onSelect={() => {
                          setSelectedProperty(p);
                          setPropertyResults([]);
                          setPropertyQuery("");
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedProperty && (
                <div className="flex gap-3 items-center">
                  <div className="flex-1 bg-white/[0.04] dark:bg-white/[0.03] border border-slate-200/40 dark:border-white/[0.06] rounded-xl p-4">
                    <p className="text-sm text-slate-900 dark:text-white">
                      {selectedProperty.propertyName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-white/40">
                      {selectedProperty.location?.city}
                    </p>
                  </div>

                  <select className="input" value={interestLevel} onChange={(e) => setInterestLevel(e.target.value)}>
                    {INTEREST_LEVELS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>

                  <button onClick={addInterest} className="px-4 py-1 border border-slate-300 dark:border-white/[0.06] rounded-lg">
                    Add
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* SAVED INTERESTS */}
          <Card>
            <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
              Interested Properties
            </h2>

            {client.interestedIn?.length ? (
              <div className="space-y-3">
                {client.interestedIn.map((i, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-xl border border-slate-200/40 dark:border-white/[0.06] bg-white/[0.04] dark:bg-white/[0.03]">
                    <div>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {i.property?.propertyName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-white/40">
                        {i.property?.location?.city}
                      </p>
                    </div>

                    <span className="text-xs px-3 py-1 rounded-full bg-slate-200 dark:bg-white/[0.08] text-slate-700 dark:text-white/70">
                      {i.interestLevel}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-white/40">
                No interests yet
              </p>
            )}
          </Card>

        </div>
      </PageWrapper>
    </BrokerLayout>
  );
}

/* ---------- UI PRIMITIVES ---------- */

function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black px-3 py-6">
      {children}
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200/40 dark:border-white/[0.06] rounded-2xl p-6">
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200/40 dark:border-white/[0.06] rounded-xl p-4">
      <p className="text-[11px] text-slate-500 dark:text-white/40 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function PropertyResultCard({ property, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="text-left rounded-xl p-4 border border-slate-200/40 dark:border-white/[0.06] bg-white/[0.04] dark:bg-white/[0.03] hover:bg-white/[0.08] dark:hover:bg-white/[0.06]"
    >
      <p className="text-sm text-slate-900 dark:text-white truncate">
        {property.propertyName}
      </p>
      <p className="text-xs text-slate-500 dark:text-white/40">
        {property.location?.city}
      </p>
    </button>
  );
}
