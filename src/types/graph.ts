// ============================================================
// REACT FLOW GRAPH TYPES
// Runtime representations used by the visual graph editor.
// ============================================================

import { Node, Edge } from '@xyflow/react';
import { SocketMode, SocketType } from './nodes';

/** Runtime data for a single socket rendered on a custom node. */
export interface SocketData {
    id: string;
    label: string;
    type?: SocketType;
    mode?: SocketMode;
    /** Current value — string for scalars, Record for vectors {0: x, 1: y, 2: z}. */
    value?: string | Record<string, string>;
    /** Select/dropdown options for enum-style inputs. */
    options?: string[];
}

/** Data payload attached to each custom React Flow node. */
export interface CustomNodeData {
    label: string;
    headerColor?: string;
    inputs?: SocketData[];
    outputs?: SocketData[];
    category?: string;
    name?: string;
    /** When false the node body rows are collapsed. */
    wrapped?: boolean;
    /** When false the node cannot be deleted by the user. */
    deletable?: boolean;

    // --- Entity Editor specific keys ---
    groupKey?: string;
    componentKey?: string;
    parentGroupKey?: string;
    eventKey?: string;

    /** Called when a socket value changes; injected by Graph.tsx. */
    onDataChange?: (
        socketId: string,
        value: string | Record<string, string>,
        isOutput: boolean,
    ) => void;
}

/** A React Flow node typed with {@link CustomNodeData}. */
export type CustomNodeType = Node<CustomNodeData & Record<string, unknown>, 'custom'>;

/** Snapshot of the full graph state (nodes + edges). */
export interface GraphState {
    nodes: CustomNodeType[];
    edges: Edge[];
}
