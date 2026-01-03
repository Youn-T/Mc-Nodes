// =================================
// IMPORTS
// =================================

import path from "node:path";
import { nodes } from "./nodesTemplates";

// =================================
// TYPES
// =================================

export interface Node {
    id: string;
    type: string;
    data: { inputs: NodeHandle[]; outputs: NodeHandle[]; category: string; name: string; label: string; };
}

interface NodeHandle {
    id: string,
    label: string,
    mode: string,
    type: string,
    value?: string | number | boolean | object | null,
}

export interface Connection {
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
}

export interface Graph {
    nodes: Node[];
    connections: Connection[];
}

// =================================
// UTILS
// =================================

const commonAbreviations: Record<string, string> = {
    "dimension": "dim",
    "eventData": "evtData",
    "element": "elt",
    "message": "msg",
}

// =================================
// COMPILER
// =================================
// TODO : gérer la récursivité et les boucles
// TODO : gérer les erreurs
export class Compilator {

    private graph: Graph;

    constructor(graph: Graph) {
        console.log("Compilator initialized with graph:", graph);
        this.graph = graph;
    }

    private getBestVarName(baseName: string, varRegister: Record<string, Record<string, string>>): string {
        const baseVar = commonAbreviations[baseName.toLowerCase()] || baseName.toLowerCase().replace(/\s+/g, '_');
        let varName = baseVar;
        let counter = 1;
        while (Object.values(varRegister).some(vars => Object.values(vars).includes(varName))) {
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
            .map(line => line.trim()) // Nettoie les espaces existants
            .filter(line => line.length > 0) // Supprime les lignes vides
            .map(line => {
                // Si la ligne commence par une fermeture, on réduit l'indentation avant d'écrire
                if (line.startsWith('}') || line.startsWith(']')) {
                    indent = Math.max(0, indent - 1);
                }

                const formattedLine = '    '.repeat(indent) + line;

                // Si la ligne finit par une ouverture, on augmente l'indentation pour la suivante
                if (line.endsWith('{') || line.endsWith('[')) {
                    indent++;
                }

                return formattedLine;
            })
            .join('\n');
    }

    private getNodesTriggerInDegree() {
        const nodeMap: Record<string, number> = this.graph.nodes.reduce((map, node) => {
            map[node.id] = 0;
            return map;
        }, {} as Record<string, number>);

        const connectionMap = this.graph.connections.filter((connection: Connection) => connection.sourceHandle === "trigger" && connection.targetHandle === "trigger")
            .reduce((map, conn) => {
                map[conn.target] = (map[conn.target] || 0) + 1;
                return map;
            }, nodeMap as Record<string, number>);

        return connectionMap;
    }

    private nodeDFS(node: string): any {
        const connections = this.graph.connections.filter((connection: Connection) => connection.source === node)

        let nextNode: string[] | string[][]

        if (connections.length > 1) {
            nextNode = connections.map((connection: Connection): any => this.nodeDFS(connection.target))
        } else if (connections.length === 1) {
            nextNode = this.nodeDFS(connections[0].target)
        } else {
            nextNode = []
        }

        return [node, ...nextNode]
    }

    public formatGraph() {
        const nodesTriggerInDegree: Record<string, number> = this.getNodesTriggerInDegree()
        const graphInputs = Object.keys(nodesTriggerInDegree).filter((node: string) => nodesTriggerInDegree[node] === 0)
        const paths = graphInputs.map((graphInput: string) => this.nodeDFS(graphInput))

        const flattenPaths = paths.map((path: any) => path.flat(Infinity))
        const intersections: string[][] = []
        for (const flattenPath1 of flattenPaths) {
            const line = []
            for (const flattenPath2 of flattenPaths/*.filter((path) => path != flattenPath1 )*/) {
                if (flattenPath1 === flattenPath2) {
                    line.push(null)
                    continue
                }
                line.push(flattenPath1.filter((node: any) => flattenPath2.includes(node))?.[0])
            }
            intersections.push(line)
        }

        return paths
    }

    private getNodesIndex() {

        const nodeMap: Record<string, number> = this.graph.nodes.reduce((map, node) => {
            map[node.id] = 0;
            return map;
        }, {} as Record<string, number>);


        const connectionMap = this.graph.connections.reduce((map, conn) => {
            map[conn.target] = (map[conn.target] || 0) + 1;
            return map;
        }, nodeMap as Record<string, number>);

        return connectionMap;
    }

    private generateTopologicalSort(): string[] {
        const inDegree: Record<string, number> = this.getNodesIndex();
        const totalNodes = Object.keys(inDegree).length; // Nombre total de noeuds

        const queue = Object.keys(inDegree).filter((val: string, _i: number) => inDegree[val] === 0)
        const topologicalSort: string[] = []

        while (queue.length > 0) {
            const currentNode = queue.shift()!;

            const nodeConnections = this.graph.connections.filter((val: Connection, _i: number) => val.source === currentNode)

            nodeConnections.forEach((connection: Connection, _i: number) => {
                inDegree[connection.target] -= 1
                if (inDegree[connection.target] === 0) {
                    queue.push(connection.target)
                }
            })

            topologicalSort.push(currentNode)
        }

        if (topologicalSort.length !== totalNodes) {
            throw new Error("Graph has at least one cycle, topological sort not possible.");
        }

        return topologicalSort//.map( node => this.graph.nodes.find(nde => nde.id === node)?.data.label )
    }

    public compile(): string {
        const sortedNodePaths = this.formatGraph();

        // COMPILATION OF EACH PATH
        const compiledPaths : {compiledNodes: string, dependenciesSet: Set<string>}[] = sortedNodePaths.map((sortedNodeIds : string[], _pathIndex) => {
            const sortedNodes = sortedNodeIds.map(nodeId => this.graph.nodes.find(nde => nde.id === nodeId)!);

            const dependenciesSet: Set<string> = new Set();

            const varRegister: Record<string, Record<string, string>> = this.graph.nodes.reduce((acc, node) => {
                if (node.data.category === 'Variable' || node.data.category === 'Constant') {
                    acc[node.id] = {};
                    node.data.outputs.forEach((output: NodeHandle) => {
                        const bestName = this.getBestVarName(node.data.name, acc);
                        acc[node.id][output.id] = bestName;
                    });
                }
                return acc;
            }, {} as Record<string, Record<string, string>>);
            console.log("Initial variable register:", varRegister);
            // const varRegister: Record<string, Record<string, string>> = {};
            let compiledNodes = this.compileNode(sortedNodes, dependenciesSet, varRegister);

            return {compiledNodes, dependenciesSet};
        });

        // CODE GENERATION WITH IMPORTS
        const dependencies = compiledPaths.reduce((acc, path) => {
            path.dependenciesSet.forEach(dep => acc.add(dep));
            return acc;
        }, new Set<string>());

        // FORMATTING THE DEPENDENCIES AND FINAL CODE
        const compliedDependencies = `import { ${Array.from(dependencies).join(', ')} } from "@minecraft/server";\n\n`; 
        
        const compiledNodes = compliedDependencies + compiledPaths.reduce((acc, path) => {
            acc += path.compiledNodes + '\n\n';
            return acc;
        }, "");

        return compiledNodes
    }

    private compileNode(sortedNodes: Node[], imports: Set<string>, varRegister: Record<string, Record<string, string>>): string {
        const currentNode: Node = sortedNodes.shift()!;

        if (!currentNode) {
            console.warn(`Node not found during compilation.`);
            return "// NODE NOT FOUND " + "\n";
        }

        const compiledNodeTemplate: { template: string, dependencies?: string[], var?: Record<string, string> } = nodes[currentNode.data.name as string]

        if (!compiledNodeTemplate) {
            console.warn(`No template found for node type: ${currentNode.data.name}`);
            return "// MISSING NODE : " + (currentNode.data.name ? JSON.stringify(currentNode.data.name) : "") + "\n" + this.compileNode(sortedNodes, imports, varRegister);
        }

        try {
            let compiledNode = compiledNodeTemplate.template;


            if (compiledNodeTemplate.dependencies) compiledNodeTemplate.dependencies.forEach(dep => imports.add(dep));

            currentNode.data.outputs.forEach((output: NodeHandle, _i: number) => {

                if (compiledNodeTemplate.var?.[output.id]) {
                    const varName = compiledNodeTemplate.var[output.id];
                    const bestName = this.getBestVarName(output.id, varRegister);
                    compiledNode = compiledNode.replace(`/* __${varName}__ */`, bestName);
                    console.log("Registering variable:", currentNode.id, output.id, bestName);

                    if (!varRegister[currentNode.id]) varRegister[currentNode.id] = {};
                    varRegister[currentNode.id][output.id] = bestName;
                }
            });


            const connections = this.graph.connections;
            currentNode.data.inputs.forEach((input: NodeHandle) => {
                const connection: Connection | undefined = connections.find((connection: Connection) => connection.target === currentNode.id && connection.targetHandle === input.id)
                if (connection) {
                    const sourceVarName = varRegister[connection.source]?.[connection.sourceHandle];
                    if (!sourceVarName && compiledNode.includes(`/* __${input.id}__ */`)) {
                        throw new Error(`Variable not found for connection from node ${connection.source} handle ${connection.sourceHandle}`);
                    }
                    compiledNode = compiledNode.replace(`/* __${input.id}__ */`, sourceVarName);
                } else {
                    compiledNode = compiledNode.replace(`/* __${input.id}__ */`, this.escapeInputValue(input));
                }
            });

            if (sortedNodes.length === 0) return compiledNode;

            if (compiledNode.includes("/* __NEXT_NODE__ */")) {
                return compiledNode.replace("/* __NEXT_NODE__ */", this.compileNode(sortedNodes, imports, varRegister));
            } else {
                return compiledNode + this.compileNode(sortedNodes, imports, varRegister);
            }
        } catch (error) {
            console.warn(`Compilation error for node type: ${currentNode.data.name} : `, error);
            return "// COMPILATION ERROR : " + (currentNode.data.name ? JSON.stringify(currentNode.data.name) : "") + "\n" + this.compileNode(sortedNodes, imports, varRegister);
        }
    }
}