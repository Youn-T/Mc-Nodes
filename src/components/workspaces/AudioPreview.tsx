
function AudioPreview({ asset }: {  asset: any }) {
    return (
        <div className="flex-1 bg-neutral-900 flex items-center justify-center flex-col">
            <div className="text-neutral-200 text-3xl font-semibold">Audio Player</div>
            <div className="text-neutral-400 text-xl">You selected audio: {asset.name}</div>
            <audio controls className="mt-4" src={asset.url}></audio>
        </div>)
}

export default AudioPreview;