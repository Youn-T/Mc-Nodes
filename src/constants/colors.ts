// ============================================================
// COLOR CONSTANTS
// Single source of truth for all color mappings.
// ============================================================

import { SocketType } from '../types/nodes';

/** Hex color for each socket data type, used to tint handles and edges. */
export const socketColors: Partial<Record<SocketType, string>> = {
    [SocketType.BOOL]:                 '#CC4545',
    [SocketType.INT]:                  '#CC9645',
    [SocketType.FLOAT]:                '#B1CC45',
    [SocketType.STRING]:               '#60CC45',
    [SocketType.VECTOR]:               '#45CC7B',
    [SocketType.ENTITY]:               '#45CCCC',
    [SocketType.ITEM]:                 '#457BCC',
    [SocketType.BLOCK]:                '#6045CC',
    [SocketType.PLAYER]:               '#B145CC',
    [SocketType.ROTATION]:             '#CC4596',
    [SocketType.CAMERA]:               '#457BCC',
    [SocketType.SCOREBOARD_OBJECTIVE]: '#CC52CC',
    [SocketType.COMPONENT]:            '#52CCA3',
};

/** Hex color for each top-level menu category, used as node header background. */
export const nodeColors: Record<string, string> = {
    World:      '#CD7B52',
    System:     '#CCA352',
    Entity:     '#A3CC52',
    Player:     '#52CC52',
    Block:      '#7A52CC',
    Dimension:  '#CCCC52',
    Item:       '#A352CC',
    Scoreboard: '#CC52CC',
    Event:      '#CC5252',
    Math:       '#5252CC',
    Constant:   '#52CCA3',
    Logic:      '#52CCCC',
    Flow:       '#52A3CC',
    Vector:     '#527ACC',
    String:     '#7ACC52',
    Array:      '#CC52A3',
    Variables:  '#52CC7A',
};
