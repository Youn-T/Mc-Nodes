import { Plus, Trash2 } from "lucide-react";
import Graph from "../../graphs/Graph"
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { minecraftComponents } from "../../../editors/entityEditor";
import { Edge } from "@xyflow/react";
import { CustomNodeType, SocketData } from "../../CustomNode";
import { ComponentGroupsData } from "../EntityEditor";

const formatCOmponentGroupName = (name: string) => {
    return name.split(":")[1] || name;
}

// Génère le menu dynamique à partir des minecraftComponents
const generateComponentMenu = () => {
    const menuItems = Object.entries(minecraftComponents).map(([key, component]) => ({
        name: key.toLocaleLowerCase(),
        node: {
            type: 'custom',
            data: {
                label: key,
                headerColor: "#7A52CC",
                outputs: [{ id: "component", label: "component", type: "component", mode: "value" }],
                inputs: minecraftComponents[key].inputs.map((input: any) => ({
                    id: input.name,
                    label: input.name,
                    type: typeParser(input.type),
                    mode: "value",
                    value: input.default
                })),
                wrapped: true,
            }
        }
    }));

    const constants = [
        {
            name: "boolean",
            node: {
                type: 'custom',
                data: {
                    category: "Constant",
                    label: "Boolean",
                    headerColor: "#D97706",
                    outputs: [{ id: "value", label: "value", type: "boolean", mode: "value" }],
                    wrapped: true,
                }
            }
        },
        {
            name: "integer",
            node: {
                type: 'custom',
                data: {
                    category: "Constant",
                    label: "Integer",
                    headerColor: "#059669",
                    outputs: [{ id: "value", label: "value", type: "integer", mode: "value" }],
                    wrapped: true,
                }
            }
        },
        {
            name: "float",
            node: {
                type: 'custom',
                data: {
                    category: "Constant",
                    label: "Float",
                    headerColor: "#0891B2",
                    outputs: [{ id: "value", label: "value", type: "float", mode: "value" }],
                    wrapped: true,
                }
            }
        }
    ];

    // Retourne le menu au format attendu par Graph (tableau de groupes)
    return [constants, menuItems];
};

const typeParser = (value: any): string => {
    if (value == "bool") return "boolean";
    if (value == "int") return "integer";
    return value;
}

const generateComponentMenuNodes = () => {
    const menuItems: Record<string, any> = {};

    menuItems["boolean"] = {
        type: 'custom',
        data: {
            category: "Constant",
            label: "Boolean",
            headerColor: "#D97706",
            outputs: [{ id: "value", label: "value", type: "boolean", mode: "value" }],
            inputs: [{ id: "value", label: "value", type: "boolean", mode: "value", value: false }],
            wrapped: true,
        }
    };
    menuItems["integer"] = {
        type: 'custom',
        data: {
            category: "Constant",
            label: "Integer",
            headerColor: "#059669",
            outputs: [{ id: "value", label: "value", type: "integer", mode: "value" }],
            inputs: [{ id: "value", label: "value", type: "integer", mode: "value", value: 0 }],
            wrapped: true,
        }
    };
    menuItems["float"] = {
        type: 'custom',
        data: {
            category: "Constant",
            label: "Float",
            headerColor: "#0891B2",
            outputs: [{ id: "value", label: "value", type: "float", mode: "value" }],
            inputs: [{ id: "value", label: "value", type: "float", mode: "value", value: 0.0 }],
            wrapped: true,
        }
    };

    Object.entries(minecraftComponents).forEach(([key, component]) => (

        menuItems[key.toLocaleLowerCase()] = {
            type: 'custom',
            data: {
                label: key.toLowerCase(),
                headerColor: "#7A52CC",
                outputs: [{ id: "component", label: "component", type: "component", mode: "value" }],
                inputs: component.inputs.map((input: any) => ({
                    id: input.name,
                    label: input.name,
                    type: typeParser(input.type),
                    mode: "value",
                    value: input.default
                })),
                wrapped: true,
            }
        }));

    // Retourne le menu au format attendu par Graph (tableau de groupes)
    return menuItems;
};

