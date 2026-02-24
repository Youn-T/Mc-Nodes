import Graph from "../../graphs/Graph"
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CustomNodeType, SocketData } from "../../CustomNode";
import { Edge } from "@xyflow/react";
import { SocketType, SocketMode } from "../../../types/nodes";

// ── Types ─────────────────────────────────────────────────────────────────────

type RenderControllerEntry = string | Record<string, string>;

// ── Helpers ──────────────────────────────────────────────────────────────────

const genId = () => Date.now().toString() + Math.random().toString(36).substring(2);

const formatRCName = (name: string) => {
    return name.replace(/controller\.render\./g, "").replace(/_/g, " ");
};

const getRCName = (rc: RenderControllerEntry): string => {
    return typeof rc === "string" ? rc : Object.keys(rc)[0];
};

const getRCCondition = (rc: RenderControllerEntry): string => {
    if (typeof rc === "string") return "";
    const name = Object.keys(rc)[0];
    return rc[name] || "";
};

// ── Couleurs ─────────────────────────────────────────────────────────────────

const MOLANG_COLORS: Record<string, string> = {
    output: "#CC5252",
    query: "#059669",
    expression: "#D97706",
    and: "#2563EB",
    or: "#7C3AED",
    not: "#DC2626",
    comparison: "#0891B2",
};

// ── Molang Query Definitions ─────────────────────────────────────────────────

interface QueryDef {
    name: string;       // function name: "is_baby"
    label: string;      // display: "Is Baby"
    group: string;      // menu group
    params?: { id: string; label: string; defaultValue: string }[];
}

const MOLANG_QUERIES: QueryDef[] = [
    // Boolean queries (no params)
    { name: "is_baby", label: "Is Baby", group: "Boolean" },
    { name: "is_sneaking", label: "Is Sneaking", group: "Boolean" },
    { name: "is_moving", label: "Is Moving", group: "Boolean" },
    { name: "is_swimming", label: "Is Swimming", group: "Boolean" },
    { name: "is_on_fire", label: "Is On Fire", group: "Boolean" },
    { name: "is_sleeping", label: "Is Sleeping", group: "Boolean" },
    { name: "is_riding", label: "Is Riding", group: "Boolean" },
    { name: "is_sprinting", label: "Is Sprinting", group: "Boolean" },
    { name: "is_jumping", label: "Is Jumping", group: "Boolean" },
    { name: "is_using_item", label: "Is Using Item", group: "Boolean" },
    { name: "is_charged", label: "Is Charged", group: "Boolean" },
    { name: "is_powered", label: "Is Powered", group: "Boolean" },
    { name: "is_tamed", label: "Is Tamed", group: "Boolean" },
    { name: "is_saddled", label: "Is Saddled", group: "Boolean" },
    { name: "is_sheared", label: "Is Sheared", group: "Boolean" },
    { name: "is_angry", label: "Is Angry", group: "Boolean" },
    { name: "is_in_water", label: "Is In Water", group: "Boolean" },
    { name: "is_in_lava", label: "Is In Lava", group: "Boolean" },
    { name: "has_target", label: "Has Target", group: "Boolean" },
    { name: "is_alive", label: "Is Alive", group: "Boolean" },
    { name: "is_in_contact_with_water", label: "Is In Contact With Water", group: "Boolean" },
    { name: "is_levitating", label: "Is Levitating", group: "Boolean" },
    { name: "is_on_ground", label: "Is On Ground", group: "Boolean" },
    // Value queries (no params, return number)
    { name: "variant", label: "Variant", group: "Value" },
    { name: "mark_variant", label: "Mark Variant", group: "Value" },
    { name: "skin_id", label: "Skin ID", group: "Value" },
    { name: "health", label: "Health", group: "Value" },
    { name: "max_health", label: "Max Health", group: "Value" },
    { name: "life_time", label: "Life Time", group: "Value" },
    { name: "modified_distance_moved", label: "Distance Moved", group: "Value" },
    { name: "ground_speed", label: "Ground Speed", group: "Value" },
    { name: "yaw_speed", label: "Yaw Speed", group: "Value" },
    { name: "body_x_rotation", label: "Body X Rotation", group: "Value" },
    { name: "body_y_rotation", label: "Body Y Rotation", group: "Value" },
    { name: "head_x_rotation", label: "Head X Rotation", group: "Value" },
    { name: "head_y_rotation", label: "Head Y Rotation", group: "Value" },
    // Parameterized queries
    { name: "property", label: "Property", group: "Param", params: [{ id: "identifier", label: "identifier", defaultValue: "" }] },
    { name: "has_property", label: "Has Property", group: "Param", params: [{ id: "identifier", label: "identifier", defaultValue: "" }] },
    { name: "has_component", label: "Has Component", group: "Param", params: [{ id: "component", label: "component", defaultValue: "" }] },
];

