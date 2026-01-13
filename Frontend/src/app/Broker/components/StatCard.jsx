export default function StatCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-card border dark:border-border rounded-xl p-5">
      <p className="text-sm text-slate-500 dark:text-muted">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
