export default function StatCard({ label, value, sub }) {
  return (
    <div
      className="
        rounded-xl p-5
        bg-black/[0.04] dark:bg-white/[0.05]
        backdrop-blur-sm
        border border-black/[0.06] dark:border-white/[0.08]
        transition
      "
    >
      {/* LABEL */}
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {label}
      </p>

      {/* VALUE */}
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>

      {/* SUBTEXT */}
      {sub && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {sub}
        </p>
      )}
    </div>
  );
}
