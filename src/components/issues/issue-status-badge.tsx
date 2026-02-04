import { Badge } from "@/components/ui/badge";
import { Circle, CheckCircle2, Timer, XCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

type IssueStatus = "backlog" | "todo" | "in_progress" | "done" | "canceled";

interface IssueStatusBadgeProps {
  status: IssueStatus | string | null;
  className?: string;
}

const statusConfig: Record<
  IssueStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  backlog: {
    label: "Backlog",
    icon: Circle,
    className: "bg-gray-500/10 text-gray-600 border-gray-500/20 hover:bg-gray-500/20",
  },
  todo: {
    label: "Todo",
    icon: Circle,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader,
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20",
  },
  canceled: {
    label: "Canceled",
    icon: XCircle,
    className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20",
  },
};

export function IssueStatusBadge({ status, className }: IssueStatusBadgeProps) {
  const normalizedStatus = (status?.toLowerCase() || "backlog") as IssueStatus;
  const config = statusConfig[normalizedStatus] || statusConfig.backlog;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
}
