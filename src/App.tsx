import {

  ReactFlowProvider
} from '@xyflow/react';

import Workspace from './components/Workspace';
import Navbar, { explorerData, browserData } from './components/Navbar';
import { useState } from 'react';

import Importer from './components/Importer';

function FlowContent() {

  const [data, setData] = useState<{ explorer: explorerData, browser: browserData } | null>(/*{ explorer: { entities: ["test", "machin"], blocks: ["machin", "truc"], items: ["bidule"], scripts: ["truc random", "pas d'idée", "chose"] }, browser: { textures: ["test", "machin"], models: ["machin", "truc"], audio: ["bidule"] } }*/null);

  const [_files, setFiles] = useState<Record<string, { blob: Blob, url: string }> | null>(null);

  const [selected, setSelected] = useState<{ tab: string, section?: string, item?: any, index?: number } | null>(null);

  function handleItemSelect(payload: { tab: string, section?: string, item: any, index: number }): void {
    setSelected(payload);
  }

  function handleDataImport(importedData: { explorer: explorerData, browser: browserData }, importedFiles: Record<string, { blob: Blob, url: string }>): void {
    setData(importedData);
    setFiles(importedFiles);
  }
  // const [currentView, setCurrentView] = useState<any>('flow');

  return (
    <div style={{ width: '100vw', height: '100vh' }} className='flex'>
      {data !== null && <><Navbar data={data} onItemSelect={handleItemSelect} />
        <Workspace selected={selected}></Workspace></>}
      {data === null && <Importer onDataImport={handleDataImport}></Importer>}
      {/* {selected?.tab === 'explorer' && <FlowGraph />} */}


    </div>
  );
}

function Flow() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}

export default Flow;