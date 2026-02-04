"use client";

import { CreateIssueModal } from "./create-issue-modal";

export function CreateIssueModalWrapper() {
  // TODO: Get actual team ID from context/auth
  const teamId = "8566e958-c650-4b88-ba38-79764569afa9";
  
  return <CreateIssueModal teamId={teamId} />;
}
