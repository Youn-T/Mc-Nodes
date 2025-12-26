// ==========================================
// UTILS
// ==========================================
export enum SocketMode {
    TRIGGER = 'trigger',
    VALUE = 'value',
}

export enum SocketType {
    BOOL = 'boolean',
    INT = 'integer',
    FLOAT = 'float',
    STRING = 'string',
    VECTOR = 'vector',
    ENTITY = 'entity',
    ITEM = 'item',
    BLOCK = 'block',
    PLAYER = 'player',
    ROTATION = 'rotation',
    CAMERA = 'camera',
    OTHER = 'other',
}

const nodeColors: Record<string, string> = {
    'Player': '#B145CC',
    'Event': "#CC4545"
}

const getItemId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '_');
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
export const rawNodes: rawNode[] = [
    {
        name: 'give item',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item', mode: SocketMode.VALUE, type: SocketType.ITEM }
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

    {
        name: 'on entity hit block',
        inputs: [
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'event data', mode: SocketMode.VALUE, type: SocketType.OTHER },
        ],
        menu: ["Event", "Block"]
    },
        {
        name: 'on block explode',
        inputs: [
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'event data', mode: SocketMode.VALUE, type: SocketType.OTHER },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'on player break block',
        inputs: [
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'event data', mode: SocketMode.VALUE, type: SocketType.OTHER },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'on player interact with block',
        inputs: [
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'event data', mode: SocketMode.VALUE, type: SocketType.OTHER },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'on player place block',
        inputs: [
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'event data', mode: SocketMode.VALUE, type: SocketType.OTHER },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'on projectile hit block',
        inputs: [
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'event data', mode: SocketMode.VALUE, type: SocketType.OTHER },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'on target block hit',
        inputs: [
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'event data', mode: SocketMode.VALUE, type: SocketType.OTHER },
        ],
        menu: ["Event", "Block"]
    }
]

type rawNode = {
    name: string;
    label?: string;
    inputs: { name: string; mode: SocketMode; type?: SocketType }[];
    outputs: { name: string; mode: SocketMode; type?: SocketType }[];
    menu: string[];
    color?: string;
}

// ==========================================
// NODES EXPORT
// ==========================================
export const nodes: Record<string, node> = rawNodes.reduce((obj: Record<string, node>, item: rawNode) => {
    const id = getItemId(item.name);
    obj[id] = {
        type: 'custom',
        data: {
            label: item.label ? item.label : item.name.replace(/\b\w/g, c => c.toUpperCase()),
            inputs: item.inputs.map((input) => ({ id: input.name.toLowerCase().replace(/\s+/g, '_'), label: input.name.replace(/\s+/g, '_'), mode: input.mode, type: input.type })),
            outputs: item.outputs.map((output) => ({ id: output.name.toLowerCase().replace(/\s+/g, '_'), label: output.name.replace(/\s+/g, '_'), mode: output.mode, type: output.type })),
            headerColor: item.color ? item.color : nodeColors[item.menu[0]],
        }
    }
    return obj;
}, {} as Record<string, node>);

type node = {
    type: string;
    data: {
        label: string;
        inputs: { id: string; label: string; mode?: SocketMode; type?: SocketType }[];
        outputs: { id: string; label: string; mode?: SocketMode; type?: SocketType }[];
        headerColor?: string;
    }
}

// ==========================================
// CONTEXTUAL MENU EXPORT
// ==========================================

type menuOption = {
    name: string;
    node?: string;
    options?: menuOption[][];
}

const recursivelyAddItems = (menuAcc: menuOption[][], itemMenu: string[], itemNode: string) => {
    const existingMenuDivision = menuAcc.find(div => div.find(cat => cat.name === itemMenu[0]) !== undefined)
    const existingCategory = existingMenuDivision ? existingMenuDivision.find(cat => cat.name === itemMenu[0]) : undefined
    if (existingCategory && existingMenuDivision) {

        const existingOptions = menuAcc[menuAcc.indexOf(existingMenuDivision)][existingMenuDivision.indexOf(existingCategory)].options || [[]]
        menuAcc[menuAcc.indexOf(existingMenuDivision)][existingMenuDivision.indexOf(existingCategory)].options = recursivelyAddItems(existingOptions, itemMenu.slice(1), itemNode)
    } else {
            console.log(itemMenu, menuAcc, itemNode)
            

        if (itemMenu.length < 1) {
            const index = menuAcc.reduce((acc, curr) => {
                const existingCategory = curr.find(cat => cat.options !== undefined)
                if (existingCategory) acc += 1;
                return acc;
            }, 0);
            if (index >= menuAcc.length) {
                menuAcc.push([])
            }
            console.log(index, menuAcc)
            menuAcc[index].push({ name: itemNode, node: getItemId(itemNode) })

        } else {
            const firstCatFree = menuAcc[0].find(cat => cat.options === undefined) !== undefined
            if (firstCatFree) {
                menuAcc.splice(0,0, [])
            }
            menuAcc[0].push({ name: itemMenu[0], options: recursivelyAddItems([[  ]], itemMenu.slice(1), itemNode) })
        }
    }

    return menuAcc
}

export const menu: menuOption[][] = rawNodes.reduce((menuAcc: menuOption[][], item: rawNode) => {
    const itemMenu = item.menu;
    const itemNode = item.name;

    menuAcc = recursivelyAddItems(menuAcc, itemMenu, itemNode)
    return menuAcc
}, [[]] as menuOption[][]);

// ==========================================
// END OF FILE
// ==========================================