const buildQueryNodeData = (q: QueryDef) => ({
    type: 'custom' as const,
    data: {
        category: "molang_query",
        name: q.name,
        label: q.label,
        headerColor: MOLANG_COLORS.query,
        inputs: (q.params || []).map(p => ({
            id: p.id, label: p.label, type: "string", mode: "value", value: p.defaultValue
        })),
        outputs: [{ id: "molang", label: "molang", type: "string", mode: "value" }],
        wrapped: true,
    }
});

// ── Menu Generation ──────────────────────────────────────────────────────────

const generateRCMenu = () => {
    const booleanQueries = MOLANG_QUERIES.filter(q => q.group === "Boolean").map(q => ({
        name: q.label.toLowerCase(),
        node: buildQueryNodeData(q),
    }));
    const valueQueries = MOLANG_QUERIES.filter(q => q.group === "Value").map(q => ({
        name: q.label.toLowerCase(),
        node: buildQueryNodeData(q),
    }));
    const paramQueries = MOLANG_QUERIES.filter(q => q.group === "Param").map(q => ({
        name: q.label.toLowerCase(),
        node: buildQueryNodeData(q),
    }));

    const logicNodes = [
        {
            name: "expression",
            node: {
                type: 'custom',
                data: {
                    category: "molang_expression",
                    label: "Expression",
                    headerColor: MOLANG_COLORS.expression,
                    inputs: [
                        { id: "expression", label: "expression", type: "string", mode: "value", value: "" }
                    ],
                    outputs: [{ id: "molang", label: "molang", type: "string", mode: "value" }],
                    wrapped: true,
                }
            }
        },
        {
            name: "AND (&&)",
            node: {
                type: 'custom',
                data: {
                    category: "molang_and",
                    label: "AND (&&)",
                    headerColor: MOLANG_COLORS.and,
                    inputs: [
                        { id: "a", label: "A", type: "string", mode: "value", value: "" },
                        { id: "b", label: "B", type: "string", mode: "value", value: "" }
                    ],
                    outputs: [{ id: "molang", label: "molang", type: "string", mode: "value" }],
                    wrapped: true,
                }
            }
        },
        {
            name: "OR (||)",
            node: {
                type: 'custom',
                data: {
                    category: "molang_or",
                    label: "OR (||)",
                    headerColor: MOLANG_COLORS.or,
                    inputs: [
                        { id: "a", label: "A", type: "string", mode: "value", value: "" },
                        { id: "b", label: "B", type: "string", mode: "value", value: "" }
                    ],
                    outputs: [{ id: "molang", label: "molang", type: "string", mode: "value" }],
                    wrapped: true,
                }
            }
        },
        {
            name: "NOT (!)",
            node: {
                type: 'custom',
                data: {
                    category: "molang_not",
                    label: "NOT (!)",
                    headerColor: MOLANG_COLORS.not,
                    inputs: [
                        { id: "a", label: "input", type: "string", mode: "value", value: "" }
                    ],
                    outputs: [{ id: "molang", label: "molang", type: "string", mode: "value" }],
                    wrapped: true,
                }
            }
        },
        {
            name: "comparison",
            node: {
                type: 'custom',
                data: {
                    category: "molang_comparison",
                    label: "Comparison",
                    headerColor: MOLANG_COLORS.comparison,
                    inputs: [
                        { id: "left", label: "left", type: "string", mode: "value", value: "" },
                        { id: "operator", label: "operator", type: "string", mode: "value", value: "==", options: ["==", "!=", ">", "<", ">=", "<="] },
                        { id: "right", label: "right", type: "string", mode: "value", value: "" }
                    ],
                    outputs: [{ id: "molang", label: "molang", type: "string", mode: "value" }],
                    wrapped: true,
                }
            }
        },
    ];

    return [
        [
            {
                name: "Queries",
                options: [booleanQueries, valueQueries, paramQueries]
            }
        ],
        logicNodes
    ];
};

