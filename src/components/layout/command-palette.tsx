"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useUIStore } from "@/stores/ui-store";
import { useIssues } from "@/hooks/use-issues";
import { useTheme } from "next-themes";
import {
  FileText,
  Plus,
  Moon,
  Sun,
  Monitor,
  Inbox,
  LayoutGrid,
  Settings,
  Search,
} from "lucide-react";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import { IssuePriorityIcon } from "@/components/issues/issue-priority-icon";

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, closeCommandPalette, openCreateIssue } = useUIStore();
  const { setTheme } = useTheme();
  const [search, setSearch] = useState("");

  // TODO: Get actual team ID from context
  const teamId = "00000000-0000-0000-0000-000000000001";
  const { data: issuesData } = useIssues(teamId);

  // Filter issues based on search
  const filteredIssues = issuesData?.data?.filter((issue) => {
    const searchLower = search.toLowerCase();
    return (
      issue.title.toLowerCase().includes(searchLower) ||
      issue.identifier.toLowerCase().includes(searchLower) ||
      issue.description?.toLowerCase().includes(searchLower)
    );
  }).slice(0, 10); // Limit to top 10 results

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setSearch("");
    }
  }, [isCommandPaletteOpen]);

  return (
    <Command.Dialog
      open={isCommandPaletteOpen}
      onOpenChange={closeCommandPalette}
      label="Command Menu"
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Command Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
        <Command
          className="rounded-lg border bg-popover shadow-2xl"
          shouldFilter={false} // We handle filtering manually
        >
          {/* Search Input */}
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search issues, actions, or navigate..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Results List */}
          <Command.List className="max-h-100 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {/* Issues Group */}
            {filteredIssues && filteredIssues.length > 0 && (
              <Command.Group heading="Issues" className="mb-2">
                {filteredIssues.map((issue) => (
                  <Command.Item
                    key={issue.id}
                    value={`issue-${issue.id}`}
                    onSelect={() => {
                      router.push(`/dashboard/issues/${issue.id}`);
                      closeCommandPalette();
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
                  >
                    <IssuePriorityIcon
                      priority={issue.priority}
                      showTooltip={false}
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {issue.identifier}
                        </span>
                        <span className="truncate">{issue.title}</span>
                      </div>
                    </div>
                    <IssueStatusBadge status={issue.status} />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Actions Group */}
            <Command.Group heading="Actions" className="mb-2">
              <Command.Item
                value="create-issue"
                onSelect={() => {
                  openCreateIssue();
                  closeCommandPalette();
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
              >
                <Plus className="h-4 w-4" />
                <span>Create Issue</span>
                <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  <span className="text-xs">C</span>
                </kbd>
              </Command.Item>
            </Command.Group>

            {/* Theme Group */}
            <Command.Group heading="Theme" className="mb-2">
              <Command.Item
                value="theme-light"
                onSelect={() => {
                  setTheme("light");
                  closeCommandPalette();
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
              >
                <Sun className="h-4 w-4" />
                <span>Light Mode</span>
              </Command.Item>
              <Command.Item
                value="theme-dark"
                onSelect={() => {
                  setTheme("dark");
                  closeCommandPalette();
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
              >
                <Moon className="h-4 w-4" />
                <span>Dark Mode</span>
              </Command.Item>
              <Command.Item
                value="theme-system"
                onSelect={() => {
                  setTheme("system");
                  closeCommandPalette();
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
              >
                <Monitor className="h-4 w-4" />
                <span>System</span>
              </Command.Item>
            </Command.Group>

            {/* Navigation Group */}
            <Command.Group heading="Navigate">
              <Command.Item
                value="nav-inbox"
                onSelect={() => {
                  router.push("/dashboard/inbox");
                  closeCommandPalette();
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
              >
                <Inbox className="h-4 w-4" />
                <span>Inbox</span>
              </Command.Item>
              <Command.Item
                value="nav-issues"
                onSelect={() => {
                  router.push("/dashboard/issues");
                  closeCommandPalette();
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
              >
                <LayoutGrid className="h-4 w-4" />
                <span>Issues</span>
              </Command.Item>
              <Command.Item
                value="nav-settings"
                onSelect={() => {
                  router.push("/dashboard/settings");
                  closeCommandPalette();
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer with keyboard hints */}
          <div className="border-t px-3 py-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Navigate with arrow keys</span>
              <div className="flex gap-2">
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  ↵
                </kbd>
                <span>to select</span>
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  ESC
                </kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        </Command>
      </div>
    </Command.Dialog>
  );
}
