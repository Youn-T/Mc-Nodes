// ============================================================
// SOCKET & NODE DEFINITION TYPES
// Source of truth for all node-related type definitions.
// ============================================================

/** Determines the role of a socket: execution flow vs data transfer. */
export enum SocketMode {
    TRIGGER = 'trigger',
    VALUE = 'value',
}

/** Data type carried by value sockets. */
export enum SocketType {
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

/** Defines a single socket (input or output) within a NodeDefinition. */
export interface SocketDefinition {
    name: string;
    mode: SocketMode;
    type?: SocketType;
}

/** The raw definition of a node, used to build the node registry and contextual menu. */
export interface NodeDefinition {
    name: string;
    /** Display label — defaults to `name` with first letter uppercased. */
    label?: string;
    inputs: SocketDefinition[];
    outputs: SocketDefinition[];
    /** Breadcrumb path in the contextual menu, e.g. ["World", "Time"]. */
    menu: string[];
    /** Override for the header background color. */
    color?: string;
}

/** @deprecated Use {@link NodeDefinition} instead. */
export type rawNode = NodeDefinition;