const generateRCMenuNodes = () => {
    const menuItems: Record<string, any> = {};

    // Generate one entry per query
    MOLANG_QUERIES.forEach(q => {
        menuItems[q.label.toLowerCase()] = buildQueryNodeData(q);
    });

    menuItems["expression"] = {
        type: 'custom',
        data: {
            category: "molang_expression",
            label: "Expression",
            headerColor: MOLANG_COLORS.expression,
            inputs: [
                { id: "expression", label: "expression", type: "string", mode: "value", value: "" }
            ],
            outputs: [{ id: "molang", label: "molang", type: "string", mode: "value" }],
            wrapped: true,
        }
    };

    menuItems["and (&&)"] = {
        type: 'custom',
        data: {
            category: "molang_and",
            label: "AND (&&)",
            headerColor: MOLANG_COLORS.and,
            inputs: [
                { id: "a", label: "A", type: "string", mode: "value", value: "" },
                { id: "b", label: "B", type: "string", mode: "value", value: "" }
            ],
            outputs: [{ id: "molang", label: "molang", type: "string", mode: "value" }],
            wrapped: true,
        }
    };

    menuItems["or (||)"] = {
        type: 'custom',
        data: {
            category: "molang_or",
            label: "OR (||)",
            headerColor: MOLANG_COLORS.or,
            inputs: [
                { id: "a", label: "A", type: "string", mode: "value", value: "" },
                { id: "b", label: "B", type: "string", mode: "value", value: "" }
            ],
            outputs: [{ id: "molang", label: "molang", type: "string", mode: "value" }],
            wrapped: true,
        }
    };

    menuItems["not (!)"] = {
        type: 'custom',
        data: {
            category: "molang_not",
            label: "NOT (!)",
            headerColor: MOLANG_COLORS.not,
            inputs: [
                { id: "a", label: "input", type: "string", mode: "value", value: "" }
            ],
            outputs: [{ id: "molang", label: "molang", type: "string", mode: "value" }],
            wrapped: true,
        }
    };

    menuItems["comparison"] = {
        type: 'custom',
        data: {
            category: "molang_comparison",
            label: "Comparison",
            headerColor: MOLANG_COLORS.comparison,
            inputs: [
                { id: "left", label: "left", type: "string", mode: "value", value: "" },
                { id: "operator", label: "operator", type: "string", mode: "value", value: "==", options: ["==", "!=", ">", "<", ">=", "<="] },
                { id: "right", label: "right", type: "string", mode: "value", value: "" }
            ],
            outputs: [{ id: "molang", label: "molang", type: "string", mode: "value" }],
            wrapped: true,
        }
    };

    return menuItems;
};

// ── Molang Parsing (string → AST → nodes) ───────────────────────────────────

interface MolangAST {
    type: 'query' | 'expression' | 'and' | 'or' | 'not' | 'comparison';
    value?: string;
    operator?: string;
    children?: MolangAST[];
    params?: string[];
}

