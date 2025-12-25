// import { useState, useCallback, useRef, useEffect } from 'react';
// import ReactFlow, {
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   Connection,
//   Edge,
//   ReactFlowInstance,
//   MarkerType,
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import { ItemCreator } from './components/ItemCreator';
// import CustomNode from './components/CustomNode';
// import './components/CustomNode.css';
// import {
//   reconnectEdge,
// } from 'reactflow';
// // Définir les types de nodes personnalisés
// const nodeTypes = {
//   custom: CustomNode,
// };

// // Couleurs de header par catégorie
// const headerColors = {
//   event: '#1D725E',      // vert turquoise
//   action: '#6363c7',     // violet
//   condition: '#cc6677',  // rose
//   data: '#598c5c',       // vert foncé
// };

// const initialNodes = [
//   {
//     id: '1',
//     type: 'custom',
//     position: { x: 0, y: 0 },
//     data: {
//       label: 'Start Event',
//       headerColor: headerColors.event,
//       inputs: [],
//       outputs: [
//         { id: 'trigger', label: 'Trigger', type: 'default' },
//       ],
//     },
//   },
//   {
//     id: '2',
//     type: 'custom',
//     position: { x: 250, y: 0 },
//     data: {
//       label: 'Give Item',
//       headerColor: headerColors.action,
//       inputs: [
//         { id: 'trigger', label: 'Trigger', type: 'default' },
//         { id: 'player', label: 'Player', type: 'string' },
//         { id: 'item', label: 'Item', type: 'string' },
//         { id: 'amount', label: 'Amount', type: 'int' },
//       ],
//       outputs: [
//         { id: 'success', label: 'Success', type: 'boolean' },
//       ],
//     },
//   },
// ];

// const initialEdges = [
//   {
//     id: 'e1-2',
//     source: '1',
//     target: '2',
//     sourceHandle: 'trigger',
//     targetHandle: 'trigger',
//     style: { stroke: '#00d084', strokeWidth: 2 },
//     markerEnd: { type: MarkerType.Arrow, color: '#00d084' },
//   },
// ];

// function App() {
//   const [view, setView] = useState('nodes');
//   const [nodes, , onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

// const edgeReconnectSuccessful = useRef(true);

//   const onReconnectStart = useCallback(() => {
//     edgeReconnectSuccessful.current = false;
//   }, []);

//   const onReconnect = useCallback((oldEdge, newConnection) => {
//     edgeReconnectSuccessful.current = true;
//     setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
//   }, []);

//   const onReconnectEnd = useCallback((_, edge) => {
//     if (!edgeReconnectSuccessful.current) {
//       setEdges((eds) => eds.filter((e) => e.id !== edge.id));
//     }

//     edgeReconnectSuccessful.current = true;
//   }, []);

//   const onConnect = useCallback(
//     (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges],
//   );

//   // Désactiver panOnDrag pour que le drag gauche sélectionne
//   const panOnDrag = false;

//   // Référence vers l'instance React Flow
//   const rfInstance = useRef<ReactFlowInstance | null>(null);
//   const flowWrapper = useRef<HTMLDivElement | null>(null);

//   // état pour menu contextuel
//   const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; type?: string; id?: string }>({
//     visible: false,
//     x: 0,
//     y: 0,
//   });

//   // middle-button panning
//   const isMiddleDown = useRef(false);
//   const isRightDown = useRef(false);
//   const lastPos = useRef<{ x: number; y: number } | null>(null);

//   // état pour couper les liens (Ctrl + drag gauche)
//   const cutState = useRef<{ active: boolean; start: { x: number; y: number } | null; end: { x: number; y: number } | null }>(
//     { active: false, start: null, end: null },
//   );

//   // initialise l'instance
//   const onInit = useCallback((instance: ReactFlowInstance) => {
//     rfInstance.current = instance;
//   }, []);

//   const projectToFlow = useCallback(
//     (clientX: number, clientY: number) => {
//       if (!rfInstance.current || !flowWrapper.current) return null;
//       const bounds = flowWrapper.current.getBoundingClientRect();
//       return rfInstance.current.project({ x: clientX - bounds.left, y: clientY - bounds.top });
//     },
//     [],
//   );

