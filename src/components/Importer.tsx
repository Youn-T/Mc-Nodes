import { useDropzone } from 'react-dropzone';

import { useCallback } from 'react';

import {ImportFiles, GenerateData} from '../filesystem/import';
import { explorerData, browserData } from './Navbar';

function Importer({onDataImport}: {onDataImport: (importedData: { explorer: explorerData, browser: browserData },importedFiles: Record<string, {blob: Blob, url: string}>) => void}) {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const importedFiles = await ImportFiles(acceptedFiles); 
        
        if (importedFiles) {
            const data = await GenerateData(importedFiles);
            onDataImport(data, importedFiles);
        }
        // acceptedFiles.forEach((file : File) => {
        //     const reader = new FileReader()

        //     reader.onabort = () => console.log('file reading was aborted')
        //     reader.onerror = () => console.log('file reading has failed')
        //     reader.onload = () => {
        //         // Do whatever you want with the file contents
        //         const binaryStr = reader.result
        //         console.log(binaryStr)
        //     }
        //     reader.readAsArrayBuffer(file)
        // })

    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return (
        <div className="flex-1 bg-neutral-900 flex items-center justify-center flex-col select-none">
            <div className="text-neutral-200 text-3xl font-semibold">Importer</div>
            <div className="text-neutral-400 text-xl mb-8">No data found. Please import your assets to get started.</div>
            <div >
                <div ></div>
            </div>

            <div {...getRootProps()} className="w-200 h-35 border-4 border-dashed rounded-lg border-neutral-500 bg-neutral-800 flex items-center justify-center cursor-pointer hover:border-neutral-400 hover:bg-neutral-700 transition-all focus:outline-none">
                <input {...getInputProps()} />
                <p className="text-neutral-400 text-xl hover:scale-105 w-full h-full flex items-center justify-center transition-all">Drag & Drop files here or click to import</p>
            </div>

        </div>
    )
}

export default Importer;