/** Split an expression by a separator, respecting parentheses depth */
function splitTopLevel(expr: string, separator: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';
    let i = 0;

    while (i < expr.length) {
        if (expr[i] === '(') {
            depth++;
            current += expr[i];
            i++;
        } else if (expr[i] === ')') {
            depth--;
            current += expr[i];
            i++;
        } else if (depth === 0 && expr.substring(i, i + separator.length) === separator) {
            parts.push(current.trim());
            current = '';
            i += separator.length;
        } else {
            current += expr[i];
            i++;
        }
    }

    if (current.trim()) parts.push(current.trim());
    return parts;
}

/** Parse a Molang expression string into an AST */
function parseMolangAST(expr: string): MolangAST {
    expr = expr.trim();
    if (!expr) return { type: 'expression', value: '' };

    // Remove wrapping parentheses if they enclose the entire expression
    if (expr.startsWith('(') && expr.endsWith(')')) {
        let depth = 0;
        let allWrapped = true;
        for (let i = 0; i < expr.length - 1; i++) {
            if (expr[i] === '(') depth++;
            if (expr[i] === ')') depth--;
            if (depth === 0 && i < expr.length - 1) {
                allWrapped = false;
                break;
            }
        }
        if (allWrapped) {
            return parseMolangAST(expr.substring(1, expr.length - 1));
        }
    }

    // Try to split by || (lowest precedence)
    const orParts = splitTopLevel(expr, '||');
    if (orParts.length > 1) {
        let result: MolangAST = parseMolangAST(orParts[0]);
        for (let i = 1; i < orParts.length; i++) {
            result = { type: 'or', children: [result, parseMolangAST(orParts[i])] };
        }
        return result;
    }

    // Try to split by &&
    const andParts = splitTopLevel(expr, '&&');
    if (andParts.length > 1) {
        let result: MolangAST = parseMolangAST(andParts[0]);
        for (let i = 1; i < andParts.length; i++) {
            result = { type: 'and', children: [result, parseMolangAST(andParts[i])] };
        }
        return result;
    }

    // Check for NOT
    if (expr.startsWith('!')) {
        return { type: 'not', children: [parseMolangAST(expr.substring(1))] };
    }

    // Check for comparison operators (order matters: >= before >, <= before <, != before ==)
    for (const op of ['!=', '>=', '<=', '==', '>', '<']) {
        const compParts = splitTopLevel(expr, op);
        if (compParts.length === 2) {
            return { type: 'comparison', operator: op, children: [parseMolangAST(compParts[0]), parseMolangAST(compParts[1])] };
        }
    }

    // Check for query (with optional parameters)
    if (expr.startsWith('query.') || expr.startsWith('q.')) {
        const parenIdx = expr.indexOf('(');
        if (parenIdx !== -1 && expr.endsWith(')')) {
            const queryBase = expr.substring(0, parenIdx);
            const paramsStr = expr.substring(parenIdx + 1, expr.length - 1);
            const params = paramsStr.split(',').map(s => s.trim());
            return { type: 'query', value: queryBase, params };
        }
        return { type: 'query', value: expr };
    }

    // Fallback: raw expression
    return { type: 'expression', value: expr };
}

