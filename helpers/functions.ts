import { Guid } from "guid-typescript";

export function findIndexById(array: any[], id: string): number {
    return array.indexOf(array.find(x => id === x.id));
}

export function getNewId(): string {
    return guidToString(Guid.create());
}

function guidToString(guid: Guid): string {
    return (guid['value'].toString() as string);
}

export function devConsoleLog(log: any): void {
    if(__DEV__) {
        console.log(log);
    }
}

// If GUID not good for project, We use id, ang generate with this code

/*export async function generateNewIdForLabels(): Promise<number> {
    return generateNewId('labelId');
}

export async function generateNewIdForPhotos(): Promise<number> {
    return generateNewId('photoId');
}

async function generateNewId(key: string): Promise<number> {
    const data = await getData(key);
    let id = 0;

    if (data !== null)
        id = Number(data);

    ++id;
    storeData(id, key);

    return id;
}

async function getData (key: string)  {
    try {
        return await AsyncStorage.getItem(key);
    } catch(e) {
        throw(e);
    }
}

async function storeData (value: any, key: string) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        throw(e);
    }
}*/
