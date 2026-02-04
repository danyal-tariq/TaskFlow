import { updateIssue } from "@/server/actions/issues";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateIssueInput } from "@/lib/validations/issue-schema";
import { toast } from "sonner";

interface UpdateIssueMutationVariables {
    id: string;
    data: UpdateIssueInput;
    teamId?: string; // Optional for cache management
}

export function useUpdateIssue() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateIssueMutationVariables) => {
            console.log("=== UPDATE MUTATION CALLED ===");
            console.log("ID:", id);
            console.log("Data:", data);
            return updateIssue(id, data);
        },
        onMutate: async (variables) => {
            const { id, data, teamId } = variables;
            const toastId = toast.loading('Updating issue...');
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['issues'] });
            await queryClient.cancelQueries({ queryKey: ['issue', id] });

            // Snapshot previous values
            const previousList = teamId ? queryClient.getQueryData(['issues', teamId]) : null;
            const previousIssue = queryClient.getQueryData(['issue', id]);

            // Optimistically update the issues list
            if (teamId) {
                queryClient.setQueryData(['issues', teamId], (old: any) => {
                    if (!old?.data) return old;
                    return {
                        ...old,
                        data: old.data.map((issue: any) => {
                            if (issue.id === id) {
                                return { ...issue, ...data };
                            }
                            return issue;
                        })
                    };
                });
            }

            // Optimistically update the single issue query
            queryClient.setQueryData(['issue', id], (old: any) => {
                if (!old?.data) return old;
                return {
                    ...old,
                    data: { ...old.data, ...data }
                };
            });

            return { previousList, previousIssue, teamId, toastId };
        },
        onSuccess: (result) => {
            console.log("=== UPDATE SUCCESS ===", result);
        },
        onError: (err, variables, context) => {
            console.error("=== UPDATE ERROR ===", err);
            // Rollback on error
            if (context?.teamId && context.previousList) {
                queryClient.setQueryData(['issues', context.teamId], context.previousList);
            }
            if (context?.previousIssue) {
                queryClient.setQueryData(['issue', variables.id], context.previousIssue);
            }
            toast.error('Failed to update issue', { id: context?.toastId });
        },
        onSettled: (data, error, variables,context) => {
            // Refetch to sync with server
            if (variables.teamId) {
                queryClient.invalidateQueries({ queryKey: ['issues', variables.teamId] });
            }
            queryClient.invalidateQueries({ queryKey: ['issue', variables.id] });
            toast.success('Issue updated successfully', { id: context?.toastId });
        },
    });
}