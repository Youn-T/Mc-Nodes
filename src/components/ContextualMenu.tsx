import React, { useCallback, useState } from 'react';
import { useReactFlow } from '@xyflow/react';

type ContextMenuProps = {
  id?: string;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  [key: string]: any;
};

type MenuItemProps = {
  node: any;
  renderMenu: (menuGroups: any) => React.ReactNode;
};

// Composant séparé pour chaque item de menu
function MenuItem({ node, renderMenu }: MenuItemProps) {
  const [nextMenu, setNextMenu] = useState<any>(null);
  const hasOptions = node.hasOwnProperty("options");

  if (hasOptions) {
    return (
      <div
        key={node.name}
        className='rounded-sm text-neutral-300 text-l font-normal capitalize custom-menu-item hover:cursor-pointer select-none flex justify-between relative'
        onMouseEnter={() => setNextMenu(node.options)}
        onMouseLeave={() => setNextMenu(null)}
      >
        <span className='pl-6'>{node.name}</span>
        <span className='mr-2'>▸</span>

        {nextMenu && (
          <div className="z-10 absolute custom-menu p-0.5 flex flex-col gap-1 left-full ml-1 top-0">
            <h2 className='text-gray-400 text-l font-medium mx-1.5 mt-0.5 select-none'>Add</h2>
            {renderMenu(nextMenu)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      key={node.name}
      className='rounded-sm text-neutral-300 text-l font-normal capitalize custom-menu-item hover:cursor-pointer select-none flex justify-between'
      onClick={() => {/**Handle Node Addition */ }}
    >
      <span className='pl-6'>{node.name}</span>
      <span className='mr-2'>▸</span>
    </div>
  );
}

const nodes = [["prout", "pouet", "plop"], ["test", "example"]];
const menu = [[{ name: "prout", options: [[{ name: "truc", node: "..." }, { name: "truc3", node: "..." }], [{ name: "truc2", node: "..." }]] }, { name: "machin", options: [[{ name: "truc3", node: "..." }], [{ name: "truc2", node: "..." }]] }], [{ name: "bidule", options: [[{ name: "truc", node: "..." }], [{ name: "truc2", node: "..." }]] }]]

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextMenuProps) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const recursiveMenu = (menuGroups: any): React.ReactNode => {
    return (
      <>
        {menuGroups.map((menuGroup: any, groupIndex: number) => (
          <div key={menuGroup[0]?.name || groupIndex} className='flex flex-col'>
            <span className='custom-menu-separator pb-1 mx-1.5'></span>
            {menuGroup.map((node: any, nodeIndex: number) => (
              <MenuItem
                key={node.name || nodeIndex}
                node={node}
                renderMenu={recursiveMenu}
              />
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <div
      style={{ top, left, right, bottom }}
      className="z-10 absolute custom-menu p-0.5 flex flex-col gap-1"
      {...props}
    >
      <h2 className='text-gray-400 text-l font-medium mx-1.5 mt-0.5 select-none'>Add</h2>
      {recursiveMenu(menu)}
    </div>
  );
}
