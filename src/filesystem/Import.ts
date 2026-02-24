import JSZip from "jszip";
import type { ExplorerData, BrowserData } from '../types/workspace';

export async function ImportFiles(files: File[]): Promise<Record<string, { blob: Blob, url: string }>> {
    const filesMap: Record<string, { blob: Blob, url: string }> = {};

    for (const file of files) {
        if (file.name.endsWith('.mcaddon')) {
            const zip = new JSZip();
            const unzipped = await zip.loadAsync(file);
            for (const zippedName of Object.keys(unzipped.files)) {
                const zippedFile = unzipped.files[zippedName];
                if (!zippedFile.dir) {


                    if (zippedName.endsWith('.mcpack')) {

                        const unzippedMcpack = await zip.loadAsync(await zippedFile.async('arraybuffer'));

                        for (const nestedZippedName of Object.keys(unzippedMcpack.files)) {
                            const nestedZippedFile = unzippedMcpack.files[nestedZippedName];
                            const nestedBlob = await nestedZippedFile.async('blob');
                            filesMap[zippedName.replace('.mcpack', '') + '/' + nestedZippedName] = { blob: nestedBlob, url: URL.createObjectURL(nestedBlob) };
                        }
                    } else {
                        const blob = await zippedFile.async('blob');
                        filesMap[zippedName] = { blob, url: URL.createObjectURL(blob) };
                    }
                }
            }
        } else {
            // optionnel: gérer fichiers non-zip
            filesMap[file.name] = { blob: file, url: URL.createObjectURL(file) };
        }
    }
    return filesMap;
}

export async function GenerateData(files: Record<string, { blob: Blob, url: string }>): Promise<{ explorer: ExplorerData, browser: BrowserData }> {
    const data: { explorer: ExplorerData, browser: BrowserData } = { explorer: { entities: {}, blocks: {}, items: {}, scripts: {} }, browser: { textures: [], models: [], audio: [] } };
    const constRootDirs = new Set(Object.keys(files).map(fileName => fileName.split('/')[0]));
    let detectedResourcePack: string = "";
    let detectedBehaviorPack: string = "";

    for (const rootDir of constRootDirs) {
        if (Object.prototype.hasOwnProperty.call(files, `${rootDir}/manifest.json`)) {
            const manifestContent = await files[`${rootDir}/manifest.json`].blob.text();
            const manifest = JSON.parse(manifestContent);
            if (manifest?.modules?.find((mod: { type: string }) => mod.type === 'resources')) {
                detectedResourcePack = rootDir;
            }
            if (manifest?.modules?.find((mod: { type: string }) => mod.type === 'data')) {
                detectedBehaviorPack = rootDir;
            }
        }
    }
    for (const fileName of Object.keys(files)) {
        const isInResourcePack = detectedResourcePack !== "" && fileName.startsWith(detectedResourcePack + '/');
        const isInBehaviorPack = detectedBehaviorPack !== "" && fileName.startsWith(detectedBehaviorPack + '/');

        if (isInResourcePack) {
            if (fileName.includes('/sounds/') && (fileName.endsWith('.ogg') || fileName.endsWith('.mp3') || fileName.endsWith('.wav'))) {
                data.browser.audio.push({ name: fileName, url: files[fileName].url, blob: files[fileName].blob });
            }

            if (fileName.includes('/textures/') && (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg'))) {
                data.browser.textures.push({ name: fileName, url: files[fileName].url, blob: files[fileName].blob });
            }

            if (fileName.includes('/models/') && (fileName.endsWith('.bbmodel') || fileName.endsWith('.geo.json'))) {
                data.browser.models.push({ name: fileName, url: files[fileName].url, blob: files[fileName].blob });
            }

            if (fileName.includes('/entity/') && (fileName.endsWith('.json'))) {
                try {
                    const entityId = JSON.parse(await files[fileName].blob.text())["minecraft:client_entity"].description.identifier;

                    if (!data.explorer.entities[entityId]) data.explorer.entities[entityId] = {};

                    data.explorer.entities[entityId]["res"] = { name: fileName, url: files[fileName].url, blob: files[fileName].blob };
                } catch {
                    // Failed to parse entity file
                }
            }
        }

        if (isInBehaviorPack) {
            if (fileName.includes('/entities/') && (fileName.endsWith('.json'))) {
                try {
                    const text = (await files[fileName].blob.text()).replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
                    const entityId = JSON.parse(text)["minecraft:entity"].description.identifier;
                    if (!data.explorer.entities[entityId]) data.explorer.entities[entityId] = {};

                    data.explorer.entities[entityId]["bev"] = { name: fileName, url: files[fileName].url, blob: files[fileName].blob };
                } catch (e) {
                    console.log('Failed to parse entity file:', fileName, e);
                    // Failed to parse entity file
                }
            }
        }

    }
    return data;
}
