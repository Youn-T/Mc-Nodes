import { SocketMode, SocketType, NodeDefinition } from '../types';
/** @deprecated */ type rawNode = NodeDefinition;

export const minecraftNodes: NodeDefinition[] = [
    // ==========================================
    // WORLD
    // ==========================================
    {
        name: 'world get absolute time',
        inputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'time', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        menu: ["World", "Time"]
    },
    {
        name: 'world get day',
        inputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'day', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        menu: ["World", "Time"]
    },
    {
        name: 'world get time of day',
        inputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'time', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        menu: ["World", "Time"]
    },
    {
        name: 'world set time of day',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'time', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Time"]
    },
    {
        name: 'world set absolute time',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'time', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Time"]
    },
    {
        name: 'world send message',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'message', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Message"]
    },
    {
        name: 'world broadcast client message',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'id', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'value', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Message"]
    },
    {
        name: 'world get dimension',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["World", "Dimension"]
    },
    {
        name: 'world play music',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'track id', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'volume', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'pitch', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'loop', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Audio"]
    },
    {
        name: 'world queue music',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'track id', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'volume', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'pitch', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'loop', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Audio"]
    },
    {
        name: 'world stop music',
        inputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Audio"]
    },
    {
        name: 'world play sound',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'sound id', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR },
            { name: 'pitch', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'volume', mode: SocketMode.VALUE, type: SocketType.FLOAT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Audio"]
    },
    {
        name: 'world get dynamic property',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'identifier', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'value', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["World", "Property"]
    },
    {
        name: 'world set dynamic property',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'identifier', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'value', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Property"]
    },
    {
        name: 'world get all players',
        inputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'players', mode: SocketMode.VALUE, type: SocketType.OTHER } // Array of players
        ],
        menu: ["World", "Player"]
    },
    {
        name: 'world get entity',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        menu: ["World", "Entity"]
    },
    {
        name: 'world get default spawn location',
        inputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR }
        ],
        menu: ["World", "Spawn"]
    },
    {
        name: 'world set default spawn location',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Spawn"]
    },

    // ==========================================
    // SYSTEM
    // ==========================================
    {
        name: 'system current tick',
        inputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'tick', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        menu: ["System"]
    },
    {
        name: 'system wait ticks',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'ticks', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["System"]
    },
    {
        name: 'system run',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            // Callback logic is handled by flow, this node just schedules next tick execution
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["System"]
    },

    // ==========================================
    // ENTITY
    // ==========================================
    {
        name: 'entity teleport',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'rotation x', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'rotation y', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'keep velocity', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Movement"]
    },
    {
        name: 'entity kill',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Life"]
    },
    {
        name: 'entity remove',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Life"]
    },
    {
        name: 'entity is valid',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'is valid', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        menu: ["Entity", "State"]
    },
    {
        name: 'entity apply damage',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'amount', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            // Options could be complex, simplified for now
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Damage"]
    },
    {
        name: 'entity add effect',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'effect', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'duration', mode: SocketMode.VALUE, type: SocketType.INT },
            { name: 'amplifier', mode: SocketMode.VALUE, type: SocketType.INT },
            { name: 'show particles', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Effect"]
    },
    {
        name: 'entity remove effect',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'effect', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Effect"]
    },
    {
        name: 'entity get effect',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'effect', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'effect object', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Entity", "Effect"]
    },
    {
        name: 'entity set on fire',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'seconds', mode: SocketMode.VALUE, type: SocketType.INT },
            { name: 'effect fire', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "State"]
    },
    {
        name: 'entity extinguish fire',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'effect fire', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "State"]
    },
    {
        name: 'entity get component',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'component id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'component', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Entity", "Component"]
    },
    {
        name: 'entity has component',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'component id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'has component', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        menu: ["Entity", "Component"]
    },
    {
        name: 'entity get location',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR }
        ],
        menu: ["Entity", "Location"]
    },
    {
        name: 'entity get velocity',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'velocity', mode: SocketMode.VALUE, type: SocketType.VECTOR }
        ],
        menu: ["Entity", "Movement"]
    },
    {
        name: 'entity apply impulse',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'vector', mode: SocketMode.VALUE, type: SocketType.VECTOR }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Movement"]
    },
    {
        name: 'entity apply knockback',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'direction x', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'direction z', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'horizontal strength', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'vertical strength', mode: SocketMode.VALUE, type: SocketType.FLOAT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Movement"]
    },
    {
        name: 'entity get head location',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR }
        ],
        menu: ["Entity", "Location"]
    },
    {
        name: 'entity get rotation',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'rotation', mode: SocketMode.VALUE, type: SocketType.ROTATION }
        ],
        menu: ["Entity", "Location"]
    },
    {
        name: 'entity set rotation',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'rotation', mode: SocketMode.VALUE, type: SocketType.ROTATION }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Location"]
    },
    {
        name: 'entity get dimension',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Entity", "Location"]
    },
    {
        name: 'entity get tags',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'tags', mode: SocketMode.VALUE, type: SocketType.OTHER } // string[]
        ],
        menu: ["Entity", "Tag"]
    },
    {
        name: 'entity add tag',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'tag', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Tag"]
    },
    {
        name: 'entity remove tag',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'tag', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Tag"]
    },
    {
        name: 'entity has tag',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'tag', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'has tag', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        menu: ["Entity", "Tag"]
    },
    {
        name: 'entity get dynamic property',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'identifier', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'value', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Entity", "Property"]
    },
    {
        name: 'entity set dynamic property',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'identifier', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'value', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Entity", "Property"]
    },

    // ==========================================
    // PLAYER
    // ==========================================
    {
        name: 'player add levels',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'levels', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Player", "Experience"]
    },
    {
        name: 'player add experience',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'experience', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Player", "Experience"]
    },
    {
        name: 'player get level',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'level', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        menu: ["Player", "Experience"]
    },
    {
        name: 'player get total experience',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'experience', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        menu: ["Player", "Experience"]
    },
    {
        name: 'player set game mode',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'game mode', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Player", "GameMode"]
    },
    {
        name: 'player get game mode',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'game mode', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        menu: ["Player", "GameMode"]
    },
    {
        name: 'player play sound',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'sound id', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'volume', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'pitch', mode: SocketMode.VALUE, type: SocketType.FLOAT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Player", "Audio"]
    },
    {
        name: 'player send message',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'message', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Player", "Message"]
    },
    {
        name: 'player get name',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'name', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        menu: ["Player", "Info"]
    },
    {
        name: 'player get id',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        menu: ["Player", "Info"]
    },
    {
        name: 'player get inventory',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'inventory', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Player", "Inventory"]
    },
    {
        name: 'player get item cooldown',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item category', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'cooldown', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        menu: ["Player", "Inventory"]
    },
    {
        name: 'player start item cooldown',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'item category', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'tick duration', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Player", "Inventory"]
    },

    // ==========================================
    // BLOCK
    // ==========================================
    {
        name: 'block set type',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
            { name: 'type', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Block"]
    },
    {
        name: 'block get type',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'type', mode: SocketMode.VALUE, type: SocketType.OTHER } // BlockType
        ],
        menu: ["Block"]
    },
    {
        name: 'block get type id',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'type id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        menu: ["Block"]
    },
    {
        name: 'block get location',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR }
        ],
        menu: ["Block"]
    },
    {
        name: 'block get dimension',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Block"]
    },
    {
        name: 'block get permutation',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'permutation', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Block"]
    },
    {
        name: 'block set permutation',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
            { name: 'permutation', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Block"]
    },
    {
        name: 'block get tags',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'tags', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Block"]
    },
    {
        name: 'block has tag',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
            { name: 'tag', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'has tag', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        menu: ["Block"]
    },
    {
        name: 'block get component',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK },
            { name: 'component id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'component', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Block"]
    },

    // ==========================================
    // DIMENSION
    // ==========================================
    {
        name: 'dimension get block',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.BLOCK }
        ],
        menu: ["Dimension"]
    },
    {
        name: 'dimension spawn entity',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'entity id', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        menu: ["Dimension"]
    },
    {
        name: 'dimension spawn item',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'item stack', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entity', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        menu: ["Dimension"]
    },
    {
        name: 'dimension create explosion',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR },
            { name: 'radius', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'allow underwater', mode: SocketMode.VALUE, type: SocketType.BOOL },
            { name: 'breaks blocks', mode: SocketMode.VALUE, type: SocketType.BOOL },
            { name: 'causes fire', mode: SocketMode.VALUE, type: SocketType.BOOL },
            { name: 'source', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Dimension"]
    },
    {
        name: 'dimension get entities',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            // Options omitted for simplicity
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'entities', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Dimension"]
    },
    {
        name: 'dimension get players',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            // Options omitted for simplicity
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'players', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Dimension"]
    },
    {
        name: 'dimension fill blocks',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'begin', mode: SocketMode.VALUE, type: SocketType.VECTOR },
            { name: 'end', mode: SocketMode.VALUE, type: SocketType.VECTOR },
            { name: 'block', mode: SocketMode.VALUE, type: SocketType.OTHER } // BlockPermutation or Type
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'blocks affected', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        menu: ["Dimension"]
    },

    // ==========================================
    // ITEM STACK
    // ==========================================
    {
        name: 'item stack create',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'item id', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'amount', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'item stack', mode: SocketMode.VALUE, type: SocketType.ITEM }
        ],
        menu: ["Item"]
    },
    {
        name: 'item stack get amount',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'item stack', mode: SocketMode.VALUE, type: SocketType.ITEM }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'amount', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        menu: ["Item"]
    },
    {
        name: 'item stack set amount',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'item stack', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'amount', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Item"]
    },
    {
        name: 'item stack get type id',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'item stack', mode: SocketMode.VALUE, type: SocketType.ITEM }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'type id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        menu: ["Item"]
    },
    {
        name: 'item stack get name tag',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'item stack', mode: SocketMode.VALUE, type: SocketType.ITEM }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'name tag', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        menu: ["Item"]
    },
    {
        name: 'item stack set name tag',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'item stack', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'name tag', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Item"]
    },
    {
        name: 'item stack get lore',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'item stack', mode: SocketMode.VALUE, type: SocketType.ITEM }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'lore', mode: SocketMode.VALUE, type: SocketType.OTHER } // string[]
        ],
        menu: ["Item"]
    },
    {
        name: 'item stack set lore',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'item stack', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'lore', mode: SocketMode.VALUE, type: SocketType.OTHER } // string[]
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Item"]
    },
    {
        name: 'item stack get component',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'item stack', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'component id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'component', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Item"]
    },
    {
        name: 'item stack has component',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'item stack', mode: SocketMode.VALUE, type: SocketType.ITEM },
            { name: 'component id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'has component', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        menu: ["Item"]
    },
    // ==========================================
    // SCOREBOARD
    // ==========================================
    {
        name: 'scoreboard get objective',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'objective id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'objective', mode: SocketMode.VALUE, type: SocketType.SCOREBOARD_OBJECTIVE }
        ],
        menu: ["Scoreboard"]
    },
    {
        name: 'scoreboard add objective',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'objective id', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'display name', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'objective', mode: SocketMode.VALUE, type: SocketType.SCOREBOARD_OBJECTIVE }
        ],
        menu: ["Scoreboard"]
    },
    {
        name: 'scoreboard remove objective',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'objective id', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Scoreboard"]
    },
    {
        name: 'objective get score',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'objective', mode: SocketMode.VALUE, type: SocketType.SCOREBOARD_OBJECTIVE },
            { name: 'target', mode: SocketMode.VALUE, type: SocketType.ENTITY }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'score', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        menu: ["Scoreboard"]
    },
    {
        name: 'objective set score',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'objective', mode: SocketMode.VALUE, type: SocketType.SCOREBOARD_OBJECTIVE },
            { name: 'target', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'score', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Scoreboard"]
    },
    {
        name: 'objective add score',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'objective', mode: SocketMode.VALUE, type: SocketType.SCOREBOARD_OBJECTIVE },
            { name: 'target', mode: SocketMode.VALUE, type: SocketType.ENTITY },
            { name: 'amount', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Scoreboard"]
    },

    // ==========================================
    // GAMERULES
    // ==========================================
    {
        name: 'world get game rule',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'rule name', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'value', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["World", "GameRule"]
    },
    {
        name: 'world set game rule',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'rule name', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'value', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "GameRule"]
    },

    // ==========================================
    // CAMERA
    // ==========================================
    {
        name: 'player set camera',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'camera preset', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR },
            { name: 'rotation', mode: SocketMode.VALUE, type: SocketType.ROTATION },
            { name: 'ease time', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'ease type', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Player", "Camera"]
    },
    {
        name: 'player clear camera',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Player", "Camera"]
    },
    {
        name: 'player fade camera',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'player', mode: SocketMode.VALUE, type: SocketType.PLAYER },
            { name: 'fade time', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'hold time', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'fade out time', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'color', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["Player", "Camera"]
    },
    // ==========================================
    // WEATHER
    // ==========================================
    {
        name: 'world set weather',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'weather type', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'duration', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Weather"]
    },

    // ==========================================
    // STRUCTURE
    // ==========================================
    {
        name: 'world place structure',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'structure name', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'location', mode: SocketMode.VALUE, type: SocketType.VECTOR },
            { name: 'rotation', mode: SocketMode.VALUE, type: SocketType.ROTATION },
            { name: 'mirror', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'integrity', mode: SocketMode.VALUE, type: SocketType.FLOAT },
            { name: 'seed', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "Structure"]
    },

    // ==========================================
    // TICKING AREA
    // ==========================================
    {
        name: 'world add ticking area',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'from', mode: SocketMode.VALUE, type: SocketType.VECTOR },
            { name: 'to', mode: SocketMode.VALUE, type: SocketType.VECTOR },
            { name: 'name', mode: SocketMode.VALUE, type: SocketType.STRING },
            { name: 'is circle', mode: SocketMode.VALUE, type: SocketType.BOOL }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "TickingArea"]
    },
    {
        name: 'world remove ticking area',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'dimension', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'name', mode: SocketMode.VALUE, type: SocketType.STRING }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER }],
        menu: ["World", "TickingArea"]
    },
    {
        name: 'get array element by index',
        inputs: [
            { name: 'trigger', mode: SocketMode.TRIGGER },
            { name: 'array', mode: SocketMode.VALUE, type: SocketType.OTHER },
            { name: 'index', mode: SocketMode.VALUE, type: SocketType.INT }
        ],
        outputs: [{ name: 'trigger', mode: SocketMode.TRIGGER },
        { name: 'element', mode: SocketMode.VALUE, type: SocketType.OTHER }
        ],
        menu: ["Array"]
    }
];
