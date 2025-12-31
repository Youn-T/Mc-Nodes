import { memo, useState } from 'react';
import { Handle, Position, useHandleConnections, Node } from '@xyflow/react';
import { Diamond, Triangle } from 'lucide-react'

import { SocketType, SocketMode } from '../nodes/types';

export type SocketData = {
  id: string;
  label: string;
  type: string;
  mode?: string;
  value?: string | Record<string, string>; // string pour les types simples, Record pour les vecteurs {0: "x", 1: "y", 2: "z"}
};

export type CustomNodeData = {
  label: string;
  headerColor?: string;
  inputs?: SocketData[];
  outputs?: SocketData[];
  category?: string;
  name?: string;
  onDataChange?: (socketId: string, value: string | Record<string, string>, isOutput: boolean) => void;
};

export type CustomNodeType = Node<CustomNodeData, 'custom'>;


// Couleurs par type de socket
const socketColors: Record<string, string> = {
  boolean: "#CC4545",
  integer: "#CC9645",
  float: "#B1CC45",
  string: "#60CC45",
  vector: "#45CC7B",
  entity: "#45CCCC",
  item: "#457BCC",
  block: "#6045CC",
  player: "#B145CC",
  rotation: "#CC4596",
  camera: "#457BCC",
};

const socketDefaultValue = {
  boolean: false,
  integer: 0,
  float: 0.0,
  string: "",
  vector: 0,
}

const InputRow = ({ input, internalId, getSocketValue, updateSocketValue }: { 
  input: SocketData, 
  internalId: string, 
  getSocketValue: (socket: SocketData, componentIndex?: number) => string,
  updateSocketValue: (socketId: string, newValue: string, isOutput: boolean, componentIndex?: number) => void
}) => {
  const connections = useHandleConnections({
    type: 'target',
    id: input.id
  });

  return (
    <div className="custom-node-row input-row flex flex-col">
      <div className='relative w-full'>
        <Handle
          type="target"
          position={Position.Left}
          id={input.id}
          className="custom-handle"
          style={{
            background: 'transparent',
            border: 'none',
          }}>
          {input.mode === SocketMode.TRIGGER && <Triangle
            fill="#FFF"
            style={{
              pointerEvents: 'none',
              fontSize: '0.5px',
              width: '12px',
              bottom: "-8.85px",
              right: '-3px',
              position: 'absolute',
              color: '#fff',
              rotate: '-90deg',
            }}
          />
          }

          {input.mode === SocketMode.VALUE && <Diamond
            fill={socketColors[input.type]}
            style={{
              pointerEvents: 'none',
              fontSize: '0.5px',
              width: '12px',
              bottom: "-8.85px",
              right: '-3px',
              position: 'absolute',
              color: '#fff',
              rotate: '-90deg',
            }}
          />
          }


        </Handle>
        {/* <span className="custom-node-socket-indicator" style={{ background: socketColors[input.type] || socketColors.default }} /> */}
        <span className="custom-node-label input-label ">{input.label}</span>
      </div>
      {connections.length === 0 && socketDefaultValue.hasOwnProperty(input.type) && 
        nodeInput({ type: input.type as SocketType, socket: input, internalId, getSocketValue, updateSocketValue, isOutput: false })
      }
    </div>
  );
};

