// ============================================================
// HOOK — useConnectionValidator
// Validates proposed connections between nodes:
//   • prevents self-connections
//   • prevents cycles
//   • checks socket type compatibility
// ============================================================

import { useCallback } from 'react';
import { getOutgoers, type Edge, type Connection } from '@xyflow/react';
import type { CustomNodeType } from '../types/graph';
import type { SocketData } from '../types/graph';
import { SocketType } from '../types/nodes';

/**
 * Returns a stable `isValidConnection` callback compatible with
 * React Flow's `isValidConnection` prop.
 *
 * @param nodes Current node array (from `useNodesState`).
 */
export function useConnectionValidator(
    nodes: CustomNodeType[],
): (connection: Connection | Edge) => boolean {
    return useCallback(
        (connection: Connection | Edge): boolean => {
            const source = nodes.find(n => n.id === connection.source);
            const target = nodes.find(n => n.id === connection.target);

            // 1) No self-connections
            if (!source || !target || source.id === target.id) return false;

            // 2) Socket-type compatibility
            const sourceSocket = source.data.outputs?.find(
                (s: SocketData) => s.id === connection.sourceHandle,
            );
            const targetSocket = target.data.inputs?.find(
                (s: SocketData) => s.id === connection.targetHandle,
            );

            if (sourceSocket && targetSocket) {
                // Trigger ↔ trigger only
                if (sourceSocket.mode !== targetSocket.mode) return false;

                // If both are value sockets, types must match (OTHER is wildcard)
                if (
                    sourceSocket.type &&
                    targetSocket.type &&
                    sourceSocket.type !== SocketType.OTHER &&
                    targetSocket.type !== SocketType.OTHER &&
                    sourceSocket.type !== targetSocket.type
                ) {
                    return false;
                }
            }

            // 3) Cycle detection (only meaningful for trigger connections)
            const hasCycle = (node: CustomNodeType, visited = new Set<string>()): boolean => {
                if (visited.has(node.id)) return false;
                visited.add(node.id);
                for (const outgoer of getOutgoers(node, nodes, [])) {
                    if (outgoer.id === connection.source) return true;
                    if (hasCycle(outgoer as CustomNodeType, visited)) return true;
                }
                return false;
            };

            if (hasCycle(target)) return false;

            return true;
        },
        [nodes],
    );
}