function getType(value: any): string {
    if (typeof value === 'number') return "float";
    return typeof value;
}

function ComponentGroupsGraph({ componentGroupsData, setComponentGroupsData }: { componentGroupsData: ComponentGroupsData, setComponentGroupsData: (data: ComponentGroupsData) => void }) {

    const [componentGroupsNames, setComponentGroupsNames] = useState<{ [key: string]: string }>({});
    const [data, setData] = useState<ComponentGroupsData>(componentGroupsData);
    const [graphNodes, setGraphNodes] = useState<CustomNodeType[]>([]);
    const [graphConnections, setGraphConnections] = useState<Edge[]>([]);

    // Refs pour garder l'état le plus récent du graphe depuis les callbacks de Graph
    const latestNodesRef = useRef<CustomNodeType[]>([]);
    const latestEdgesRef = useRef<Edge[]>([]);

    const genId = () => Date.now().toString() + Math.random().toString(36).substring(2);

    const updateGraphFromData = (newData: ComponentGroupsData) => {
        const existingNodes = latestNodesRef.current;
        const existingEdges = latestEdgesRef.current;

        // Lookup des nodes existants par groupKey / componentKey
        const existingGroupNodes: Record<string, CustomNodeType> = {};
        const existingCompNodes: Record<string, CustomNodeType> = {};
        const existingCompByLabel: Record<string, CustomNodeType[]> = {};
        const handledNodeIds = new Set<string>();

        existingNodes.forEach(n => {
            if (n.data.groupKey) {
                existingGroupNodes[n.data.groupKey] = n;
            }
            if (n.data.componentKey && n.data.parentGroupKey) {
                existingCompNodes[`${n.data.parentGroupKey}:${n.data.componentKey}`] = n;
            }
            // indexer par label pour réutiliser les nodes ajoutés manuellement
            if (n.data.outputs && n.data.outputs.some((o: any) => o.type === 'component')) {
                const label = n.data.label;
                if (!existingCompByLabel[label]) existingCompByLabel[label] = [];
                existingCompByLabel[label].push(n);
            }

        });

        const newNodes: CustomNodeType[] = [];
        const newEdges: Edge[] = [];

        let totalOffsetY = 0;

        Object.entries(newData).forEach(([key, grp]: [string, any]) => {
            const existing = existingGroupNodes[key];
            const groupId = existing?.id || genId();
            handledNodeIds.add(groupId);

            newNodes.push({
                id: groupId,
                position: existing?.position || { x: 100, y: totalOffsetY },
                type: 'custom',
                data: {
                    label: componentGroupsNames[key] || formatCOmponentGroupName(key),
                    headerColor: "#CC5252",
                    groupKey: key,
                    inputs: [{ id: "components", label: "components", type: "component", mode: "value" }],
                    deletable: false,
                }
            });

            Object.keys(grp).forEach((compKey: string, idx: number) => {
                const compLookup = `${key}:${compKey}`;
                let existingComp = existingCompNodes[compLookup];
                // si pas trouvé, tenter de réutiliser un node existant portant le même label non assigné
                if (!existingComp) {
                    const candidates = existingCompByLabel[compKey] || [];
                    // choisir un candidat qui n'a pas déjà parentGroupKey ou qui appartient à même groupe
                    existingComp = candidates.find(c => !c.data.parentGroupKey || c.data.parentGroupKey === key) as any;
                }
                const compId = existingComp?.id || genId();
                handledNodeIds.add(compId);

                newNodes.push({
                    id: compId,
                    position: existingComp?.position || { x: -100, y: totalOffsetY + idx * 75 },
                    type: 'custom',
                    data: {
                        label: compKey,
                        headerColor: "#7A52CC",
                        componentKey: compKey,
                        parentGroupKey: key,
                        outputs: [{ id: "component", label: "component", type: "component", mode: "value" }],
                        inputs: minecraftComponents[compKey].inputs.map((input: any) => ({
                            id: input.name,
                            label: input.name,
                            type: typeParser(input.type),
                            mode: "value",
                            value: existingComp?.data.inputs?.find((i: SocketData) => i.id === input.name)?.value ?? grp[compKey][input.name]
                        })),
                        wrapped: true,
                    }
                });

                newEdges.push({
                    id: `e:${groupId}:${compId}`,
                    source: compId,
                    target: groupId,
                    sourceHandle: "component",
                    targetHandle: "components",
                    deletable: false,
                });
            });

            totalOffsetY += Object.keys(grp).length * 75 + 50;
        });

        // Préserver les nodes standalone (constants, etc.)
        existingNodes.forEach(n => {
            if (!handledNodeIds.has(n.id) && !n.data.groupKey && !n.data.componentKey) {
                newNodes.push(n);
            }
        });

        // Préserver les edges des nodes standalone
        const newNodeIds = new Set(newNodes.map(n => n.id));
        const newEdgeIds = new Set(newEdges.map(e => e.id));
        existingEdges.forEach(e => {
            if (!newEdgeIds.has(e.id) && newNodeIds.has(e.source) && newNodeIds.has(e.target)) {
                newEdges.push(e);
            }
        });

        setGraphNodes(newNodes);
        setGraphConnections(newEdges);
    };

    useEffect(() => {
        updateGraphFromData(componentGroupsData);
    }, []);

    useEffect(() => {
        setComponentGroupsData(data);
    }, [data]);

    // Génère le menu une seule fois
    const componentMenu = useMemo(() => generateComponentMenu(), []);
    const componentMenuNodes = useMemo(() => generateComponentMenuNodes(), []);

    const updateDataFromGraph = (nodes: CustomNodeType[], edges: Edge[]) => {
        const newData: ComponentGroupsData = {};

        // Identifier les group nodes via groupKey
        nodes.forEach(node => {
            if (node.data.groupKey) {
                newData[node.data.groupKey] = {};
            }
        });

        // Reconstruire les relations composant→groupe depuis les edges
        edges.forEach(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (sourceNode && targetNode && edge.sourceHandle === "component" && edge.targetHandle === "components") {
                const groupKey = targetNode.data.groupKey || targetNode.data.label;
                const componentKey = sourceNode.data.componentKey || sourceNode.data.label;

                if (!newData[groupKey]) return;

                // Construire les valeurs d'inputs en prenant en compte les constant nodes connectés
                const inputValues: Record<string, any> = {};
                sourceNode.data?.inputs?.forEach((input: SocketData) => {
                    // Vérifier si cet input a un constant node connecté
                    const constEdge = edges.find(e => e.target === sourceNode.id && e.targetHandle === input.id);
                    if (constEdge) {
                        const constNode = nodes.find(n => n.id === constEdge.source);
                        if (constNode && !constNode.data.groupKey && !constNode.data.componentKey) {
                            const constInput = constNode.data.inputs?.find((i: SocketData) => i.id === "value");
                            if (constInput !== undefined && constInput.value !== undefined) {
                                inputValues[input.id] = constInput.value;
                                return;
                            }
                        }
                    }
                    inputValues[input.id] = input.value;
                });

                newData[groupKey][componentKey] = inputValues;
            }
        });

        setData(newData);
    };

    const updateDataFromUI = (newData: ComponentGroupsData) => {
        setData(newData);
        updateGraphFromData(newData);
    };

    const updateNodes = (nodes: CustomNodeType[]) => {
        latestNodesRef.current = nodes;
        updateDataFromGraph(nodes, latestEdgesRef.current);
    };

    const updateEdges = (edges: Edge[]) => {
        latestEdgesRef.current = edges;
        updateDataFromGraph(latestNodesRef.current, edges);
    };

    // Désactiver la validation de connexion stricte (parent/cycle) pour permettre
    // de connecter un même composant à plusieurs groupes
    const customIsValidConnection = useCallback(() => true, []);

    return (<>
        <Graph initialNodes={graphNodes} initialEdges={graphConnections} menuItems={componentMenu} nodes_={componentMenuNodes} onEdgesUpdate={updateEdges} onNodesUpdate={updateNodes} customIsValidConnection={customIsValidConnection}></Graph>

        {/* Sidebar: Liste des events/groups */}
        <div className="w-64 bg-neutral-800 border-l border-neutral-700 overflow-y-auto p-2">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between ">Component Groups <Plus className="w-4 h-4 font-bold" onClick={(e) => {
                e.stopPropagation();

                const next = { ...data };
                let keyIdx = 1;
                while (next.hasOwnProperty("new_component_group_" + keyIdx)) { keyIdx++; }
                next[("new_component_group_" + keyIdx)] = {};

                updateDataFromUI(next);
            }}></Plus></div>

            <div className="flex flex-col gap-2">
                {
                    Object.keys(data).map((componentGroupsKey: string) => {

                        return (
                            <div className="bg-neutral-700 rounded px-2 pb-2 text-sm pt-1 flex items-center" key={componentGroupsKey}>
                                <input className="text-sm text-neutral-400 focus:outline-none w-full" spellCheck={false} value={componentGroupsNames[componentGroupsKey] || componentGroupsKey} onChange={(event) => {
                                    const newName = event.target.value;
                                    setComponentGroupsNames(prev => ({
                                        ...prev,
                                        [componentGroupsKey]: newName,
                                    }));

                                    // Mettre à jour le label du node dans le graphe en temps réel
                                    const updatedNodes = latestNodesRef.current.map(n => {
                                        if (n.data.groupKey === componentGroupsKey) {
                                            return { ...n, data: { ...n.data, label: newName } };
                                        }
                                        return n;
                                    });
                                    setGraphNodes(updatedNodes);
                                }}

                                    onBlur={() => {
                                        const newKey = componentGroupsNames[componentGroupsKey] || componentGroupsKey;
                                        setComponentGroupsNames(prev => {
                                            const next = { ...prev };
                                            delete next[componentGroupsKey];
                                            return next;
                                        });

                                        if (newKey === componentGroupsKey) return;

                                        let next = { ...data };
                                        if (next[componentGroupsKey] === undefined) return;

                                        const replaceKeyPreserveOrder = (obj: Record<string, any>, oldK: string, newK: string) => {
                                            if (!Object.prototype.hasOwnProperty.call(obj, oldK)) return obj;
                                            const entries = Object.entries(obj);
                                            const newEntries = entries.map(([k, v]) => k === oldK ? [newK, v] : [k, v]);
                                            const res: Record<string, any> = {};
                                            newEntries.forEach(([k, v]) => { res[k] = v; });
                                            return res;
                                        };

                                        next = replaceKeyPreserveOrder(next, componentGroupsKey, newKey);

                                        // Mettre à jour les groupKey/parentGroupKey dans les refs avant de régénérer
                                        latestNodesRef.current = latestNodesRef.current.map(n => {
                                            if (n.data.groupKey === componentGroupsKey) {
                                                return { ...n, data: { ...n.data, groupKey: newKey, label: newKey } };
                                            }
                                            if (n.data.parentGroupKey === componentGroupsKey) {
                                                return { ...n, data: { ...n.data, parentGroupKey: newKey } };
                                            }
                                            return n;
                                        });

                                        updateDataFromUI(next);
                                    }}

                                />

                                <Trash2 className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-red-500 transition-colors" onClick={() => {
                                    setComponentGroupsNames(prev => {
                                        const next = { ...prev };
                                        delete next[componentGroupsKey];
                                        return next;
                                    });

                                    const next = { ...data };
                                    delete next[componentGroupsKey];
                                    updateDataFromUI(next);

                                }}></Trash2>

                            </div>
                        )
                    })
                }
            </div>
        </div>
    </>)
}

export default ComponentGroupsGraph;