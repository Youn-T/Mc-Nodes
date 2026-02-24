// =================================
// IMPORTS
// =================================

import { nodes } from './nodesTemplates';
import type {
    CompilationNode,
    CompilationConnection,
    CompilationGraph,
    CompilationError,
    CompilationResult,
    NodeHandle,
} from '../types/compilator';

// Re-export graph types so callers can use them from this module
export type {
    CompilationNode as Node,
    CompilationConnection as Connection,
    CompilationGraph as Graph,
    CompilationResult,
    CompilationError,
} from '../types/compilator';

// =================================
// UTILS
// =================================

const commonAbreviations: Record<string, string> = {
    dimension: 'dim',
    eventData: 'evtData',
    element: 'elt',
    message: 'msg',
};

// =================================
// COMPILER
// =================================
// TODO : gérer la récursivité et les boucles
export class Compilator {

    private graph: CompilationGraph;
    private compilationErrors: CompilationError[] = [];

    constructor(graph: CompilationGraph) {
        this.graph = graph;
    }

    // =================================
    // UTILS
    // =================================
    private getBestVarName(
        baseName: string,
        varRegister: Record<string, Record<string, string>>,
    ): string {
        const baseVar =
            commonAbreviations[baseName.toLowerCase()] ??
            baseName.toLowerCase().replace(/\s+/g, '_');
        let varName = baseVar;
        let counter = 1;
        while (
            Object.values(varRegister).some(vars =>
                Object.values(vars).includes(varName),
            )
        ) {
            varName = `${baseVar}${counter}`;
            counter++;
        }
        return varName;
    }

    private escapeInputValue(input: NodeHandle | undefined): string {
        if (input == null || input.value == null) return 'undefined';
        if (input.type === 'string') return JSON.stringify(input.value);
        if (typeof input.value === 'object') return JSON.stringify(input.value);
        return String(input.value);
    }

