import { useEffect, useState } from "react";
import BrokerLayout from "../../components/layout/BrokerLayout";
import api from "../../services/api";

export default function ClientDocuments() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/broker/documents")
      .then((res) => {
        const data =
          res.data?.documentsByClient ||
          res.documentsByClient ||
          [];
        setGroups(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <BrokerLayout>
      <div className="px-10 pt-6 max-w-7xl mx-auto text-white">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-lg font-medium tracking-tight">
            Client Documents
          </h1>
          <p className="text-xs text-white/40">
            All uploaded documents grouped by client
          </p>
        </div>

        {/* GLASS CONTAINER */}
        <div
          className="
            rounded-2xl
            bg-white/[0.025]
            backdrop-blur-xl
            border border-white/[0.06]
            overflow-hidden
          "
        >
          {loading ? (
            <div className="py-20 text-center text-white/40">
              Loading documents…
            </div>
          ) : groups.length === 0 ? (
            <div className="py-20 text-center text-white/40">
              No client documents uploaded yet.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {groups.map((group) => (
                <section
                  key={group.client._id}
                  className="px-6 py-5"
                >
                  {/* CLIENT HEADER */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium">
                        {group.client.name}
                      </p>
                      <p className="text-[11px] text-white/40">
                        {group.documents.length} document(s)
                      </p>
                    </div>
                  </div>

                  {/* MOBILE */}
                  <div className="space-y-3 md:hidden">
                    {group.documents.map((doc) => (
                      <div
                        key={doc._id}
                        className="
                          rounded-xl
                          bg-white/[0.03]
                          border border-white/[0.06]
                          p-4
                        "
                      >
                        <p className="text-sm font-medium">
                          {doc.originalName || "Document"}
                        </p>

                        <div className="mt-1 text-[11px] text-white/40 space-y-1">
                          <p className="capitalize">
                            {doc.type?.replace("_", " ")}
                          </p>
                          <p>
                            {doc.uploadedAt
                              ? new Date(doc.uploadedAt).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>

                        <div className="mt-3 text-right">
                          <a
                            href={`/clients/${group.client._id}/documents/${doc._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-white/70 hover:text-white"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP TABLE */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr
                          className="
                            text-left text-[11px] uppercase tracking-widest
                            text-white/40
                            border-b border-white/[0.06]
                          "
                        >
                          <th className="py-3">Document</th>
                          <th className="py-3">Type</th>
                          <th className="py-3">Uploaded</th>
                          <th className="py-3 text-right">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {group.documents.map((doc) => (
                          <tr
                            key={doc._id}
                            className="
                              border-b border-white/[0.04]
                              hover:bg-white/[0.035]
                              transition
                            "
                          >
                            <td className="py-3 font-medium">
                              {doc.originalName || "Document"}
                            </td>

                            <td className="py-3 capitalize text-white/40">
                              {doc.type?.replace("_", " ")}
                            </td>

                            <td className="py-3 text-[11px] text-white/40">
                              {doc.uploadedAt
                                ? new Date(doc.uploadedAt).toLocaleDateString()
                                : "-"}
                            </td>

                            <td className="py-3 text-right">
                              <a
                                href={`/clients/${group.client._id}/documents/${doc._id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-white/70 hover:text-white"
                              >
                                Download
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <p className="text-[11px] text-right text-white/30 mt-10">
          Crafted with care ·{" "}
          <span className="text-white/70">BackendBots</span>
        </p>
      </div>
    </BrokerLayout>
  );
}
