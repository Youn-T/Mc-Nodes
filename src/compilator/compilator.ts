// =================================
// TYPES
// =================================

export interface Node {
    id: string;
    type: string;
    data: any;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
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
// COMPILER
// =================================

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

        const queue = Object.keys(inDegree).filter((val: string, _i: number) => inDegree[val] === 0)
        const topologicalSort = []
        // const graph = this.graph.nodes.reduce((map, node) => {
        //     map.push(node.id)
        //     return map;
        // }, [] as string[]);

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

        return topologicalSort//.map( node => this.graph.nodes.find(nde => nde.id === node)?.data.label )
    }

    public compile(): string {
        const sortedNodeIds = this.generateTopologicalSort();
        const sortedNodes = sortedNodeIds.map(nodeId => this.graph.nodes.find(nde => nde.id === nodeId)!);

        const dependenciesSet: Set<string> = new Set();

        const varRegister: Record<string, Record<string, string>> = {}; // TODO : gérer les variables globales avant la compilation (éviter des doublons)

        let compiledNodes = this.compileNode(sortedNodes, dependenciesSet, varRegister);

        if (dependenciesSet.size > 0) {
            compiledNodes = `import { ${Array.from(dependenciesSet).join(', ')} } from "@minecraft/server";\n\n` + compiledNodes
        }

        return compiledNodes;
    }

    private compileNode(sortedNodes: Node[], imports: Set<string>, varRegister: Record<string, Record<string, string>>): string {
        const currentNode: Node = sortedNodes.shift()!;
        const compiledNodeTemplate: { template: string, dependencies?: string[], var?: Record<string, string> } = nodes[currentNode.data.name as string]

        let compiledNode = compiledNodeTemplate.template;

        // compiledNode = compiledNode.replace("/* __NODE_ID__ */", currentNode.id)

        if (compiledNodeTemplate.dependencies) compiledNodeTemplate.dependencies.forEach(dep => imports.add(dep));

        currentNode.data.outputs.forEach((output: any, _i: number) => {

            if (compiledNodeTemplate.var?.[output.id]) {
                const varName = compiledNodeTemplate.var[output.id];
                const bestName = this.getBestVarName(output.id, varRegister);
                compiledNode = compiledNode.replace(`/* __${varName}__ */`, bestName);
                console.log("Registering variable:", currentNode.id, output.id, bestName);

                if (!varRegister[currentNode.id]) varRegister[currentNode.id] = {};
                varRegister[currentNode.id][output.id] = bestName;
            }
        });


        // TODO : inclure les valeurs de node par défaut
        const connections = this.graph.connections;
        currentNode.data.inputs.forEach((input: any) => {
            const connection: Connection | undefined = connections.find((connection: Connection) => connection.target === currentNode.id && connection.targetHandle === input.id)
            if (connection) {
                compiledNode = compiledNode.replace(`/* __${input.id}__ */`, varRegister?.[connection.source]?.[connection.sourceHandle]);
            } else {
                compiledNode = compiledNode.replace(`/* __${input.id}__ */`, input.type === 'string' ? `"${input?.value}"` : input?.value)
            }
        });




        if (sortedNodes.length === 0) return compiledNode;

        if (compiledNode.includes("/* __NEXT_NODE__ */")) {
            return compiledNode.replace("/* __NEXT_NODE__ */", this.compileNode(sortedNodes, imports, varRegister));
        } else {
            return compiledNode + this.compileNode(sortedNodes, imports, varRegister);
        }
    }
}

// =================================
// NODES
// =================================

const commonAbreviations: Record<string, string> = {
    "dimension": "dim",
    "eventData": "evtData",
    "element": "elt",
    "message": "msg",
}

const nodes: Record<string, { template: string, dependencies?: string[], var?: Record<string, string> }> = {
    "block explode": {
        template: "world.afterEvents.blockExplode.subscribe(eventData => {\n /* __NEXT_NODE__ */ });",
        dependencies: ["world"]
    },
    "world get dimension": {
        template: "const /* __VAR1__ */ = world.getDimension(/* __dimension_id__ */);\n",
        dependencies: ["world"],
        var: { "dimension": "VAR1" }
    },
    "dimension get players": {
        template: "const /* __VAR1__ */ = /* __dimension__ */.getPlayers();\n",
        dependencies: ["world"],
        var: { "players": "VAR1" }
    },
    "get array element by index": {
        template: "const /* __VAR1__ */ = /* __array__ */[/* __index__ */];\n",
        var: { "element": "VAR1" }
    },
    "player send message": {
        template: "/* __player__ */.sendMessage(/* __message__ */);\n",
    }
}

