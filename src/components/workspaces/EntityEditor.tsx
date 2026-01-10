import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff, Workflow, Box, Settings, Plus, Trash2 } from "lucide-react";

type Tab = "events" | "visuals" | "settings";

// Composant pour un item de component (style Blender)
function ComponentItem({ name, isOpen, onToggle, children }: { name: string; isOpen: boolean; onToggle: () => void; children?: React.ReactNode }) {
    const [enabled, setEnabled] = useState(true);

    return (
        <div className="border border-neutral-600 rounded bg-neutral-800 mb-1">
            <div className="flex items-center gap-1 px-2 py-1.5 cursor-pointer hover:bg-neutral-700" onClick={onToggle}>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="flex-1 text-sm font-medium truncate">{name.replace("minecraft:", "")}</span>
                <button 
                    className="p-1 hover:bg-neutral-600 rounded" 
                    onClick={(e) => { e.stopPropagation(); setEnabled(!enabled); }}
                >
                    {enabled ? <Eye size={14} className="text-green-400" /> : <EyeOff size={14} className="text-neutral-500" />}
                </button>
                <button className="p-1 hover:bg-red-900/50 rounded text-red-400" onClick={(e) => e.stopPropagation()}>
                    <Trash2 size={14} />
                </button>
            </div>
            {isOpen && (
                <div className="px-3 py-2 border-t border-neutral-600 bg-neutral-850 text-xs">
                    {children || <span className="text-neutral-500 italic">Propriétés du composant...</span>}
                </div>
            )}
        </div>
    );
}