//   // Handlers pour context menu (pane et node)
//   const handlePaneContextMenu = useCallback((event: React.MouseEvent) => {
//     event.preventDefault();
//     if (isRightDown.current) return;
//     setContextMenu({ visible: true, x: event.clientX, y: event.clientY, type: 'pane' });
//   }, []);

//   const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
//     event.preventDefault();
//     setContextMenu({ visible: true, x: event.clientX, y: event.clientY, type: 'node', id: node.id });
//   }, []);

//   // clic gauche sur node -> laisser comportement normal (sélection)
//   const handlePaneClick = useCallback(() => {
//     // fermer le menu contextuel si ouvert
//     if (contextMenu.visible) setContextMenu({ visible: false, x: 0, y: 0 });
//   }, [contextMenu.visible]);

//   // Mouse down pour détecter le click molette (button === 1)
//   const handleMouseDown = useCallback(
//     (event: React.MouseEvent) => {
//       // bouton central (1)
//       if (event.button === 1) {
//         isMiddleDown.current = true;
//         lastPos.current = { x: event.clientX, y: event.clientY };
//         event.preventDefault();
//         return;
//       }

//       // bouton droit pour panning
//       if (event.button === 2) {
//         isRightDown.current = true;
//         lastPos.current = { x: event.clientX, y: event.clientY };
//         event.preventDefault();
//         return;
//       }

//       // Ctrl + clic gauche pour couper des liens
//       if (event.button === 0 && event.ctrlKey) {
//         const start = projectToFlow(event.clientX, event.clientY);
//         if (start) {
//           cutState.current = { active: true, start, end: start };
//           event.preventDefault();
//         }
//       }
//     },
//     [projectToFlow],
//   );

//   const handleMouseMove = useCallback(
//     (event: React.MouseEvent) => {
//       if ((isMiddleDown.current || isRightDown.current) && rfInstance.current && lastPos.current) {
//         // pan en fonction du déplacement souris
//         const dx = event.clientX - lastPos.current.x;
//         const dy = event.clientY - lastPos.current.y;
//         const vp = rfInstance.current.getViewport();
//         rfInstance.current.setViewport({ x: vp.x + dx, y: vp.y + dy, zoom: vp.zoom });
//         lastPos.current = { x: event.clientX, y: event.clientY };
//         return;
//       }

//       // mise à jour de la ligne de coupe en cours
//       if (cutState.current.active) {
//         const end = projectToFlow(event.clientX, event.clientY);
//         if (end) {
//           cutState.current = { ...cutState.current, end };
//         }
//       }
//     },
//     [projectToFlow],
//   );

//   const segmentsIntersect = useCallback((a1: { x: number; y: number }, a2: { x: number; y: number }, b1: { x: number; y: number }, b2: { x: number; y: number }) => {
//     const cross = (p: { x: number; y: number }, q: { x: number; y: number }, r: { x: number; y: number }) =>
//       (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
//     const d1 = cross(a1, a2, b1);
//     const d2 = cross(a1, a2, b2);
//     const d3 = cross(b1, b2, a1);
//     const d4 = cross(b1, b2, a2);
//     return d1 * d2 < 0 && d3 * d4 < 0;
//   }, []);

//   const handleMouseUp = useCallback(
//     (event: React.MouseEvent) => {
//       if (event.button === 1) {
//         isMiddleDown.current = false;
//         lastPos.current = null;
//         event.preventDefault();
//         return;
//       }

//       if (event.button === 2) {
//         isRightDown.current = false;
//         lastPos.current = null;
//         event.preventDefault();
//         return;
//       }

//       // fin de coupe des liens
//       if (event.button === 0 && cutState.current.active && cutState.current.start && cutState.current.end) {
//         const cutStart = cutState.current.start;
//         const cutEnd = cutState.current.end;

//         // Récupérer les edges SVG du DOM pour tester l'intersection
//         const edgesToRemove: string[] = [];
//         const edgePaths = document.querySelectorAll('.react-flow__edge-path');

//         edgePaths.forEach((pathEl) => {
//           const path = pathEl as SVGPathElement;
//           const edgeId = path.closest('.react-flow__edge')?.getAttribute('data-id');
//           if (!edgeId) return;

