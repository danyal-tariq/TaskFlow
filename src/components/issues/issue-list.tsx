"use client";

import { useIssues } from "@/hooks/use-issues";
import { IssueCard } from "./issue-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

interface IssueListProps {
  teamId: string;
  teamSlug?: string;
}

export function IssueList({ teamId, teamSlug }: IssueListProps) {
  const { data, isLoading, error, refetch } = useIssues(teamId);
  const { openCreateIssue } = useUIStore();

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load issues</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "An error occurred"}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Empty State
  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No issues yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create your first issue to get started
        </p>
        <Button onClick={openCreateIssue}>
          <Plus className="mr-2 h-4 w-4" />
          Create Issue
        </Button>
      </div>
    );
  }

  // Success State - Render Issues
  return (
    <div className="space-y-2">
      {data.data.map((issue) => (
        <IssueCard key={issue.id} issue={issue} teamSlug={teamSlug} />
      ))}
    </div>
  );
}
