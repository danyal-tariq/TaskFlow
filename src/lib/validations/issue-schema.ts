import { z } from "zod";

// Zod schemas matching database constraints
export const createIssueSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional().default(""),
  team_id: z.string().uuid("Team ID must be a valid UUID"),
  priority: z.enum(["no_priority", "low", "medium", "high", "urgent"]).default("no_priority"),
  status: z.enum(["backlog", "todo", "in_progress", "done", "canceled"]).default("backlog")
});

export const updateIssueSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").optional(),
  description: z.string().optional(),
  status: z.enum(["backlog", "todo", "in_progress", "done", "canceled"]).optional(),
  priority: z.enum(["no_priority", "low", "medium", "high", "urgent"]).optional(),
  sort_order: z.number().optional(),
});

// TypeScript types derived from schemas
export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;