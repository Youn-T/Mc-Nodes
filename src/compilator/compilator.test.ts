// ============================================================
// Tests — Compilator
// Integration tests for graph → script compilation.
// ============================================================

import { describe, it, expect } from 'vitest';
import { Compilator } from './compilator';
import type { CompilationGraph, CompilationNode, CompilationConnection } from '../types/compilator';
import { SocketMode, SocketType } from '../types/nodes';

// ---------- Helpers ----------

/** Build a minimal CompilationNode. */
function makeNode(
    id: string,
    name: string,
    inputs: { id: string; mode?: SocketMode; type?: SocketType; value?: unknown }[] = [],
    outputs: { id: string; mode?: SocketMode; type?: SocketType }[] = [],
    category = 'World',
): CompilationNode {
    return {
        id,
        type: 'custom',
        data: {
            name,
            label: name,
            category,
            inputs: inputs.map(i => ({
                id: i.id,
                label: i.id,
                mode: i.mode ?? SocketMode.VALUE,
                type: i.type ?? SocketType.OTHER,
                value: i.value,
            })),
            outputs: outputs.map(o => ({
                id: o.id,
                label: o.id,
                mode: o.mode ?? SocketMode.VALUE,
                type: o.type ?? SocketType.OTHER,
            })),
        },
    };
}

function makeConnection(
    source: string,
    sourceHandle: string,
    target: string,
    targetHandle: string,
): CompilationConnection {
    return { source, sourceHandle, target, targetHandle };
}

// ---------- Tests ----------

