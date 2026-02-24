// ============================================================
// Tests — Types & Constants
// Validates the structural integrity of centralized types and
// constants, ensuring they stay in sync.
// ============================================================

import { describe, it, expect } from 'vitest';
import { SocketMode, SocketType } from '../types/nodes';
import { socketColors } from '../constants/colors';
import { socketDefaultValue } from '../constants/socketDefaults';

describe('SocketMode enum', () => {
    it('has TRIGGER and VALUE members', () => {
        expect(SocketMode.TRIGGER).toBeDefined();
        expect(SocketMode.VALUE).toBeDefined();
    });

    it('TRIGGER and VALUE are different values', () => {
        expect(SocketMode.TRIGGER).not.toBe(SocketMode.VALUE);
    });
});

describe('SocketType enum', () => {
    const expectedTypes = [
        'BOOL', 'INT', 'FLOAT', 'STRING', 'VECTOR',
        'ENTITY', 'PLAYER', 'BLOCK', 'ITEM', 'CAMERA',
        'ROTATION', 'SCOREBOARD_OBJECTIVE', 'COMPONENT', 'OTHER',
    ];

    it('contains all expected type keys', () => {
        for (const key of expectedTypes) {
            expect(SocketType).toHaveProperty(key);
        }
    });

    it('has unique values for each key', () => {
        const values = Object.values(SocketType);
        const unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });
});

describe('socketColors', () => {
    it('has color entries for the most common SocketTypes', () => {
        const requiredTypes = [
            SocketType.BOOL, SocketType.INT, SocketType.FLOAT, SocketType.STRING,
            SocketType.VECTOR, SocketType.ENTITY, SocketType.PLAYER, SocketType.BLOCK,
            SocketType.ITEM, SocketType.CAMERA, SocketType.ROTATION,
        ];
        for (const t of requiredTypes) {
            expect(
                socketColors,
                `Missing color for SocketType "${t}"`,
            ).toHaveProperty(t);
        }
    });

    it('all color values are valid hex strings', () => {
        for (const [key, value] of Object.entries(socketColors)) {
            expect(
                value,
                `socketColors["${key}"] = "${value}" is not a valid hex color`,
            ).toMatch(/^#[0-9a-fA-F]{3,8}$/);
        }
    });
});

describe('socketDefaultValue', () => {
    it('provides defaults for common input types', () => {
        // At minimum, INT, FLOAT, STRING, BOOL, VECTOR should have defaults
        expect(socketDefaultValue).toHaveProperty(SocketType.INT);
        expect(socketDefaultValue).toHaveProperty(SocketType.FLOAT);
        expect(socketDefaultValue).toHaveProperty(SocketType.STRING);
        expect(socketDefaultValue).toHaveProperty(SocketType.BOOL);
        expect(socketDefaultValue).toHaveProperty(SocketType.VECTOR);
    });

    it('INT default is a number', () => {
        expect(typeof socketDefaultValue[SocketType.INT]).toBe('number');
    });

    it('FLOAT default is a number', () => {
        expect(typeof socketDefaultValue[SocketType.FLOAT]).toBe('number');
    });

    it('STRING default is a string', () => {
        expect(typeof socketDefaultValue[SocketType.STRING]).toBe('string');
    });
});
