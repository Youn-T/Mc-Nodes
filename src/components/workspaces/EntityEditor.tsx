import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff, Workflow, Box, Settings, Plus, Trash2 } from "lucide-react";
import {  EntityData, minecraftComponents, parseComponentGroups, parseComponents, parseEvents } from "../../editors/entityEditor";
import { BasicSelector } from "../utils/BasicSelector";

import { explorerData, browserData } from '../Navbar';

type Tab = "events" | "visuals" | "settings";

const alphabeticalSort = (values: string[]) => values.sort((a: string, b: string) => a.localeCompare(b));




// Composant pour un item de component (style Blender)
function ComponentItem({ name, isOpen, onToggle, componentData, onValuesChange }: { name: string; isOpen: boolean; onToggle: () => void; componentData: any, onValuesChange: (newValues: any) => void }) {
    const [enabled, setEnabled] = useState(true);

    const [values, setValues] = useState<Record<string, any>>(componentData);

    return (
        <div className="border border-neutral-600 rounded bg-neutral-800 mb-1">
            <div className="flex items-center gap-1 px-2 py-1.5 cursor-pointer hover:bg-neutral-700" onClick={onToggle}>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="flex-1 text-sm font-medium truncate capitalize">{name.replace("minecraft:", "").replace("_", " ").replace(".", " ")?.toLowerCase()}</span>
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
                <div className="px-3 py-2 border-t border-neutral-600 bg-neutral-850 text-xs flex flex-col gap-2 items-start">
                    {
                        minecraftComponents[name].inputs.map((input: any) => {
                            const value = values[input.name];
                            switch (input.type) {
                                case "int":
                                    return (<div className="flex items-center gap-4 w-full">
                                        <label className="text-xs text-neutral-400 block mb-1 capitalize w-20 text-right">{input.name?.replace("_", " ")?.replace(".", " ")}</label>
                                        <input
                                            type="text"
                                            onChange={(e) => {
                                                // if (e.target.value === "") return;
                                                setValues(prev => ({ ...prev, [input.name]: e.target.value === '' ? '' : parseInt(e.target.value) }));
                                                onValuesChange({ ...values, [input.name]: parseInt(e.target.value) });
                                            }}
                                            onBlur={(e) => {
                                                if (e.target.value === "") {
                                                    setValues(prev => ({ ...prev, [input.name]: 0 }));
                                                    onValuesChange({ ...values, [input.name]: 0 });
                                                }
                                            }}
                                            value={value === undefined ? 0 : value}
                                            className=" bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm focus:outline-none"
                                        /></div>);
                                case "bool":
                                    return (<div className="flex items-center gap-4 w-full">
                                        <label className="text-xs text-neutral-400 block mb-1 capitalize w-20 text-right">{input.name?.replace("_", " ")?.replace(".", " ")}</label>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                setValues(prev => ({ ...prev, [input.name]: e.target.checked }))
                                                onValuesChange({ ...values, [input.name]: e.target.checked })
                                            }}
                                            checked={value || false}
                                            className=" bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm focus:outline-none"
                                        /></div>);
                            }
                        })
                    }

                </div>
            )}
        </div>
    );
}

