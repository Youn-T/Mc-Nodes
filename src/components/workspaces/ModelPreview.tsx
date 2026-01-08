import { useEffect, useState } from "react";

function ModelPreview({ asset }: {  asset: any }) {
    const [content, setContent] = useState<string>('');
    useEffect(() => {
        fetch(asset.url)
            .then(response => response.text())
            .then(text => setContent(text))
            .catch(error => console.error('Error fetching model data:', error));
    }, [asset.url]);
    return (
        <div className="flex-1 bg-neutral-900 flex items-start justify-center flex-col px-4 py-2">
            <div className="text-neutral-200 text-3xl font-semibold">Model Preview</div>
            <div className="text-neutral-400 text-xl">You selected model: {asset.name}</div>
            <textarea className="resize-none w-full h-200 bg-neutral-800 text-neutral-200 p-2 mt-4 focus:outline-none" readOnly value={content}></textarea>
        </div>)
}

export default ModelPreview;