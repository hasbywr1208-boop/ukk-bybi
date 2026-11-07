import type { ReactNode } from "react";

import { OrganizerHeaderActions } from "./header-actions";

export function OrganizerPageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        {eyebrow ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-600/10 px-3 py-1 text-xs font-medium text-fuchsia-300">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-slate-400">{description}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {action}
        <OrganizerHeaderActions />
      </div>
    </header>
  );
}
