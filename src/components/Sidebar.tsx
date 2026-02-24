import  { useState } from 'react';
import { Compilator } from '../compilator/compilator';
import type { CompilationGraph } from '../types/compilator';

interface SidebarProps {
  nodes?: any[];
  edges?: any[];
}

export default function Sidebar({ nodes = [], edges = [] }: SidebarProps) {
  const [generated, setGenerated] = useState('');

  const generateCode = (): void => {
    const payload: CompilationGraph = { nodes, connections: edges };
    const compilator = new Compilator(payload);
    const result = compilator.compile();
    setGenerated(result.output);
  };


  return (
    <aside
      className='w-110 p-4'
      style={{ backgroundColor: "#303030" }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className='text-white text-xl font-semibold mb-2'>Export & Génération</h3>
        <button onClick={generateCode} className='p-4 bg-neutral-600 hover:bg-neutral-500 transition duration-300  ease-in-out  text-white'>Générer le code</button>


      </div>

      <textarea
        value={generated}
        readOnly
        onFocus={() => { if (!generated) generateCode(); }}
        style={{ flex: 1, width: '100%', minHeight: 200, background: '#1A1A1A', color: '#dbeafe', padding: 8, border: '1px solid rgba(255,255,255,0.04)' }}
      />
    </aside>
  );
}
