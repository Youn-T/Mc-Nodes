// ============================================================
// CONSTANTS — Socket default values
// Used when a socket has no incoming connection to provide a
// sensible starting value in the node UI.
// ============================================================

/**
 * Default values keyed by SocketType value string.
 * Only types that support inline editing have entries here.
 */
export const socketDefaultValue: Record<string, unknown> = {
    boolean: false,
    integer: 0,
    float: 0.0,
    string: '',
    vector: 0,
};
