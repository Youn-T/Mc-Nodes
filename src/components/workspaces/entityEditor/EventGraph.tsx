import Graph from "../../graphs/Graph"
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CustomNodeType, SocketData } from "../../CustomNode";
import { Edge } from "@xyflow/react";
import { EventData } from "../EntityEditor";
import { SocketMode, SocketType } from "../../../types/nodes";

// ── Helpers ──────────────────────────────────────────────────────────────────

const genId = () => Date.now().toString() + Math.random().toString(36).substring(2);

function parseValue(value: string): any {
    if (value === "true") return true;
    if (value === "false") return false;
    const num = Number(value);
    if (!isNaN(num) && value.trim() !== "") return num;
    return value;
}

// ── Couleurs par type d'action ───────────────────────────────────────────────

const ACTION_COLORS: Record<string, string> = {
    event: "#CC5252",
    set_property: "#D97706",
    add_component_group: "#059669",
    remove_component_group: "#DC2626",
    trigger: "#2563EB",
    stop_movement: "#6B7280",
    play_sound: "#CA8A04",
    set_home_position: "#6B7280",
    sequence: "#7C3AED",
    randomize: "#9333EA",
    filter: "#0891B2",
};

// ── Génération du menu contextuel ────────────────────────────────────────────

const generateEventMenu = (componentGroups: string[], eventNames: string[]) => {
    const actions = [
        {
            name: "add component group",
            node: {
                type: 'custom',
                data: {
                    category: "add_component_group",
                    label: "Add Component Group",
                    headerColor: ACTION_COLORS.add_component_group,
                    inputs: [
                        { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                        { id: "component_group", label: "component group", type: SocketType.STRING, mode: SocketMode.VALUE, value: componentGroups[0] || "", options: componentGroups }
                    ],
                    outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    wrapped: true,
                }
            }
        },
        {
            name: "remove component group",
            node: {
                type: 'custom',
                data: {
                    category: "remove_component_group",
                    label: "Remove Component Group",
                    headerColor: ACTION_COLORS.remove_component_group,
                    inputs: [
                        { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                        { id: "component_group", label: "component group", type: SocketType.STRING, mode: SocketMode.VALUE, value: componentGroups[0] || "", options: componentGroups }
                    ],
                    outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    wrapped: true,
                }
            }
        },
        {
            name: "set property",
            node: {
                type: 'custom',
                data: {
                    category: "set_property",
                    label: "Set Property",
                    headerColor: ACTION_COLORS.set_property,
                    inputs: [
                        { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                        { id: "property_name", label: "property", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" },
                        { id: "property_value", label: "value", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" }
                    ],
                    outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    wrapped: true,
                }
            }
        },
        {
            name: "trigger event",
            node: {
                type: 'custom',
                data: {
                    category: "trigger",
                    label: "Trigger Event",
                    headerColor: ACTION_COLORS.trigger,
                    inputs: [
                        { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                        { id: "event", label: "event", type: SocketType.STRING, mode: SocketMode.VALUE, value: "", options: eventNames }
                    ],
                    outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    wrapped: true,
                }
            }
        },
        {
            name: "stop movement",
            node: {
                type: 'custom',
                data: {
                    category: "stop_movement",
                    label: "Stop Movement",
                    headerColor: ACTION_COLORS.stop_movement,
                    inputs: [{ id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    wrapped: true,
                }
            }
        },
        {
            name: "play sound",
            node: {
                type: 'custom',
                data: {
                    category: "play_sound",
                    label: "Play Sound",
                    headerColor: ACTION_COLORS.play_sound,
                    inputs: [
                        { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                        { id: "sound", label: "sound", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" }
                    ],
                    outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    wrapped: true,
                }
            }
        },
        {
            name: "set home position",
            node: {
                type: 'custom',
                data: {
                    category: "set_home_position",
                    label: "Set Home Position",
                    headerColor: ACTION_COLORS.set_home_position,
                    inputs: [{ id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    wrapped: true,
                }
            }
        },
    ];

    const flow = [
        {
            name: "sequence",
            node: {
                type: 'custom',
                data: {
                    category: "sequence",
                    label: "Sequence",
                    headerColor: ACTION_COLORS.sequence,
                    inputs: [{ id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    outputs: [
                        { id: "step_0", label: "step 1", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                        { id: "step_1", label: "step 2", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                    ],
                    wrapped: true,
                }
            }
        },
        {
            name: "randomize",
            node: {
                type: 'custom',
                data: {
                    category: "randomize",
                    label: "Randomize",
                    headerColor: ACTION_COLORS.randomize,
                    inputs: [
                        { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                        { id: "weight_0", label: "weight 1", type: SocketType.INT, mode: SocketMode.VALUE, value: "1" },
                        { id: "weight_1", label: "weight 2", type: SocketType.INT, mode: SocketMode.VALUE, value: "1" },
                    ],
                    outputs: [
                        { id: "option_0", label: "option 1", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                        { id: "option_1", label: "option 2", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                    ],
                    wrapped: true,
                }
            }
        },
        {
            name: "filter",
            node: {
                type: 'custom',
                data: {
                    category: "filter",
                    label: "Filter",
                    headerColor: ACTION_COLORS.filter,
                    inputs: [
                        { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                        { id: "test", label: "test", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" },
                        { id: "subject", label: "subject", type: SocketType.STRING, mode: SocketMode.VALUE, value: "self" },
                        { id: "operator", label: "operator", type: SocketType.STRING, mode: SocketMode.VALUE, value: "equals" },
                        { id: "filter_value", label: "value", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" }
                    ],
                    outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    wrapped: true,
                }
            }
        },
    ];

    return [actions, flow];
};

const generateEventMenuNodes = (componentGroups: string[], eventNames: string[]) => {
    const menuItems: Record<string, any> = {};

    menuItems["add component group"] = {
        type: 'custom',
        data: {
            category: "add_component_group",
            label: "Add Component Group",
            headerColor: ACTION_COLORS.add_component_group,
            inputs: [
                { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "component_group", label: "component group", type: SocketType.STRING, mode: SocketMode.VALUE, value: componentGroups[0] || "", options: componentGroups }
            ],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            wrapped: true,
        }
    };

    menuItems["remove component group"] = {
        type: 'custom',
        data: {
            category: "remove_component_group",
            label: "Remove Component Group",
            headerColor: ACTION_COLORS.remove_component_group,
            inputs: [
                { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "component_group", label: "component group", type: SocketType.STRING, mode: SocketMode.VALUE, value: componentGroups[0] || "", options: componentGroups }
            ],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            wrapped: true,
        }
    };

    menuItems["set property"] = {
        type: 'custom',
        data: {
            category: "set_property",
            label: "Set Property",
            headerColor: ACTION_COLORS.set_property,
            inputs: [
                { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "property_name", label: "property", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" },
                { id: "property_value", label: "value", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" }
            ],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            wrapped: true,
        }
    };

    menuItems["trigger event"] = {
        type: 'custom',
        data: {
            category: "trigger",
            label: "Trigger Event",
            headerColor: ACTION_COLORS.trigger,
            inputs: [
                { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "event", label: "event", type: SocketType.STRING, mode: SocketMode.VALUE, value: "", options: eventNames }
            ],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            wrapped: true,
        }
    };

    menuItems["stop movement"] = {
        type: 'custom',
        data: {
            category: "stop_movement",
            label: "Stop Movement",
            headerColor: ACTION_COLORS.stop_movement,
            inputs: [{ id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            wrapped: true,
        }
    };

    menuItems["play sound"] = {
        type: 'custom',
        data: {
            category: "play_sound",
            label: "Play Sound",
            headerColor: ACTION_COLORS.play_sound,
            inputs: [
                { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "sound", label: "sound", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" }
            ],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            wrapped: true,
        }
    };

    menuItems["set home position"] = {
        type: 'custom',
        data: {
            category: "set_home_position",
            label: "Set Home Position",
            headerColor: ACTION_COLORS.set_home_position,
            inputs: [{ id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            wrapped: true,
        }
    };

    menuItems["sequence"] = {
        type: 'custom',
        data: {
            category: "sequence",
            label: "Sequence",
            headerColor: ACTION_COLORS.sequence,
            inputs: [{ id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            outputs: [
                { id: "step_0", label: "step 1", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "step_1", label: "step 2", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
            ],
            wrapped: true,
        }
    };

    menuItems["randomize"] = {
        type: 'custom',
        data: {
            category: "randomize",
            label: "Randomize",
            headerColor: ACTION_COLORS.randomize,
            inputs: [
                { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "weight_0", label: "weight 1", type: SocketType.INT, mode: SocketMode.VALUE, value: "1" },
                { id: "weight_1", label: "weight 2", type: SocketType.INT, mode: SocketMode.VALUE, value: "1" },
            ],
            outputs: [
                { id: "option_0", label: "option 1", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "option_1", label: "option 2", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
            ],
            wrapped: true,
        }
    };

    menuItems["filter"] = {
        type: 'custom',
        data: {
            category: "filter",
            label: "Filter",
            headerColor: ACTION_COLORS.filter,
            inputs: [
                { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "test", label: "test", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" },
                { id: "subject", label: "subject", type: SocketType.STRING, mode: SocketMode.VALUE, value: "self" },
                { id: "operator", label: "operator", type: SocketType.STRING, mode: SocketMode.VALUE, value: "equals" },
                { id: "filter_value", label: "value", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" }
            ],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            wrapped: true,
        }
    };

    return menuItems;
};

// ── Construction du graphe depuis les données (trigger chain) ────────────────

function createChainFromData(
    actionData: Record<string, any>,
    sourceNodeId: string,
    sourceHandleId: string,
    parentKey: string,
    xStart: number,
    yStart: number,
    existingNodes: CustomNodeType[],
    existingEdges: Edge[],
    componentGroups: string[],
    allEventKeys: string[]
): { nodes: CustomNodeType[], edges: Edge[], nextX: number, maxY: number } {
    const nodes: CustomNodeType[] = [];
    const edges: Edge[] = [];
    let currentX = xStart;
    let currentSourceId = sourceNodeId;
    let currentSourceHandle = sourceHandleId;
    let maxY = yStart;

    // Ajoute un node dans la chaîne et met à jour le chaînage
    const addChainNode = (key: string, nodeData: any) => {
        // Prefer reuse by componentKey, otherwise reuse a node already connected from current source with same category
        let existing = existingNodes.find(n => n.data.componentKey === key);
        if (!existing) {
            existing = existingNodes.find(n =>
                n.data.category === nodeData.category &&
                existingEdges.some(e => e.source === currentSourceId && e.target === n.id)
            );
        }

        const nodeId = existing?.id || genId();

        // If node doesn't already exist in our new list, add it
        if (!nodes.find(n => n.id === nodeId)) {
            nodes.push({
                id: nodeId,
                position: existing?.position || { x: currentX, y: yStart },
                type: 'custom',
                data: {
                    ...nodeData,
                    parentGroupKey: parentKey,
                    componentKey: key,
                    wrapped: true,
                }
            });
        }

        // Avoid duplicate edges: check existingEdges and new edges
        const alreadyConnected = existingEdges.some(e => e.source === currentSourceId && e.target === nodeId && e.sourceHandle === currentSourceHandle && e.targetHandle === 'trigger')
            || edges.some(e => e.source === currentSourceId && e.target === nodeId && e.sourceHandle === currentSourceHandle && e.targetHandle === 'trigger');

        if (!alreadyConnected) {
            edges.push({
                id: `e:${currentSourceId}:${currentSourceHandle}:${nodeId}`,
                source: currentSourceId,
                sourceHandle: currentSourceHandle,
                target: nodeId,
                targetHandle: "trigger",
            });
        }

        // If we reused an existing node with a fixed position, move currentX after it to keep spacing
        if (existing && existing.position && typeof existing.position.x === 'number') {
            currentX = existing.position.x + 250;
        } else {
            currentX += 250;
        }

        currentSourceId = nodeId;
        currentSourceHandle = "trigger_out";
    };

    // Filtre au niveau racine → premier dans la chaîne
    if (actionData.filters) {
        addChainNode(`${parentKey}:filter`, {
            label: "Filter",
            category: "filter",
            headerColor: ACTION_COLORS.filter,
            inputs: [
                { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "test", label: "test", type: SocketType.STRING, mode: SocketMode.VALUE, value: actionData.filters.test || "" },
                { id: "subject", label: "subject", type: SocketType.STRING, mode: SocketMode.VALUE, value: actionData.filters.subject || "self" },
                { id: "operator", label: "operator", type: SocketType.STRING, mode: SocketMode.VALUE, value: actionData.filters.operator || "equals" },
                { id: "filter_value", label: "value", type: SocketType.STRING, mode: SocketMode.VALUE, value: String(actionData.filters.value ?? "") },
            ],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
        });
    }

    // Actions plates — chaînées en séquence
    if (actionData.set_property) {
        Object.entries(actionData.set_property).forEach(([propName, propValue]) => {
            addChainNode(`${parentKey}:set_property:${propName}`, {
                label: "Set Property",
                category: "set_property",
                headerColor: ACTION_COLORS.set_property,
                inputs: [
                    { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                    { id: "property_name", label: "property", type: SocketType.STRING, mode: SocketMode.VALUE, value: String(propName) },
                    { id: "property_value", label: "value", type: SocketType.STRING, mode: SocketMode.VALUE, value: String(propValue) },
                ],
                outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            });
        });
    }

    if (actionData.add?.component_groups) {
        (actionData.add.component_groups as string[]).forEach((cg: string) => {
            addChainNode(`${parentKey}:add_cg:${cg}`, {
                label: "Add Component Group",
                category: "add_component_group",
                headerColor: ACTION_COLORS.add_component_group,
                inputs: [
                    { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                    { id: "component_group", label: "component group", type: SocketType.STRING, mode: SocketMode.VALUE, value: cg, options: componentGroups },
                ],
                outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            });
        });
    }

    if (actionData.remove?.component_groups) {
        (actionData.remove.component_groups as string[]).forEach((cg: string) => {
            addChainNode(`${parentKey}:remove_cg:${cg}`, {
                label: "Remove Component Group",
                category: "remove_component_group",
                headerColor: ACTION_COLORS.remove_component_group,
                inputs: [
                    { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                    { id: "component_group", label: "component group", type: SocketType.STRING, mode: SocketMode.VALUE, value: cg, options: componentGroups },
                ],
                outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            });
        });
    }

    if (actionData.stop_movement !== undefined) {
        addChainNode(`${parentKey}:stop_movement`, {
            label: "Stop Movement",
            category: "stop_movement",
            headerColor: ACTION_COLORS.stop_movement,
            inputs: [{ id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
        });
    }

    if (actionData.play_sound) {
        addChainNode(`${parentKey}:play_sound:${actionData.play_sound.sound || ''}`, {
            label: "Play Sound",
            category: "play_sound",
            headerColor: ACTION_COLORS.play_sound,
            inputs: [
                { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "sound", label: "sound", type: SocketType.STRING, mode: SocketMode.VALUE, value: actionData.play_sound.sound || "" },
            ],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
        });
    }

    if (actionData.set_home_position !== undefined) {
        addChainNode(`${parentKey}:set_home_position`, {
            label: "Set Home Position",
            category: "set_home_position",
            headerColor: ACTION_COLORS.set_home_position,
            inputs: [{ id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
        });
    }

    if (actionData.trigger) {
        const triggerValue = typeof actionData.trigger === 'string' ? actionData.trigger : '';
        addChainNode(`${parentKey}:trigger:${triggerValue}`, {
            label: "Trigger Event",
            category: "trigger",
            headerColor: ACTION_COLORS.trigger,
            inputs: [
                { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                { id: "event", label: "event", type: SocketType.STRING, mode: SocketMode.VALUE, value: triggerValue, options: allEventKeys },
            ],
            outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
        });
    }

    // Sequence — node avec N sorties trigger pour chaque étape
    if (actionData.sequence) {
        const seqKey = `${parentKey}:sequence`;
        const existing = existingNodes.find(n => n.data.componentKey === seqKey);
        const seqNodeId = existing?.id || genId();
        const steps = actionData.sequence as any[];

        const stepOutputs: SocketData[] = steps.map((_: any, i: number) => ({
            id: `step_${i}`, label: `step ${i + 1}`, type: SocketType.TRIGGER, mode: SocketMode.TRIGGER
        }));
        // Un port de plus pour pouvoir ajouter une étape
        stepOutputs.push({ id: `step_${steps.length}`, label: `step ${steps.length + 1}`, type: SocketType.TRIGGER, mode: SocketMode.TRIGGER });

        nodes.push({
            id: seqNodeId,
            position: existing?.position || { x: currentX, y: yStart },
            type: 'custom',
            data: {
                label: "Sequence",
                category: "sequence",
                headerColor: ACTION_COLORS.sequence,
                parentGroupKey: parentKey,
                componentKey: seqKey,
                inputs: [{ id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                outputs: stepOutputs,
                wrapped: true,
            }
        });
        edges.push({
            id: `e:${currentSourceId}:${currentSourceHandle}:${seqNodeId}`,
            source: currentSourceId,
            sourceHandle: currentSourceHandle,
            target: seqNodeId,
            targetHandle: "trigger",
        });

        let branchY = yStart;
        steps.forEach((step: any, idx: number) => {
            const stepKey = `${seqKey}:step_${idx}`;
            const subResult = createChainFromData(
                step, seqNodeId, `step_${idx}`, stepKey,
                currentX + 250, branchY,
                existingNodes, existingEdges, componentGroups, allEventKeys
            );
            nodes.push(...subResult.nodes);
            edges.push(...subResult.edges);
            branchY = subResult.maxY + 100;
            maxY = Math.max(maxY, subResult.maxY);
        });
        maxY = Math.max(maxY, branchY);
    }

    // Randomize — node avec N sorties trigger + poids pour chaque option
    if (actionData.randomize) {
        const randKey = `${parentKey}:randomize`;
        const existing = existingNodes.find(n => n.data.componentKey === randKey);
        const randNodeId = existing?.id || genId();
        const options = actionData.randomize as any[];

        const optOutputs: SocketData[] = options.map((_: any, i: number) => ({
            id: `option_${i}`, label: `option ${i + 1}`, type: SocketType.TRIGGER, mode: SocketMode.TRIGGER
        }));
        // Un port de plus pour permettre d'ajouter une option
        optOutputs.push({ id: `option_${options.length}`, label: `option ${options.length + 1}`, type: SocketType.TRIGGER, mode: SocketMode.TRIGGER });

        const weightInputs: SocketData[] = options.map((opt: any, i: number) => ({
            id: `weight_${i}`, label: `weight ${i + 1}`, type: SocketType.INT, mode: SocketMode.VALUE, value: String(opt.weight ?? 1)
        }));
        // Poids pour le port supplémentaire
        weightInputs.push({ id: `weight_${options.length}`, label: `weight ${options.length + 1}`, type: SocketType.INT, mode: SocketMode.VALUE, value: "1" });

        nodes.push({
            id: randNodeId,
            position: existing?.position || { x: currentX, y: yStart },
            type: 'custom',
            data: {
                label: "Randomize",
                category: "randomize",
                headerColor: ACTION_COLORS.randomize,
                parentGroupKey: parentKey,
                componentKey: randKey,
                inputs: [
                    { id: "trigger", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER },
                    ...weightInputs,
                ],
                outputs: optOutputs,
                wrapped: true,
            }
        });
        edges.push({
            id: `e:${currentSourceId}:${currentSourceHandle}:${randNodeId}`,
            source: currentSourceId,
            sourceHandle: currentSourceHandle,
            target: randNodeId,
            targetHandle: "trigger",
        });

        let branchY = yStart;
        options.forEach((opt: any, idx: number) => {
            const optKey = `${randKey}:opt_${idx}`;
            const optWithoutWeight = { ...opt };
            delete optWithoutWeight.weight;

            const subResult = createChainFromData(
                optWithoutWeight, randNodeId, `option_${idx}`, optKey,
                currentX + 250, branchY,
                existingNodes, existingEdges, componentGroups, allEventKeys
            );
            nodes.push(...subResult.nodes);
            edges.push(...subResult.edges);
            branchY = subResult.maxY + 100;
            maxY = Math.max(maxY, subResult.maxY);
        });
        maxY = Math.max(maxY, branchY);
    }

    return { nodes, edges, nextX: currentX, maxY };
}

// ── Reconstruction des données depuis le graphe (parcours de la chaîne) ─────

function mergeActions(target: Record<string, any>, source: Record<string, any>) {
    for (const [key, value] of Object.entries(source)) {
        if (key === "add" && target.add) {
            target.add.component_groups.push(...(value.component_groups || []));
        } else if (key === "remove" && target.remove) {
            target.remove.component_groups.push(...(value.component_groups || []));
        } else if (key === "set_property" && target.set_property) {
            Object.assign(target.set_property, value);
        } else {
            target[key] = value;
        }
    }
}

function collectChainActions(
    sourceNodeId: string,
    sourceHandleId: string,
    nodes: CustomNodeType[],
    edges: Edge[]
): Record<string, any> {
    const result: Record<string, any> = {};

    // Trouver l'edge sortant depuis ce handle
    const outEdge = edges.find(e => e.source === sourceNodeId && e.sourceHandle === sourceHandleId);
    if (!outEdge) return result;

    const nextNode = nodes.find(n => n.id === outEdge.target);
    if (!nextNode) return result;

    switch (nextNode.data.category) {
        case "add_component_group": {
            if (!result.add) result.add = { component_groups: [] };
            const cg = nextNode.data.inputs?.find((i: SocketData) => i.id === "component_group")?.value as string || "";
            if (cg) result.add.component_groups.push(cg);
            break;
        }
        case "remove_component_group": {
            if (!result.remove) result.remove = { component_groups: [] };
            const cg = nextNode.data.inputs?.find((i: SocketData) => i.id === "component_group")?.value as string || "";
            if (cg) result.remove.component_groups.push(cg);
            break;
        }
        case "set_property": {
            if (!result.set_property) result.set_property = {};
            const name = nextNode.data.inputs?.find((i: SocketData) => i.id === "property_name")?.value as string || "";
            const value = nextNode.data.inputs?.find((i: SocketData) => i.id === "property_value")?.value as string || "";
            if (name) result.set_property[name] = parseValue(value);
            break;
        }
        case "trigger": {
            const event = nextNode.data.inputs?.find((i: SocketData) => i.id === "event")?.value as string || "";
            if (event) result.trigger = event;
            break;
        }
        case "stop_movement": {
            result.stop_movement = {};
            break;
        }
        case "play_sound": {
            const sound = nextNode.data.inputs?.find((i: SocketData) => i.id === "sound")?.value as string || "";
            result.play_sound = { sound };
            break;
        }
        case "set_home_position": {
            result.set_home_position = {};
            break;
        }
        case "filter": {
            result.filters = {
                test: nextNode.data.inputs?.find((i: SocketData) => i.id === "test")?.value || "",
                subject: nextNode.data.inputs?.find((i: SocketData) => i.id === "subject")?.value || "self",
                operator: nextNode.data.inputs?.find((i: SocketData) => i.id === "operator")?.value || "equals",
                value: parseValue(nextNode.data.inputs?.find((i: SocketData) => i.id === "filter_value")?.value as string || ""),
            };
            break;
        }
        case "sequence": {
            result.sequence = [];
            const stepOutputs = (nextNode.data.outputs || []).filter((o: SocketData) => o.id.startsWith("step_"));
            // Trier par index
            stepOutputs.sort((a: SocketData, b: SocketData) => {
                const idxA = parseInt(a.id.replace("step_", ""));
                const idxB = parseInt(b.id.replace("step_", ""));
                return idxA - idxB;
            });
            for (const stepOutput of stepOutputs) {
                const stepData = collectChainActions(nextNode.id, stepOutput.id, nodes, edges);
                if (Object.keys(stepData).length > 0) {
                    result.sequence.push(stepData);
                }
            }
            return result; // Sequence termine cette branche
        }
        case "randomize": {
            result.randomize = [];
            const optOutputs = (nextNode.data.outputs || []).filter((o: SocketData) => o.id.startsWith("option_"));
            optOutputs.sort((a: SocketData, b: SocketData) => {
                const idxA = parseInt(a.id.replace("option_", ""));
                const idxB = parseInt(b.id.replace("option_", ""));
                return idxA - idxB;
            });
            for (const optOutput of optOutputs) {
                const optData = collectChainActions(nextNode.id, optOutput.id, nodes, edges);
                if (Object.keys(optData).length > 0) {
                    const idx = optOutput.id.replace("option_", "");
                    const weight = nextNode.data.inputs?.find((i: SocketData) => i.id === `weight_${idx}`)?.value;
                    if (weight !== undefined && weight !== "") optData.weight = parseValue(weight as string);
                    result.randomize.push(optData);
                }
            }
            return result; // Randomize termine cette branche
        }
    }

    // Continuer la chaîne depuis trigger_out
    const continuation = collectChainActions(nextNode.id, "trigger_out", nodes, edges);
    mergeActions(result, continuation);

    return result;
}

// ── Composant EventGraph ─────────────────────────────────────────────────────

function EventGraph({ eventData, setEventData, componentGroups }: { eventData: EventData, setEventData: (data: EventData) => void, componentGroups: string[] }) {
    const [eventNames, setEventNames] = useState<{ [key: string]: string }>({});
    const [data, setData] = useState<EventData>(eventData);
    const [graphNodes, setGraphNodes] = useState<CustomNodeType[]>([]);
    const [graphConnections, setGraphConnections] = useState<Edge[]>([]);

    const latestNodesRef = useRef<CustomNodeType[]>([]);
    const latestEdgesRef = useRef<Edge[]>([]);
    const isAddingPortsRef = useRef(false);

    // ── updateGraphFromData ──────────────────────────────────────────────────

    const updateGraphFromData = (newData: EventData) => {
        const existingNodes = latestNodesRef.current;
        const existingEdges = latestEdgesRef.current;

        const newNodes: CustomNodeType[] = [];
        const newEdges: Edge[] = [];
        const handledNodeIds = new Set<string>();

        let totalOffsetY = 0;
        const allEventKeys = Object.keys(newData);

        Object.entries(newData).forEach(([eventKey, eventActions]) => {
            const existingEventNode = existingNodes.find(n => n.data.groupKey === eventKey);
            const eventNodeId = existingEventNode?.id || genId();
            handledNodeIds.add(eventNodeId);

            // Node d'event = point de départ avec un trigger de sortie
            newNodes.push({
                id: eventNodeId,
                position: existingEventNode?.position || { x: 0, y: totalOffsetY },
                type: 'custom',
                data: {
                    label: eventNames[eventKey] || eventKey,
                    headerColor: ACTION_COLORS.event,
                    groupKey: eventKey,
                    outputs: [{ id: "trigger_out", label: "trigger", type: SocketType.TRIGGER, mode: SocketMode.TRIGGER }],
                    deletable: false,
                }
            });

            // Créer la chaîne d'actions
            const result = createChainFromData(
                eventActions as any || {},
                eventNodeId,
                "trigger_out",
                eventKey,
                250,
                totalOffsetY,
                existingNodes,
                existingEdges,
                componentGroups,
                allEventKeys
            );

            result.nodes.forEach(n => {
                handledNodeIds.add(n.id);
                newNodes.push(n);
            });
            newEdges.push(...result.edges);

            totalOffsetY = result.maxY + 150;
        });

        // Préserver les nœuds standalone (ajoutés manuellement)
        existingNodes.forEach(n => {
            if (!handledNodeIds.has(n.id) && !n.data.groupKey && !n.data.componentKey) {
                newNodes.push(n);
            }
        });

        // Préserver les edges standalone
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

    // ── updateDataFromGraph ──────────────────────────────────────────────────

    const updateDataFromGraph = (nodes: CustomNodeType[], edges: Edge[]) => {
        const newData: EventData = {};

        nodes.forEach(node => {
            if (node.data.groupKey) {
                const eventActions = collectChainActions(node.id, "trigger_out", nodes, edges);
                newData[node.data.groupKey as string] = eventActions;
            }
        });

        setData(newData);
    };

    // ── Ports dynamiques pour Randomize et Sequence ──────────────────────────

    const ensureDynamicPorts = useCallback((currentNodes: CustomNodeType[], currentEdges: Edge[]) => {
        if (isAddingPortsRef.current) return;

        let needsUpdate = false;
        const updatedNodes = currentNodes.map(node => {
            if (node.data.category === "randomize") {
                const optOutputs = (node.data.outputs || []).filter((o: SocketData) => o.id.startsWith("option_"));
                const connectedOpts = optOutputs.filter((o: SocketData) =>
                    currentEdges.some(e => e.source === node.id && e.sourceHandle === o.id)
                );

                if (connectedOpts.length >= optOutputs.length && optOutputs.length > 0) {
                    needsUpdate = true;
                    const newIdx = optOutputs.length;
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            outputs: [
                                ...(node.data.outputs || []),
                                { id: `option_${newIdx}`, label: `option ${newIdx + 1}`, type: SocketType.TRIGGER, mode: SocketMode.TRIGGER } as SocketData
                            ],
                            inputs: [
                                ...(node.data.inputs || []),
                                { id: `weight_${newIdx}`, label: `weight ${newIdx + 1}`, type: SocketType.INT, mode: SocketMode.VALUE, value: "1" } as SocketData
                            ],
                        }
                    };
                }
            }

            if (node.data.category === "sequence") {
                const stepOutputs = (node.data.outputs || []).filter((o: SocketData) => o.id.startsWith("step_"));
                const connectedSteps = stepOutputs.filter((o: SocketData) =>
                    currentEdges.some(e => e.source === node.id && e.sourceHandle === o.id)
                );

                if (connectedSteps.length >= stepOutputs.length && stepOutputs.length > 0) {
                    needsUpdate = true;
                    const newIdx = stepOutputs.length;
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            outputs: [
                                ...(node.data.outputs || []),
                                { id: `step_${newIdx}`, label: `step ${newIdx + 1}`, type: SocketType.TRIGGER, mode: SocketMode.TRIGGER } as SocketData
                            ],
                        }
                    };
                }
            }

            return node;
        });

        if (needsUpdate) {
            isAddingPortsRef.current = true;
            latestNodesRef.current = updatedNodes;
            setGraphNodes(updatedNodes);
            setTimeout(() => { isAddingPortsRef.current = false; }, 100);
        }
    }, []);

    // ── Lifecycle ────────────────────────────────────────────────────────────

    useEffect(() => {
        updateGraphFromData(eventData);
    }, []);

    useEffect(() => {
        setEventData(data);
    }, [data]);

    const componentMenu = useMemo(() => generateEventMenu(componentGroups, Object.keys(data)), [componentGroups, data]);
    const componentMenuNodes = useMemo(() => generateEventMenuNodes(componentGroups, Object.keys(data)), [componentGroups, data]);

    const updateDataFromUI = (newData: EventData) => {
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
        ensureDynamicPorts(latestNodesRef.current, edges);
    };

    const customIsValidConnection = useCallback(() => true, []);

    return (<>
        <Graph initialNodes={graphNodes} initialEdges={graphConnections} menuItems={componentMenu} nodes_={componentMenuNodes} onEdgesUpdate={updateEdges} onNodesUpdate={updateNodes} customIsValidConnection={customIsValidConnection} />

        {/* Sidebar: Liste des events */}
        <div className="w-64 bg-neutral-800 border-l border-neutral-700 overflow-y-auto p-3 custom-scrollbar relative pt-0">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 sticky top-0 from-neutral-800 to-transparent via-neutral-800 pt-3 pb-2 bg-linear-to-b flex justify-between items-center">
                Events
                <Plus className="w-4 h-4 cursor-pointer hover:text-white" onClick={() => {
                    const next = { ...data };
                    let keyIdx = 1;
                    while (next.hasOwnProperty("new_event_" + keyIdx)) { keyIdx++; }
                    next["new_event_" + keyIdx] = {};
                    updateDataFromUI(next);
                }} />
            </div>
            <div className="flex flex-col gap-2">
                {
                    Object.keys(data).map((eventKey: string) => {
                        return (
                            <div className="bg-neutral-700 rounded px-2 pb-2 text-sm pt-1 flex items-center" key={eventKey}>
                                <input className="text-sm text-neutral-400 focus:outline-none w-full" spellCheck={false} value={eventNames[eventKey] || eventKey} onChange={(event) => {
                                    const newName = event.target.value;
                                    setEventNames(prev => ({
                                        ...prev,
                                        [eventKey]: newName,
                                    }));

                                    // Mettre à jour le label du node dans le graphe en temps réel
                                    const updatedNodes = latestNodesRef.current.map(n => {
                                        if (n.data.groupKey === eventKey) {
                                            return { ...n, data: { ...n.data, label: newName } };
                                        }
                                        return n;
                                    });
                                    setGraphNodes(updatedNodes);
                                }}

                                    onBlur={() => {
                                        const newKey = eventNames[eventKey] || eventKey;
                                        setEventNames(prev => {
                                            const next = { ...prev };
                                            delete next[eventKey];
                                            return next;
                                        });

                                        if (newKey === eventKey) return;

                                        let next = { ...data };
                                        if (next[eventKey] === undefined) return;

                                        const replaceKeyPreserveOrder = (obj: Record<string, any>, oldK: string, newK: string) => {
                                            if (!Object.prototype.hasOwnProperty.call(obj, oldK)) return obj;
                                            const entries = Object.entries(obj);
                                            const newEntries = entries.map(([k, v]) => k === oldK ? [newK, v] : [k, v]);
                                            const res: Record<string, any> = {};
                                            newEntries.forEach(([k, v]) => { res[k] = v; });
                                            return res;
                                        };

                                        next = replaceKeyPreserveOrder(next, eventKey, newKey);

                                        // Mettre à jour les keys dans les refs avant de régénérer
                                        latestNodesRef.current = latestNodesRef.current.map(n => {
                                            if (n.data.groupKey === eventKey) {
                                                return { ...n, data: { ...n.data, groupKey: newKey, label: newKey } };
                                            }
                                            if (n.data.parentGroupKey === eventKey) {
                                                return {
                                                    ...n,
                                                    data: {
                                                        ...n.data,
                                                        parentGroupKey: newKey,
                                                        componentKey: (n.data.componentKey as string)?.replace(eventKey, newKey)
                                                    }
                                                };
                                            }
                                            return n;
                                        });

                                        updateDataFromUI(next);
                                    }}

                                />

                                <Trash2 className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-red-500 transition-colors" onClick={() => {
                                    setEventNames(prev => {
                                        const next = { ...prev };
                                        delete next[eventKey];
                                        return next;
                                    });

                                    const next = { ...data };
                                    delete next[eventKey];
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

export default EventGraph;
