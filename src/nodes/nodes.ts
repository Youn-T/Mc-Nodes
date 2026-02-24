// ==========================================
// UTILS
// ==========================================
import { SocketMode, SocketType, NodeDefinition } from '../types';
import { nodeColors, socketDefaultValue } from '../constants';
import { minecraftNodes } from './minecraftNodes';
import { eventNodes } from './eventNodes';

const getItemId = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '_');
}

// ==========================================
// INTERNAL NODE TYPE
// ==========================================
/** Internal runtime node shape used in the nodes registry. */
type NodeRegistryEntry = {
    type: 'custom';
    data: {
        label: string;
        inputs: { id: string; label: string; mode?: SocketMode; type?: SocketType }[];
        outputs: { id: string; label: string; mode?: SocketMode; type?: SocketType }[];
        headerColor?: string;
        category: string;
        name?: string;
    };
}

// ==========================================
// NODES DEFINITION
// ==========================================
/* Please only edit inside the rawNodes array 
    - all names must be lowercase and without spaces
    - each node must have a unique name
    - each input/output must have a unique name within the node
    - you can define a label if needed to override the default one (which is the id with first letter uppercase)
    - you must define a mode for each input/output (trigger or value)
    - you should define a type for each input/output in value mode (not needed for trigger mode)
    -you can override the default header color by defining a color property
*/
export const rawNodes: NodeDefinition[] = [
    ...minecraftNodes,
    {
        name: 'give item',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'amount', mode: SocketMode.VALUE, type: SocketType.INT }

        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'success', mode: SocketMode.VALUE, type: SocketType.BOOL },
        ],
        menu: ["Player", "Inventory"]
    },
    {
        name: 'get camera',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'camera', mode: SocketMode.VALUE, type: SocketType.CAMERA },
        ],
        menu: ["Player"]
    },
    {
        name: 'is emoting',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'emoting', mode: SocketMode.VALUE, type: SocketType.BOOL },
        ],
        menu: ["Player"]
    },
    {
        name: 'is flying',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'flying', mode: SocketMode.VALUE, type: SocketType.BOOL },
        ],
        menu: ["Player"]
    },
    {
        name: 'is gliding',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'gliding', mode: SocketMode.VALUE, type: SocketType.BOOL },
        ],
        menu: ["Player"]
    },
    {
        name: 'is jumping',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'jumping', mode: SocketMode.VALUE, type: SocketType.BOOL },
        ],
        menu: ["Player"]
    },
    {
        name: 'get level',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'level', mode: SocketMode.VALUE, type: SocketType.INT },
        ],
        menu: ["Player", "Experience"]
    },
    {
        name: 'get name',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'name', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Player"]
    },
    {
        name: 'get selected slot',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'selected slot', mode: SocketMode.VALUE, type: SocketType.INT },
        ],
        menu: ["Player"]
    },
    {
        name: 'get total experience needed for next level',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'total experience', mode: SocketMode.VALUE, type: SocketType.INT },
        ],
        menu: ["Player", "Experience"]
    },
    {
        name: 'get experience earned at current level',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'experience earned', mode: SocketMode.VALUE, type: SocketType.INT },
        ],
        menu: ["Player", "Experience"]
    },
    ...eventNodes,
    {
        name: 'add',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'a', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'b', mode: SocketMode.VALUE, type: SocketType.FLOAT }],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'result', mode: SocketMode.VALUE, type: SocketType.FLOAT },

        ],
        menu: ["Math", "Basic"]
    },
    {
        name: 'substract',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'a', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'b', mode: SocketMode.VALUE, type: SocketType.FLOAT }],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'result', mode: SocketMode.VALUE, type: SocketType.FLOAT },

        ],
        menu: ["Math", "Basic"]
    },
    {
        name: 'multiply',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'a', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'b', mode: SocketMode.VALUE, type: SocketType.FLOAT }],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'result', mode: SocketMode.VALUE, type: SocketType.FLOAT },

        ],
        menu: ["Math", "Basic"]
    },
    {
        name: 'divide',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'a', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'b', mode: SocketMode.VALUE, type: SocketType.FLOAT }],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'result', mode: SocketMode.VALUE, type: SocketType.FLOAT },

        ],
        menu: ["Math", "Basic"]
    },
    {
        name: 'constant integer',
        inputs: [],
        outputs: [
            { name: 'value', mode: SocketMode.VALUE, type: SocketType.INT },

        ],
        menu: ["Constant"]
    },
    {
        name: 'constant float',
        inputs: [],
        outputs: [
            { name: 'value', mode: SocketMode.VALUE, type: SocketType.FLOAT },

        ],
        menu: ["Constant"]
    },
    {
        name: 'constant string',
        inputs: [],
        outputs: [
            { name: 'value', mode: SocketMode.VALUE, type: SocketType.STRING },

        ],
        menu: ["Constant"]
    },
    {
        name: 'equals',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'a', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'b', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'result', mode: SocketMode.VALUE, type: SocketType.BOOL },

        ],
        menu: ["Logic", "Comparison"]
    },
    {
        name: 'vector add',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'a', mode: SocketMode.VALUE, type: SocketType.VECTOR },
            { name: 'b', mode: SocketMode.VALUE, type: SocketType.VECTOR }],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'result', mode: SocketMode.VALUE, type: SocketType.VECTOR },
        ],
        menu: ["Vector", "Basic"]
    }

]