function CustomNode({ data, selected }: { data: CustomNodeData; selected?: boolean; id?: string }) {
  const {
    label,
    headerColor = '#2d8f6f',
    inputs = [],
    outputs = [],
    category = "",
    onDataChange,
  } = data;

  const [wrapped, setWrapped] = useState(true);
  const internalId = Math.random().toString(36).substring(2, 9);
  
  // Fonction pour obtenir la valeur d'un socket (input ou output)
  const getSocketValue = (socket: SocketData, componentIndex?: number): string => {
    const socketType = socket.type as keyof typeof socketDefaultValue;
    const defaultVal = socketDefaultValue[socketType];
    
    if (socket.type === 'vector') {
      // Pour les vecteurs, la valeur est un Record<string, string>
      const vectorValue = socket.value as Record<string, string> | undefined;
      if (vectorValue && componentIndex !== undefined && vectorValue[componentIndex] !== undefined) {
        return vectorValue[componentIndex];
      }
      return String(socketDefaultValue.vector);
    } else {
      // Pour les autres types
      if (socket.value !== undefined) {
        return socket.value as string;
      }
      return defaultVal !== undefined ? String(defaultVal) : '';
    }
  };

  // Fonction pour mettre à jour la valeur d'un socket
  const updateSocketValue = (socketId: string, newValue: string, isOutput: boolean, componentIndex?: number) => {
    if (!onDataChange) return;
    
    const socketList = isOutput ? outputs : inputs;
    const socket = socketList.find(s => s.id === socketId);
    if (!socket) return;
    
    if (socket.type === 'vector' && componentIndex !== undefined) {
      // Pour les vecteurs, on met à jour un composant spécifique
      const currentValue = (socket.value as Record<string, string>) || { '0': '0', '1': '0', '2': '0' };
      const updatedValue = { ...currentValue, [componentIndex]: newValue };
      onDataChange(socketId, updatedValue, isOutput);
    } else {
      // Pour les autres types
      onDataChange(socketId, newValue, isOutput);
    }
  };

  return (
    <>
      {wrapped && <div
        className={`custom-node ${selected ? 'selected' : ''}`}
        style={{
          '--header-color': headerColor,
        } as React.CSSProperties}
      >
        {/* Header */}
        <div className="custom-node-header">
          <span className="custom-node-collapse" onClick={() => setWrapped(false)}>▽</span>
          <span className="custom-node-title">{label}</span>
        </div>
        {/* Body */}
        <div className="custom-node-body">
          {/* Outputs (droite) */}
          {outputs.map((output, index) => (
            <div key={output.id} className="custom-node-row output-row flex flex-col items-end">



              <div className='relative'>
                <span className="custom-node-label output-label">{output.label}</span>

                <Handle
                  type="source"
                  position={Position.Right}
                  id={output.id}
                  className="custom-handle"
                  style={{
                    background: 'transparent',
                    border: 'none',
                  }}
                >{output.mode === SocketMode.TRIGGER && <Triangle
                  fill="#FFF"
                  style={{
                    pointerEvents: 'none',
                    fontSize: '0.5px',
                    width: '12px',
                    bottom: "-8.85px",
                    right: '-3px',
                    position: 'absolute',
                    color: '#fff',
                    rotate: '90deg',
                  }}
                />
                  }

                  {output.mode === SocketMode.VALUE && <Diamond
                    fill={socketColors[output.type]}
                    style={{
                      pointerEvents: 'none',
                      fontSize: '0.5px',
                      width: '12px',
                      bottom: "-8.85px",
                      right: '-3px',
                      position: 'absolute',
                      color: '#fff',
                      rotate: '-90deg',
                    }}
                  />
                  }</Handle>
              </div>
              {(socketDefaultValue.hasOwnProperty(output.type) && category === "Constant") && 
                nodeInput({ type: output.type as SocketType, socket: output, internalId, getSocketValue, updateSocketValue, isOutput: true })
              }
            </div>
          ))}

          {/* Inputs (gauche) */}
          {inputs.map((input, index) => (
            <InputRow
              key={input.id}
              input={input}
              internalId={internalId}
              getSocketValue={getSocketValue}
              updateSocketValue={updateSocketValue}
            />
          ))}
        </div>
      </div>}

      {!wrapped && <div
        className={`custom-node-wrapped ${selected ? 'selected' : ''}`}
        style={{
          '--header-color': headerColor,
        } as React.CSSProperties}
      >
        {/* Header */}
        <div className="custom-node-header-wrapped">
          <span className="custom-node-collapse" onClick={() => setWrapped(true)}>▷</span>
          <span className="custom-node-title">{label}</span>
        </div>
        {/* Body */}
        <div className="pb-[8px] flex justify-between">
          {/* Outputs (droite) */}

          <div className="gap-y-[6px] flex flex-col">
            {/* Inputs (gauche) */}
            {inputs.map((input, index) => (
              <div key={input.id} className="custom-node-row input-row">
                <Handle
                  type="target"
                  position={Position.Left}
                  id={input.id}
                  className="custom-handle"
                  style={{
                    background: 'transparent',
                    border: 'none',
                  }}>
                  {input.mode === SocketMode.TRIGGER && <Triangle
                    fill="#FFF"
                    style={{
                      pointerEvents: 'none',
                      fontSize: '0.5px',
                      width: '12px',
                      bottom: "-8.85px",
                      right: '-3px',
                      position: 'absolute',
                      color: '#fff',
                      rotate: '-90deg',
                    }}
                  />
                  }

                  {input.mode === SocketMode.VALUE && <Diamond
                    fill={socketColors[input.type]}
                    style={{
                      pointerEvents: 'none',
                      fontSize: '0.5px',
                      width: '12px',
                      bottom: "-8.85px",
                      right: '-3px',
                      position: 'absolute',
                      color: '#fff',
                      rotate: '-90deg',
                    }}
                  />
                  }
                </Handle>
                {/* <span className="custom-node-socket-indicator" style={{ background: socketColors[input.type] || socketColors.default }} /> */}
              </div>
            ))}</div>
          <div className="gap-y-[6px] flex flex-col">
            {outputs.map((output, index) => (
              <div key={output.id} className="custom-node-row output-row">
                <Handle
                  type="source"
                  position={Position.Right}
                  id={output.id}
                  className="custom-handle"
                  style={{
                    background: 'transparent',
                    border: 'none',
                  }}
                >{output.mode === SocketMode.TRIGGER && <Triangle
                  fill="#FFF"
                  style={{
                    pointerEvents: 'none',
                    fontSize: '0.5px',
                    width: '12px',
                    bottom: "-8.85px",
                    right: '-3px',
                    position: 'absolute',
                    color: '#fff',
                    rotate: '90deg',
                  }}
                />
                  }

                  {output.mode === SocketMode.VALUE && <Diamond
                    fill={socketColors[output.type]}
                    style={{
                      pointerEvents: 'none',
                      fontSize: '0.5px',
                      width: '12px',
                      bottom: "-8.85px",
                      right: '-3px',
                      position: 'absolute',
                      color: '#fff',
                      rotate: '-90deg',
                    }}
                  />
                  }</Handle>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </>
  );
}


function nodeInput({ type, socket, internalId, getSocketValue, updateSocketValue, isOutput }: { 
  type: SocketType; 
  socket: SocketData; 
  internalId: string;
  getSocketValue: (socket: SocketData, componentIndex?: number) => string;
  updateSocketValue: (socketId: string, newValue: string, isOutput: boolean, componentIndex?: number) => void;
  isOutput: boolean;
}) {
  const id = socket.id;

  return (<>
    {Array.from(type === 'vector' ? [0, 1, 2] : [0]).map((compIdx) => {
      const currentValue = getSocketValue(socket, type === 'vector' ? compIdx : undefined);
      return (
        <div className="custom-node-value-row" key={`${id}-${compIdx}`}>
          <span className="custom-node-value-label cursor-text" onClick={() => {
            document.getElementById(`input-${internalId}-${id}-${compIdx}`)?.focus();
          }}>Value</span>
          <input
            id={`input-${internalId}-${id}-${compIdx}`}
            type="text"
            className='custom-node-input rounded-sm text-right'
            value={currentValue}
            onChange={(evt) => {
              const v = evt.target.value;

              // Autorise les étapes intermédiaires (vide, "-") pour une meilleure UX
              if (v === '' || v === '-') {
                updateSocketValue(id, v, isOutput, type === 'vector' ? compIdx : undefined);
                return;
              }

              // Choix du regex selon type (entier vs flottant)
              const isText = type === 'string';
              const isInteger = type === 'integer';
              const intRegex = /^-?\d*$/;
              const floatRegex = /^-?\d*\.?\d*$/;

              const ok = isText ? true : isInteger ? intRegex.test(v) : floatRegex.test(v);

              if (!ok) {
                // invalide — n'applique pas la mise à jour
                return;
              }

              updateSocketValue(id, v, isOutput, type === 'vector' ? compIdx : undefined);
            }}
            onFocus={(evt) => { evt.target.select() }}
          />
        </div>
      );
    })}

  </>)
}

export default memo(CustomNode);
