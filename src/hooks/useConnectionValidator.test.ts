// ============================================================
// Tests — isSocketConnectionValid
// Pure function validation for socket connection rules.
// ============================================================

import { describe, it, expect } from 'vitest';
import { isSocketConnectionValid } from './useConnectionValidator';
import { SocketMode, SocketType } from '../types/nodes';

describe('isSocketConnectionValid', () => {
    // ---- Mode checks ----

    it('rejects connections between different modes (TRIGGER → VALUE)', () => {
        expect(
            isSocketConnectionValid(
                { mode: SocketMode.TRIGGER },
                { mode: SocketMode.VALUE, type: SocketType.INT },
            ),
        ).toBe(false);
    });

    it('accepts TRIGGER → TRIGGER regardless of type', () => {
        expect(
            isSocketConnectionValid(
                { mode: SocketMode.TRIGGER },
                { mode: SocketMode.TRIGGER },
            ),
        ).toBe(true);
    });

    // ---- Same type checks ----

    it('accepts VALUE connections with identical types', () => {
        const types = [
            SocketType.BOOL,
            SocketType.INT,
            SocketType.FLOAT,
            SocketType.STRING,
            SocketType.VECTOR,
            SocketType.ENTITY,
            SocketType.PLAYER,
            SocketType.BLOCK,
            SocketType.ITEM,
            SocketType.CAMERA,
            SocketType.ROTATION,
            SocketType.SCOREBOARD_OBJECTIVE,
            SocketType.COMPONENT,
        ];

        for (const t of types) {
            expect(
                isSocketConnectionValid(
                    { mode: SocketMode.VALUE, type: t },
                    { mode: SocketMode.VALUE, type: t },
                ),
            ).toBe(true);
        }
    });

    it('rejects VALUE connections with mismatched types', () => {
        expect(
            isSocketConnectionValid(
                { mode: SocketMode.VALUE, type: SocketType.STRING },
                { mode: SocketMode.VALUE, type: SocketType.INT },
            ),
        ).toBe(false);
    });

    // ---- INT → FLOAT widening ----

    it('accepts INT → FLOAT implicit widening', () => {
        expect(
            isSocketConnectionValid(
                { mode: SocketMode.VALUE, type: SocketType.INT },
                { mode: SocketMode.VALUE, type: SocketType.FLOAT },
            ),
        ).toBe(true);
    });

    it('rejects FLOAT → INT (no narrowing)', () => {
        expect(
            isSocketConnectionValid(
                { mode: SocketMode.VALUE, type: SocketType.FLOAT },
                { mode: SocketMode.VALUE, type: SocketType.INT },
            ),
        ).toBe(false);
    });

    // ---- OTHER wildcard ----

    it('accepts OTHER as source type with any target type', () => {
        expect(
            isSocketConnectionValid(
                { mode: SocketMode.VALUE, type: SocketType.OTHER },
                { mode: SocketMode.VALUE, type: SocketType.VECTOR },
            ),
        ).toBe(true);
    });

    it('accepts any source type with OTHER as target type', () => {
        expect(
            isSocketConnectionValid(
                { mode: SocketMode.VALUE, type: SocketType.PLAYER },
                { mode: SocketMode.VALUE, type: SocketType.OTHER },
            ),
        ).toBe(true);
    });

    it('accepts OTHER ↔ OTHER', () => {
        expect(
            isSocketConnectionValid(
                { mode: SocketMode.VALUE, type: SocketType.OTHER },
                { mode: SocketMode.VALUE, type: SocketType.OTHER },
            ),
        ).toBe(true);
    });
});
