# Mc Nodes - AI Coding Instructions

You are working on **Mc Nodes**, a visual node editor for creating Minecraft Bedrock Add-ons using React, TypeScript, and React Flow (@xyflow/react).

## Project Architecture & Core Concepts

### 1. Visual Scripting System (@xyflow/react)
- **Core Component**: `src/components/graphs/Graph.tsx` wraps `ReactFlow`. It manages `nodes` and `edges` state.
- **Node Data Model**: Nodes use a custom structure inside `data`:
  ```typescript
  // src/nodes/types.ts
  interface rawNode {
      name: string;
      inputs: { name: string; mode: SocketMode; type?: SocketType }[];
      outputs: { name: string; mode: SocketMode; type?: SocketType }[];
  }
  ```
- **Socket System**:
  - `SocketMode.TRIGGER`: Execution flow (like white execution pins in Unreal Blueprints).
  - `SocketMode.VALUE`: Data transfer (integers, strings, entities).
- **Custom Nodes**: The project uses a custom node type `'custom'` rendered by `src/components/CustomNode.tsx`.

### 2. Node Definitions (`src/nodes/`)
- **Validation Source**: `src/nodes/minecraftNodes.ts` contains the registry of available nodes.
- **Adding New Nodes**: When asked to add a new node type, you must add an entry to the `minecraftNodes` array in `minecraftNodes.ts` following the `rawNode` schema.

### 3. Compilation Logic (`src/compilator/`)
- **Compilator**: `src/compilator/compilator.ts` transforms the visual graph into script/JSON.
- **Logic**: It traverses the graph structure, handling variable generation and indentation.

## Tech Stack & Conventions

### Frontend
- **Framework**: React 19 + TypeScript.
- **Build Tool**: Vite 7.
- **Styling**: Tailwind CSS v4.
- **Icons**: `lucide-react`.

### Coding Patterns
- **State Management**: Use React Hooks (`useState`, `useEffect`, `useCallback`) and React Flow hooks (`useNodesState`, `useEdgesState`, `useReactFlow`).
- **File Structure**:
  - Components: `src/components`
  - Logic/Utils: `src/compilator`, `src/filesystem`
  - Data Definitions: `src/nodes`
- **Type Safety**: Strictly define interfaces for component props and data structures. Avoid `any` where possible, especially in node data manipulation.

## Development Workflow

### Key Commands
- `npm run dev`: Start the development server (Vite).
- `npm run build`: Type-check and build for production.

### Common Tasks
- **Modifying Node Logic**: Update `src/components/CustomNode.tsx` for UI changes, or `src/components/graphs/Graph.tsx` for interaction logic.
- **Changing Compilation**: Edit `src/compilator/compilator.ts`.
- **Styling**: Use Tailwind utility classes. For complex node styling, check `src/components/CustomNode.css`.

## Specific Instructions for AI
- When generating code for nodes, **always** verify against `src/nodes/types.ts` `SocketMode` and `SocketType` enums.
- The project allows mixing `TRIGGER` and `VALUE` sockets. Ensure connections respect types (e.g., don't connect a String output to a Vector input unless a converter exists).
- If creating new UI components, use **Tailwind CSS** for styling to maintain consistency.
- **Graph.tsx** manages the state. Do not try to move React Flow state management to a global store unless explicitly requested; the current pattern uses local state with `useNodesState`.





