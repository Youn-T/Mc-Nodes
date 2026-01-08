import { Box, ChevronDown, Compass, File, FolderDown, Image, Volume2 } from "lucide-react";
import { useState } from "react";

const tabs = [
    {
        name: 'explorer',
        icon: Compass,
    },
    {
        name: 'content browser',
        icon: File,
    },
    {
        name: 'exportation',
        icon: FolderDown,
    },
];

const browserIcons = {
    textures: Image,
    models: Box,
    audio: Volume2,
};

export interface explorerData {
    entities: Record<string, { res?: { name: string, url: string, blob: Blob }, bev?: { name: string, url: string, blob: Blob } }>,
    blocks: any[],
    items: any[],
    scripts: any[],
}

export interface browserData {
    textures: any[],
    models: any[],
    audio: any[]
}

function Navbar({
    data,
    onItemSelect,
}: {
    data: { explorer: explorerData, browser: browserData },
    onItemSelect?: (payload: { tab: string, section?: string, item: any, index: number }) => void, // <-- ajouté
}) {
    const [currentTab, setCurrentTab] = useState<string>('explorer');
    const [explorerTabs, setExplorerTabs] = useState<Record<string, boolean>>({
        entities: false,
        blocks: false,
        items: false,
        scripts: false,
    });

    const [browserTabs, setBrowserTabs] = useState<Record<string, boolean>>({
        textures: false,
        models: false,
        audio: false,
    });

    const [customNamespaceEnabled, setCustomNamespaceEnabled] = useState(false);
    const [webSiteEnabled, setWebSiteEnabled] = useState(false);

    const [file, setFile] = useState<string>();
    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        if (e.target.files && e.target.files[0]) {
            setFile(URL.createObjectURL(e.target.files[0]));
        }
    }

    return (
        <div className='w-100 h-full flex border-r border-neutral-700'>
            <div className='bg-[#444444] w-15 h-full flex flex-col pt-4 items-center gap-y-6 border-r border-neutral-600'>
                {tabs.map((tab) =>
                    <tab.icon key={tab.name} className={`w-8 h-8 ${currentTab === tab.name ? 'text-neutral-200' : 'text-neutral-500'} hover:text-neutral-200`} onClick={() => { setCurrentTab(tab.name); }} />
                )}

            </div>
            <div className=' w-full h-full bg-[#252526] overflow-y-auto custom-scrollbar'>
                <div className="capitalize font-semibold p-2 pb-1 bg-[#444444] border-b border-neutral-600 sticky top-0">{currentTab}</div>
                {currentTab === 'explorer' && Object.keys(data.explorer).map((key) => {
                    return (
                        <div className="" key={key}>
                            <div className="bg-[#333333] w-full h-6 border-y border-neutral-700 capitalize px-2 text-sm flex select-none cursor-pointer "
                                onClick={() => setExplorerTabs({ ...explorerTabs, [key]: !explorerTabs[key] })}
                            >
                                {/* Chevron rotation : rotate-0 quand fermé, -rotate-90 quand ouvert */}
                                <ChevronDown className={`w-4 h-4 mr-1 mt-1 transition-transform ${!explorerTabs[key] ? '-rotate-90' : 'rotate-0'}`} />
                                {key}
                            </div>

                            {/* Contenu animé : grid-rows pour animer la hauteur réelle et supprimer le gap */}
                            <div className={`grid transition-[grid-template-rows,margin] duration-200 ease-out ${explorerTabs[key] ? 'grid-rows-[1fr] mb-2' : 'grid-rows-[0fr] mb-0'}`}>
                                <div className="overflow-hidden">
                                    {
                                        Object.keys(data.explorer[key as keyof typeof data.explorer]).map((item: any, index: number) => {

                                            return (<div key={index} className="pl-8 text-sm capitalize py-0.5 hover:bg-[#333333] select-none" onClick={() => onItemSelect?.({ tab: currentTab, section: key, item: data.explorer[key as keyof typeof data.explorer][item], index })}> {item.split(":")[1].split("_").join(" ")/*.name?.split('/')?.pop()*/}</div>)
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}

                {currentTab === 'content browser' && Object.keys(data.browser).map((key) => {
                    return (
                        <div className="" key={key}>
                            <div className="bg-[#333333] w-full h-6 border-y border-neutral-700 capitalize px-2 text-sm flex select-none cursor-pointer "
                                onClick={() => setBrowserTabs({ ...browserTabs, [key]: !browserTabs[key] })}
                            >
                                {/* Chevron rotation : rotate-0 quand fermé, -rotate-90 quand ouvert */}
                                <ChevronDown className={`w-4 h-4 mr-1 mt-1 transition-transform ${!browserTabs[key] ? '-rotate-90' : 'rotate-0'}`} />
                                {key}
                            </div>

                            {/* Contenu animé : grid-rows pour animer la hauteur réelle et supprimer le gap */}
                            <div className={`grid transition-[grid-template-rows,margin] duration-200 ease-out ${browserTabs[key] ? 'grid-rows-[1fr] mb-2' : 'grid-rows-[0fr] mb-0'}`}>
                                <div className="overflow-hidden">
                                    {
                                        data.browser[key as keyof typeof data.browser].map((item: any, index: number) => {
                                            const Icon = browserIcons[key as keyof typeof browserIcons];
                                            return (<div key={index} className="pl-4 text-sm capitalize py-0.5 hover:bg-[#333333] flex items-center select-none" onClick={() => onItemSelect?.({ tab: currentTab, section: key, item, index })}><Icon className="w-4 h-4 mr-1" /> {item.name.split('/').pop()}</div>)
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}

                {currentTab === 'exportation' && <div className="m-2">
                    <div className="capitalize font-semibold mb-2">Mod Infos</div>

                    <label htmlFor="modName" className="text-sm  mb-1 block">Mod Name</label>
                    <input id="modName" className="border border-neutral-600 focus:outline-none rounded-sm mb-2 w-full text-neutral-400" placeholder="My Mod..."></input>
                    <label htmlFor="modDescription" className="text-sm  mb-1 block">Mod Description</label>
                    <textarea id="modDescription" className="border border-neutral-600 focus:outline-none rounded-sm w-full resize-none text-neutral-400" /*maxLength={80}*/ rows={3} placeholder="Description of my mod..."></textarea>
                    <label htmlFor="modIcon" className="text-sm  mb-1 block">Mod Icon</label>

                    <div className="flex justify-between items-center mb-2">
                        <input id="modIcon" type="file" onChange={handleChange} className="hidden" accept="image/*" />
                        <label htmlFor="modIcon" className="border border-neutral-600 focus:outline-none rounded-sm py-0.5 px-1 cursor-pointer text-neutral-400 bg-neutral-700">Upload</label>
                        {file && <img className="ml-2 h-10 w-10 object-cover" src={file} alt="preview" />}
                    </div>

                    <div className="capitalize font-semibold mb-2">Author</div>
                    <label htmlFor="authorName" className="text-sm  mb-1 block">Author Name</label>
                    <input id="authorName" className="border border-neutral-600 focus:outline-none rounded-sm mb-2 w-full text-neutral-400" placeholder="Author Name..."></input>

                    <div className="flex justify-between items-center"><label htmlFor="customNamespace" className="text-sm  mb-1 block">Custom Namespace</label> <input type="checkbox" className="mr-2 w-4 h-4" checked={customNamespaceEnabled} onChange={() => setCustomNamespaceEnabled(!customNamespaceEnabled)}></input></div>
                    {customNamespaceEnabled && <input id="customNamespace" className="border border-neutral-600 focus:outline-none rounded-sm mb-2 w-full text-neutral-400" placeholder="Custom Namespace..."></input>}

                    <div className="flex justify-between items-center"><label htmlFor="customNamespace" className="text-sm  mb-1 block">Web Site</label> <input type="checkbox" className="mr-2 w-4 h-4" checked={webSiteEnabled} onChange={() => setWebSiteEnabled(!webSiteEnabled)}></input></div>
                    {webSiteEnabled && <input id="webSite" className="border border-neutral-600 focus:outline-none rounded-sm mb-2 w-full text-neutral-400" placeholder="Web Site..."></input>}

                    <button className="bg-neutral-600 hover:bg-neutral-700 text-white rounded-sm py-1 px-2 mt-4 w-full transition-colors">Export Mod</button>

                </div>}
            </div>
        </div>
    );
}

export default Navbar;