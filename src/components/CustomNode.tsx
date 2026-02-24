import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, useHandleConnections, Node } from '@xyflow/react';
import { Diamond, Triangle } from 'lucide-react'

import { SocketType, SocketMode } from '../nodes/types';

export type SocketData = {
  id: string;
  label: string;
  type: string;
  mode?: string;
  value?: string | Record<string, string>; // string pour les types simples, Record pour les vecteurs {0: "x", 1: "y", 2: "z"}
  options?: string[]; // Pour les inputs de type select/dropdown
};

export type CustomNodeData = {
  label: string;
  headerColor?: string;
  inputs?: SocketData[];
  outputs?: SocketData[];
  category?: string;
  name?: string;
  wrapped?: boolean;
  deletable?: boolean; // Si false, le node ne peut pas être supprimé

  groupKey?: string; // Clé du component group dans les données
  componentKey?: string; // Clé du composant dans les données
  parentGroupKey?: string; // Clé du group parent pour les composants

  eventKey?: string; // Clé de l'event dans les données (pour les nodes d'event)
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
        {/* { (!(connections.length === 0 && socketDefaultValue.hasOwnProperty(input.type))) &&  */}
        {(!(connections.length === 0 && socketDefaultValue.hasOwnProperty(input.type))) && <span className="custom-node-label input-label ">{input.label}</span>}
        {connections.length === 0 && socketDefaultValue.hasOwnProperty(input.type) &&
          nodeInput({ type: input.type as SocketType, socket: input, internalId, getSocketValue, updateSocketValue, isOutput: false, label: input.label })
        }
      </div>

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

  const [wrapped, setWrapped] = useState(Object.prototype.hasOwnProperty.call(data, 'wrapped') ? !data.wrapped : true);
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
          {outputs.map((output, _index) => (
            <div key={output.id} className="custom-node-row output-row flex flex-col items-end">



              <div className='relative'>
                {(!(socketDefaultValue.hasOwnProperty(output.type) && category === "Constant")) && <span className="custom-node-label output-label">{output.label}</span>}
                {(socketDefaultValue.hasOwnProperty(output.type) && category === "Constant") &&
                  nodeInput({ type: output.type as SocketType, socket: output, internalId, getSocketValue, updateSocketValue, isOutput: true, label: output.label })
                }
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

            </div>
          ))}

          {/* Inputs (gauche) */}
          {inputs.map((input, _index) => (
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
            {inputs.map((input, _index) => (
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
            {outputs.map((output, _index) => (
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


// ── Composant dropdown custom pour correspondre au style sombre ──────────────

function CustomDropdown({ value, options, onChange, label }: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as unknown as globalThis.Node)) {
        setIsOpen(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="w-full relative" ref={containerRef}>
      <div
        className="custom-node-value-row cursor-pointer select-none"
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
      >
        <span className="custom-node-value-label truncate">{label || "Value"}</span>
        <span className="text-right flex items-center gap-1 text-white text-xs" style={{ maxWidth: '7.5rem' }}>
          <span className="truncate">{value || '--'}</span>
          <span className="text-neutral-400 text-[10px]">▾</span>
        </span>
      </div>
      {isOpen && (
        <div
          className="absolute z-[100] mt-0.5 rounded shadow-lg overflow-y-auto custom-menu-scroll"
          style={{
            maxHeight: '160px',
            minWidth: '100%',
            left: 0,
            right: 0,
            background: '#1e1e1e',
            border: '1px solid #3f3f3f',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="px-2 py-1 text-xs cursor-pointer"
            style={{ color: '#999' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#3f3f3f'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            onClick={() => { onChange(""); setIsOpen(false); }}
          >--</div>
          {options.map(opt => (
            <div
              key={opt}
              className="px-2 py-1 text-xs cursor-pointer"
              style={{
                color: '#e0e0e0',
                background: opt === value ? '#2d4a7c' : 'transparent',
              }}
              onMouseEnter={(e) => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = '#3f3f3f'; }}
              onMouseLeave={(e) => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              onClick={() => { onChange(opt); setIsOpen(false); }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function nodeInput({ type, socket, internalId, getSocketValue, updateSocketValue, isOutput, label }: {
  type: SocketType;
  socket: SocketData;
  internalId: string;
  getSocketValue: (socket: SocketData, componentIndex?: number) => string;
  updateSocketValue: (socketId: string, newValue: string, isOutput: boolean, componentIndex?: number) => void;
  isOutput: boolean;
  label: string;
}) {
  const id = socket.id;

  // Cas spécial pour select/dropdown quand des options sont présentes
  if (socket.options && socket.options.length > 0) {
    const currentValue = getSocketValue(socket);
    return (
      <CustomDropdown
        key={`${id}-select`}
        value={currentValue}
        options={socket.options}
        onChange={(val) => updateSocketValue(id, val, isOutput)}
        label={label || "Value"}
      />
    );
  }

  // Cas spécial pour boolean : affiche une checkbox
  if (type === 'boolean') {
    const currentValue = getSocketValue(socket);
    const isChecked = currentValue === 'true';

    return (
      <div className="w-full">
        <div className="custom-node-value-row flex items-center justify-between " key={`${id}-boolean`}>
          <span className="custom-node-value-label">{label ? label : "Value"}</span>
          <label
            className="custom-node-checkbox-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              cursor: 'pointer',
            }}
          >
            <input
              id={`input-${internalId}-${id}-boolean`}
              type="checkbox"
              checked={isChecked}
              onChange={(evt) => {
                updateSocketValue(id, evt.target.checked ? 'true' : 'false', isOutput);
              }}
              style={{ display: 'none' }}
            />
            <div
              className="custom-node-checkbox"
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '2px',
                border: `2px solid #a3a3a3`,
                backgroundColor: isChecked ? '#a3a3a3' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease',
              }}
            >
              {isChecked && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </label>
        </div>
      </div>);
  }

  return (<>
    {Array.from(type === 'vector' ? [0, 1, 2] : [0]).map((compIdx) => {
      const currentValue = getSocketValue(socket, type === 'vector' ? compIdx : undefined);
      return (
        <div className="w-full" key={`${id}-container-${compIdx}`}>
          <div className="custom-node-value-row" key={`${id}-${compIdx}`}>
            <span className="custom-node-value-label cursor-text truncate" onClick={() => {
              document.getElementById(`input-${internalId}-${id}-${compIdx}`)?.focus();
            }}>{label ? label : "Value"}</span>
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
        </div>);
    })}

  </>)
}

export default memo(CustomNode);
