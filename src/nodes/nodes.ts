// ==========================================
// UTILS
// ==========================================
import { SocketMode, SocketType, rawNode } from './types';
import { minecraftNodes } from './minecraftNodes';

const nodeColors: Record<string, string> = {
    'World': "#CD7B52",
    'System': "#CCA352",
    'Entity': "#A3CC52",
    'Player': "#52CC52",
    'Block': "#7A52CC",
    'Dimension': "#CCCC52",
    'Item': "#A352CC",
    'Scoreboard': "#CC52CC",
    'Event': "#CC5252",
    'Math': "#5252CC",
    'Constant': "#52CCA3",
    'Logic': "#52CCCC",
    'Flow': "#52A3CC",
    'Vector': "#527ACC",
    'String': "#7ACC52",
    "Array" : "#CC52A3",
    'Variables' : "#52CC7A"
}

const getItemId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '_');
}

const socketDefaultValue = {
  boolean: false,
  integer: 0,
  float: 0.0,
  string: "",
  vector: 0,
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
    {
        name: 'block explode',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'button push',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.ENTITY },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'chat send',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'sender', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'message', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'data driven entity trigger',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'event id', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "Entity"]
    },
    {
        name: 'effect add',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'effect', mode: SocketMode.VALUE, type: SocketType.OTHER },
        ],
        menu: ["Event", "Entity"]
    },
    {
        name: 'entity die',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dead entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'damaging entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
        ],
        menu: ["Event", "Entity"]
    },
    {
        name: 'entity heal',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'heal amount', mode: SocketMode.VALUE, type: SocketType.FLOAT },
        ],
        menu: ["Event", "Entity"]
    },
    {
        name: 'entity health changed',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'old health', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'new health', mode: SocketMode.VALUE, type: SocketType.FLOAT },
        ],
        menu: ["Event", "Entity"]
    },
    {
        name: 'entity hit block',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
        ],
        menu: ["Event", "Entity"]
    },
    {
        name: 'entity hit entity',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'hitting entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'hit entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
        ],
        menu: ["Event", "Entity"]
    },
    {
        name: 'entity hurt',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'hurt entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'damage', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'damaging entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
        ],
        menu: ["Event", "Entity"]
    },
    {
        name: 'entity load',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
        ],
        menu: ["Event", "Entity"]
    },
    {
        name: 'entity remove',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'removed entity id', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "Entity"]
    },
    {
        name: 'entity spawn',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
        ],
        menu: ["Event", "Entity"]
    },
    {
        name: 'explosion',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'impacted blocks', mode: SocketMode.VALUE, type: SocketType.OTHER },
        ],
        menu: ["Event", "World"]
    },
    {
        name: 'game rule change',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'rule', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'value', mode: SocketMode.VALUE, type: SocketType.OTHER },
        ],
        menu: ["Event", "World"]
    },
    {
        name: 'item complete use',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item', mode: SocketMode.VALUE, type: SocketType.ITEM },
        ],
        menu: ["Event", "Item"]
    },
    {
        name: 'item release use',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'use duration', mode: SocketMode.VALUE, type: SocketType.INT },
        ],
        menu: ["Event", "Item"]
    },
    {
        name: 'item start use',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item', mode: SocketMode.VALUE, type: SocketType.ITEM },
        ],
        menu: ["Event", "Item"]
    },
    {
        name: 'item start use on',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
        ],
        menu: ["Event", "Item"]
    },
    {
        name: 'item stop use',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'use duration', mode: SocketMode.VALUE, type: SocketType.INT },
        ],
        menu: ["Event", "Item"]
    },
    {
        name: 'item stop use on',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
        ],
        menu: ["Event", "Item"]
    },
    {
        name: 'item use',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item', mode: SocketMode.VALUE, type: SocketType.ITEM },
        ],
        menu: ["Event", "Item"]
    },
    {
        name: 'lever action',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'is powered', mode: SocketMode.VALUE, type: SocketType.BOOL },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'piston activate',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
            { name: 'is expanding', mode: SocketMode.VALUE, type: SocketType.BOOL },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'player break block',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'broken block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player button input',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'button', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player dimension change',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'from dimension', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'to dimension', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player emote',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'emote id', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player game mode change',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'from game mode', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'to game mode', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player hotbar selected slot change',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'from slot', mode: SocketMode.VALUE, type: SocketType.INT },
            { name: 'to slot', mode: SocketMode.VALUE, type: SocketType.INT },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player input mode change',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'old input mode', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'new input mode', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player input permission category change',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'category', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'enabled', mode: SocketMode.VALUE, type: SocketType.BOOL },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player interact with block',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player interact with entity',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'target', mode: SocketMode.VALUE, type: SocketType.ENTITY },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player inventory item change',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'is added', mode: SocketMode.VALUE, type: SocketType.BOOL },
        ],
        menu: ["Event", "Player", "Inventory"]
    },
    {
        name: 'player join',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player name', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'player id', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player leave',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player name', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'player id', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player place block',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'placed block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player spawn',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'initial spawn', mode: SocketMode.VALUE, type: SocketType.BOOL },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player swing start',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'player use name tag',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'name', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "Player"]
    },
    {
        name: 'pressure plate pop',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'pressure plate push',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.ENTITY },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'projectile hit block',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'projectile', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
        ],
        menu: ["Event", "Projectile"]
    },
    {
        name: 'projectile hit entity',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'projectile', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'hit entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
        ],
        menu: ["Event", "Projectile"]
    },
    {
        name: 'target block hit',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'redstone power', mode: SocketMode.VALUE, type: SocketType.INT },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'trip wire trip',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
            { name: 'sources', mode: SocketMode.VALUE, type: SocketType.OTHER },
        ],
        menu: ["Event", "Block"]
    },
    {
        name: 'weather change',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'new weather', mode: SocketMode.VALUE, type: SocketType.STRING },
        ],
        menu: ["Event", "World"]
    },
    {
        name: 'world load',
        inputs: [],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
        ],
        menu: ["Event", "World"]
    },
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
export const nodes: Record<string, node> = rawNodes.reduce((obj: Record<string, node>, item: rawNode) => {
    const id = getItemId(item.name);
    obj[id] = {
        type: 'custom', 
        data: {
            label: item.label ? item.label : item.name.replace(/\b\w/g, c => c.toUpperCase()),
            inputs: item.inputs.map((input) => ({ id: input.name.toLowerCase().replace(/\s+/g, '_'), label: input.name.replace(/\s+/g, '_'), mode: input.mode, type: input.type, ...(socketDefaultValue.hasOwnProperty(input.type as string) && {value: socketDefaultValue[input.type as keyof typeof socketDefaultValue]}) })),
            outputs: item.outputs.map((output) => ({ id: output.name.toLowerCase().replace(/\s+/g, '_'), label: output.name.replace(/\s+/g, '_'), mode: output.mode, type: output.type, ...(socketDefaultValue.hasOwnProperty(output.type as string) && {value: socketDefaultValue[output.type as keyof typeof socketDefaultValue]}) })),
            headerColor: item.color ? item.color : nodeColors[item.menu[0]],
            category: item.menu[0],
            name: item.name
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
        category: string;
        name?: string;
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

const initialMenu: menuOption[][] = [
    [
        {name: "Event", options: [[]]},
        {name: "System", options: [[]]},
        {name: "World", options: [[]]},
        {name: "Dimension", options: [[]]},
    ],
    [
        {name: "Player", options: [[]]},
        {name: "Entity", options: [[]]},
        {name: "Item", options: [[]]},
        {name: "Block", options: [[]]},
        {name: "Scoreboard", options: [[]]}
    ],
    [
        {name: "Flow", options: [[]]},
        {name: "Logic", options: [[]]},
        {name: "Variable", options: [[]]},
        {name: "Constant", options: [[]]},
        {name: "Math", options: [[]]},
        {name: "Vector", options: [[]]},
        {name: "String", options: [[]]},
        {name: "Array", options: [[]]}
    ],
]

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
                menuAcc.splice(0, 0, [])
            }
            menuAcc[0].push({ name: itemMenu[0], options: recursivelyAddItems([[]], itemMenu.slice(1), itemNode) })
        }
    }

    return menuAcc
}

export const menu: menuOption[][] = rawNodes.reduce((menuAcc: menuOption[][], item: rawNode) => {
    const itemMenu = item.menu;
    const itemNode = item.name;

    menuAcc = recursivelyAddItems(menuAcc, itemMenu, itemNode)
    return menuAcc
}, initialMenu);

// ==========================================
// END OF FILE
// ==========================================