//           // Échantillonner le path pour créer des segments
//           const pathLength = path.getTotalLength();
//           const samples = 20;

//           for (let i = 0; i < samples; i++) {
//             const p1 = path.getPointAtLength((i / samples) * pathLength);
//             const p2 = path.getPointAtLength(((i + 1) / samples) * pathLength);

//             // Convertir les points SVG en coordonnées flow
//             const svgPoint1 = { x: p1.x, y: p1.y };
//             const svgPoint2 = { x: p2.x, y: p2.y };

//             if (segmentsIntersect(cutStart, cutEnd, svgPoint1, svgPoint2)) {
//               edgesToRemove.push(edgeId);
//               break;
//             }
//           }
//         });

//         if (edgesToRemove.length > 0) {
//           setEdges((eds) => eds.filter((edge) => !edgesToRemove.includes(edge.id)));
//         }

//         cutState.current = { active: false, start: null, end: null };
//         event.preventDefault();
//       }
//     },
//     [segmentsIntersect, setEdges],
//   );

//   // Wheel handler : scroll normal -> zoom, Ctrl+scroll -> pan vertical, Shift+scroll -> pan horizontal
//   const handleWheel = useCallback((event: React.WheelEvent) => {
//     if (!rfInstance.current) return;
//     // empêcher le scroll natif de la page
//     event.preventDefault();
//     const vp = rfInstance.current.getViewport();
//     const delta = event.deltaY;

//     if (event.ctrlKey) {
//       // pan vertical (Ctrl + scroll)
//       rfInstance.current.setViewport({ x: vp.x, y: vp.y - delta, zoom: vp.zoom });
//       return;
//     }

//     if (event.shiftKey) {
//       // pan horizontal (Shift + scroll)
//       rfInstance.current.setViewport({ x: vp.x - delta, y: vp.y, zoom: vp.zoom });
//       return;
//     }

//     // scroll normal -> zoom (approximation simple)
//     const zoomFactor = delta < 0 ? 1.12 : 0.88;
//     let newZoom = vp.zoom * zoomFactor;
//     newZoom = Math.max(0.1, Math.min(4, newZoom));
//     rfInstance.current.setViewport({ x: vp.x, y: vp.y, zoom: newZoom });
//   }, []);

//   // fermer le menu si clic à l'extérieur (Escape)
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && contextMenu.visible) setContextMenu({ visible: false, x: 0, y: 0 });
//     };
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, [contextMenu.visible]);


//   return (
//     <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>

//       <div style={{ flex: 1, position: 'relative' }} ref={flowWrapper}>
//         {view === 'nodes' && (
//           <ReactFlow
//             nodes={nodes}
//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             onConnect={onConnect}
//             nodeTypes={nodeTypes}
//             panOnScroll={false} /* Désactivé pour utiliser le handler custom */
//             zoomOnScroll={false} /* Désactivé pour utiliser le handler custom */
//             selectNodesOnDrag={true}
//             selectionOnDrag={true}
//             panOnDrag={panOnDrag}
//             onInit={onInit}
//             onPaneContextMenu={handlePaneContextMenu}
//             onNodeContextMenu={handleNodeContextMenu as any}
//             onPaneClick={handlePaneClick}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onWheel={handleWheel}
//                   onReconnect={onReconnect}
//       onReconnectStart={onReconnectStart}
//       onReconnectEnd={onReconnectEnd}
//           >
//             {/* <Controls />
//             <MiniMap /> */}
//             <Background gap={12} size={1} />
//           </ReactFlow>
//         )}

//         {view === 'items' && <ItemCreator />}

//         {view === 'entities' && (
//           <div style={{ padding: '2rem' }}>
//             <h2>Entity Creator</h2>
//             <p>Coming soon...</p>
//           </div>
//         )}