function EntityEditor({ asset }: { asset: { res?: { name: string, url: string, blob: Blob }, bev?: { name: string, url: string, blob: Blob } } }) {
    const [resContent, setResContent] = useState<Record<string, any>>({});
    const [behContent, setBehContent] = useState<Record<string, any>>({});
    const [activeTab, setActiveTab] = useState<Tab>("settings");
    const [openComponents, setOpenComponents] = useState<Set<string>>(new Set());

    const [clientData, setClientData] = useState<any>({});
    const [entityData, setEntityData] = useState<any>({});

    const [name, setName] = useState<string>("");
    const [identifier, setIdentifier] = useState<string>("");
    const [components, setComponents] = useState<Record<string, any>>({});
    const [componentGroups, setComponentGroups] = useState<Record<string, any>>({});
    const [events, setEvents] = useState<Record<string, any>>({});

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const resBlob: Blob | null = asset?.res?.blob ?? null;
                const behBlob: Blob | null = asset?.bev?.blob ?? null;

                const resText = resBlob ? await resBlob.text() : "{}";
                const behText = behBlob ? await behBlob.text() : "{}";

                // Parse locally pour éviter d'utiliser des états stale et relancer l'effet inutilement
                let parsedRes: Record<string, any> = {};
                let parsedBeh: Record<string, any> = {};
                try {
                    parsedRes = JSON.parse(resText.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '') || "{}");
                } catch (e) {
                    parsedRes = {};
                }
                try {
                    parsedBeh = JSON.parse(behText.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '') || "{}");
                } catch (e) {
                    parsedBeh = {};
                }

                if (!mounted) return;

                // Mettre à jour les states à partir des parsed locaux
                setResContent(parsedRes);
                setBehContent(parsedBeh);

                const parsedEntity = parsedBeh["minecraft:entity"] || {};
                const parsedClient = parsedRes["minecraft:client_entity"] || {};

                setEntityData(parsedEntity);
                setClientData(parsedClient);

                const derivedIdentifier = parsedEntity?.description?.identifier || parsedClient?.description?.identifier || "";
                setIdentifier(derivedIdentifier);

                const derivedName = (parsedClient?.description?.identifier || parsedEntity?.description?.identifier || "Unnamed Entity")
                    ?.split(":")?.[1]?.split("_")?.join(" ") || "";
                setName(derivedName);

                setComponents(parsedEntity?.components || {});
                setComponentGroups(parsedEntity?.component_groups || {});
                setEvents(parsedEntity?.events || {});

                // console.log('Loaded entity data:', { parsedRes, parsedBeh, parsedEntity, parsedClient });
            } catch (err) {
                console.log('Error loading entity data', err);
            }
        }
        load();
        return () => { mounted = false; };
    }, [asset]);

    // const name = (clientData?.description?.identifier || entityData?.description?.identifier || "Unnamed Entity")?.split(":")?.[1]?.split("_")?.join(" ");
    // const identifier = entityData?.description?.identifier || clientData?.description?.identifier || "";
    // const components = entityData?.components || {};
    // console.log('Components:', components);
    // const componentGroups = entityData?.component_groups || {};
    // const events = entityData?.events || {};

    const toggleComponent = (key: string) => {
        setOpenComponents(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "events", label: "Events & Logic", icon: <Workflow size={16} /> },
        { id: "visuals", label: "Visuals", icon: <Box size={16} /> },
        { id: "settings", label: "Settings", icon: <Settings size={16} /> },
    ];

    return (
        <div className="flex-1 bg-neutral-900 flex flex-col h-full overflow-hidden">
            {/* Header avec nom et onglets */}
            <div className="bg-neutral-800 border-b border-neutral-700">
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-700">
                    <div>
                        <h2 className="capitalize font-bold text-lg">{name}</h2>
                        {/* <span className="text-xs text-neutral-400 font-mono">{identifier}</span> */}
                    </div>
                    <div className="flex gap-2 text-xs">
                        <span className="bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                            {Object.keys(components).length} components
                        </span>
                        <span className="bg-orange-900/50 text-orange-400 px-2 py-0.5 rounded">
                            {Object.keys(componentGroups).length} groups
                        </span>
                        <span className="bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">
                            {Object.keys(events).length} events
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                                activeTab === tab.id
                                    ? "border-blue-500 text-blue-400 bg-neutral-900"
                                    : "border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-750"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {/* TAB: Events & Logic - Graph Editor */}
                {activeTab === "events" && (
                    <div className="h-full flex">
                        {/* Graph Canvas */}
                        <div className="flex-1 relative bg-[#1a1a1a] bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px]">
                            <div className="absolute top-4 left-4 z-10 flex gap-2">
                                <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-sm flex items-center gap-1">
                                    <Plus size={14} /> Event
                                </button>
                                <button className="bg-orange-600 hover:bg-orange-500 px-3 py-1.5 rounded text-sm flex items-center gap-1">
                                    <Plus size={14} /> Component Group
                                </button>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-neutral-600 text-center">
                                    <Workflow size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>Graph Editor</p>
                                    <p className="text-xs mt-1">Events → Component Groups</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Liste des events/groups */}
                        <div className="w-64 bg-neutral-800 border-l border-neutral-700 overflow-y-auto">
                            <div className="p-2 border-b border-neutral-700">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Events</div>
                                {Object.keys(events).map(eventKey => (
                                    <div key={eventKey} className="text-sm px-2 py-1.5 bg-blue-900/30 hover:bg-blue-900/50 rounded mb-1 cursor-pointer truncate border-l-2 border-blue-500">
                                        {eventKey.replace("minecraft:", "").replace("better_on_bedrock:", "")}
                                    </div>
                                ))}
                            </div>
                            <div className="p-2">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Component Groups</div>
                                {Object.keys(componentGroups).map(groupKey => (
                                    <div key={groupKey} className="text-sm px-2 py-1.5 bg-orange-900/30 hover:bg-orange-900/50 rounded mb-1 cursor-pointer truncate border-l-2 border-orange-500">
                                        {groupKey.replace("minecraft:", "").replace("better_on_bedrock:", "")}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: Visuals */}
                {activeTab === "visuals" && (
                    <div className="h-full flex">
                        {/* 3D Preview */}
                        <div className="flex-1 bg-neutral-950 flex items-center justify-center relative">
                            <div className="text-neutral-600 text-center">
                                <Box size={64} className="mx-auto mb-2 opacity-50" />
                                <p>3D Model Preview</p>
                                <p className="text-xs mt-1">Drag to rotate • Scroll to zoom</p>
                            </div>
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <button className="bg-neutral-700 hover:bg-neutral-600 px-3 py-1 rounded text-xs">Idle</button>
                                <button className="bg-neutral-800 hover:bg-neutral-600 px-3 py-1 rounded text-xs">Walk</button>
                                <button className="bg-neutral-800 hover:bg-neutral-600 px-3 py-1 rounded text-xs">Attack</button>
                            </div>
                        </div>

                        {/* Sidebar: Materials, Textures, etc. */}
                        <div className="w-80 bg-neutral-800 border-l border-neutral-700 overflow-y-auto">
                            {/* Geometry */}
                            <div className="p-3 border-b border-neutral-700">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Geometry</div>
                                <div className="bg-neutral-700 rounded p-2 text-sm">
                                    <div className="text-neutral-300">{clientData?.description?.geometry?.default || "geometry.unknown"}</div>
                                </div>
                            </div>

                            {/* Textures */}
                            <div className="p-3 border-b border-neutral-700">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex justify-between items-center">
                                    Textures
                                    <button className="text-blue-400 hover:text-blue-300"><Plus size={14} /></button>
                                </div>
                                {Object.entries(clientData?.description?.textures || {}).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2 bg-neutral-700 rounded p-2 mb-1">
                                        <div className="w-8 h-8 bg-neutral-600 rounded flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-neutral-400">{key}</div>
                                            <div className="text-sm truncate ">{String(value).split("/").pop()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Render Controllers */}
                            <div className="p-3 border-b border-neutral-700">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Render Controllers</div>
                                {(clientData?.description?.render_controllers || []).map((rc: string, i: number) => (
                                    <div key={i} className="text-sm px-2 py-1.5 bg-neutral-700 rounded mb-1 truncate">
                                        {rc}
                                    </div>
                                ))}
                            </div>

                            {/* Animations */}
                            <div className="p-3">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex justify-between items-center">
                                    Animations
                                    <button className="text-blue-400 hover:text-blue-300"><Plus size={14} /></button>
                                </div>
                                {Object.entries(clientData?.description?.animations || {}).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between bg-neutral-700 rounded p-2 mb-1 text-sm">
                                        <span className="text-neutral-300">{key}</span>
                                        <span className="text-xs text-neutral-500 truncate ml-2">{String(value).split(".").pop()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: Settings & Components */}
                {activeTab === "settings" && (
                    <div className="h-full flex">
                        {/* Left: Base Settings */}
                        <div className="w-80 bg-neutral-850 border-r border-neutral-700 overflow-y-auto p-4">
                            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Entity Description</div>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-neutral-400 block mb-1">Identifier</label>
                                    <input 
                                        type="text" 
                                        value={identifier}
                                        readOnly
                                        className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center justify-between bg-neutral-700 rounded px-3 py-2">
                                        <span className="text-sm">Spawnable</span>
                                        <input type="checkbox" checked={!!entityData?.description?.is_spawnable} readOnly className="accent-blue-500 focus:outline-none" />
                                    </div>
                                    <div className="flex items-center justify-between bg-neutral-700 rounded px-3 py-2">
                                        <span className="text-sm">Summonable</span>
                                        <input type="checkbox" checked={!!entityData?.description?.is_summonable} readOnly className="accent-blue-500 focus:outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-neutral-400 block mb-1">Format Version</label>
                                    <input 
                                        type="text" 
                                        value={behContent?.format_version || "1.21.0"}
                                        readOnly
                                        className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-6">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Quick Stats</div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {components["minecraft:health"] && (
                                        <div className="bg-red-900/30 border border-red-800 rounded p-2">
                                            <div className="text-xs text-red-400">Health</div>
                                            <div className="font-bold">{components["minecraft:health"]?.max || components["minecraft:health"]?.value}</div>
                                        </div>
                                    )}
                                    {components["minecraft:movement"] && (
                                        <div className="bg-blue-900/30 border border-blue-800 rounded p-2">
                                            <div className="text-xs text-blue-400">Movement</div>
                                            <div className="font-bold">{components["minecraft:movement"]?.value}</div>
                                        </div>
                                    )}
                                    {components["minecraft:scale"] && (
                                        <div className="bg-purple-900/30 border border-purple-800 rounded p-2">
                                            <div className="text-xs text-purple-400">Scale</div>
                                            <div className="font-bold">{components["minecraft:scale"]?.value}x</div>
                                        </div>
                                    )}
                                    {components["minecraft:attack"] && (
                                        <div className="bg-orange-900/30 border border-orange-800 rounded p-2">
                                            <div className="text-xs text-orange-400">Attack</div>
                                            <div className="font-bold">{components["minecraft:attack"]?.damage}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Components List (Blender style) */}
                        <div className="flex-1 bg-neutral-900 overflow-y-auto p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Components</div>
                                <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm flex items-center gap-1">
                                    <Plus size={14} /> Add Component
                                </button>
                            </div>

                            <div className="space-y-1">
                                {Object.entries(components).map(([key, value]) => (
                                    <ComponentItem 
                                        key={key} 
                                        name={key} 
                                        isOpen={openComponents.has(key)}
                                        onToggle={() => toggleComponent(key)}
                                    >
                                        <pre className="text-xs text-neutral-400 overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(value, null, 2)}
                                        </pre>
                                    </ComponentItem>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EntityEditor;