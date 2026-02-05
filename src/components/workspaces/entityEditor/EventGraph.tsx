import Graph from "../../graphs/Graph"
import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";

type EventData = Record<string, Event>
type Event = Partial<Record<EventKeys, any[]>>
type EventKeys = 'randomize' | 'add' | 'remove' | 'sequence' | 'trigger';

function EventGraph({ eventData }: { eventData: EventData }) {
    const [eventNames, setEventNames] = useState<{ [key: string]: string }>({});
    const [data, setData] = useState<EventData>(eventData);
    const [graphNodes, setGraphNodes] = useState<any[]>([]);
    const [graphConnections, setGraphConnections] = useState<any[]>([]);

    useEffect(() => {
        const newNodes: any[] = [];
        const newConnections: any[] = [];
        let totalOffsetY = 0;

        Object.entries(data).forEach(([key, event]: [string, any]) => {
            const eventId: string = "event_" + key.replace(/[^a-zA-Z0-9]/g, "_");
            
            // Event Node (Trigger)
            newNodes.push({
                id: eventId,
                position: { x: 100, y: totalOffsetY },
                type: 'custom',
                data: {
                    label: eventNames[key] || key,
                    headerColor: "#CC5252", // Red for events
                    category: "Event",
                    outputs: [{ id: "trigger", label: "trigger", type: "trigger", mode: "trigger" }],
                    deletable: false,
                }
            });

            let actionOffsetY = totalOffsetY;
            let lastTriggerSource = { id: eventId, handle: "trigger" };

            // Helper to add action nodes
            const addActionNode = (type: string, label: string, color: string, content: any, parentId: string) => {
                const nodeId = parentId + "_" + type + "_" + Math.random().toString(36).substring(7);
                newNodes.push({
                    id: nodeId,
                    position: { x: 400, y: actionOffsetY },
                    type: 'custom',
                    data: {
                        label: label,
                        headerColor: color,
                        inputs: [
                            { id: "trigger", label: "trigger", type: "trigger", mode: "trigger" },
                            ...Object.keys(content).map(k => ({ id: k, label: k, value: content[k], mode: "value", type: "string" })) // Simplified
                        ],
                        outputs: [{ id: "trigger", label: "trigger", type: "trigger", mode: "trigger" }],
                    }
                });
                
                newConnections.push({
                    id: "e_" + lastTriggerSource.id + "_" + nodeId,
                    source: lastTriggerSource.id,
                    target: nodeId,
                    sourceHandle: lastTriggerSource.handle,
                    targetHandle: "trigger",
                });

                lastTriggerSource = { id: nodeId, handle: "trigger" };
                actionOffsetY += 100;
            };

            // Process 'add' component groups
            if (event.add?.component_groups) {
                event.add.component_groups.forEach((group: string) => {
                    addActionNode("add_group", "Add Group: " + group, "#52CC7A", { group }, eventId);
                });
            }

            // Process 'remove' component groups
            if (event.remove?.component_groups) {
                event.remove.component_groups.forEach((group: string) => {
                    addActionNode("remove_group", "Remove Group: " + group, "#CC5252", { group }, eventId);
                });
            }

             // Process 'trigger'
             if (event.trigger) {
                 const triggerEvent = typeof event.trigger === 'string' ? event.trigger : event.trigger.event;
                 addActionNode("trigger_event", "Trigger: " + triggerEvent, "#52A3CC", { event: triggerEvent }, eventId);
             }


            totalOffsetY = Math.max(actionOffsetY, totalOffsetY + 150);
        });

        setGraphNodes(newNodes);
        setGraphConnections(newConnections);
    }, [data, eventNames]);


    // Menu generation (simplified for now)
    const eventMenu = useMemo(() => [
        [{
            name: "Add Group",
            node: {
                type: 'custom',
                data: { label: "Add Component Group", headerColor: "#52CC7A", inputs: [{id:"trigger", mode:"trigger"}, {id:"group", label:"group", type:"string", mode:"value"}], outputs: [{id:"trigger", mode:"trigger"}] }
            }
        }],
        [{
            name: "Remove Group",
            node: {
                type: 'custom',
                data: { label: "Remove Component Group", headerColor: "#CC5252", inputs: [{id:"trigger", mode:"trigger"}, {id:"group", label:"group", type:"string", mode:"value"}], outputs: [{id:"trigger", mode:"trigger"}] }
            }
        }]
    ], []);

    const eventMenuNodes = useMemo(() => ({
        "Add Group": { type: 'custom', data: { label: "Add Component Group" } }, // Simplified
        "Remove Group": { type: 'custom', data: { label: "Remove Component Group" } }
    }), []);

    return (<>
        <Graph initialNodes={graphNodes} initialEdges={graphConnections} menuItems={eventMenu} nodes_={eventMenuNodes}></Graph>

        {/* Sidebar: Liste des events */}
        <div className="w-64 bg-neutral-800 border-l border-neutral-700 overflow-y-auto p-3 custom-scrollbar relative pt-0">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 sticky top-0 from-neutral-800 to-transparent via-neutral-800 pt-3 pb-2 bg-linear-to-b flex justify-between items-center">
                Events
                <Plus className="w-4 h-4 cursor-pointer hover:text-white" onClick={() => {
                     const next = { ...data };
                     let keyIdx = 1;
                     while (next.hasOwnProperty("new_event_" + keyIdx)) { keyIdx++; }
                     next["new_event_" + keyIdx] = {};
                     setData(next);
                }} />
            </div>
            <div className="flex flex-col gap-2">
                {
                    Object.entries(data || {}).map(([key, value]: [string, Event]) => {
                        return (
                            <div className="bg-neutral-700 rounded px-2 pb-2 text-sm pt-1" key={key}>
                                <input className="text-sm text-neutral-400 focus:outline-none bg-transparent w-full"
                                    value={eventNames[key] || key}
                                    spellCheck={false} 
                                    onChange={(e) => setEventNames(prev => ({ ...prev, [key]: e.target.value }))}
                                    onBlur={() => {
                                         const newKey = eventNames[key] || key;
                                         if (newKey !== key) {
                                             setData(prev => {
                                                 const next = { ...prev };
                                                 next[newKey] = next[key];
                                                 delete next[key];
                                                 return next;
                                             });
                                             setEventNames(prev => {
                                                 const next = { ...prev };
                                                 delete next[key];
                                                 return next;
                                             });
                                         }
                                    }}
                                />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    </>)
}

export default EventGraph;