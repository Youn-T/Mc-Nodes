import { useCallback, useRef, useEffect, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  SelectionMode,
  useEdgesState,
  useNodesState,
  Background,
  getOutgoers,
  OnNodeDrag,
  useReactFlow,
  reconnectEdge,
  Edge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ContextMenu from './ContextualMenu';

import CustomNode, { CustomNodeType } from './CustomNode';
import './CustomNode.css';
import './ContextualMenu.css';
import { SocketType } from '../nodes/types';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: CustomNodeType[] = [];
const initialEdges: Edge[] = [];

const panOnDrag = [1]; // Seulement le clic molette pour React Flow, on gère le clic droit manuellement

function FlowGraph() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const rfInstance = useRef<any>(null);
  const flowWrapper = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<any>(null);
  const [snapToGrid, setSnapToGrid] = useState(false);

  // Callback pour mettre à jour les valeurs d'un socket (input ou output) d'un node
  const { setNodes, getNodes, getEdges } = useReactFlow<CustomNodeType, Edge>();
  const onNodeDataChange = useCallback((nodeId: string, socketId: string, value: string | Record<string, string>, isOutput: boolean) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const socketList = isOutput ? 'outputs' : 'inputs';
          const updatedSockets = (node.data[socketList] || []).map((socket: any) => {
            if (socket.id === socketId) {
              return { ...socket, value };
            }
            return socket;
          });
          return {
            ...node,
            data: {
              ...node.data,
              [socketList]: updatedSockets,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // État pour le pan avec clic droit
  const rightClickState = useRef<{
    isDown: boolean;
    startPos: { x: number; y: number } | null;
    lastPos: { x: number; y: number } | null;
    hasMoved: boolean;
  }>({ isDown: false, startPos: null, lastPos: null, hasMoved: false });

  const PAN_THRESHOLD = 5; // Distance minimale pour considérer un drag

  // COUPE DES LIENS

  const handleEscape = useCallback((e: KeyboardEvent): void => {
    if (e.key === 'Escape' && menu) {
      setMenu(null);
    }
  }, [menu]);

  const snapToGridHandlerEnable = useCallback((e: KeyboardEvent): void => {
    if (e.key === 'Control') {
      setSnapToGrid(true);
    }
  }, []);

  const snapToGridHandlerDisable = useCallback((e: KeyboardEvent): void => {
    if (e.key === 'Control') {
      setSnapToGrid(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', snapToGridHandlerEnable);
    document.addEventListener('keyup', snapToGridHandlerDisable);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', snapToGridHandlerEnable);
      document.removeEventListener('keyup', snapToGridHandlerDisable);
    };
  }, [handleEscape, snapToGridHandlerEnable, snapToGridHandlerDisable]);

  const onInit = useCallback((instance: any): void => {
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
          if (menu == null) {
            event.preventDefault();
            const pane = flowWrapper.current?.getBoundingClientRect();
            if (!pane) return;

            // Calculer la position en coordonnées flow


            setMenu({
              id: "pane",
              top: event.clientY < pane.height - 200 && event.clientY,
              left: event.clientX < pane.width - 200 && event.clientX,
              right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
              bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
              flowWrapper: flowWrapper,
              reactFlowInstance: rfInstance,
              rfInstance: rfInstance.current,
              setMenu: setMenu,
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
    };
  }, []);

  useEffect(() => {
    const container = flowWrapper.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (!rfInstance.current) return;
      // Vérifier si l'événement provient d'un élément scrollable dans le menu contextuel
      const target = event.target as HTMLElement;
      const scrollableMenu = target.closest('.custom-menu-scroll');
      if (scrollableMenu) {
        // Laisser le scroll natif se produire dans le menu
        return;
      }

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
    (connection: Connection) => {
      const target = nodes.find(n => n.id === connection.target);
      const source = nodes.find(n => n.id === connection.source);
      if (!target || !source) return;
      const targetHandle = target.data.inputs?.find((h: any) => h.id === connection.targetHandle);
      const sourceHandle = source.data.outputs?.find((h: any) => h.id === connection.sourceHandle);

      if ((sourceHandle?.mode !== targetHandle?.mode) || (sourceHandle?.type !== targetHandle?.type && !(targetHandle?.type === SocketType.FLOAT && sourceHandle?.type === SocketType.INT) && sourceHandle?.type !== SocketType.OTHER && targetHandle?.type !== SocketType.OTHER)) {
        return;
      }

      const previousEdges = edges.filter(e => (e.target === connection.target && e.targetHandle === connection.targetHandle) );

      setEdges((eds) => (addEdge(connection, eds)).filter(e => !previousEdges.includes(e)));

    },
    [setEdges, nodes, edges],
  );

  // NODE ADD TO EDGE
  const { updateEdge, getEdge, addEdges } = useReactFlow();

  const overlappedEdgeRef = useRef<string | null>(null);

  const onNodeDragStop: OnNodeDrag = useCallback(
    (_event, node) => {
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
    (_e, node) => {
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

  const onReconnectStart = useCallback((): void => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection): void => {
    edgeReconnectSuccessful.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, [setEdges]);

  const onReconnectEnd = useCallback((_: MouseEvent | TouchEvent, edge: Edge): void => {
    if (!edgeReconnectSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeReconnectSuccessful.current = true;
  }, [setEdges]);

  // Suppression de la ref inutile (on utilise flowWrapper)
  // const ref = useRef(null);

  const onPaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault();
    },
    [],
  );

  // Ajouter un handler pour les noeuds pour empêcher le menu natif
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, _node: any): void => {
      event.preventDefault();
    },
    [],
  );

  // Ajouter un handler pour les edges pour empêcher le menu natif
  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, _edge: any) => {
      event.preventDefault();
    },
    [],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);
  const onNodeClick = useCallback(() => setMenu(null), [setMenu]);
  const onNodeDragStart = useCallback(() => setMenu(null), [setMenu]);

  const onConnectEnd = useCallback((event: MouseEvent | TouchEvent, connectionState: any): void => {
    if (event instanceof TouchEvent) return;
    const pane = flowWrapper.current?.getBoundingClientRect();
    if (connectionState.toNode) return;
    if (!pane) return;

    setMenu({
      id: "pane",
      top: event.clientY < pane.height - 200 && event.clientY,
      left: event.clientX < pane.width - 200 && event.clientX,
      right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
      bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
      flowWrapper: flowWrapper,
      reactFlowInstance: rfInstance,
      rfInstance: rfInstance.current,
      setMenu: setMenu,
      connectTo: connectionState,
    });


  }, []);

  // NODE ADD TO EDGE
  // Injecter la callback onDataChange dans chaque node
  const nodesWithCallback = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onDataChange: (socketId: string, value: string | Record<string, string>, isOutput: boolean) =>
        onNodeDataChange(node.id, socketId, value, isOutput),
    },
  }));

  const isValidConnection = useCallback(
    (connection: any) => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      const source = nodes.find((node) => node.id === connection.source);

      // CYCLE DETECTION
      const hasCycle = (node: any, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (target?.id === connection.source) return false;

      // CONNECTION HERITAGE
      const isParent = (parent: string, node: string)  => {
        const inComers = edges.filter(edge => edge.target === node && edge.targetHandle === "trigger")

        for (const inComer of inComers) {
          if (parent === inComer.source) return true;
          if (isParent(parent, inComer.source)) return true;
        }

        return false; 
      }
      return !hasCycle(target) && ( connection.sourceHandle !== "trigger" ? isParent(source?.id || "", target?.id || "") : true);

    },
    [getNodes, getEdges],
  );


  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div ref={flowWrapper} style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodesWithCallback}
          edges={edges}
          onInit={onInit}
          onReconnectStart={onReconnectStart}
          onReconnect={onReconnect}
          onReconnectEnd={onReconnectEnd}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectEnd={onConnectEnd}
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
          onNodeDragStart={onNodeDragStart}
          snapToGrid={snapToGrid}
          snapGrid={[20, 20]}
          onNodeClick={onNodeClick}
          isValidConnection={isValidConnection}
          fitView
        >
          <Background />
          {menu && <ContextMenu {...menu} />}
        </ReactFlow>
      </div>
      {/* <Sidebar nodes={nodes} edges={edges} /> */}
    </div>
  );
}

export default FlowGraph;