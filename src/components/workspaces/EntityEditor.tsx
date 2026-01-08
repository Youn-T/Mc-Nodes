import { useEffect, useState } from "react";


function EntityEditor({ asset }: { asset: { res?: { name: string, url: string, blob: Blob }, bev?: { name: string, url: string, blob: Blob } } }) {
    const [resContent, setResContent] = useState<Record<string, { description?: { identifier?: string } }>>({});
    const [behContent, setBehContent] = useState<Record<string, { description?: { identifier?: string } }>>({});

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const resBlob: Blob | null = asset?.res?.blob ?? null;
                const behBlob: Blob | null = asset?.bev?.blob ?? null; // corrigé: bev au lieu de res

                const resText = resBlob ? await resBlob.text() : "{}";
                const behText = behBlob ? await behBlob.text() : "{}";

                if (!mounted) return;
                setResContent(JSON.parse(resText || "{}"));
                setBehContent(JSON.parse(behText || "{}"));
            } catch {
                // Failed parsing blobs
            }
        }
        load();
        return () => { mounted = false; };
    }, [asset]);

    const name = (resContent["minecraft:client_entity"]?.description?.identifier || behContent["minecraft:entity"]?.description?.identifier || "Unnamed Entity")?.split(":")?.[1]?.split("_")?.join(" ");
    return (
        <div className="flex-1 bg-neutral-900 flex items-center justify-center flex-col">
            <div className="capitalize font-semibold p-2 pb-1 bg-[#444444] border-b border-l border-neutral-600 sticky top-0 w-full">{name}</div>
            <div className="flex  w-full h-full">
                <div className="h-full w-full border-r border-neutral-600 px-3 pt-2">

                    <div className="capitalize font-semibold mb-2">Mod Infos</div>

                    <label htmlFor="modName" className="text-sm  mb-1 block">Mod Name</label>
                    <input id="modName" className="border border-neutral-600 focus:outline-none rounded-sm mb-2 w-full text-neutral-300 bg-neutral-700" placeholder="My Mod..."></input>
                    <label htmlFor="modDescription" className="text-sm  mb-1 block">Mod Description</label>
                    <textarea id="modDescription" className="border border-neutral-600 focus:outline-none rounded-sm w-full resize-none text-neutral-300 bg-neutral-700" /*maxLength={80}*/ rows={3} placeholder="Description of my mod..."></textarea>
                    <label htmlFor="modIcon" className="text-sm  mb-1 block">Mod Icon</label>

                    <div className="flex justify-between items-center mb-2">
                        {/* <input id="modIcon" type="file" onChange={handleChange} className="hidden" accept="image/*" /> */}
                        <label htmlFor="modIcon" className="border border-neutral-600 focus:outline-none rounded-sm py-0.5 px-1 cursor-pointer text-neutral-400 bg-neutral-700">Upload</label>
                        {/* {file && <img className="ml-2 h-10 w-10 object-cover" src={file} alt="preview" />} */}
                    </div>

                    <div className="capitalize font-semibold mb-2">Author</div>
                    <label htmlFor="authorName" className="text-sm  mb-1 block">Author Name</label>
                    <input id="authorName" className="border border-neutral-600 focus:outline-none rounded-sm mb-2 w-full text-neutral-400" placeholder="Author Name..."></input>

                    <div className="flex justify-between items-center"><label htmlFor="customNamespace" className="text-sm  mb-1 block">Custom Namespace</label> <input type="checkbox" className="mr-2 w-4 h-4" /*checked={customNamespaceEnabled} onChange={() => setCustomNamespaceEnabled(!customNamespaceEnabled)}*/></input></div>
                    {/* {customNamespaceEnabled && <input id="customNamespace" className="border border-neutral-600 focus:outline-none rounded-sm mb-2 w-full text-neutral-400" placeholder="Custom Namespace..."></input>} */}

                    <div className="flex justify-between items-center"><label htmlFor="customNamespace" className="text-sm  mb-1 block">Web Site</label> <input type="checkbox" className="mr-2 w-4 h-4" /*checked={webSiteEnabled} onChange={() => setWebSiteEnabled(!webSiteEnabled)}*/></input></div>
                    {/* {webSiteEnabled && <input id="webSite" className="border border-neutral-600 focus:outline-none rounded-sm mb-2 w-full text-neutral-400" placeholder="Web Site..."></input>} */}

                    <button className="bg-neutral-600 hover:bg-neutral-700 text-white rounded-sm py-1 px-2 mt-4 w-full transition-colors">Export Mod</button>



                </div>
                <div className="h-full w-full"></div>
            </div>


        </div>)
}

export default EntityEditor;