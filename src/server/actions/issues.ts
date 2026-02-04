"use server";

import { createClient } from "@/lib/supabase/server";
import { createIssueSchema, updateIssueSchema, type CreateIssueInput, type UpdateIssueInput } from "@/lib/validations/issue-schema";
import { revalidatePath } from "next/cache";
import type { Tables, TablesInsert } from "@/types/database";

type Issue = Tables<"issues">;
type IssueWithRelations = Issue & {
  creator: Tables<"profiles"> | null;
  assignees: Tables<"profiles">[];
};

/**
 * Generate the next issue identifier for a team (e.g., TEAM-1, TEAM-2)
 */
async function generateIssueIdentifier(teamId: string, teamSlug?: string): Promise<string> {
  const supabase = await createClient();

  // Get the team slug if not provided
  let slug = teamSlug;
  if (!slug) {
    const { data: team } = await supabase
      .from("teams")
      .select("slug")
      .eq("id", teamId)
      .single();
    
    if (!team) throw new Error("Team not found");
    slug = team.slug.toUpperCase();
  }

  // Get the highest identifier number for this team
  const { data: issues } = await supabase
    .from("issues")
    .select("identifier")
    .eq("team_id", teamId)
    .order("identifier", { ascending: false })
    .limit(1);

  // Extract number from identifier (e.g., "TEAM-42" -> 42)
  let nextNumber = 1;
  if (issues && issues.length > 0) {
    const match = issues[0].identifier.match(/-(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `${slug}-${nextNumber}`;
}

/**
 * Create a new issue
 */
export async function createIssue(input: CreateIssueInput) {
  try {
    const supabase = await createClient();

    // Validate input
    const validated = createIssueSchema.parse(input);

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Generate identifier
    const identifier = await generateIssueIdentifier(validated.team_id);

    // Create issue
    const { data: issue, error } = await supabase
      .from("issues")
      .insert({
        identifier,
        title: validated.title,
        description: validated.description || null,
        status: validated.status,
        priority: validated.priority,
        team_id: validated.team_id,
        creator_id: user.id,
        sort_order: Date.now(), // Use timestamp for initial ordering
      })
      .select(`
        *,
        creator:profiles!creator_id(*)
      `)
      .single();

    if (error) {
      console.error("Error creating issue:", error);
      return { error: error.message };
    }

    revalidatePath("/dashboard/issues");
    return { data: issue as IssueWithRelations };
  } catch (error) {
    console.error("Error in createIssue:", error);
    return { error: error instanceof Error ? error.message : "Failed to create issue" };
  }
}

/**
 * Update an existing issue
 */
export async function updateIssue(id: string, input: UpdateIssueInput) {
  try {
    const supabase = await createClient();

    // Validate input
    const validated = updateIssueSchema.parse(input);

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Update issue
    const { data: issue, error } = await supabase
      .from("issues")
      .update(validated)
      .eq("id", id)
      .select(`
        *,
        creator:profiles!creator_id(*)
      `)
      .single();

    if (error) {
      console.error("Error updating issue:", error);
      return { error: error.message };
    }

    revalidatePath("/dashboard/issues");
    revalidatePath(`/dashboard/issues/${id}`);
    return { data: issue as IssueWithRelations };
  } catch (error) {
    console.error("Error in updateIssue:", error);
    return { error: error instanceof Error ? error.message : "Failed to update issue" };
  }
}

/**
 * Get all issues for a team
 */
export async function getIssues(teamId: string) {
  try {
    const supabase = await createClient();

    const { data: issues, error } = await supabase
      .from("issues")
      .select(`
        *,
        creator:profiles!creator_id(*),
        assignees:issue_assignees(
          assignee:profiles!assignee_id(*)
        )
      `)
      .eq("team_id", teamId)
      .order("sort_order", { ascending: false });

    if (error) {
      console.error("Error fetching issues:", error);
      return { error: error.message };
    }

    // Transform assignees structure
    const transformedIssues = issues.map(issue => ({
      ...issue,
      assignees: issue.assignees?.map((a: any) => a.assignee).filter(Boolean) || [],
    }));

    return { data: transformedIssues as IssueWithRelations[] };
  } catch (error) {
    console.error("Error in getIssues:", error);
    return { error: error instanceof Error ? error.message : "Failed to fetch issues" };
  }
}

/**
 * Get a single issue by ID
 */
export async function getIssueById(id: string) {
  try {
    const supabase = await createClient();

    const { data: issue, error } = await supabase
      .from("issues")
      .select(`
        *,
        creator:profiles!creator_id(*),
        assignees:issue_assignees(
          assignee:profiles!assignee_id(*)
        ),
        comments(
          *,
          user:profiles!user_id(*)
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching issue:", error);
      return { error: error.message };
    }

    // Transform assignees structure
    const transformedIssue = {
      ...issue,
      assignees: issue.assignees?.map((a: any) => a.assignee).filter(Boolean) || [],
    };

    return { data: transformedIssue as IssueWithRelations };
  } catch (error) {
    console.error("Error in getIssueById:", error);
    return { error: error instanceof Error ? error.message : "Failed to fetch issue" };
  }
}

/**
 * Delete an issue
 */
export async function deleteIssue(id: string) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("issues")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting issue:", error);
      return { error: error.message };
    }

    revalidatePath("/dashboard/issues");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteIssue:", error);
    return { error: error instanceof Error ? error.message : "Failed to delete issue" };
  }
}