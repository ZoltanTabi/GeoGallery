import 'react-native';
import { findIndexById, onlyUnique, groupBy, imageToPhoto } from '../helpers/functions';
import { Image } from 'react-native-image-crop-picker';
import { ImageType } from '../interfaces/photo';
import { GeocoderOptions, Position } from '@timwangdev/react-native-geocoder';

jest.mock('@timwangdev/react-native-geocoder', () => {
    return {
        geocodePosition:  jest.fn((position: Position, options?: GeocoderOptions): { formattedAddress: string; locality: string | null; country: string; }[] => {
            return [{formattedAddress: 'Budapest, teszt utca 1.', locality: 'Budapest', country: 'Hungary'}];
        }),
    };
});

describe('findIndexById', () => {
    it('not found', () => {
        expect(findIndexById([{id: '0'}, {id: '2'}, {id: '4'}], '3')).toBe(-1);
    });
    it('found', () => {
        expect(findIndexById([{id: '0'}, {id: '2'}, {id: '4'}], '2')).toBe(1);
    });
});

describe('onlyUnique', () => {
    it('not sort', () => {
        expect([0, 2, 4].filter(onlyUnique)).toStrictEqual([0, 2, 4]);
    });
    it('sort', () => {
        expect([0, 2, 2, 2, 4].filter(onlyUnique)).toStrictEqual([0, 2, 4]);
    });
});

describe('groupBy', () => {
    it('groupBy', () => {
        expect(groupBy([{id: 0}, {id: 0}, {id: 1}, {id: 2}, {id: 2}, {id: 2}], 'id')).toStrictEqual({"0": [{"id": 0}, {"id": 0}], "1": [{"id": 1}], "2": [{"id": 2}, {"id": 2}, {"id": 2}]});
    });
});

describe('imageToPhoto', () => {
    it('without exif', async () => {
        const photo = {"address": undefined, "city": undefined, "country": undefined, "createDate": undefined, "height": 400, "imageUri": "", "labels": [], "latitude": undefined, "longitude": undefined, "type": 1, "width": 400}

        const image: Image = {
            path: '',
            size: 100,
            width: 400,
            height: 400,
            mime: 'MIME/jpg',
            exif: undefined
        }

        expect(await imageToPhoto(image, ImageType.Camera)).toMatchObject(photo);
    });
    it('with lat lng in params', async () => {
        const photo = {"address": 'Budapest, teszt utca 1.', "city": 'Budapest', "country": 'Hungary', "createDate": undefined, "height": 400, "imageUri": "", "labels": [], "latitude": 47.497913000000004, "longitude": 19.040236, "type": 1, "width": 400}

        const image: Image = {
            path: '',
            size: 100,
            width: 400,
            height: 400,
            mime: 'MIME/jpg',
            exif: undefined
        }

        expect(await imageToPhoto(image, ImageType.Camera, {lat: 47.497913000000004, lng: 19.040236})).toMatchObject(photo);
    });
    it('with lat lng in exif', async () => {
        const photo = {"address": 'Budapest, teszt utca 1.', "city": 'Budapest', "country": 'Hungary', "createDate": undefined, "height": 400, "imageUri": "", "labels": [], "latitude": 47.497913000000004, "longitude": 19.040236, "type": 1, "width": 400}

        const image: Image = {
            path: '',
            size: 100,
            width: 400,
            height: 400,
            mime: 'MIME/jpg',
            exif: {GPSLatitude: '47,29,52.4868', GPSLongitude: '19,2,24.8496'},
        }

        expect(await imageToPhoto(image, ImageType.Camera)).toMatchObject(photo);
    });
    it('with date in exif', async () => {
        const photo = {"address": undefined, "city": undefined, "country": undefined, "createDate": new Date('2021-05-09T08:20:20.000Z'), "height": 400, "imageUri": "", "labels": [], "latitude": undefined, "longitude": undefined, "type": 1, "width": 400}

        const image: Image = {
            path: '',
            size: 100,
            width: 400,
            height: 400,
            mime: 'MIME/jpg',
            exif: {DateTime: '2021:05:09 10:20:20'}
        }

        expect(await imageToPhoto(image, ImageType.Camera)).toMatchObject(photo);
    });
});
