// ============================================================
// COMPILATOR TYPE DEFINITIONS
// Structures used by the script compiler (compilator.ts).
// ============================================================

import type { SocketMode, SocketType } from './nodes';

// ---- Node handle (socket on a compilation node) ----

export interface NodeHandle {
    id: string;
    label: string;
    mode: SocketMode;
    type: SocketType;
    value?: unknown;
}

// ---- Compilation graph structures ----

/** A node as seen by the compiler. */
export interface CompilationNode {
    id: string;
    type: string;
    data: {
        name: string;
        label: string;
        category: string;
        inputs: NodeHandle[];
        outputs: NodeHandle[];
    };
}

/** An edge/connection between two nodes. */
export interface CompilationConnection {
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
}

/** The full graph payload handed to the compiler. */
export interface CompilationGraph {
    nodes: CompilationNode[];
    connections: CompilationConnection[];
}

// ---- Compilation result ----

export interface CompilationError {
    kind: 'MISSING_NODE' | 'COMPILATION_ERROR';
    nodeId: string;
    nodeName: string;
    message: string;
}

export interface CompilationResult {
    success: boolean;
    output: string;
    errors: CompilationError[];
}
