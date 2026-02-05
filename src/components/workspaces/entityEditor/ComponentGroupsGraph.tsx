import { Plus } from "lucide-react";
import Graph from "../../graphs/Graph"
import { useState, useEffect, useMemo } from "react";
import { minecraftComponents } from "../../../editors/entityEditor";

type ComponentGroupsData = Record<string, any>;

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

function ComponentGroupsGraph({ componentGroupsData }: { componentGroupsData: ComponentGroupsData }) {

    const [componentGroupsNames, setComponentGroupsNames] = useState<{ [key: string]: string }>({});

    const [data, setData] = useState<ComponentGroupsData>(componentGroupsData);

    const [graphNodes, setGraphNodes] = useState<any[]>([]);
    const [graphConnections, setGraphConnections] = useState<any[]>([]);


    useEffect(() => {
        console.log("componentGroupsData changed", componentGroupsData);
        const newNodes: any[] = [];
        const newConnections: any[] = [];
        let totalOffsetY = 0;
        Object.entries(data).forEach(([key, grp]: [string, any]) => {
            const index: number = Object.keys(data).indexOf(key);
            const groupId: string = Date.now().toString() + Math.random().toString(36).substring(2);
            newNodes.push({
                id: groupId,
                position: { x: 100, y: totalOffsetY },
                type: 'custom',
                data: {
                    label: componentGroupsNames[key] || formatCOmponentGroupName(key),
                    headerColor: "#CC5252",
                    inputs: [{ id: "components", label: "components", type: "component", mode: "value" }],
                    deletable: false, // Les nodes de component group ne peuvent pas être supprimés
                }
            });

            Object.keys(grp).forEach((componentKey: string, idx: number) => {
                newNodes.push({
                    id: groupId + "_" + componentKey,
                    position: { x: -100, y: totalOffsetY + idx * 75 },
                    type: 'custom',
                    data: {
                        label: componentKey,
                        headerColor: "#7A52CC",
                        outputs: [{ id: "component", label: "component", type: "component", mode: "value" }],
                        inputs: minecraftComponents[componentKey].inputs.map((input: any) => ({ //Object.keys(grp[componentKey])
                            id: input.name,
                            label: input.name,
                            type: typeParser(input.type),
                            mode: "value",
                            value: grp[componentKey][input.name]
                        })),
                        wrapped: true,
                    }
                });
                newConnections.push({
                    id: "e_" + groupId + "_" + componentKey,
                    source: groupId + "_" + componentKey,
                    target: groupId,
                    sourceHandle: "component",
                    targetHandle: "components",
                });
            });
            totalOffsetY += Object.keys(grp).length * 75 + 50; // Ajouter un espacement entre les groupes
        });
        console.log("newNodes", newNodes);
        setGraphNodes(newNodes);
        setGraphConnections(newConnections);
    }, [data, componentGroupsNames]);

    // useEffect(() => {
    //     const initial: { [key: string]: string } = {};
    //     console.log("initial", initial)
    //     Object.keys(componentGroupsData).forEach(k => {
    //         initial[k] = formatCOmponentGroupName(k);
    //     });
    //     setComponentGroupsNames(initial);
    // }, [componentGroupsData]);

    // Génère le menu une seule fois
    const componentMenu = useMemo(() => generateComponentMenu(), []);
    const componentMenuNodes = useMemo(() => generateComponentMenuNodes(), []);

    console.log("data", data);
    return (<>
        <Graph initialNodes={graphNodes} initialEdges={graphConnections} menuItems={componentMenu} nodes_={componentMenuNodes}></Graph>

        {/* Sidebar: Liste des events/groups */}
        <div className="w-64 bg-neutral-800 border-l border-neutral-700 overflow-y-auto p-2">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between ">Component Groups <Plus className="w-4 h-4 font-bold" onClick={(e) => {
                e.stopPropagation();
                console.trace()
                console.log('Adding new geometry entry');

                const next = { ...data };
                let keyIdx = 1;
                while (next.hasOwnProperty("new_component_group_" + keyIdx)) { keyIdx++; }
                console.log(next)
                next[("new_component_group_" + keyIdx)] = {};
                // while (next.description.geometry.hasOwnProperty("new_geometry_" + keyIdx)) { keyIdx++; }
                // console.log(next)
                // next.description.geometry["new_geometry_" + keyIdx] = modelGeometryOptions[0] || "geometry.unknown";
                // next.description.geometry["new_geometry_" + keyIdx] = ;

                setData(next);
                // setClientData(next);
            }}></Plus></div>
            {/* <div className="flex"><div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Component Groups</div> <Plus className="w-4 h-4 font-bold" onClick={(e) => {
                                    e.stopPropagation();
                                    console.trace()
                                    console.log('Adding new geometry entry');

                                    // const next = { ...clientData };
                                    let keyIdx = 1;
                                    // while (next.description.geometry.hasOwnProperty("new_geometry_" + keyIdx)) { keyIdx++; }
                                    // console.log(next)
                                    // next.description.geometry["new_geometry_" + keyIdx] = modelGeometryOptions[0] || "geometry.unknown";
                                    // next.description.geometry["new_geometry_" + keyIdx] = ;


                                    // setClientData(next);
                                }}></Plus></div> */}
            <div className="flex flex-col gap-2">
                {
                    Object.keys(data).map((componentGroupsKey: string) => {

                        return (
                            <div className="bg-neutral-700 rounded px-2 pb-2 text-sm pt-1" key={componentGroupsKey}>
                                <input className="text-sm text-neutral-400 focus:outline-none w-full" spellCheck={false} value={componentGroupsNames[componentGroupsKey] || componentGroupsKey} onChange={(event) => {
                                    const prevNames = { ...componentGroupsNames };
                                    prevNames[componentGroupsKey] = event.target.value;
                                    setComponentGroupsNames(prevNames);
                                }}

                                    onBlur={() => {
                                        const newKey = componentGroupsNames[componentGroupsKey] || componentGroupsKey;
                                        setComponentGroupsNames(prev => {
                                            const next = { ...prev };
                                            delete next[componentGroupsKey];
                                            return next;
                                        });
                                        setData((prev: any) => {
                                            let next = { ...prev };
                                            if (next[componentGroupsKey] === undefined) return next;
                                            if (newKey === componentGroupsKey) return next;

                                            const replaceKeyPreserveOrder = (obj: Record<string, any>, oldK: string, newK: string) => {
                                                if (!Object.prototype.hasOwnProperty.call(obj, oldK)) return obj;
                                                const entries = Object.entries(obj);
                                                const newEntries = entries.map(([k, v]) => k === oldK ? [newK, v] : [k, v]);
                                                const res: Record<string, any> = {};
                                                newEntries.forEach(([k, v]) => { res[k] = v; });
                                                return res;
                                            };

                                            next = replaceKeyPreserveOrder(next, componentGroupsKey, newKey)
                                            return next;
                                        });
                                    }}

                                />



                            </div>
                        )
                    })
                }
            </div>
        </div>
    </>)
}

export default ComponentGroupsGraph;