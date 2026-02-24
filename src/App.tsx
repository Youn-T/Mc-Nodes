import { ReactFlowProvider } from '@xyflow/react';
import { WorkspaceProvider, useWorkspace } from './contexts/WorkspaceContext';
import Workspace from './components/Workspace';
import Navbar from './components/Navbar';
import Importer from './components/Importer';

function FlowContent() {
  const { data, loadWorkspace, selectItem } = useWorkspace();

  return (
    <div style={{ width: '100vw', height: '100vh' }} className='flex select-none'>
      {data !== null && (
        <>
          <Navbar data={data} onItemSelect={selectItem} />
          <Workspace />
        </>
      )}
      {data === null && (
        <Importer onDataImport={loadWorkspace} />
      )}
    </div>
  );
}

function Flow() {
  return (
    <WorkspaceProvider>
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </WorkspaceProvider>
  );
}

export default Flow;
