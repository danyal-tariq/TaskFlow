import { getIssues, getIssueById } from "@/server/actions/issues";
import { useQuery } from "@tanstack/react-query";

export function useIssues(teamId: string) {
    return useQuery({
        queryKey: ['issues', teamId],
        queryFn: () => getIssues(teamId),
        staleTime: 1000 * 30, // 30 seconds
  })
}

export function useIssue(id: string) {
    return useQuery({
        queryKey: ['issue', id],
        queryFn: () => getIssueById(id),
        staleTime: 1000 * 60, // 1 minute
    })
}