    private formatCode(code: string): string {
        let indent = 0;
        const lines = code.split('\n');

        return lines
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                if (line.startsWith('}') || line.startsWith(']')) {
                    indent = Math.max(0, indent - 1);
                }
                const formattedLine = '    '.repeat(indent) + line;
                if (line.endsWith('{') || line.endsWith('[')) {
                    indent++;
                }
                return formattedLine;
            })
            .join('\n');
    }

    // =================================
    // COMPILATION
    // =================================

    private getNodesTriggerInDegree(): Record<string, number> {
        const nodeMap: Record<string, number> = this.graph.nodes.reduce(
            (map, node) => { map[node.id] = 0; return map; },
            {} as Record<string, number>,
        );

        return this.graph.connections
            .filter(
                (c: CompilationConnection) =>
                    c.sourceHandle === 'trigger' && c.targetHandle === 'trigger',
            )
            .reduce((map, conn) => {
                map[conn.target] = (map[conn.target] || 0) + 1;
                return map;
            }, nodeMap as Record<string, number>);
    }

    private nodeDFS(node: string): string[] {
        const connections = this.graph.connections.filter(
            (c: CompilationConnection) =>
                c.source === node &&
                c.sourceHandle === 'trigger' &&
                c.targetHandle === 'trigger',
        );

        if (connections.length > 1) {
            return [node, ...connections.flatMap(c => this.nodeDFS(c.target))];
        } else if (connections.length === 1) {
            return [node, ...this.nodeDFS(connections[0].target)];
        }
        return [node];
    }

    public formatGraph(): string[][] {
        const inDegree = this.getNodesTriggerInDegree();
        const roots = Object.keys(inDegree).filter(id => inDegree[id] === 0);
        return roots.map(root => this.nodeDFS(root));
    }

    /** Compile the graph and return a structured result with code and errors. */
    public compile(): CompilationResult {
        this.compilationErrors = [];
        const sortedNodePaths = this.formatGraph();

        // COMPILATION OF EACH PATH
        const compiledPaths: { compiledNodes: string; dependenciesSet: Set<string> }[] =
            sortedNodePaths.map((sortedNodeIds: string[]) => {
                const sortedNodes = sortedNodeIds
                    .map(id => this.graph.nodes.find(n => n.id === id))
                    .filter((n): n is CompilationNode => n !== undefined);

                const dependenciesSet = new Set<string>();

                const varRegister: Record<string, Record<string, string>> =
                    this.graph.nodes.reduce((acc, node) => {
                        if (
                            node.data.category === 'Variable' ||
                            node.data.category === 'Constant'
                        ) {
                            acc[node.id] = {};
                            node.data.outputs.forEach((output: NodeHandle) => {
                                const bestName = this.getBestVarName(node.data.name, acc);
                                acc[node.id][output.id] = bestName;
                            });
                        }
                        return acc;
                    }, {} as Record<string, Record<string, string>>);

                const compiledNodes = this.compileNode(
                    sortedNodes,
                    dependenciesSet,
                    varRegister,
                );

                return { compiledNodes, dependenciesSet };
            });

        // AGGREGATE DEPENDENCIES
        const dependencies = compiledPaths.reduce((acc, path) => {
            path.dependenciesSet.forEach(dep => acc.add(dep));
            return acc;
        }, new Set<string>());

        const compiledDependencies =
            dependencies.size > 0
                ? `import { ${Array.from(dependencies).join(', ')} } from "@minecraft/server";\n\n`
                : '';

        const rawOutput =
            compiledDependencies +
            compiledPaths.map(p => p.compiledNodes).join('\n\n');

        const output = this.formatCode(rawOutput);

        return {
            success: this.compilationErrors.length === 0,
            output,
            errors: [...this.compilationErrors],
        };
    }

    private compileNode(
        sortedNodes: CompilationNode[],
        imports: Set<string>,
        varRegister: Record<string, Record<string, string>>,
    ): string {
        const currentNode = sortedNodes.shift();

        if (!currentNode) return '';

        const compiledNodeTemplate: {
            template: string;
            dependencies?: string[];
            var?: Record<string, string>;
        } | undefined = nodes[currentNode.data.name];

        if (!compiledNodeTemplate) {
            this.compilationErrors.push({
                kind: 'MISSING_NODE',
                nodeId: currentNode.id,
                nodeName: currentNode.data.name,
                message: `No template found for node "${currentNode.data.name}"`,
            });
            // Emit inline comment so the output is still readable
            return (
                `// MISSING NODE: ${JSON.stringify(currentNode.data.name)}\n` +
                this.compileNode(sortedNodes, imports, varRegister)
            );
        }

        try {
            let compiledNode = compiledNodeTemplate.template;

            if (compiledNodeTemplate.dependencies) {
                compiledNodeTemplate.dependencies.forEach(dep => imports.add(dep));
            }

            currentNode.data.outputs.forEach((output: NodeHandle) => {
                const varKey = compiledNodeTemplate.var?.[output.id];
                if (!varKey) return;

                if (compiledNode.includes(`/* __${varKey}__ */`)) {
                    const bestName = this.getBestVarName(output.id, varRegister);
                    compiledNode = compiledNode.replace(`/* __${varKey}__ */`, bestName);
                    if (!varRegister[currentNode.id]) varRegister[currentNode.id] = {};
                    varRegister[currentNode.id][output.id] = bestName;
                } else {
                    if (!varRegister[currentNode.id]) varRegister[currentNode.id] = {};
                    varRegister[currentNode.id][output.id] = varKey;
                }
            });

            const connections = this.graph.connections;
            currentNode.data.inputs.forEach((input: NodeHandle) => {
                const connection = connections.find(
                    (c: CompilationConnection) =>
                        c.target === currentNode.id && c.targetHandle === input.id,
                );
                if (connection) {
                    const sourceVarName =
                        varRegister[connection.source]?.[connection.sourceHandle];
                    if (
                        !sourceVarName &&
                        compiledNode.includes(`/* __${input.id}__ */`)
                    ) {
                        throw new Error(
                            `Variable not found for connection from node ` +
                            `${connection.source} handle ${connection.sourceHandle}`,
                        );
                    }
                    compiledNode = compiledNode.replace(
                        `/* __${input.id}__ */`,
                        sourceVarName,
                    );
                } else {
                    compiledNode = compiledNode.replace(
                        `/* __${input.id}__ */`,
                        this.escapeInputValue(input),
                    );
                }
            });

            if (sortedNodes.length === 0) return compiledNode;

            if (compiledNode.includes('/* __NEXT_NODE__ */')) {
                return compiledNode.replace(
                    '/* __NEXT_NODE__ */',
                    this.compileNode(sortedNodes, imports, varRegister),
                );
            }
            return compiledNode + this.compileNode(sortedNodes, imports, varRegister);

        } catch (err) {
            const message =
                err instanceof Error ? err.message : String(err);
            this.compilationErrors.push({
                kind: 'COMPILATION_ERROR',
                nodeId: currentNode.id,
                nodeName: currentNode.data.name,
                message,
            });
            return (
                `// COMPILATION ERROR: ${JSON.stringify(currentNode.data.name)}\n` +
                this.compileNode(sortedNodes, imports, varRegister)
            );
        }
    }
}
