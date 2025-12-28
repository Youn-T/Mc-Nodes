import React, { useState } from 'react';

interface SidebarProps {
  nodes?: any[];
  edges?: any[];
}

export default function Sidebar({ nodes = [], edges = [] }: SidebarProps) {
  const [generated, setGenerated] = useState('');
  const [tab, setTab] = useState<'export' | 'code' | 'settings'>('export');

  const generateCode = () => {
    try {
      const payload = { nodes, edges, generatedAt: new Date().toISOString() };
      const code = JSON.stringify(payload, null, 2);
      setGenerated(code);
    } catch (e) {
      setGenerated('// Erreur lors de la génération');
    }
  };

  const downloadPack = () => {
    const payload = { nodes, edges, generatedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mc-nodes-pack.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyCode = async () => {
    if (!generated) generateCode();
    try {
      await navigator.clipboard.writeText(generated || JSON.stringify({ nodes, edges }));
    } catch (e) {
      // noop
    }
  };

  return (
    <aside
      className='w-110 p-4'
      style={{ backgroundColor: "#303030" }}
    // style={{
    //   width: 320,
    //   minWidth: 260,
    //   backgroundColor: '#0f1720',
    //   color: '#e6eef8',
    //   borderLeft: '1px solid rgba(255,255,255,0.04)',
    //   display: 'flex',
    //   flexDirection: 'column',
    //   padding: '1rem',
    //   gap: '0.75rem'
    // }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className='text-white text-xl font-semibold mb-2'>Export & Génération</h3>
        <button onClick={generateCode} className='p-4 bg-neutral-600 hover:bg-neutral-500 transition duration-300  ease-in-out  text-white'>Générer le code</button>


      </div>

      <textarea
        value={generated}
        readOnly
        onFocus={() => { if (!generated) generateCode(); }}
        style={{ flex: 1, width: '100%', minHeight: 200, background: '#1A1A1A', color: '#dbeafe' , padding: 8, border: '1px solid rgba(255,255,255,0.04)' }}
      />

      {tab === 'export' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        </div>
      )}

      {tab === 'code' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Code généré</div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={copyCode} style={{ padding: '8px' }}>Copier</button>
            <button onClick={downloadPack} style={{ padding: '8px' }}>Télécharger</button>
          </div>
        </div>
      )}

    </aside>
  );
}
