
function ImagePreview({ asset }: {  asset: any }) {
    return (
        <div className="flex-1 bg-neutral-900 flex items-center justify-center flex-col">
            <div className="text-neutral-200 text-3xl font-semibold">Texture Preview</div>
            <div className="text-neutral-400 text-xl">You selected texture: {asset.name}</div>
            <img className="mt-4 w-auto h-100 max-w-250" src={asset.url} alt={asset.name} style={{imageRendering: 'pixelated'}}/>
        </div>)
}

export default ImagePreview;