//         {/* Menu contextuel simple */}
//         {contextMenu.visible && (
//           <div
//             style={{
//               position: 'absolute',
//               left: contextMenu.x,
//               top: contextMenu.y,
//               background: '#fff',
//               border: '1px solid rgba(0,0,0,0.2)',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//               zIndex: 100,
//               padding: 8,
//               minWidth: 160,
//             }}
//             onContextMenu={(e) => e.preventDefault()}
//           >
//             {contextMenu.type === 'node' ? (
//               <>
//                 <div
//                   style={{ padding: 6, cursor: 'pointer' }}
//                   onClick={() => {
//                     console.log('Edit', contextMenu.id);
//                     setContextMenu({ visible: false, x: 0, y: 0 });
//                   }}
//                 >
//                   Éditer
//                 </div>
//                 <div
//                   style={{ padding: 6, cursor: 'pointer' }}
//                   onClick={() => {
//                     console.log('Supprimer', contextMenu.id);
//                     setContextMenu({ visible: false, x: 0, y: 0 });
//                   }}
//                 >
//                   Supprimer
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div
//                   style={{ padding: 6, cursor: 'pointer' }}
//                   onClick={() => {
//                     console.log('Ajouter un noeud');
//                     setContextMenu({ visible: false, x: 0, y: 0 });
//                   }}
//                 >
//                   Ajouter un noeud
//                 </div>
//                 <div
//                   style={{ padding: 6, cursor: 'pointer' }}
//                   onClick={() => {
//                     console.log('Options');
//                     setContextMenu({ visible: false, x: 0, y: 0 });
//                   }}
//                 >
//                   Options
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

// // export default Flow;
import { useCallback, useRef, useEffect, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  SelectionMode,
  useEdgesState,
  useNodesState,
  Background,
  ReactFlowInstance,
  OnMove,
  OnNodeDrag,
  useReactFlow,
  ReactFlowProvider,
  reconnectEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ContextMenu from './components/ContextualMenu';

import CustomNode, { SocketTypes } from './components/CustomNode';
import './components/CustomNode.css';
import './components/ContextualMenu.css';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      label: 'Start Event',
      inputs: [],
      outputs: [
        { id: 'trigger', label: 'Trigger', type: SocketTypes.TRIGGER },
      ],
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 250, y: 0 },
    data: {
      label: 'Give Item',
      inputs: [
        { id: 'trigger', label: 'Trigger', type: SocketTypes.TRIGGER },
        { id: 'player', label: 'Player', type: SocketTypes.VALUE },
        { id: 'item', label: 'Item', type: SocketTypes.VALUE },
        { id: 'amount', label: 'Amount', type: SocketTypes.VALUE },
      ],
      outputs: [
        { id: 'success', label: 'Success', type: SocketTypes.VALUE },
      ],
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 250, y: 0 },
    data: {
      label: 'Give Item',
      inputs: [
        { id: 'trigger', label: 'Trigger', type: SocketTypes.TRIGGER },
        { id: 'player', label: 'Player', type: SocketTypes.VALUE },
        { id: 'item', label: 'Item', type: SocketTypes.VALUE },
        { id: 'amount', label: 'Amount', type: SocketTypes.VALUE },
      ],
      outputs: [
        { id: 'success', label: 'Success', type: SocketTypes.VALUE },
      ],
    },
  }
];
const initialEdges = [

];

const panOnDrag = [1]; // Seulement le clic molette pour React Flow, on gère le clic droit manuellement

function FlowContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const rfInstance = useRef<ReactFlowInstance | null>(null);
  const flowWrapper = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(null);

  // État pour le pan avec clic droit
  const rightClickState = useRef<{
    isDown: boolean;
    startPos: { x: number; y: number } | null;
    lastPos: { x: number; y: number } | null;
    hasMoved: boolean;
  }>({ isDown: false, startPos: null, lastPos: null, hasMoved: false });

  const PAN_THRESHOLD = 5; // Distance minimale pour considérer un drag

  // COUPE DES LIENS

  const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menu) {
        setMenu(null);
      }
    }

    document.addEventListener('keydown', handleEscape);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    document.addEventListener('contextmenu', event => event.preventDefault());
    rfInstance.current = instance;
  }, []);

  // État pour la ligne de coupe (Ctrl + drag gauche)

  const cutState = useRef<{
    active: boolean;
    start: { x: number; y: number } | null;
    end: { x: number; y: number } | null;
  }>({ active: false, start: null, end: null });

  // Fonction pour projeter les coordonnées écran vers le flow
  const projectToFlow = useCallback(
    (clientX: number, clientY: number) => {
      if (!rfInstance.current || !flowWrapper.current) return null;
      const bounds = flowWrapper.current.getBoundingClientRect();
      return rfInstance.current.screenToFlowPosition({
        x: clientX - bounds.left,
        y: clientY - bounds.top,
      });
    },
    [],
  );

  // Vérifie si deux segments s'intersectent
  const segmentsIntersect = useCallback(
    (
      a1: { x: number; y: number },
      a2: { x: number; y: number },
      b1: { x: number; y: number },
      b2: { x: number; y: number },
    ) => {
      const cross = (
        p: { x: number; y: number },
        q: { x: number; y: number },
        r: { x: number; y: number },
      ) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
      const d1 = cross(a1, a2, b1);
      const d2 = cross(a1, a2, b2);
      const d3 = cross(b1, b2, a1);
      const d4 = cross(b1, b2, a2);
      return d1 * d2 < 0 && d3 * d4 < 0;
    },
    [],
  );

  // Gestionnaire de mousedown pour démarrer la coupe
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      console.log(event.button);
      // Clic droit : préparer le pan ou le menu contextuel
      if (event.button === 2) {
        rightClickState.current = {
          isDown: true,
          startPos: { x: event.clientX, y: event.clientY },
          lastPos: { x: event.clientX, y: event.clientY },
          hasMoved: false,
        };
        // Ne pas empêcher l'événement pour l'instant
        return;
      }

      // Ctrl + clic droit pour couper des liens (gardé pour compatibilité)
      if (event.button === 0 && event.ctrlKey) {
                

        const start = projectToFlow(event.clientX, event.clientY);
        if (start) {
          cutState.current = { active: true, start, end: start };
          event.preventDefault();
        }
      }
    },
    [projectToFlow],
  );

  // Gestionnaire de mousemove pour mettre à jour la ligne de coupe
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      // Pan avec clic droit
      if (rightClickState.current.isDown && rfInstance.current && rightClickState.current.lastPos) {
        console.log('Panning with right click');
        const dx = event.clientX - rightClickState.current.lastPos.x;
        const dy = event.clientY - rightClickState.current.lastPos.y;

        // Vérifier si on a dépassé le seuil de mouvement
        if (!rightClickState.current.hasMoved && rightClickState.current.startPos) {
          const totalDx = event.clientX - rightClickState.current.startPos.x;
          const totalDy = event.clientY - rightClickState.current.startPos.y;
          const distance = Math.sqrt(totalDx * totalDx + totalDy * totalDy);

          if (distance > PAN_THRESHOLD) {
            rightClickState.current.hasMoved = true;
            // Fermer le menu si ouvert
            setMenu(null);
          }
        }

        // Si on a bougé, effectuer le pan
        if (rightClickState.current.hasMoved) {
          const vp = rfInstance.current.getViewport();
          rfInstance.current.setViewport({ x: vp.x + dx, y: vp.y + dy, zoom: vp.zoom });
        }

        rightClickState.current.lastPos = { x: event.clientX, y: event.clientY };
        return;
      }

      // Mise à jour de la ligne de coupe
      if (cutState.current.active && event.ctrlKey) {
        const end = projectToFlow(event.clientX, event.clientY);
        if (end) {
          cutState.current = { ...cutState.current, end };
        }
      }
    },
    [projectToFlow, setMenu],
  );

  // Gestionnaire de mouseup pour finaliser la coupe
  const handleMouseUp = useCallback(
    (event: React.MouseEvent) => {
      // Fin du clic droit
      if (event.button === 2) {
        const hasMoved = rightClickState.current.hasMoved;
        rightClickState.current = { isDown: false, startPos: null, lastPos: null, hasMoved: false };

        // Si on n'a pas bougé, laisser le menu contextuel s'afficher
        // Le menu sera géré par onPaneContextMenu / onNodeContextMenu
        if (hasMoved) {
          // Empêcher le menu contextuel natif si on a fait un pan
          event.preventDefault();
        } else {
          console.log(menu);
          if (menu == null) {
            event.preventDefault();
            const pane = flowWrapper.current?.getBoundingClientRect();
            if (!pane) return;

            setMenu({
              id: "pane",
              top: event.clientY < pane.height - 200 && event.clientY,
              left: event.clientX < pane.width - 200 && event.clientX,
              right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
              bottom:
                event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
          } else {
            
            setMenu(null);
          }

        }
        return;
      }

      // Coupe des liens (si implémenté avec un autre bouton)
      if (
        cutState.current.active &&
        cutState.current.start &&
        cutState.current.end
      ) {
        const cutStart = cutState.current.start;
        const cutEnd = cutState.current.end;

        // Récupérer les edges SVG du DOM pour tester l'intersection
        const edgesToRemove: string[] = [];
        const edgePaths = document.querySelectorAll('.react-flow__edge-path');

        edgePaths.forEach((pathEl) => {
          const path = pathEl as SVGPathElement;
          const edgeId = path.closest('.react-flow__edge')?.getAttribute('data-id');
          if (!edgeId) return;

          // Échantillonner le path pour créer des segments
          const pathLength = path.getTotalLength();
          const samples = 20;

          for (let i = 0; i < samples; i++) {
            const p1 = path.getPointAtLength((i / samples) * pathLength);
            const p2 = path.getPointAtLength(((i + 1) / samples) * pathLength);

            // Convertir les points SVG en coordonnées flow
            const svgPoint1 = { x: p1.x, y: p1.y };
            const svgPoint2 = { x: p2.x, y: p2.y };

            if (segmentsIntersect(cutStart, cutEnd, svgPoint1, svgPoint2)) {
              edgesToRemove.push(edgeId);
              break;
            }
          }
        });

        if (edgesToRemove.length > 0) {
          setEdges((eds) => eds.filter((edge) => !edgesToRemove.includes(edge.id)));
        }

        cutState.current = { active: false, start: null, end: null };
        event.preventDefault();
      }
    },
    [segmentsIntersect, setEdges, setMenu, menu],
  );

  // Bloquer le menu contextuel natif si on a fait un pan
  useEffect(() => {
    const container = flowWrapper.current;
    if (!container) return;

    const handleContextMenu = (e: MouseEvent) => {
      // Si on a fait un pan, bloquer le menu natif
      if (rightClickState.current.hasMoved) {
        e.preventDefault();
      }
    };

    container.addEventListener('contextmenu', handleContextMenu);

    

    return () => {
      container.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    const container = flowWrapper.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (!rfInstance.current) return;

      // empêcher le scroll natif de la page (possible car passive: false)
      event.preventDefault();

      const vp = rfInstance.current.getViewport();
      const delta = event.deltaY;

      if (event.ctrlKey) {
        // pan vertical (Ctrl + scroll)
        rfInstance.current.setViewport({ x: vp.x, y: vp.y - delta, zoom: vp.zoom });
        return;
      }

      if (event.shiftKey) {
        // pan horizontal (Shift + scroll)
        rfInstance.current.setViewport({ x: vp.x - delta, y: vp.y, zoom: vp.zoom });
        return;
      }

      // scroll normal -> zoom vers le curseur
      const zoomFactor = delta < 0 ? 1.12 : 0.88;
      let newZoom = vp.zoom * zoomFactor;
      newZoom = Math.max(0.1, Math.min(4, newZoom));

      // Calculer la position de la souris relative au conteneur
      const bounds = container.getBoundingClientRect();
      const clientX = event.clientX - bounds.left;
      const clientY = event.clientY - bounds.top;

      // Ajuster le viewport pour que le point sous la souris reste fixe
      const newX = clientX - ((clientX - vp.x) / vp.zoom) * newZoom;
      const newY = clientY - ((clientY - vp.y) / vp.zoom) * newZoom;

      rfInstance.current.setViewport({ x: newX, y: newY, zoom: newZoom });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const onConnect = useCallback(
    (connection) => {
      console.log('onConnect', connection);
      const target = nodes.find(n => n.id === connection.target);
      const source = nodes.find(n => n.id === connection.source);
      if (!target || !source) return;
      const targetHandle = target.data.inputs.find(h => h.id === connection.targetHandle);
      const sourceHandle = source.data.outputs.find(h => h.id === connection.sourceHandle);
      console.log('Connected', sourceHandle, 'to', targetHandle);

      if (sourceHandle?.type !== targetHandle?.type) {
        console.log('Incompatible socket types:', sourceHandle?.type, 'and', targetHandle?.type);
        return;
      }

      setEdges((eds) => addEdge(connection, eds));

    },
    [setEdges],
  );

  // NODE ADD TO EDGE
  const { updateEdge, getEdge, addEdges } = useReactFlow();

  const overlappedEdgeRef = useRef<string | null>(null);

  const onNodeDragStop: OnNodeDrag = useCallback(
    (event, node) => {
      const edgeId = overlappedEdgeRef.current;
      if (!edgeId) return;
      const edge = getEdge(edgeId);
      if (!edge) return;

      updateEdge(edgeId, { source: edge.source, target: node.id, style: {} });

      addEdges({
        id: `${node.id}->${edge.target}`,
        source: node.id,
        target: edge.target,
      });

      overlappedEdgeRef.current = null;
    },
    [getEdge, addEdges, updateEdge],
  );

  const onNodeDrag: OnNodeDrag = useCallback(
    (e, node) => {
      // Correction du sélecteur : pas d'espace entre la classe et l'attribut
      const nodeDiv = document.querySelector(
        `.react-flow__node[data-id="${node.id}"]`,
      );
      if (!nodeDiv) return;

      const rect = nodeDiv.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const edgeFound = document
        .elementsFromPoint(centerX, centerY)
        .find((el) =>
          el.classList.contains('react-flow__edge-interaction'),
        )?.parentElement;

      const edgeId = edgeFound?.dataset.id;

      if (edgeId) updateEdge(edgeId, { style: { stroke: 'black' } });
      else if (overlappedEdgeRef.current)
        updateEdge(overlappedEdgeRef.current, { style: {} });

      overlappedEdgeRef.current = edgeId || null;
    },
    [updateEdge],
  );

  // DISCONECT EDGES 
  const edgeReconnectSuccessful = useRef(true);

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback((oldEdge, newConnection) => {
    edgeReconnectSuccessful.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, []);

  const onReconnectEnd = useCallback((_, edge) => {
    if (!edgeReconnectSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeReconnectSuccessful.current = true;
  }, []);

  // Suppression de la ref inutile (on utilise flowWrapper)
  // const ref = useRef(null);

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      // Empêcher le menu natif immédiatement
      event.preventDefault();

      console.log('pane context menu');
      // Utiliser flowWrapper pour les dimensions
      // const pane = flowWrapper.current?.getBoundingClientRect();
      // if (!pane) return;

      // setMenu({
      //   id: "pane",
      //   top: event.clientY < pane.height - 200 && event.clientY,
      //   left: event.clientX < pane.width - 200 && event.clientX,
      //   right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
      //   bottom:
      //     event.clientY >= pane.height - 200 && pane.height - event.clientY,
      // });
    },
    [setMenu],
  );

  // Ajouter un handler pour les noeuds pour empêcher le menu natif
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      event.preventDefault();

      // const pane = flowWrapper.current?.getBoundingClientRect();
      // if (!pane) return;

      // setMenu({
      //   id: node.id,
      //   top: event.clientY < pane.height - 200 && event.clientY,
      //   left: event.clientX < pane.width - 200 && event.clientX,
      //   right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
      //   bottom:
      //     event.clientY >= pane.height - 200 && pane.height - event.clientY,
      // });
    },
    [setMenu],
  );

  // Ajouter un handler pour les edges pour empêcher le menu natif
  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: any) => {
      event.preventDefault();
      // Logique spécifique pour les edges si nécessaire
      console.log('edge context menu', edge);
    },
    [],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);


  // NODE ADD TO EDGE
  return (
    <div ref={flowWrapper} style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={onInit}
        onReconnectStart={onReconnectStart}
        onReconnect={onReconnect}
        onReconnectEnd={onReconnectEnd}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        selectionOnDrag
        panOnDrag={panOnDrag}
        nodeTypes={nodeTypes}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        selectionMode={SelectionMode.Partial}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneClick={onPaneClick}
        fitView
      >
        <Background />
        {menu && <ContextMenu {...menu} />}
      </ReactFlow>
    </div>
  );
}

function Flow() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}

export default Flow;