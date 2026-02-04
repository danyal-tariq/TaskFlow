import { IssueDetailView } from "@/components/issues/issue-detail-view";

interface IssueDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function IssueDetailPage({ params }: IssueDetailPageProps) {
  const { id } = await params;
  
  return <IssueDetailView issueId={id} />;
}
