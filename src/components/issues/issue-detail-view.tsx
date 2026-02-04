"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useIssue } from "@/hooks/use-issues";
import { useUpdateIssue } from "@/hooks/use-update-issue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { IssueStatusBadge } from "./issue-status-badge";
import { IssuePriorityIcon } from "./issue-priority-icon";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Pencil, Check, X, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface IssueDetailViewProps {
  issueId: string;
}

export function IssueDetailView({ issueId }: IssueDetailViewProps) {
  const router = useRouter();
  const { data, isLoading, error } = useIssue(issueId);
  const updateMutation = useUpdateIssue();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-6 w-48" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="container py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="mt-8 text-center">
          <p className="text-destructive">Failed to load issue</p>
        </div>
      </div>
    );
  }

  const issue = data.data;

  const handleUpdateField = async (field: string, value: any) => {
    updateMutation.mutate({
      id: issueId,
      data: { [field]: value },
      teamId: issue.team_id || undefined,
    });
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== issue.title) {
      handleUpdateField("title", editedTitle);
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (editedDescription !== issue.description) {
      handleUpdateField("description", editedDescription);
    }
    setIsEditingDescription(false);
  };

  const startEditTitle = () => {
    setEditedTitle(issue.title);
    setIsEditingTitle(true);
  };

  const startEditDescription = () => {
    setEditedDescription(issue.description || "");
    setIsEditingDescription(true);
  };

  return (
    <div className="container py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Issues
        </Button>
      </div>

      {/* Issue Identifier */}
      <div className="mb-2">
        <span className="text-sm font-mono text-muted-foreground">
          {issue.identifier}
        </span>
      </div>

      {/* Title */}
      <div className="mb-6">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") setIsEditingTitle(false);
              }}
              className="text-3xl font-bold h-auto py-2"
              autoFocus
            />
            <Button size="icon" variant="ghost" onClick={handleSaveTitle}>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditingTitle(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className="group flex items-start gap-2 cursor-pointer"
            onClick={startEditTitle}
          >
            <h1 className="text-3xl font-bold flex-1">{issue.title}</h1>
            <Button
              size="icon"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Metadata Row */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select
            value={issue.status || "backlog"}
            onValueChange={(value) => handleUpdateField("status", value)}
          >
            <SelectTrigger className="w-fit">
              <SelectValue>
                <IssueStatusBadge status={issue.status} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Priority:</span>
          <Select
            value={issue.priority || "no_priority"}
            onValueChange={(value) => handleUpdateField("priority", value)}
          >
            <SelectTrigger className="w-35">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <IssuePriorityIcon priority={issue.priority} showTooltip={false} />
                  <span className="capitalize">
                    {issue.priority?.replace("_", " ") || "No Priority"}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no_priority">No Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Creator */}
        {issue.creator && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">Created by:</span>
            <Avatar className="h-6 w-6">
              <AvatarImage src={issue.creator.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {issue.creator.full_name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{issue.creator.full_name || issue.creator.email}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Description</h2>
        {isEditingDescription ? (
          <div className="space-y-2">
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsEditingDescription(false);
              }}
              className="min-h-50"
              autoFocus
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveDescription}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditingDescription(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "group relative rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors",
              !issue.description && "text-muted-foreground italic"
            )}
            onClick={startEditDescription}
          >
            <p className="whitespace-pre-wrap">
              {issue.description || "No description provided. Click to add one."}
            </p>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Comments Section (Placeholder) */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Comments</h2>
        <p className="text-sm text-muted-foreground italic">
          Comments feature coming soon...
        </p>
      </div>
    </div>
  );
}
