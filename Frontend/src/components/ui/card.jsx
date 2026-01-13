import React from "react";
import clsx from "clsx";

export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-card border border-slate-200 dark:border-border",
        "rounded-2xl shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }) {
  return (
    <div
      className={clsx(
        "px-5 pt-4 pb-2 flex flex-col gap-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }) {
  return (
    <h3
      className={clsx(
        "text-sm font-semibold text-slate-900 dark:text-white tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div
      className={clsx(
        "px-5 pb-5 pt-1 text-slate-700 dark:text-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
