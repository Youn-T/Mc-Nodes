import AudioPreview from './workspaces/AudioPreview';
import EntityEditor from './workspaces/EntityEditor';
import ImagePreview from './workspaces/ImagePreview';
import ModelPreview from './workspaces/ModelPreview';
import { useWorkspace } from '../contexts/WorkspaceContext';

function Workspace() {
    const { selected } = useWorkspace();


    if (!selected) {
        return <div className="flex-1 bg-neutral-900 flex items-center justify-center flex-col"><div className="text-neutral-200 text-3xl font-semibold">No item selected</div><div className="text-neutral-400 text-xl">Please select an item from the navbar to begin</div></div>;
    }
    // console.log('Workspace received selected item:', selected);
    // if (selected.tab === 'content browser') {
    switch (selected.section) {
        case 'textures':
            return <ImagePreview asset={selected.item} />;
        case 'models':
            return <ModelPreview asset={selected.item} />;
        case 'audio':
            return <AudioPreview asset={selected.item} />;
        case 'entities':
            return <EntityEditor asset={selected.item} onChange={(newData) => { void newData; }} />;
        // }
        default:
            return (
                <div className="flex-1 bg-neutral-900 flex items-center justify-center">
                    <div className="text-neutral-400">Unknown section: {selected.section}</div>
                </div>
            );
    }

}

export default Workspace;