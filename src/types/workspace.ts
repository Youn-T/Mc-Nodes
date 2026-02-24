// ============================================================
// Workspace & Filesystem types
// ============================================================

/** A single asset from a Minecraft pack (texture, audio, model, entity, etc.) */
export interface PackAsset {
  name: string;
  url: string;
  blob: Blob;
}

/** A pack entry keyed by pack type (e.g. "res" | "bev") */
export type PackEntry = Record<string, PackAsset>;

/**
 * Data from the project explorer panel:
 * entities/blocks/items/scripts detected in the imported pack.
 */
export interface ExplorerData {
  entities: Record<string, PackEntry>;
  blocks: Record<string, PackEntry>;
  items: Record<string, PackEntry>;
  scripts: Record<string, PackEntry>;
}

/** Assets available in the content browser (media files). */
export interface BrowserData {
  textures: PackAsset[];
  models: PackAsset[];
  audio: PackAsset[];
}

/**
 * Combined workspace data returned by the import pipeline.
 */
export interface WorkspaceData {
  explorer: ExplorerData;
  browser: BrowserData;
}

