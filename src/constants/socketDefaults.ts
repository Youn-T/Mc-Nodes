// ============================================================
// SOCKET DEFAULT VALUES
// Default runtime values for each value socket type.
// ============================================================

import { SocketType } from '../types/nodes';

/** Default value used to initialize value sockets when no connection is present. */
export const socketDefaultValue: Partial<Record<SocketType, boolean | number | string>> = {
    [SocketType.BOOL]:   false,
    [SocketType.INT]:    0,
    [SocketType.FLOAT]:  0,
    [SocketType.STRING]: '',
    [SocketType.VECTOR]: 0,
};
