// ============================================================
// WorkspaceContext
// Provides the imported add-on data to the entire component tree,
// eliminating prop drilling through Navbar → Workspace → EntityEditor.
// ============================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ExplorerData, BrowserData, WorkspaceData } from '../types/workspace';

// ---- Context shape ----

interface WorkspaceContextValue {
    /** The currently loaded workspace data, or null if no add-on is imported. */
    data: WorkspaceData | null;
    /** Raw file blobs returned by the importer. */
    files: Record<string, { blob: Blob; url: string }> | null;
    /** Which item is currently selected in the explorer/browser panel. */
    selected: {
        tab: string;
        section?: string;
        item?: unknown;
        index?: number;
    } | null;
    /** Load a newly imported add-on into the workspace. */
    loadWorkspace: (
        data: WorkspaceData,
        files: Record<string, { blob: Blob; url: string }>,
    ) => void;
    /** Update the selected item. */
    selectItem: (payload: {
        tab: string;
        section?: string;
        item: unknown;
        index: number;
    }) => void;
    /** Clear the active selection. */
    clearSelection: () => void;
}

// ---- Context instance ----

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

// ---- Provider ----

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<WorkspaceData | null>(null);
    const [files, setFiles] = useState<Record<string, { blob: Blob; url: string }> | null>(null);
    const [selected, setSelected] = useState<WorkspaceContextValue['selected']>(null);

    const loadWorkspace = useCallback(
        (
            newData: WorkspaceData,
            newFiles: Record<string, { blob: Blob; url: string }>,
        ) => {
            setData(newData);
            setFiles(newFiles);
            setSelected(null);
        },
        [],
    );

    const selectItem = useCallback(
        (payload: { tab: string; section?: string; item: unknown; index: number }) => {
            setSelected(payload);
        },
        [],
    );

    const clearSelection = useCallback(() => setSelected(null), []);

    return (
        <WorkspaceContext.Provider
            value={{ data, files, selected, loadWorkspace, selectItem, clearSelection }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

// ---- Consumer hook ----

/**
 * Access the workspace context from any component inside `WorkspaceProvider`.
 * Throws if used outside the provider.
 */
export function useWorkspace(): WorkspaceContextValue {
    const ctx = useContext(WorkspaceContext);
    if (!ctx) {
        throw new Error('useWorkspace must be used inside a <WorkspaceProvider>.');
    }
    return ctx;
}

// ---- Typed helpers (convenience) ----

/** Shorthand — returns just the explorer data (throws if workspace is not loaded). */
export function useExplorerData(): ExplorerData {
    const { data } = useWorkspace();
    if (!data) throw new Error('No workspace loaded.');
    return data.explorer;
}

/** Shorthand — returns just the browser data (throws if workspace is not loaded). */
export function useBrowserData(): BrowserData {
    const { data } = useWorkspace();
    if (!data) throw new Error('No workspace loaded.');
    return data.browser;
}