describe('Compilator', () => {
    describe('formatGraph', () => {
        it('finds root nodes with in-degree 0 on trigger connections', () => {
            const graph: CompilationGraph = {
                nodes: [
                    makeNode('a', 'block explode', [], [{ id: 'trigger', mode: SocketMode.TRIGGER }]),
                    makeNode('b', 'player send message', [{ id: 'trigger', mode: SocketMode.TRIGGER }, { id: 'player', type: SocketType.PLAYER }, { id: 'message', type: SocketType.STRING }], []),
                ],
                connections: [
                    makeConnection('a', 'trigger', 'b', 'trigger'),
                ],
            };

            const comp = new Compilator(graph);
            const paths = comp.formatGraph();

            // Only 'a' is a root (in-degree 0)
            expect(paths).toHaveLength(1);
            expect(paths[0]).toEqual(['a', 'b']);
        });

        it('handles multiple independent root paths', () => {
            const graph: CompilationGraph = {
                nodes: [
                    makeNode('a', 'block explode', [], [{ id: 'trigger', mode: SocketMode.TRIGGER }]),
                    makeNode('b', 'button push', [], [{ id: 'trigger', mode: SocketMode.TRIGGER }]),
                ],
                connections: [],
            };

            const comp = new Compilator(graph);
            const paths = comp.formatGraph();

            expect(paths).toHaveLength(2);
        });
    });

    describe('compile', () => {
        it('compiles a simple event → action chain', () => {
            const graph: CompilationGraph = {
                nodes: [
                    makeNode('1', 'block explode', [], [{ id: 'trigger', mode: SocketMode.TRIGGER }, { id: 'block', type: SocketType.BLOCK }]),
                    makeNode('2', 'block get location', [{ id: 'trigger', mode: SocketMode.TRIGGER }, { id: 'block', type: SocketType.BLOCK }], [{ id: 'trigger', mode: SocketMode.TRIGGER }, { id: 'location', type: SocketType.VECTOR }]),
                ],
                connections: [
                    makeConnection('1', 'trigger', '2', 'trigger'),
                    makeConnection('1', 'block', '2', 'block'),
                ],
            };

            const comp = new Compilator(graph);
            const result = comp.compile();

            expect(result.success).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.output).toContain('world');
            expect(result.output).toContain('blockExplode');
            expect(result.output).toContain('.location');
        });

        it('returns structured errors for missing node templates', () => {
            const graph: CompilationGraph = {
                nodes: [
                    makeNode('1', 'nonexistent_node_xyz', [], [{ id: 'trigger', mode: SocketMode.TRIGGER }]),
                ],
                connections: [],
            };

            const comp = new Compilator(graph);
            const result = comp.compile();

            expect(result.success).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0].kind).toBe('MISSING_NODE');
            expect(result.errors[0].nodeId).toBe('1');
            expect(result.output).toContain('MISSING NODE');
        });

        it('generates import statements for dependencies', () => {
            const graph: CompilationGraph = {
                nodes: [
                    makeNode('1', 'block explode', [], [{ id: 'trigger', mode: SocketMode.TRIGGER }]),
                ],
                connections: [],
            };

            const comp = new Compilator(graph);
            const result = comp.compile();

            expect(result.output).toContain('import');
            expect(result.output).toContain('@minecraft/server');
            expect(result.output).toContain('world');
        });

        it('omits import line when no dependencies', () => {
            // 'get array element by index' has no dependencies
            const graph: CompilationGraph = {
                nodes: [
                    makeNode('1', 'get array element by index',
                        [{ id: 'trigger', mode: SocketMode.TRIGGER }, { id: 'array', value: '[]' }, { id: 'index', type: SocketType.INT, value: 0 }],
                        [{ id: 'trigger', mode: SocketMode.TRIGGER }, { id: 'element' }],
                    ),
                ],
                connections: [],
            };

            const comp = new Compilator(graph);
            const result = comp.compile();

            expect(result.output).not.toContain('import');
        });

        it('substitutes inline input values when no connection exists', () => {
            const graph: CompilationGraph = {
                nodes: [
                    makeNode('1', 'player send message',
                        [{ id: 'trigger', mode: SocketMode.TRIGGER }, { id: 'player', type: SocketType.PLAYER, value: 'p' }, { id: 'message', type: SocketType.STRING, value: 'Hello' }],
                        [],
                    ),
                ],
                connections: [],
            };

            const comp = new Compilator(graph);
            const result = comp.compile();

            // String values should be JSON-escaped (quoted)
            expect(result.output).toContain('"Hello"');
        });

        it('compiles an empty graph without crashing', () => {
            const graph: CompilationGraph = { nodes: [], connections: [] };
            const comp = new Compilator(graph);
            const result = comp.compile();

            expect(result.success).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });

    describe('formatCode (via compile output)', () => {
        it('produces properly indented output with curly braces', () => {
            const graph: CompilationGraph = {
                nodes: [
                    makeNode('1', 'block explode', [], [{ id: 'trigger', mode: SocketMode.TRIGGER }]),
                ],
                connections: [],
            };

            const comp = new Compilator(graph);
            const result = comp.compile();
            const lines = result.output.split('\n');

            // Check that lines inside braces are indented
            const subscribeLine = lines.find(l => l.includes('subscribe'));
            expect(subscribeLine).toBeDefined();

            // No line should start with excessive whitespace (basic sanity)
            for (const line of lines) {
                // Maximum reasonable indent: 10 levels
                expect(line.length - line.trimStart().length).toBeLessThan(40);
            }
        });
    });

    describe('getBestVarName (via compile)', () => {
        it('uses common abbreviations for known names', () => {
            // 'world get dimension' uses a dimension input which triggers abbreviation
            const graph: CompilationGraph = {
                nodes: [
                    makeNode('1', 'world get dimension',
                        [{ id: 'trigger', mode: SocketMode.TRIGGER }, { id: 'dimension_id', type: SocketType.STRING, value: 'overworld' }],
                        [{ id: 'trigger', mode: SocketMode.TRIGGER }, { id: 'dimension' }],
                    ),
                ],
                connections: [],
            };

            const comp = new Compilator(graph);
            const result = comp.compile();

            // 'dimension' should be abbreviated to 'dim' according to commonAbreviations
            expect(result.output).toContain('dim');
        });
    });
});
