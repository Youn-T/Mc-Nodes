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
    SCOREBOARD_OBJECTIVE = 'scoreboard_objective',
    COMPONENT = 'component',
    OTHER = 'other',
}

export type rawNode = {
    name: string;
    label?: string;
    inputs: { name: string; mode: SocketMode; type?: SocketType }[];
    outputs: { name: string; mode: SocketMode; type?: SocketType }[];
    menu: string[];
    color?: string;
}