/** Convert a Molang AST into graph nodes and edges, connecting to a target node input */
function astToNodes(
    ast: MolangAST,
    targetNodeId: string,
    targetHandle: string,
    x: number,
    y: number,
): { nodes: CustomNodeType[], edges: Edge[] } {
    const nodes: CustomNodeType[] = [];
    const edges: Edge[] = [];
    const nodeId = genId();

    switch (ast.type) {
        case 'query': {
            const queryStr = ast.value || '';
            const queryName = queryStr.replace(/^query\./, '').replace(/^q\./, '');
            const queryDef = MOLANG_QUERIES.find(q => q.name === queryName);

            const inputs = (queryDef?.params || []).map((p, idx) => ({
                id: p.id, label: p.label, type: SocketType.STRING as SocketType, mode: SocketMode.VALUE as SocketMode,
                value: ast.params?.[idx] || p.defaultValue
            }));

            nodes.push({
                id: nodeId,
                position: { x, y },
                type: 'custom',
                data: {
                    category: "molang_query",
                    name: queryName,
                    label: queryDef?.label || queryName,
                    headerColor: MOLANG_COLORS.query,
                    inputs,
                    outputs: [{ id: "molang", label: "molang", type: SocketType.STRING, mode: SocketMode.VALUE }],
                    wrapped: true,
                }
            });
            edges.push({
                id: `e:${nodeId}:molang:${targetNodeId}:${targetHandle}`,
                source: nodeId,
                sourceHandle: "molang",
                target: targetNodeId,
                targetHandle,
            });
            break;
        }
        case 'expression': {
            nodes.push({
                id: nodeId,
                position: { x, y },
                type: 'custom',
                data: {
                    category: "molang_expression",
                    label: "Expression",
                    headerColor: MOLANG_COLORS.expression,
                    inputs: [
                        { id: "expression", label: "expression", type: SocketType.STRING, mode: SocketMode.VALUE, value: ast.value || "" }
                    ],
                    outputs: [{ id: "molang", label: "molang", type: SocketType.STRING, mode: SocketMode.VALUE }],
                    wrapped: true,
                }
            });
            edges.push({
                id: `e:${nodeId}:molang:${targetNodeId}:${targetHandle}`,
                source: nodeId,
                sourceHandle: "molang",
                target: targetNodeId,
                targetHandle,
            });
            break;
        }
        case 'and':
        case 'or': {
            const label = ast.type === 'and' ? "AND (&&)" : "OR (||)";
            const category = ast.type === 'and' ? "molang_and" : "molang_or";
            const color = ast.type === 'and' ? MOLANG_COLORS.and : MOLANG_COLORS.or;

            nodes.push({
                id: nodeId,
                position: { x, y },
                type: 'custom',
                data: {
                    category,
                    label,
                    headerColor: color,
                    inputs: [
                        { id: "a", label: "A", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" },
                        { id: "b", label: "B", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" }
                    ],
                    outputs: [{ id: "molang", label: "molang", type: SocketType.STRING, mode: SocketMode.VALUE }],
                    wrapped: true,
                }
            });
            edges.push({
                id: `e:${nodeId}:molang:${targetNodeId}:${targetHandle}`,
                source: nodeId,
                sourceHandle: "molang",
                target: targetNodeId,
                targetHandle,
            });

            if (ast.children && ast.children.length >= 2) {
                const childA = astToNodes(ast.children[0], nodeId, "a", x - 250, y - 75);
                nodes.push(...childA.nodes);
                edges.push(...childA.edges);

                const childB = astToNodes(ast.children[1], nodeId, "b", x - 250, y + 75);
                nodes.push(...childB.nodes);
                edges.push(...childB.edges);
            }
            break;
        }
        case 'not': {
            nodes.push({
                id: nodeId,
                position: { x, y },
                type: 'custom',
                data: {
                    category: "molang_not",
                    label: "NOT (!)",
                    headerColor: MOLANG_COLORS.not,
                    inputs: [
                        { id: "a", label: "input", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" }
                    ],
                    outputs: [{ id: "molang", label: "molang", type: SocketType.STRING, mode: SocketMode.VALUE }],
                    wrapped: true,
                }
            });
            edges.push({
                id: `e:${nodeId}:molang:${targetNodeId}:${targetHandle}`,
                source: nodeId,
                sourceHandle: "molang",
                target: targetNodeId,
                targetHandle,
            });

            if (ast.children && ast.children.length >= 1) {
                const child = astToNodes(ast.children[0], nodeId, "a", x - 250, y);
                nodes.push(...child.nodes);
                edges.push(...child.edges);
            }
            break;
        }
        case 'comparison': {
            nodes.push({
                id: nodeId,
                position: { x, y },
                type: 'custom',
                data: {
                    category: "molang_comparison",
                    label: "Comparison",
                    headerColor: MOLANG_COLORS.comparison,
                    inputs: [
                        { id: "left", label: "left", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" },
                        { id: "operator", label: "operator", type: SocketType.STRING, mode: SocketMode.VALUE, value: ast.operator || "==", options: ["==", "!=", ">", "<", ">=", "<="] },
                        { id: "right", label: "right", type: SocketType.STRING, mode: SocketMode.VALUE, value: "" }
                    ],
                    outputs: [{ id: "molang", label: "molang", type: SocketType.STRING, mode: SocketMode.VALUE }],
                    wrapped: true,
                }
            });
            edges.push({
                id: `e:${nodeId}:molang:${targetNodeId}:${targetHandle}`,
                source: nodeId,
                sourceHandle: "molang",
                target: targetNodeId,
                targetHandle,
            });

            if (ast.children && ast.children.length >= 2) {
                const leftChild = astToNodes(ast.children[0], nodeId, "left", x - 250, y - 75);
                nodes.push(...leftChild.nodes);
                edges.push(...leftChild.edges);

                const rightChild = astToNodes(ast.children[1], nodeId, "right", x - 250, y + 75);
                nodes.push(...rightChild.nodes);
                edges.push(...rightChild.edges);
            }
            break;
        }
    }

    return { nodes, edges };
}

// ── Nodes → Molang compilation ───────────────────────────────────────────────

/** Compile a single node to its Molang string, recursing through connected inputs */
function compileNodeToMolang(nodeId: string, nodes: CustomNodeType[], edges: Edge[]): string {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return '';

    /** Get the value of an input: if a node is connected, compile it; otherwise use the field value */
    const getInputValue = (inputId: string): string => {
        const connectedEdge = edges.find(e => e.target === nodeId && e.targetHandle === inputId);
        if (connectedEdge) {
            return compileNodeToMolang(connectedEdge.source, nodes, edges);
        }
        return node.data.inputs?.find((i: SocketData) => i.id === inputId)?.value as string || '';
    };

    switch (node.data.category) {
        case 'molang_query': {
            const queryName = node.data.name || '';
            const params = (node.data.inputs || []).filter((i: SocketData) => i.id !== 'molang');
            if (params.length > 0) {
                const paramValues = params.map((p: SocketData) => getInputValue(p.id));
                const hasValues = paramValues.some(v => v !== '');
                if (hasValues) {
                    return `query.${queryName}(${paramValues.join(', ')})`;
                }
            }
            return `query.${queryName}`;
        }
        case 'molang_expression':
            return getInputValue('expression');
        case 'molang_and': {
            const a = getInputValue('a');
            const b = getInputValue('b');
            if (!a && !b) return '';
            if (!a) return b;
            if (!b) return a;
            return `(${a} && ${b})`;
        }
        case 'molang_or': {
            const a = getInputValue('a');
            const b = getInputValue('b');
            if (!a && !b) return '';
            if (!a) return b;
            if (!b) return a;
            return `(${a} || ${b})`;
        }
        case 'molang_not': {
            const a = getInputValue('a');
            if (!a) return '';
            return `!(${a})`;
        }
        case 'molang_comparison': {
            const left = getInputValue('left');
            const op = getInputValue('operator');
            const right = getInputValue('right');
            if (!left || !right) return '';
            return `(${left} ${op} ${right})`;
        }
        default:
            return '';
    }
}

/** Compile the condition from the graph for a given output node */
function compileConditionFromGraph(outputNodeId: string, nodes: CustomNodeType[], edges: Edge[]): string {
    const conditionEdge = edges.find(e => e.target === outputNodeId && e.targetHandle === 'condition');
    if (!conditionEdge) return '';
    return compileNodeToMolang(conditionEdge.source, nodes, edges);
}

// ── Main Component ───────────────────────────────────────────────────────────

function RenderControllersGraph({ renderControllersData, setRenderControllersData }: {
    renderControllersData: RenderControllerEntry[],
    setRenderControllersData: (data: RenderControllerEntry[]) => void
}) {
    const [rcNames, setRcNames] = useState<Record<number, string>>({});
    const [data, setData] = useState<RenderControllerEntry[]>(renderControllersData);
    const [graphNodes, setGraphNodes] = useState<CustomNodeType[]>([]);
    const [graphConnections, setGraphConnections] = useState<Edge[]>([]);

    const latestNodesRef = useRef<CustomNodeType[]>([]);
    const latestEdgesRef = useRef<Edge[]>([]);

    // ── Build graph from data ────────────────────────────────────────────────

    const updateGraphFromData = (newData: RenderControllerEntry[]) => {
        const existingNodes = latestNodesRef.current;
        const existingEdges = latestEdgesRef.current;

        const newNodes: CustomNodeType[] = [];
        const newEdges: Edge[] = [];
        const handledNodeIds = new Set<string>();

        let totalOffsetY = 0;

        newData.forEach((rc, index) => {
            const name = getRCName(rc);
            const condition = getRCCondition(rc);

            // Find or create output node
            const existingOutputNode = existingNodes.find(n => n.data.groupKey === name);
            const outputNodeId = existingOutputNode?.id || genId();
            handledNodeIds.add(outputNodeId);

            // Render Controller output node
            newNodes.push({
                id: outputNodeId,
                position: existingOutputNode?.position || { x: 400, y: totalOffsetY },
                type: 'custom',
                data: {
                    label: rcNames[index] !== undefined ? rcNames[index] : formatRCName(name),
                    headerColor: MOLANG_COLORS.output,
                    groupKey: name,
                    inputs: [{ id: "condition", label: "condition", type: SocketType.STRING, mode: SocketMode.VALUE }],
                    deletable: false,
                }
            });

            // Parse Molang condition to nodes only on initial load (no existing output node)
            if (condition && !existingOutputNode) {
                const ast = parseMolangAST(condition);
                const result = astToNodes(ast, outputNodeId, "condition", 100, totalOffsetY);
                result.nodes.forEach(n => {
                    handledNodeIds.add(n.id);
                    newNodes.push(n);
                });
                newEdges.push(...result.edges);
            }

            totalOffsetY += 200;
        });

        // Preserve standalone nodes (manually added)
        existingNodes.forEach(n => {
            if (!handledNodeIds.has(n.id) && !n.data.groupKey) {
                newNodes.push(n);
            }
        });

        // Preserve standalone edges
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

    // ── Compile graph back to data ───────────────────────────────────────────

    const updateDataFromGraph = (nodes: CustomNodeType[], edges: Edge[]) => {
        const newData: RenderControllerEntry[] = [];

        // Collect output nodes sorted by Y position to maintain ordering
        const outputNodes = nodes.filter(n => n.data.groupKey);
        outputNodes.sort((a, b) => a.position.y - b.position.y);

        outputNodes.forEach(outputNode => {
            const name = outputNode.data.groupKey!;
            const condition = compileConditionFromGraph(outputNode.id, nodes, edges);

            if (condition) {
                newData.push({ [name]: condition });
            } else {
                newData.push(name);
            }
        });

        setData(newData);
    };

    const updateDataFromUI = (newData: RenderControllerEntry[]) => {
        setData(newData);
        updateGraphFromData(newData);
    };

    // ── Lifecycle ────────────────────────────────────────────────────────────

    useEffect(() => {
        updateGraphFromData(renderControllersData);
    }, []);

    useEffect(() => {
        setRenderControllersData(data);
    }, [data]);

    const rcMenu = useMemo(() => generateRCMenu(), []);
    const rcMenuNodes = useMemo(() => generateRCMenuNodes(), []);

    const updateNodes = (nodes: CustomNodeType[]) => {
        latestNodesRef.current = nodes;
        updateDataFromGraph(nodes, latestEdgesRef.current);
    };

    const updateEdges = (edges: Edge[]) => {
        latestEdgesRef.current = edges;
        updateDataFromGraph(latestNodesRef.current, edges);
    };

    const customIsValidConnection = useCallback(() => true, []);

    // ── Render ───────────────────────────────────────────────────────────────

    return (<>
        <Graph
            initialNodes={graphNodes}
            initialEdges={graphConnections}
            menuItems={rcMenu}
            nodes_={rcMenuNodes}
            onEdgesUpdate={updateEdges}
            onNodesUpdate={updateNodes}
            customIsValidConnection={customIsValidConnection}
        />

        {/* Sidebar: Render Controllers list */}
        <div className="w-64 bg-neutral-800 border-l border-neutral-700 overflow-y-auto p-3 custom-scrollbar relative pt-0">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 sticky top-0 from-neutral-800 to-transparent via-neutral-800 pt-3 pb-2 bg-linear-to-b flex justify-between items-center">
                Render Controllers
                <Plus className="w-4 h-4 cursor-pointer hover:text-white" onClick={() => {
                    const next = [...data];
                    let keyIdx = 1;
                    while (next.some(rc => getRCName(rc) === "controller.render.new_" + keyIdx)) { keyIdx++; }
                    next.push("controller.render.new_" + keyIdx);
                    updateDataFromUI(next);
                }} />
            </div>
            <div className="flex flex-col gap-2">
                {data.map((rc, index) => {
                    const name = getRCName(rc);
                    return (
                        <div className="bg-neutral-700 rounded px-2 pb-2 text-sm pt-1 flex items-center" key={`${name}-${index}`}>
                            <input
                                className="text-sm text-neutral-400 focus:outline-none w-full"
                                spellCheck={false}
                                value={rcNames[index] !== undefined ? rcNames[index] : name}
                                onChange={(event) => {
                                    const newName = event.target.value;
                                    setRcNames(prev => ({ ...prev, [index]: newName }));

                                    // Update node label in graph in realtime
                                    const updatedNodes = latestNodesRef.current.map(n => {
                                        if (n.data.groupKey === name) {
                                            return { ...n, data: { ...n.data, label: formatRCName(newName) } };
                                        }
                                        return n;
                                    });
                                    setGraphNodes(updatedNodes);
                                }}
                                onBlur={() => {
                                    const newName = rcNames[index] !== undefined ? rcNames[index] : name;
                                    setRcNames(prev => {
                                        const next = { ...prev };
                                        delete next[index];
                                        return next;
                                    });

                                    if (newName === name) return;

                                    const condition = getRCCondition(rc);
                                    const next = data.map((item, i) => {
                                        if (i !== index) return item;
                                        return condition ? { [newName]: condition } : newName;
                                    });

                                    // Update groupKey in refs before regenerating
                                    latestNodesRef.current = latestNodesRef.current.map(n => {
                                        if (n.data.groupKey === name) {
                                            return { ...n, data: { ...n.data, groupKey: newName, label: formatRCName(newName) } };
                                        }
                                        return n;
                                    });

                                    updateDataFromUI(next);
                                }}
                            />
                            <Trash2
                                className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-red-500 transition-colors"
                                onClick={() => {
                                    setRcNames(prev => {
                                        const next = { ...prev };
                                        delete next[index];
                                        return next;
                                    });
                                    const next = data.filter((_, i) => i !== index);
                                    updateDataFromUI(next);
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    </>);
}

export default RenderControllersGraph;
