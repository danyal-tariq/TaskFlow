"use client";

import { UserDropdown } from "./user-dropdown";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        {/* Future: Breadcrumbs, Search */}
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <UserDropdown />
      </div>
    </header>
  );
}
