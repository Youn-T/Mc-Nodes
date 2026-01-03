import React, { useCallback, useEffect, useState } from 'react';
import { Edge, ReactFlowState, useReactFlow, useStore } from '@xyflow/react';
import { menu, nodes } from '../nodes/nodes';
import { Search } from 'lucide-react';

type ContextMenuProps = {
  id?: string;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  flowPosition?: { x: number; y: number };
  [key: string]: any;
};

type MenuItemProps = {
  node: any;
  renderMenu: (menuGroups: any) => React.ReactNode;
  rfInstance: any;
  setMenu: any;
  connectTo: any;
};
const selector = (state: ReactFlowState) => {
  return {
    unselectAll: state.unselectNodesAndEdges
  };
};
// Composant séparé pour chaque item de menu
function MenuItem({ node, renderMenu, rfInstance, setMenu, connectTo }: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasOptions = node.hasOwnProperty("options");
  const { getNode, setNodes, addNodes, setEdges, addEdges } = useReactFlow();
  const { unselectAll } = useStore(selector);

  if (hasOptions) {
    return (
      <div
        className='relative'
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div
          key={node.name}
          className='rounded-sm text-neutral-300 text-l font-normal capitalize custom-menu-item hover:cursor-pointer select-none flex justify-between'
        >
          <span className='pl-6'>{node.name}</span>
          <span className='mr-2'>▸</span>
        </div>

        {isOpen && (
          <>
            {/* Zone invisible pour combler le gap entre l'item et le sous-menu */}
            <div className="absolute left-full top-0 w-2 h-full" />
            <div className="z-10 absolute custom-menu p-0.5 flex flex-col gap-1 left-full ml-2 top-0">
              {renderMenu(node.options)}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      key={node.name}
      className='rounded-sm text-neutral-300 text-l font-normal capitalize custom-menu-item hover:cursor-pointer select-none flex justify-between'
      onClick={(evt) => {
        const nodeKey = node.node as keyof typeof nodes;
        const flowPosition = rfInstance?.screenToFlowPosition({
          x: evt.clientX,
          y: evt.clientY,
        });

        unselectAll();

        const id = Date.now();

        addNodes({
          ...nodes[nodeKey],
          selected: true,
          dragging: true,
          position: flowPosition,
          id: `${id}`, // Unique ID
        });

        // connectTo est le connectionState de React Flow
        // Il contient fromNode.id et fromHandle.id (pas source/sourceHandle)
        console.log("connectTo:", connectTo);
        if (connectTo && connectTo.fromNode && connectTo.fromHandle) {
          addEdges({
            id: `e${connectTo.fromNode.id}-${id}`,
            source: connectTo.fromNode.id,
            sourceHandle: connectTo.fromHandle.id,
            target: `${id}`,
            targetHandle: "trigger",
          } as Edge)
        }

        setMenu(null);
        /**Handle Node Addition */
      }}
    >
      <span className='pl-6'>{node.name}</span>
    </div>
  );
}


function SingleMenuItem({ node, rfInstance, setMenu, connectTo }: {node: any, rfInstance: any, setMenu: any, connectTo: any}) {
  const { getNode, setNodes, addNodes, setEdges, addEdges } = useReactFlow();
  const { unselectAll } = useStore(selector);
  console.log("SingleMenuItem node:", node);
  return (
    <div
      key={node.name}
      className='rounded-sm text-neutral-300 text-l font-normal capitalize custom-menu-item hover:cursor-pointer select-none flex justify-between'
      onClick={(evt) => {
        const nodeKey = node;
        const flowPosition = rfInstance?.screenToFlowPosition({
          x: evt.clientX,
          y: evt.clientY,
        });
        console.log(nodeKey)
        unselectAll();

        const id = Date.now();

        addNodes({
          ...nodeKey,
          selected: true,
          dragging: true,
          position: flowPosition,
          id: `${id}`, // Unique ID
        });

        // connectTo est le connectionState de React Flow
        // Il contient fromNode.id et fromHandle.id (pas source/sourceHandle)
        console.log("connectTo:", connectTo);
        if (connectTo && connectTo.fromNode && connectTo.fromHandle) {
          addEdges({
            id: `e${connectTo.fromNode.id}-${id}`,
            source: connectTo.fromNode.id,
            sourceHandle: connectTo.fromHandle.id,
            target: `${id}`,
            targetHandle: "trigger",
          } as Edge)
        }

        setMenu(null);
        /**Handle Node Addition */
      }}
    >
      <span className='pl-6'>{node.data.label}</span>
    </div>
  );
}
console.log(menu);
// const menu = [
//   [
//     {
//       name: "Events",
//       options: [
//         [
//           {
//             name: "Event with Reward",
//             options: [
//               [
//                 { name: "Start Event", node: "..." }
//               ],
//               [
//                 { name: "Give Item", node: ".." }
//               ]
//             ]
//           },
//           { name: "Start Event", node: "..." }
//         ],
//         [
//           { name: "Start Event", node: "..." }
//         ]
//       ]
//     },
//     {
//       name: "Common Events",
//       options: [
//         [
//           { name: "Start Event", node: "..." }
//         ],
//         [
//           { name: "Start Event", node: "..." }
//         ]
//       ]
//     }
//   ],
//   [
//     {
//       name: "Other Events",
//       options: [
//         [
//           { name: "Start Event", node: "..." }
//         ],
//         [
//           { name: "Start Event", node: "..." }
//         ]
//       ]
//     }
//   ]
// ];

// const nodes = {
//   "...": {
//     type: 'custom',
//     data: {
//       label: 'Start Event',
//       inputs: [],
//       outputs: [
//         { id: 'trigger', label: 'Trigger', type: SocketTypes.TRIGGER },
//       ],
//     },
//   },
//   "..": {
//     type: 'custom',
//     data: {
//       label: 'Give Item',
//       inputs: [
//         { id: 'trigger', label: 'Trigger', type: SocketTypes.TRIGGER },
//         { id: 'player', label: 'Player', type: SocketTypes.VALUE },
//         { id: 'item', label: 'Item', type: SocketTypes.VALUE },
//         { id: 'amount', label: 'Amount', type: SocketTypes.VALUE },
//       ],
//       outputs: [
//         { id: 'success', label: 'Success', type: SocketTypes.VALUE },
//       ],
//     }
//   }
// }

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  flowWrapper,
  reactFlowInstance,
  rfInstance,
  setMenu,
  connectTo,
  ...props
}: ContextMenuProps) {

  const recursiveMenu = (menuGroups: any): React.ReactNode => {
    return (
      <>
        {menuGroups.map((menuGroup: any, groupIndex: number) => (
          <div key={menuGroup[0]?.name || groupIndex} className='flex flex-col'>
            {groupIndex > 0 && <span className='custom-menu-separator pb-1 mx-1.5'></span>}
            {menuGroup.map((node: any, nodeIndex: number) => (
              <MenuItem
                key={node.name || nodeIndex}
                node={node}
                renderMenu={recursiveMenu}
                rfInstance={rfInstance}
                setMenu={setMenu}
                connectTo={connectTo}
              />
            ))}
          </div>
        ))}
      </>
    );
  };
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setSearchMode(true);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);
  console.log(Object.keys(nodes));
  console.log();
  return (
    <div
      style={{ top, left, right, bottom }}
      className="z-10 absolute custom-menu p-0.5 flex flex-col gap-1"
      onWheel={(e) => e.stopPropagation()}
      {...props}
    >
      {!searchMode && <><h2 className='text-gray-400 text-l font-medium mx-1.5 mt-0.5 select-none'>Add</h2>
        <span className='custom-menu-separator pb-1 mx-1.5'></span>

        {recursiveMenu(menu)}</>}
      {searchMode && <>
        <h2 className='text-gray-400 text-l font-medium mx-1.5 mt-0.5 select-none'>Search</h2>
        <div className='mx-1.5 mt-0.5 px-2 py-0.5 border border-neutral-500 rounded flex align-middle'><Search className='mr-2 w-4 h-4 color-neutral-500'></Search> <input type='text' onChange={(evt) => setSearchQuery(evt.target.value)} className='focus:outline-none' autoFocus></input></div>
        <div 
          className='max-h-96 overflow-y-auto custom-menu-scroll overscroll-contain'
          onWheel={(e) => e.stopPropagation()}
        >{Object.keys(nodes).filter((node: string) => node.toLowerCase().includes(searchQuery.toLowerCase().replace(' ', '_'))).map((nodeKey: string, index: number) => {
          const node = nodes[nodeKey];
          return (<SingleMenuItem
            key={nodeKey}
            node={node}
            rfInstance={rfInstance}
            setMenu={setMenu}
            connectTo={connectTo}
          ></SingleMenuItem>)
        })}</div>
      </>}
    </div>
  );
}
