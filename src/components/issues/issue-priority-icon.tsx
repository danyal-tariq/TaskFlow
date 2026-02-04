import { AlertCircle, Signal, Minus, SignalHigh, SignalMedium } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type IssuePriority = "no_priority" | "low" | "medium" | "high" | "urgent";

interface IssuePriorityIconProps {
  priority: IssuePriority | string | null;
  className?: string;
  showTooltip?: boolean;
}

const priorityConfig: Record<
  IssuePriority,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  no_priority: {
    label: "No Priority",
    icon: Minus,
    className: "text-gray-400",
  },
  low: {
    label: "Low",
    icon: Signal,
    className: "text-gray-500",
  },
  medium: {
    label: "Medium",
    icon: SignalMedium,
    className: "text-yellow-500",
  },
  high: {
    label: "High",
    icon: SignalHigh,
    className: "text-orange-500",
  },
  urgent: {
    label: "Urgent",
    icon: AlertCircle,
    className: "text-red-500",
  },
};

export function IssuePriorityIcon({
  priority,
  className,
  showTooltip = true,
}: IssuePriorityIconProps) {
  const normalizedPriority = (priority?.toLowerCase() || "no_priority") as IssuePriority;
  const config = priorityConfig[normalizedPriority] || priorityConfig.no_priority;
  const Icon = config.icon;

  const icon = (
    <Icon
      className={cn("h-4 w-4", config.className, className)}
      aria-label={config.label}
    />
  );

  if (!showTooltip) {
    return icon;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{icon}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
