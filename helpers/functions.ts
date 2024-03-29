import { Guid } from "guid-typescript";
import { ImageType, Photo } from "../interfaces/photo";
import { getDateTimeFromExif, getLatLongFromExif } from "./exifDataReader";
import Geocoder from '@timwangdev/react-native-geocoder';
import { Image } from 'react-native-image-crop-picker';

export function findIndexById(array: any[], id: string): number {
    return array.indexOf(array.find(x => id === x.id));
}

export function getNewId(): string {
    return guidToString(Guid.create()).replace(/-/g, '');
}

function guidToString(guid: Guid): string {
    return (guid['value'].toString() as string);
}

export function devConsoleLog(log: any): void {
    if(__DEV__) {
        console.log(log);
    }
}

export function onlyUnique(value: any, index: any, self: string | any[]) {
    return self.indexOf(value) === index;
}

export function groupBy(xs: any[], key: string | number) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

export async function imageToPhoto(image: Image, type: ImageType, latLng?: { lat: number; lng: number; }): Promise<Photo> {
    latLng = latLng ?? getLatLongFromExif(image.exif);
    const dateTime = getDateTimeFromExif(image.exif);
    let address, country, city;

    if (latLng) {
        const result = await Geocoder.geocodePosition(latLng, {locale: 'en'});
        if (result.length > 0) {
            address = result[0].formattedAddress;
            country = result[0].country;
            city = result[0].locality ? result[0].locality : '';
        }
    }

    return {
        id: getNewId(),
        imageUri: '',
        type: type,
        labels: [],
        width: image.width,
        height: image.height,
        latitude: latLng?.lat,
        longitude: latLng?.lng,
        createDate: dateTime,
        address: address,
        country: country,
        city: city
    };
}
