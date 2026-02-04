"use client";

import { Button } from "@/components/ui/button";
import { IssueList } from "@/components/issues/issue-list";
import { useUIStore } from "@/stores/ui-store";
import { Plus } from "lucide-react";

export default function IssuesPage() {
  const { openCreateIssue } = useUIStore();

  // TODO: Replace with actual team from auth/context in Phase 5
  // Using hardcoded default team UUID until teams & workspaces are implemented
  const teamId = "8566e958-c650-4b88-ba38-79764569afa9";

  return (
    <div className="container py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Issues</h1>
          <p className="mt-1 text-muted-foreground">
            Track and manage your team's work
          </p>
        </div>
        <Button onClick={openCreateIssue}>
          <Plus className="mr-2 h-4 w-4" />
          New Issue
        </Button>
      </div>

      {/* Issues List */}
      <IssueList teamId={teamId} />
    </div>
  );
}
