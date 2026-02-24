// ============================================================
// Tests — Node Registry
// Validates structural invariants of the node definitions.
// ============================================================

import { describe, it, expect } from 'vitest';
import { rawNodes, nodes, menu } from './nodes';
import { SocketMode, SocketType } from '../types/nodes';

// ---------- rawNodes invariants ----------

describe('rawNodes', () => {
    it('is not empty', () => {
        expect(rawNodes.length).toBeGreaterThan(0);
    });

    it('has unique names across all node definitions', () => {
        const names = rawNodes.map(n => n.name);
        const unique = new Set(names);
        const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
        expect(duplicates, `Duplicate node names: ${duplicates.join(', ')}`).toHaveLength(0);
        expect(unique.size).toBe(names.length);
    });

    it('every node has a non-empty name', () => {
        for (const node of rawNodes) {
            expect(node.name.trim().length, `Node has empty name`).toBeGreaterThan(0);
        }
    });

    it('every node has a menu path with at least one level', () => {
        for (const node of rawNodes) {
            expect(
                node.menu.length,
                `Node "${node.name}" has empty menu path`,
            ).toBeGreaterThan(0);
        }
    });

    it('every VALUE socket defines a SocketType', () => {
        for (const node of rawNodes) {
            const allSockets = [...node.inputs, ...node.outputs];
            for (const socket of allSockets) {
                if (socket.mode === SocketMode.VALUE) {
                    expect(
                        socket.type,
                        `Node "${node.name}", socket "${socket.name}" is VALUE but has no type`,
                    ).toBeDefined();
                }
            }
        }
    });

    it('TRIGGER sockets do not need a SocketType', () => {
        for (const node of rawNodes) {
            const allSockets = [...node.inputs, ...node.outputs];
            for (const socket of allSockets) {
                if (socket.mode === SocketMode.TRIGGER) {
                    // TRIGGER sockets should NOT have a type (or it should be undefined)
                    expect(
                        socket.type,
                        `Node "${node.name}", socket "${socket.name}" is TRIGGER but has a type`,
                    ).toBeUndefined();
                }
            }
        }
    });

    it('every socket has a valid SocketMode', () => {
        const validModes = Object.values(SocketMode);
        for (const node of rawNodes) {
            for (const socket of [...node.inputs, ...node.outputs]) {
                expect(
                    validModes,
                    `Node "${node.name}", socket "${socket.name}" has invalid mode: ${socket.mode}`,
                ).toContain(socket.mode);
            }
        }
    });

    it('every VALUE socket has a valid SocketType', () => {
        const validTypes = Object.values(SocketType);
        for (const node of rawNodes) {
            for (const socket of [...node.inputs, ...node.outputs]) {
                if (socket.mode === SocketMode.VALUE) {
                    expect(
                        validTypes,
                        `Node "${node.name}", socket "${socket.name}" has invalid type: ${socket.type}`,
                    ).toContain(socket.type);
                }
            }
        }
    });

    it('every node has unique input socket names', () => {
        for (const node of rawNodes) {
            const names = node.inputs.map(s => s.name);
            const unique = new Set(names);
            expect(
                unique.size,
                `Node "${node.name}" has duplicate input socket names`,
            ).toBe(names.length);
        }
    });

    it('every node has unique output socket names', () => {
        for (const node of rawNodes) {
            const names = node.outputs.map(s => s.name);
            const unique = new Set(names);
            expect(
                unique.size,
                `Node "${node.name}" has duplicate output socket names`,
            ).toBe(names.length);
        }
    });
});

// ---------- Compiled nodes registry ----------

describe('nodes (compiled registry)', () => {
    it('has the same count as rawNodes', () => {
        expect(Object.keys(nodes).length).toBe(rawNodes.length);
    });

    it('every node has type "custom"', () => {
        for (const [id, entry] of Object.entries(nodes)) {
            expect(entry.type, `Node "${id}" type is not "custom"`).toBe('custom');
        }
    });

    it('every node has a non-empty label', () => {
        for (const [id, entry] of Object.entries(nodes)) {
            expect(entry.data.label.trim().length, `Node "${id}" has empty label`).toBeGreaterThan(0);
        }
    });

    it('every node has a category', () => {
        for (const [id, entry] of Object.entries(nodes)) {
            expect(entry.data.category, `Node "${id}" missing category`).toBeTruthy();
        }
    });

    it('generates lowercase underscore IDs from names', () => {
        for (const raw of rawNodes) {
            const expectedId = raw.name.toLowerCase().replace(/\s+/g, '_');
            expect(nodes[expectedId], `Node "${raw.name}" → id "${expectedId}" not found`).toBeDefined();
        }
    });
});

// ---------- Contextual menu ----------

describe('menu', () => {
    it('is a non-empty 2D array', () => {
        expect(menu.length).toBeGreaterThan(0);
        for (const division of menu) {
            expect(Array.isArray(division)).toBe(true);
        }
    });

    it('contains top-level categories', () => {
        const topNames = menu.flatMap(div => div.map(cat => cat.name));
        // Verify some expected built-in categories exist
        expect(topNames).toContain('Event');
        expect(topNames).toContain('Player');
        expect(topNames).toContain('Math');
        expect(topNames).toContain('World');
    });
});
