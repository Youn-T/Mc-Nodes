import JSZip from "jszip";
import { explorerData, browserData } from '../components/Navbar';

export async function ImportFiles(files: File[]): Promise<Record<string, { blob: Blob, url: string }>> {
    const filesMap: Record<string, { blob: Blob, url: string }> = {};

    for (const file of files) {
        if (file.name.endsWith('.mcaddon')) {
            const zip = new JSZip();
            const unzipped = await zip.loadAsync(file);
            for (const zippedName of Object.keys(unzipped.files)) {
                const zippedFile = unzipped.files[zippedName];
                if (!zippedFile.dir) {
                    const blob = await zippedFile.async('blob');
                    filesMap[zippedName] = { blob, url: URL.createObjectURL(blob) };
                }
            }
        } else {
            // optionnel: gérer fichiers non-zip
            filesMap[file.name] = { blob: file, url: URL.createObjectURL(file) };
        }
    }

    return filesMap;
}

export async function GenerateData(files: Record<string, { blob: Blob, url: string }>): Promise<{ explorer: explorerData, browser: browserData }> {
    const data: { explorer: explorerData, browser: browserData } = { explorer: { entities: {}, blocks: [], items: [], scripts: [] }, browser: { textures: [], models: [], audio: [] } };

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
                    const entityId = JSON.parse(await files[fileName].blob.text())["minecraft:entity"].description.identifier;
                    if (!data.explorer.entities[entityId]) data.explorer.entities[entityId] = {};

                    data.explorer.entities[entityId]["bev"] = { name: fileName, url: files[fileName].url, blob: files[fileName].blob };
                } catch {
                    // Failed to parse entity file
                }
            }
        }
        /*if (fileName.endsWith('.ogg') || fileName.endsWith('.wav') || fileName.endsWith('.mp3')) {
            data.browser.audio.push({ name: fileName, url: files[fileName].url, blob: files[fileName].blob });
        }

        if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
            data.browser.textures.push({ name: fileName, url: files[fileName].url, blob: files[fileName].blob });
        }

        if (fileName.endsWith('.bbmodel') || fileName.includes('.geo.json')) {
            data.browser.models.push({ name: fileName, url: files[fileName].url, blob: files[fileName].blob });
        }

        if (fileName.endsWith('.json') && fileName.includes('entities')) { // TODO : renforcer la détection des entités
            data.explorer.entities.push({ name: fileName, url: files[fileName].url, blob: files[fileName].blob });
        }
        if (fileName.endsWith('.json') && fileName.includes('blocks')) { // TODO : renforcer la détection des entités
            data.explorer.blocks.push({ name: fileName, url: files[fileName].url, blob: files[fileName].blob });
        }
        if (fileName.endsWith('.json') && fileName.includes('items')) { // TODO : renforcer la détection des entités
            data.explorer.items.push({ name: fileName, url: files[fileName].url, blob: files[fileName].blob });
        }
        if ((fileName.endsWith('.js') || fileName.endsWith('.ts')) && fileName.includes('scripts')) { // TODO : renforcer la détection des entités
            data.explorer.scripts.push({ name: fileName, url: files[fileName].url, blob: files[fileName].blob });
        }*/

    }
    console.log('Import completed', data);
    return data;
}

