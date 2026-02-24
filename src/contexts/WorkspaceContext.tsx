// ============================================================
// WorkspaceContext — Shares imported workspace data (explorer +
// browser) with any component in the tree, eliminating deep
// prop-drilling through Navbar → Workspace → EntityEditor → …
// ============================================================

import { createContext, useContext } from 'react';
import type { ExplorerData, BrowserData } from '../types/workspace';

export interface WorkspaceContextValue {
    data: { explorer: ExplorerData; browser: BrowserData } | null;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({ data: null });

/**
 * Hook to consume the workspace context.
 * Must be called inside a `<WorkspaceProvider>`.
 */
export function useWorkspace(): WorkspaceContextValue {
    return useContext(WorkspaceContext);
}

export const WorkspaceProvider = WorkspaceContext.Provider;
export default WorkspaceContext;
