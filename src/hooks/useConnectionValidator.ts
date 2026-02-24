// ============================================================
// useConnectionValidator
// Validates whether a socket connection between two nodes is
// allowed, based on SocketMode and SocketType compatibility.
// ============================================================

import { useCallback } from 'react';
import type { Connection } from '@xyflow/react';
import { SocketMode, SocketType } from '../types/nodes';
import type { CustomNodeType } from '../types/graph';

/**
 * Pure function — determines whether two sockets can be connected.
 * Rules:
 *  1. Both sockets must share the same mode (TRIGGER ↔ TRIGGER, VALUE ↔ VALUE).
 *  2. For VALUE sockets, types must match, with two exceptions:
 *     - INT → FLOAT is allowed (implicit widening).
 *     - Either socket typed as OTHER accepts any VALUE type.
 */
export function isSocketConnectionValid(
    sourceHandle: { mode?: SocketMode; type?: SocketType },
    targetHandle: { mode?: SocketMode; type?: SocketType },
): boolean {
    // Modes must match
    if (sourceHandle.mode !== targetHandle.mode) return false;

    // TRIGGER sockets have no type constraint
    if (sourceHandle.mode === SocketMode.TRIGGER) return true;

    // OTHER is a wildcard — accepts any type
    if (
        sourceHandle.type === SocketType.OTHER ||
        targetHandle.type === SocketType.OTHER
    ) {
        return true;
    }

    // INT → FLOAT implicit widening
    if (
        sourceHandle.type === SocketType.INT &&
        targetHandle.type === SocketType.FLOAT
    ) {
        return true;
    }

    return sourceHandle.type === targetHandle.type;
}

/**
 * React hook — returns a memoized connection validator that uses the
 * current node list to resolve socket types before calling
 * {@link isSocketConnectionValid}.
 */
export function useConnectionValidator(nodes: CustomNodeType[]) {
    return useCallback(
        (connection: Connection): boolean => {
            const source = nodes.find(n => n.id === connection.source);
            const target = nodes.find(n => n.id === connection.target);
            if (!source || !target) return false;

            const sourceHandle = source.data.outputs?.find(
                h => h.id === connection.sourceHandle,
            );
            const targetHandle = target.data.inputs?.find(
                h => h.id === connection.targetHandle,
            );
            if (!sourceHandle || !targetHandle) return false;

            return isSocketConnectionValid(sourceHandle, targetHandle);
        },
        [nodes],
    );
}
