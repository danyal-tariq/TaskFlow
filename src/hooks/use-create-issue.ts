import { createIssue } from "@/server/actions/issues";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'sonner'
export function useCreateIssue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createIssue,
        onMutate: async (newIssue) => {
            const toastID = toast.loading('Creating issue...');

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['issues'] });
            // Snapshot previous value
            const previous = queryClient.getQueryData(['issues', newIssue.team_id]);

            // Optimistically update to the new value
            queryClient.setQueryData(['issues', newIssue.team_id], (old: any) => {
                const optimisticIssue = {
                    id: `temp-${Date.now()}`,
                    ...newIssue,
                    identifier: 'TEMP-0',
                    creator: null,
                    assignees: [],
                };

                return {
                    data: [...(old?.data || []), optimisticIssue],
                };
            });

            return { previous, toastID };
        },
        onError: (err, newIssue, context) => {
            // Rollback to previous value
            if (context?.previous) {
                queryClient.setQueryData(['issues', newIssue.team_id], context.previous);
                toast.error('Failed to create issue', { id: context.toastID });
            }
        },
        onSettled: (data, error, variables,context) => {
            // Invalidate queries to refetch fresh data
            queryClient.invalidateQueries({ queryKey: ['issues', variables.team_id] });
            toast.success('Issue created successfully', { id: context?.toastID });
        }
    })
}