import Graph from "../../graphs/Graph"

interface RenderControllersData {
    name: string;
}

function RenderControllersGraph({ renderControllersData }: { renderControllersData: RenderControllersData }) {
    return (<>
        <Graph></Graph>

        {/* Sidebar: Liste des events/groups */}
        <div className="w-64 bg-neutral-800 border-l border-neutral-700 overflow-y-auto p-2">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Render Controllers</div>

        </div>
    </>)
}

export default RenderControllersGraph;