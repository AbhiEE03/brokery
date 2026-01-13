export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-3xl text-zinc-300 font-semibold tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 dark:text-muted">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