// ==========================================
// NODES EXPORT
// ==========================================
export const nodes: Record<string, NodeRegistryEntry> = rawNodes.reduce(
    (obj: Record<string, NodeRegistryEntry>, item: NodeDefinition) => {
        const id = getItemId(item.name);
        const toSocket = (s: NodeDefinition['inputs'][number]) => ({
            id: s.name.toLowerCase().replace(/\s+/g, '_'),
            label: s.name.replace(/\s+/g, '_'),
            mode: s.mode,
            type: s.type,
            ...(s.type !== undefined && Object.prototype.hasOwnProperty.call(socketDefaultValue, s.type)
                ? { value: socketDefaultValue[s.type] }
                : {}),
        });
        obj[id] = {
            type: 'custom',
            data: {
                label: item.label ?? item.name.replace(/\b\w/g, c => c.toUpperCase()),
                inputs: item.inputs.map(toSocket),
                outputs: item.outputs.map(toSocket),
                headerColor: item.color ?? nodeColors[item.menu[0]],
                category: item.menu[0],
                name: item.name,
            },
        };
        return obj;
    },
    {},
);

// ==========================================
// CONTEXTUAL MENU EXPORT
// ==========================================

type menuOption = {
    name: string;
    node?: string;
    options?: menuOption[][];
}

const initialMenu: menuOption[][] = [
    [
        { name: "Event", options: [[]] },
        { name: "System", options: [[]] },
        { name: "World", options: [[]] },
        { name: "Dimension", options: [[]] },
    ],
    [
        { name: "Player", options: [[]] },
        { name: "Entity", options: [[]] },
        { name: "Item", options: [[]] },
        { name: "Block", options: [[]] },
        { name: "Scoreboard", options: [[]] }
    ],
    [
        { name: "Flow", options: [[]] },
        { name: "Logic", options: [[]] },
        { name: "Variable", options: [[]] },
        { name: "Constant", options: [[]] },
        { name: "Math", options: [[]] },
        { name: "Vector", options: [[]] },
        { name: "String", options: [[]] },
        { name: "Array", options: [[]] }
    ],
]

const recursivelyAddItems = (menuAcc: menuOption[][], itemMenu: string[], itemNode: string) => {
    const existingMenuDivision = menuAcc.find(div => div.find(cat => cat.name === itemMenu[0]) !== undefined)
    const existingCategory = existingMenuDivision ? existingMenuDivision.find(cat => cat.name === itemMenu[0]) : undefined
    if (existingCategory && existingMenuDivision) {

        const existingOptions = menuAcc[menuAcc.indexOf(existingMenuDivision)][existingMenuDivision.indexOf(existingCategory)].options || [[]]
        menuAcc[menuAcc.indexOf(existingMenuDivision)][existingMenuDivision.indexOf(existingCategory)].options = recursivelyAddItems(existingOptions, itemMenu.slice(1), itemNode)
    } else {
        // console.log(itemMenu, menuAcc, itemNode)


        if (itemMenu.length < 1) {
            const index = menuAcc.reduce((acc, curr) => {
                const existingCategory = curr.find(cat => cat.options !== undefined)
                if (existingCategory) acc += 1;
                return acc;
            }, 0);
            if (index >= menuAcc.length) {
                menuAcc.push([])
            }
            // console.log(index, menuAcc)
            menuAcc[index].push({ name: itemNode, node: getItemId(itemNode) })

        } else {
            const firstCatFree = menuAcc[0].find(cat => cat.options === undefined) !== undefined
            if (firstCatFree) {
                menuAcc.splice(0, 0, [])
            }
            menuAcc[0].push({ name: itemMenu[0], options: recursivelyAddItems([[]], itemMenu.slice(1), itemNode) })
        }
    }

    return menuAcc
}

export const menu: menuOption[][] = rawNodes.reduce((menuAcc: menuOption[][], item: NodeDefinition) => {
    const itemMenu = item.menu;
    const itemNode = item.name;

    menuAcc = recursivelyAddItems(menuAcc, itemMenu, itemNode)
    return menuAcc
}, initialMenu);

// ==========================================
// END OF FILE
// ==========================================