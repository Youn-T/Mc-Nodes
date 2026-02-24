// ============================================================
// NODE TYPE DEFINITIONS
// Single source of truth for socket modes, socket types,
// and raw node definitions.
// ============================================================

/**
 * Socket modes define the *role* of a socket:
 * - TRIGGER: execution flow (white pins)
 * - VALUE: data transfer
 */
export enum SocketMode {
    TRIGGER = 'trigger',
    VALUE = 'value',
}

/**
 * Socket types define the *data type* carried by a VALUE socket.
 */
export enum SocketType {
    TRIGGER = 'trigger',
    BOOL = 'boolean',
    INT = 'integer',
    FLOAT = 'float',
    STRING = 'string',
    VECTOR = 'vector',
    ENTITY = 'entity',
    ITEM = 'item',
    BLOCK = 'block',
    PLAYER = 'player',
    ROTATION = 'rotation',
    CAMERA = 'camera',
    SCOREBOARD_OBJECTIVE = 'scoreboard_objective',
    COMPONENT = 'component',
    OTHER = 'other',
}

// ---- Raw node definition (data layer, no React dependency) ----

/** A single socket definition on a raw node. */
export interface RawSocketDef {
    name: string;
    mode: SocketMode;
    type?: SocketType;
}

/**
 * Declarative node definition used in `minecraftNodes` / `eventNodes`.
 * Validated at build-time and transformed into React Flow nodes at runtime
 * by `nodes.ts`.
 */
export interface NodeDefinition {
    /** Unique lower-case identifier (e.g. "block explode"). */
    name: string;
    /** Optional display label; defaults to capitalised `name`. */
    label?: string;
    inputs: RawSocketDef[];
    outputs: RawSocketDef[];
    /** Menu path, e.g. ["Player", "Inventory"]. */
    menu: string[];
    /** Optional override for the header colour. */
    color?: string;
}

// ---- Backward-compat alias ----

/** @deprecated Use {@link NodeDefinition} instead. */
export type rawNode = NodeDefinition;
