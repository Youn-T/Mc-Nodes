import { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useHandleConnections } from '@xyflow/react';
import { Diamond, Triangle } from 'lucide-react'
export interface CustomNodeData {
  label: string;
  headerColor?: string;
  inputs?: { id: string; label: string; type: string }[];
  outputs?: { id: string; label: string; type: string }[];
  category?: string;
  name?: string;
}

import { SocketType, SocketMode } from '../nodes/types';


// Couleurs par type de socket
const socketColors = {
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

const InputRow = ({ input, internalId, nodeInputs, setNodeInputs }: { input: any, internalId: string, nodeInputs: any, setNodeInputs: any }) => {
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
      {connections.length === 0 && socketDefaultValue.hasOwnProperty(input.type) && nodeInput({ type: input.type as SocketType, id: input.id, internalId, nodeInputs, setNodeInputs })
      }
    </div>
  );
};

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const {
    label,
    headerColor = '#2d8f6f',
    inputs = [],
    outputs = [],
    category = "",
    name = "",
  } = data;

  const [wrapped, setWrapped] = useState(true);
  const internalId = Math.random().toString(36).substring(2, 9);
  const [nodeInputs, setNodeInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Populate only missing inputs with stringified default values to keep inputs controlled
    setNodeInputs(prev => {
      const next = { ...prev };
      inputs.forEach(i => {
        if (next[i.id] === undefined) {
          const def = socketDefaultValue[i.type as keyof typeof socketDefaultValue];
          next[i.id] = def !== undefined ? String(def) : '';
        }
      });
      return next;
    });
  }, [inputs]);

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
              {(socketDefaultValue.hasOwnProperty(output.type) && category === "Constant") && nodeInput({ type: output.type as SocketType, id: output.id, internalId, nodeInputs, setNodeInputs })
              }
            </div>
          ))}

          {/* Inputs (gauche) */}
          {inputs.map((input, index) => (
            <InputRow
              key={input.id}
              input={input}
              internalId={internalId}
              nodeInputs={nodeInputs}
              setNodeInputs={setNodeInputs}
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


function nodeInput({ type, id, internalId, nodeInputs, setNodeInputs }: { type: SocketType; id: string; internalId: string, nodeInputs: Record<string, any>, setNodeInputs: React.Dispatch<React.SetStateAction<Record<string, any>>> }) {

  return (<>
    {Array.from(type === 'vector' ? [0, 1, 2] : [0]).map((compIdx) => {
      const key = type === 'vector' ? `${id}_${compIdx}` : id;
      return (
        <div className="custom-node-value-row" key={key}>
          <span className="custom-node-value-label cursor-text" onClick={() => {
            document.getElementById(`input-${internalId}-${id}-${compIdx}`)?.focus();
          }}>Value</span>
          <input
            id={`input-${internalId}-${id}-${compIdx}`}
            type="text"
            className='custom-node-input rounded-sm text-right'
            value={nodeInputs[key] ?? String(socketDefaultValue[type as keyof typeof socketDefaultValue])}
            onChange={(evt) => {
              const v = evt.target.value;

              // Autorise les étapes intermédiaires (vide, "-") pour une meilleure UX
              if (v === '' || v === '-') {
                setNodeInputs(prev => ({ ...prev, [key]: v }));
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

              setNodeInputs(prev => ({ ...prev, [key]: v }));
            }}
            onFocus={(evt) => { evt.target.select() }}
          />
        </div>
      );
    })}

  </>)
}

export default memo(CustomNode);
