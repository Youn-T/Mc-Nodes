// ============================================================
// WORKSPACE / FILESYSTEM TYPES
// Data structures for imported add-on assets.
// ============================================================

/** A single file asset resolved from the imported add-on. */
export interface PackAsset {
    name: string;
    url: string;
    blob: Blob;
}

/** An entity/block/item entry that may have files from both packs. */
export interface PackEntry {
    /** Resource pack file (client-side). */
    res?: PackAsset;
    /** Behavior pack file (server-side). */
    bev?: PackAsset;
}

/** Contents of the explorer panel, organized by asset type. */
export interface ExplorerData {
    entities: Record<string, PackEntry>;
    blocks: Record<string, PackEntry>;
    items: Record<string, PackEntry>;
    scripts: Record<string, PackEntry>;
}

/** Contents of the content browser panel. */
export interface BrowserData {
    textures: PackAsset[];
    models: PackAsset[];
    audio: PackAsset[];
}

/** Combined workspace data passed from the importer into the app. */
export interface WorkspaceData {
    explorer: ExplorerData;
    browser: BrowserData;
}

// ---- Backward-compat aliases (deprecated) ----

/** @deprecated Use {@link ExplorerData} instead. */
export type explorerData = ExplorerData;

/** @deprecated Use {@link BrowserData} instead. */
export type browserData = BrowserData;
