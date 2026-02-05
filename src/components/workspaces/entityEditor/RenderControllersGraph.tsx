import Graph from "../../graphs/Graph"

interface RenderControllersData {
    name: string;
}

function RenderControllersGraph({ renderControllersData }: { renderControllersData: (string | Record<string, string>)[] }) {
    return (<>
        <Graph></Graph>

        {/* Sidebar: Liste des events/groups */}
        <div className="w-64 bg-neutral-800 border-l border-neutral-700 overflow-y-auto p-2">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Render Controllers</div>
            {
                renderControllersData.map((rc, index) => {
                    const name = typeof rc === "string" ? rc : Object.keys(rc)[0];
                    return (
                        <div className="bg-neutral-700 rounded px-2 pb-2 text-sm pt-1 mb-1" key={index}>
                             <div className="text-xs text-neutral-400">{name}</div>
                        </div>
                    )
                })
            }
        </div>
    </>)
}

export default RenderControllersGraph;
