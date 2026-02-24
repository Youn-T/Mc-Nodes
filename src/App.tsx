import {

  ReactFlowProvider
} from '@xyflow/react';

import Workspace from './components/Workspace';
import Navbar from './components/Navbar';
import type { ExplorerData, BrowserData } from './types/workspace';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { useState } from 'react';

import Importer from './components/Importer';

function FlowContent() {

  const [data, setData] = useState<{ explorer: ExplorerData, browser: BrowserData } | null>(null);

  const [_files, setFiles] = useState<Record<string, { blob: Blob, url: string }> | null>(null);

  const [selected, setSelected] = useState<{ tab: string, section?: string, item?: any, index?: number } | null>(null);

  function handleItemSelect(payload: { tab: string, section?: string, item: any, index: number }): void {
    setSelected(payload);
  }

  function handleDataImport(importedData: { explorer: ExplorerData, browser: BrowserData }, importedFiles: Record<string, { blob: Blob, url: string }>): void {
    setData(importedData);
    setFiles(importedFiles);
  }

  return (
    <WorkspaceProvider value={{ data }}>
      <div style={{ width: '100vw', height: '100vh' }} className='flex select-none'>
        {data !== null && <><Navbar data={data} onItemSelect={handleItemSelect} />
          <Workspace selected={selected}></Workspace></>}
        {data === null && <Importer onDataImport={handleDataImport} ></Importer>}
      </div>
    </WorkspaceProvider>
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