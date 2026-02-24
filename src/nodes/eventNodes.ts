import { SocketMode, SocketType } from '../types/nodes';
import type { rawNode } from '../types/nodes';

// ==========================================
// EVENT NODES DEFINITION
// ==========================================
/* World After Events from Minecraft Bedrock API
    These events are triggered after various actions occur in the world
    Reference: https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/worldafterevents
*/

export const eventNodes: rawNode[] = [
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
];
