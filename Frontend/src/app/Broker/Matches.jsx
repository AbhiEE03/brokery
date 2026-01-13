import { useEffect, useState } from "react";
import BrokerLayout from "../../components/layout/BrokerLayout";
import api from "../../services/api";

const interestStyle = {
  high: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  medium: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  low: "bg-white/5 text-white/40 border-white/10",
};

const statusStyle = {
  available: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  rented: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  sold: "bg-red-400/10 text-red-300 border-red-400/20",
  hold: "bg-white/5 text-white/40 border-white/10",
};

export default function BrokerMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/broker/matches")
      .then((res) => {
        // console.log("MATCH API RESPONSE:", res.data);
        setMatches(res.matches || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <BrokerLayout>
      <div className="px-10 pt-6 max-w-7xl mx-auto dark:text-white">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-lg font-medium tracking-tight">
            Matches
          </h1>
          <p className="text-xs text-white/40">
            Client–property interest mapping
          </p>
        </div>

        {/* GLASS TABLE */}
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
              Loading matches…
            </div>
          ) : matches.length === 0 ? (
            <div className="py-20 text-center text-white/40">
              No matches found.
            </div>
          ) : (
            <>
              {/* MOBILE LIST */}
              <div className="md:hidden divide-y divide-slate-200 dark:divide-white/[0.06]">
                {matches.map((m, i) => (
                  <div
                    key={`${m.client._id}-${i}`}
                    className="
        px-5 py-4
        bg-white
        text-slate-900
        hover:bg-slate-50
        dark:bg-white/[0.02]
        dark:text-white
        dark:hover:bg-white/[0.04]
        transition
      "
                  >
                    {/* CLIENT */}
                    <p className="text-sm font-medium">
                      {m.client?.name}
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-white/40">
                      {m.client?.email || "—"}
                    </p>

                    {/* PROPERTY */}
                    <div className="mt-2">
                      <p className="text-sm">
                        {m.property?.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-white/40">
                        {m.property?.city} · ₹{m.property?.priceLakhs}L
                      </p>
                    </div>

                    {/* META */}
                    <div className="flex items-center justify-between mt-3">
                      <span
                        className={`
            px-3 py-1 rounded-full text-[11px] font-medium border
            ${interestStyle[m.interestLevel]}
          `}
                      >
                        {m.interestLevel}
                      </span>

                      <span
                        className={`
            px-3 py-1 rounded-full text-[11px] font-medium border
            ${statusStyle[m.property?.status]}
          `}
                      >
                        {m.property?.status}
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] text-slate-400 dark:text-white/30">
                      Added · {new Date(m.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="hidden md:block  overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      className="
                      text-left text-[11px] uppercase tracking-widest
                      text-white/40
                      border-b border-white/[0.06]
                    "
                    >
                      <th className="px-6 py-4 font-medium">Client</th>
                      <th className="px-4 py-4 font-medium">Property</th>
                      <th className="px-4 py-4 font-medium">Interest</th>
                      <th className="px-4 py-4 font-medium">Added</th>
                      <th className="px-6 py-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {matches.map((m, i) => (
                      <tr
                        key={`${m.client._id}-${i}`}
                        className="
                        border-b border-white/[0.04]
                        hover:bg-white/[0.035]
                        transition
                      "
                      >
                        {/* CLIENT */}
                        <td className="px-6 py-3">
                          <p className="text-sm font-medium">
                            {m.client?.name}
                          </p>
                          <p className="text-[11px] text-white/40">
                            {m.client?.email}
                          </p>
                        </td>

                        {/* PROPERTY */}
                        <td className="px-4 py-3">
                          <p className="text-sm">
                            {m.property?.name}
                          </p>
                          <p className="text-[11px] text-white/40">
                            {m.property?.city} · ₹{m.property?.priceLakhs}L
                          </p>
                        </td>

                        {/* INTEREST */}
                        <td className="px-4 py-3">
                          <span
                            className={`
                            inline-flex items-center
                            px-3 py-1 rounded-full
                            text-[11px] font-medium
                            border
                            ${interestStyle[m.interestLevel]}
                          `}
                          >
                            {m.interestLevel}
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="px-4 py-3 text-[11px] text-white/40">
                          {new Date(m.addedAt).toLocaleDateString()}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-3 text-right">
                          <span
                            className={`
                            inline-flex items-center
                            px-3 py-1 rounded-full
                            text-[11px] font-medium
                            border
                            ${statusStyle[m.property?.status]}
                          `}
                          >
                            {m.property?.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


            </>


          )}
        </div>

        <p className="text-[11px] text-right dark:text-white/30 mt-10">
          Powered By  <span className="dark:text-white/70">BackendBots</span>
        </p>
      </div>
    </BrokerLayout>
  );
}
