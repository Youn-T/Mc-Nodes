import  { useState } from 'react';
import { Compilator } from '../compilator/compilator';
interface SidebarProps {
  nodes?: any[];
  edges?: any[];
}

export default function Sidebar({ nodes = [], edges = [] }: SidebarProps) {
  const [generated, setGenerated] = useState('');

  const generateCode = () => {
    // try {
      const payload = { nodes: nodes, connections: edges };

      const compilator = new Compilator(payload as any);


      setGenerated(compilator.compile() );
    // } catch (e) {
      // setGenerated(`// Erreur lors de la génération ${e}`);
    // }
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

      {/* {tab === 'export' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        </div>
      )} */}

      {/* {tab === 'code' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Code généré</div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={copyCode} style={{ padding: '8px' }}>Copier</button>
            <button onClick={downloadPack} style={{ padding: '8px' }}>Télécharger</button>
          </div>
        </div>
      )} */}

    </aside>
  );
}
