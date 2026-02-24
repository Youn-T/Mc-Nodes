// ============================================================
// CONSTANTS — Socket / Node colours
// Single source of truth for all colour mappings.
// ============================================================

/** Colours indexed by top-level menu category (header bar). */
export const nodeColors: Record<string, string> = {
    World: '#CD7B52',
    System: '#CCA352',
    Entity: '#A3CC52',
    Player: '#52CC52',
    Block: '#7A52CC',
    Dimension: '#CCCC52',
    Item: '#A352CC',
    Scoreboard: '#CC52CC',
    Event: '#CC5252',
    Math: '#5252CC',
    Constant: '#52CCA3',
    Logic: '#52CCCC',
    Flow: '#52A3CC',
    Vector: '#527ACC',
    String: '#7ACC52',
    Array: '#CC52A3',
    Variables: '#52CC7A',
};

/** Colours indexed by socket data type (diamond indicator). */
export const socketColors: Record<string, string> = {
    boolean: '#ff6b6b',
    integer: '#4ecdc4',
    float: '#45b7d1',
    string: '#fed766',
    vector: '#a78bfa',
    entity: '#22d3ee',
    player: '#4ade80',
    block: '#a3a3a3',
    item: '#facc15',
    rotation: '#f472b6',
    camera: '#818cf8',
    scoreboard_objective: '#fb923c',
    component: '#94a3b8',
    other: '#888888',
    default: '#888888',
};
