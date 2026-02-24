// ============================================================
// COMPILATOR TYPES
// Data structures used by the script graph compilator.
// ============================================================

import { SocketMode, SocketType } from './nodes';

// ---- Errors & Results ----

export type CompilationErrorKind = 'MISSING_NODE' | 'COMPILATION_ERROR' | 'NOT_FOUND';

export interface CompilationError {
    kind: CompilationErrorKind;
    nodeId?: string;
    nodeName?: string;
    message: string;
}

/** Structured result returned by Compilator.compile(). */
export interface CompilationResult {
    success: boolean;
    output: string;
    errors: CompilationError[];
}

// ---- Graph Structures ----

/** A resolved socket handle used during compilation. */
export interface NodeHandle {
    id: string;
    label: string;
    mode: SocketMode;
    type: SocketType;
    value?: string | number | boolean | object | null;
}

/** A node as seen by the compilator (subset of the React Flow node). */
export interface CompilationNode {
    id: string;
    type: string;
    data: {
        inputs: NodeHandle[];
        outputs: NodeHandle[];
        category: string;
        name: string;
        label: string;
    };
}

export interface CompilationConnection {
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
}

export interface CompilationGraph {
    nodes: CompilationNode[];
    connections: CompilationConnection[];
}
