import 'react-native';
import { getLatLongFromExif, getDateTimeFromExif } from '../helpers/exifDataReader';

describe('get latitude and latitude from exif data', () => {
    it('undefined', () => {
        expect(getLatLongFromExif({})).toBe(undefined);
    });
    it('Budapest', () => {
        expect(getLatLongFromExif({GPSLatitude: '47,29,52.4868', GPSLongitude: '19,2,24.8496'})).toStrictEqual({lat: 47.497913000000004, lng: 19.040236});
    });
});

describe('get date from exif data', () => {
    it('undefined', () => {
        expect(getDateTimeFromExif({})).toBe(undefined);
    });
    it('2021.05.09. 10:20:20', () => {
        expect(getDateTimeFromExif({DateTime: '2021:05:09 10:20:20'})).toStrictEqual(new Date(2021, 5-1, 9,10, 20, 20));
    });
});
