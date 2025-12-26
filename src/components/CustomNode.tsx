import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Diamond, Triangle } from 'lucide-react'
export interface CustomNodeData {
  label: string;
  headerColor?: string;
  inputs?: { id: string; label: string; type: string }[];
  outputs?: { id: string; label: string; type: string }[];
}

import { SocketType, SocketMode } from '../nodes/nodes';


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

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const {
    label,
    headerColor = '#2d8f6f',
    inputs = [],
    outputs = [],
  } = data;

  const [wrapped, setWrapped] = useState(true);

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
            <div key={output.id} className="custom-node-row output-row">
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
          ))}

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
              <span className="custom-node-label input-label ">{input.label}</span>
            </div>
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

export default memo(CustomNode);
