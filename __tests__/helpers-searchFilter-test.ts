import 'react-native';
import { galleryFilter, mapFilter, getCountriesAndCities, getCountriesAndCitiesWithPhotosAscending, getCountriesAndCitiesWithPhotosDescending, getOrderByDateTimeAscending, getOrderByDateTimeDescending } from '../helpers/searchFilter';
import { ImageType, Photo } from '../interfaces/photo';


    /* id: string;
    imageUri: string;
    type: ImageType;
    labels: string[];
    width: number;
    height: number;
    longitude?: number;
    latitude?: number;
    createDate?: Date;
    address?: string;
    country?: string;
    city?: string; */

    /*countries: string[];
    cities: string[];
    dateTo?: Date;
    dateFrom?: Date;
    labels: string[];
    circle?: MapCircleProps;
    polygon?: LatLng[];
    photoIdsByClusterFilter?: string[];*/



describe('galleryFilter', () => {
    it('no filter', () => {
        const photos: Photo[] = [
            {id: '0', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
            {id: '1', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
            {id: '2', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
            {id: '3', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
            {id: '4', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
        ];

        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: []}})).toStrictEqual(photos);
    });
    it('city filter', () => {
        const photos: Photo[] = [
            {id: '0', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
            {id: '1', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
            {id: '2', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
            {id: '3', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
            {id: '4', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
        ];

        expect(galleryFilter({photos: photos}, {searchTerm: {countries: ['a'], cities: [], labels: []}})).toStrictEqual([]);
    });
});
