import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
    // ---- Global ignores ----
    { ignores: ['dist', 'node_modules', '*.js'] },

    // ---- Base JS recommended rules ----
    js.configs.recommended,

    // ---- TypeScript recommended rules ----
    ...tseslint.configs.recommended,

    // ---- React Hooks + Refresh plugins ----
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            // React Hooks
            ...reactHooks.configs.recommended.rules,

            // React Refresh — warn on non-component exports
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],

            // TypeScript strictness
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],

            // General
            'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
    },
);
