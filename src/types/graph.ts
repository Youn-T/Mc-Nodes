// ============================================================
// GRAPH / REACT FLOW TYPE DEFINITIONS
// Types used by the visual editor (React Flow layer).
// ============================================================

import type { Node } from '@xyflow/react';
import type { SocketMode, SocketType } from './nodes';

// ---- Socket data (runtime, attached to a node instance) ----

/** Runtime representation of a single socket on a rendered node. */
export interface SocketData {
    id: string;
    label: string;
    mode: SocketMode;
    type: SocketType;
    value?: unknown;
    /** Optional list of allowed values for dropdown sockets. */
    options?: string[];
}

/** Data payload stored inside every custom React Flow node. */
export interface CustomNodeData {
    label: string;
    name?: string;
    headerColor?: string;
    inputs?: SocketData[];
    outputs?: SocketData[];
    category?: string;
    wrapped?: boolean;
    deletable?: boolean;
    /** Callback injected by Graph.tsx to propagate value edits upward. */
    onDataChange?: (socketId: string, value: string | Record<string, string>, isOutput: boolean) => void;
    [key: string]: unknown;
}

/** A React Flow node with our custom data type. */
export type CustomNodeType = Node<CustomNodeData>;

// ---- Processed node record (output of nodes.ts) ----

/** A fully resolved node ready to be stamped into the graph. */
export interface ProcessedNode {
    type: 'custom';
    data: {
        label: string;
        inputs: SocketData[];
        outputs: SocketData[];
        headerColor?: string;
        category: string;
        name?: string;
    };
}