function EntityEditor({ asset, onChange, data }: { asset: { res?: { name: string, url: string, blob: Blob }, bev?: { name: string, url: string, blob: Blob } }, onChange: (data: { res?: { name: string, url: string, blob: Blob }, bev?: { name: string, url: string, blob: Blob } }) => void, data: { explorer: explorerData, browser: browserData } }) {
    // const [resContent, setResContent] = useState<Record<string, any>>({});
    // const [behContent, setBehContent] = useState<Record<string, any>>({});
    const [activeTab, setActiveTab] = useState<Tab>("settings");
    const [openComponents, setOpenComponents] = useState<Set<string>>(new Set());

    const [clientData, setClientData] = useState<any>({});
    const [entityData, setEntityData] = useState<any>({});

    onChange(asset); // TODO : remove this ; )

    // Pré-calcul des options de géométrie à partir des models (évite 'await' dans le JSX)
    const [modelGeometryOptions, setModelGeometryOptions] = useState<string[]>([]);
    useEffect(() => {
        let mounted = true;
        async function loadModelOptions() {
            try {
                const models = data?.browser?.models || [];
                const opts: string[] = [];
                models.forEach(async (model: any) => {
                    try {
                        const blob: Blob = model.blob as Blob;
                        const text = await blob.text();
                        console.log(text);
                        const json = JSON.parse(text);
                        json["minecraft:geometry"].forEach((element: any) => {
                            opts.push(element.description.identifier.replace("geometry.", ""));
                        });
                    } catch {
                        return "unknown";
                    }
                });


                // await Promise.all(models.map(async (model: any) => {
                //     try {
                //         const blob: Blob = model.blob as Blob;
                //         const text = await blob.text();
                //         console.log(text);
                //         const json = JSON.parse(text);
                //         return (json["minecraft:geometry"]?.description?.identifier) || "unknown";
                //     } catch {
                //         return "unknown";
                //     }
                // }));
                if (mounted) setModelGeometryOptions(opts);
            } catch {
                if (mounted) setModelGeometryOptions([]);
            }
        }
        loadModelOptions();
        return () => { mounted = false; };
    }, [data?.browser?.models]);

    const name = () => userEntityData.identifier?.split(":")?.[1]?.split("_")?.join(" ") || "";

    const [userEntityData, setUserEntityData] = useState<EntityData>({
        formatVersion: "",
        identifier: "",
        isSpawnable: true,
        isSummonable: true,
        components: {
            HEALTH: {
                max_health: 20,
                default_health: 20,
                fire_resistant: true,
                knockback_resistance: 12
            }
        },
        events: {},
        componentGroups: {}
    });

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
                // setResContent(parsedRes);
                // setBehContent(parsedBeh);

                const parsedEntity = parsedBeh["minecraft:entity"] || {};
                const parsedClient = parsedRes["minecraft:client_entity"] || {};

                setEntityData(parsedEntity);
                setClientData(parsedClient);
                const newEntityData: EntityData = entityData
                const derivedIdentifier = parsedEntity?.description?.identifier || parsedClient?.description?.identifier || "";
                newEntityData.identifier = derivedIdentifier;
                newEntityData.formatVersion = parsedBeh?.format_version;
                newEntityData.isSpawnable = parsedEntity?.description?.is_spawnable || false;
                newEntityData.isSummonable = parsedEntity?.description?.is_summonable || false;
                newEntityData.components = parseComponents(parsedEntity?.components || {});
                newEntityData.componentGroups = parseComponentGroups(parsedEntity?.component_groups || {});
                newEntityData.events = parseEvents(parsedEntity?.events || {});
                setUserEntityData(newEntityData);
                console.log('Loaded entity data', userEntityData);
            } catch (err) {
                console.log('Error loading entity data', err);
            }
        }
        load();
        return () => { mounted = false; };
    }, [asset]);


    const toggleComponent = (key: string) => {
        setOpenComponents(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const changeComponentValues = (key: string, newValues: any) => {
        setUserEntityData(prev => {
            const next = { ...prev };
            next.components[key] = { ...next.components[key], ...newValues };
            return next;
        });
    }

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "settings", label: "Settings", icon: <Settings size={16} /> },
        { id: "events", label: "Events & Logic", icon: <Workflow size={16} /> },
        { id: "visuals", label: "Visuals", icon: <Box size={16} /> },
    ];

    const [geometryNames, setGeometryNames] = useState<Record<string, any>>({});

    return (
        <div className="flex-1 bg-neutral-900 flex flex-col h-full overflow-hidden">
            {/* Header avec nom et onglets */}
            <div className="bg-neutral-800 border-b border-neutral-700">
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-700">
                    <div>
                        <h2 className="capitalize font-bold text-lg">{name()}</h2>
                        {/* <span className="text-xs text-neutral-400 font-mono">{identifier}</span> */}
                    </div>
                    <div className="flex gap-2 text-xs">
                        <span className="bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                            {Object.keys(userEntityData.components).length} components
                        </span>
                        <span className="bg-orange-900/50 text-orange-400 px-2 py-0.5 rounded">
                            {Object.keys(userEntityData.componentGroups).length} groups
                        </span>
                        <span className="bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">
                            {Object.keys(userEntityData.events).length} events
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors  ${activeTab === tab.id
                                ? "border-blue-500 text-neutral-300 bg-neutral-900 rounded-t-lg"
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
                                {Object.keys(userEntityData.events).map(eventKey => (
                                    <div key={eventKey} className="text-sm px-2 py-1.5 bg-blue-900/30 hover:bg-blue-900/50 rounded mb-1 cursor-pointer truncate border-l-2 border-blue-500">
                                        {eventKey.replace("minecraft:", "").replace("better_on_bedrock:", "")}
                                    </div>
                                ))}
                            </div>
                            <div className="p-2">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Component Groups</div>
                                {Object.keys(userEntityData.componentGroups).map(groupKey => (
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
                    <div className="h-full flex ">
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
                        <div className="w-80 bg-neutral-800 border-l border-neutral-700 overflow-y-auto custom-scrollbar">
                            {/* Geometry */}
                            <div className="p-3 border-b border-neutral-700">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between ">Geometry <Plus className="w-4 h-4 font-bold" onClick={(e) => {
                                    e.stopPropagation();
                                    console.trace()
                                    console.log('Adding new geometry entry');

                                    const next = { ...clientData };
                                    let keyIdx = 1;
                                    while (next.description.geometry.hasOwnProperty("new_geometry_" + keyIdx)) { keyIdx++; }
                                    console.log(next)
                                    next.description.geometry["new_geometry_" + keyIdx] = modelGeometryOptions[0] || "geometry.unknown";
                                    // next.description.geometry["new_geometry_" + keyIdx] = ;


                                    setClientData(next);
                                }}></Plus></div>
                                <div className="flex flex-col gap-2">
                                    {
                                        Object.keys(clientData?.description?.geometry || {}).map((key: string) => {
                                            return (
                                                <div className="bg-neutral-700 rounded px-2 pb-2 text-sm pt-1" key={key}>
                                                    <input className="text-xs text-neutral-400 border-none outline-none mb-2" value={geometryNames[key] === undefined ? key : geometryNames[key]}
                                                        spellCheck={false}
                                                        onChange={(e) =>
                                                            setGeometryNames(prev => ({ ...prev, [key]: e.target.value }))
                                                        }

                                                        onBlur={() => {
                                                            const newKey = geometryNames[key] || key;
                                                            setGeometryNames(prev => {
                                                                const next = { ...prev };
                                                                delete next[key];
                                                                return next;
                                                            });
                                                            setClientData((prev: any) => {
                                                                const next = { ...prev };
                                                                const geom = next.description?.geometry || {};
                                                                if (geom[key] === undefined) return next;
                                                                if (newKey === key) return next;

                                                                const replaceKeyPreserveOrder = (obj: Record<string, any>, oldK: string, newK: string) => {
                                                                    if (!Object.prototype.hasOwnProperty.call(obj, oldK)) return obj;
                                                                    const entries = Object.entries(obj);
                                                                    const newEntries = entries.map(([k, v]) => k === oldK ? [newK, v] : [k, v]);
                                                                    const res: Record<string, any> = {};
                                                                    newEntries.forEach(([k, v]) => { res[k] = v; });
                                                                    return res;
                                                                };

                                                                next.description = { ...next.description, geometry: replaceKeyPreserveOrder(geom, key, newKey) };
                                                                return next;
                                                            });
                                                        }} />
                                                    <BasicSelector options={alphabeticalSort(modelGeometryOptions)} value={clientData?.description?.geometry?.[key].replace("geometry.", "") || ""} onChange={(newValue: any) => {
                                                        setClientData((prev: any) => {
                                                            const next = { ...prev };
                                                            next.description.geometry[key] = newValue;
                                                            return next;
                                                        });
                                                    }} />
                                                    {/* <div className="text-sm truncate" onClick={() => {}}>{clientData?.description?.geometry?.[key] || "geometry.unknown"}</div> */}

                                                    {/* <div className="text-neutral-300">{}</div> */}
                                                </div>
                                            )
                                        })
                                    }
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
                                {/* {(clientData?.description?.render_controllers || []).map((rc: string, i: number) => (
                                    <div key={i} className="text-sm px-2 py-1.5 bg-neutral-700 rounded mb-1 truncate">
                                        {rc}
                                    </div>
                                ))} */}
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
                                        value={userEntityData.identifier}
                                        onChange={(e) => {
                                            setUserEntityData(prev => ({ ...prev, identifier: e.target.value }));
                                        }}
                                        className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center justify-between bg-neutral-700 rounded px-3 py-2">
                                        <span className="text-sm">Spawnable</span>
                                        <input type="checkbox" checked={!!userEntityData?.isSpawnable}
                                            onChange={(e) => {
                                                setUserEntityData(prev => ({ ...prev, isSpawnable: e.target.checked }));
                                            }}
                                            className="accent-blue-500 focus:outline-none" />
                                    </div>
                                    <div className="flex items-center justify-between bg-neutral-700 rounded px-3 py-2">
                                        <span className="text-sm">Summonable</span>
                                        <input type="checkbox" checked={!!userEntityData?.isSummonable}
                                            onChange={(e) => {
                                                setUserEntityData(prev => ({ ...prev, isSummonable: e.target.checked }));
                                            }}
                                            className="accent-blue-500 focus:outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-neutral-400 block mb-1">Format Version</label>
                                    <input
                                        type="text"
                                        value={userEntityData?.formatVersion || "1.21.0"}
                                        onChange={(e) => {
                                            setUserEntityData(prev => ({ ...prev, formatVersion: e.target.value }));
                                        }}
                                        className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-6">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Quick Stats</div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {userEntityData.components["minecraft:health"] && (
                                        <div className="bg-red-900/30 border border-red-800 rounded p-2">
                                            <div className="text-xs text-red-400">Health</div>
                                            <div className="font-bold">{userEntityData.components["minecraft:health"]?.max || userEntityData.components["minecraft:health"]?.value}</div>
                                        </div>
                                    )}
                                    {userEntityData.components["minecraft:movement"] && (
                                        <div className="bg-blue-900/30 border border-blue-800 rounded p-2">
                                            <div className="text-xs text-blue-400">Movement</div>
                                            <div className="font-bold">{userEntityData.components["minecraft:movement"]?.value}</div>
                                        </div>
                                    )}
                                    {userEntityData.components["minecraft:scale"] && (
                                        <div className="bg-purple-900/30 border border-purple-800 rounded p-2">
                                            <div className="text-xs text-purple-400">Scale</div>
                                            <div className="font-bold">{userEntityData.components["minecraft:scale"]?.value}x</div>
                                        </div>
                                    )}
                                    {userEntityData.components["minecraft:attack"] && (
                                        <div className="bg-orange-900/30 border border-orange-800 rounded p-2">
                                            <div className="text-xs text-orange-400">Attack</div>
                                            <div className="font-bold">{userEntityData.components["minecraft:attack"]?.damage}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Components List (Blender style) */}
                        <div className="flex-1 bg-neutral-900 overflow-y-auto p-4 custom-scrollbar">
                            <div className="flex items-start justify-between mb-3">
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Components</div>
                                <button className="bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 transition px-3 py-1 rounded text-xs flex items-center gap-1"
                                    onClick={() => {
                                        // navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
                                        //     if (result.state === "granted" || result.state === "prompt") {
                                        //         navigator.clipboard.writeText(JSON.stringify(compileEntity(userEntityData)));
                                        //     }
                                        // });

                                    }}>
                                    <Plus size={14} /> Add Component
                                </button>
                            </div>

                            <div className="space-y-1 ">
                                {Object.entries(userEntityData.components).map(([key, value]) => (
                                    <ComponentItem
                                        key={key}
                                        name={key}
                                        isOpen={openComponents.has(key)}
                                        onToggle={() => toggleComponent(key)}
                                        onValuesChange={(newValues: any) => changeComponentValues(key, newValues)}
                                        componentData={value}
                                    >
                                        {/* <pre className="text-xs text-neutral-400 overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(value, null, 2)}
                                        </pre> */}
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