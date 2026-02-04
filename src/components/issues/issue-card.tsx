import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IssueStatusBadge } from "./issue-status-badge";
import { IssuePriorityIcon } from "./issue-priority-icon";
import { cn } from "@/lib/utils";
import type { Tables } from "@/types/database";

type Issue = Tables<"issues">;
type Profile = Tables<"profiles">;

interface IssueCardProps {
  issue: Issue & {
    creator?: Profile | null;
    assignees?: Profile[];
  };
  teamSlug?: string;
  className?: string;
}

export function IssueCard({ issue, teamSlug, className }: IssueCardProps) {
  const href = teamSlug 
    ? `/${teamSlug}/${issue.identifier}`
    : `/dashboard/issues/${issue.id}`;

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:bg-accent hover:shadow-sm",
        className
      )}
    >
      {/* Priority Icon */}
      <div className="shrink-0">
        <IssuePriorityIcon priority={issue.priority} />
      </div>

      {/* Issue Identifier */}
      <div className="shrink-0">
        <span className="text-xs font-mono text-muted-foreground">
          {issue.identifier}
        </span>
      </div>

      {/* Issue Title */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate group-hover:text-primary">
          {issue.title}
        </h3>
      </div>

      {/* Status Badge */}
      <div className="shrink-0">
        <IssueStatusBadge status={issue.status} />
      </div>

      {/* Assignees */}
      {issue.assignees && issue.assignees.length > 0 && (
        <div className="shrink-0 flex -space-x-2">
          {issue.assignees.slice(0, 3).map((assignee) => (
            <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
              <AvatarImage src={assignee.avatar_url || undefined} alt={assignee.full_name || ""} />
              <AvatarFallback className="text-[10px]">
                {assignee.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || assignee.email?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          ))}
          {issue.assignees.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-[10px] font-medium">
                +{issue.assignees.length - 3}
              </span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
