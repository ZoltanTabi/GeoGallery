import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getData (key: string)  {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        throw(e);
    }
}

export async function storeData (value: any, key: string) {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        throw(e);
    }
}
