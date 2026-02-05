# Implementation Plan

## 1. Codebase Cleanup
- [ ] Remove `src\components\workspaces\entityEditor\RenderControllersGraph copy.tsx`
- [ ] Analyze `src\nodes\nodes.ts`, `src\nodes\minecraftNodes.ts`, and `src\nodes\eventNodes.ts` for duplication.
- [ ] Analyze `src\components\workspaces\EntityEditor.tsx` vs `src\components\workspaces\entityEditor\*.tsx`.

## 2. Entity Editor Implementation
- [x] Create `RenderControllersGraph.tsx` skeleton.
- [x] Implement `EventGraph.tsx` logic (parse events to nodes).
- [x] Clean up `ComponentGroupsGraph.tsx`.
- [x] Refine `RenderControllersGraph.tsx`.
- [x] Verify `Graph.tsx` capabilities.
