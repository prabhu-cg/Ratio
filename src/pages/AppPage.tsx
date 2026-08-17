import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function AppPage() {
  useDocumentTitle('RATIO — Workspace');

  return <WorkspaceShell />;
}

export default AppPage;
