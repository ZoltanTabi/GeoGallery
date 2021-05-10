import 'react-native';
import { galleryFilter, getCountriesAndCities, getCountriesAndCitiesWithPhotosAscending, getCountriesAndCitiesWithPhotosDescending, getOrderByDateTimeAscending, getOrderByDateTimeDescending } from '../helpers/searchFilter';
import { ImageType, Photo } from '../interfaces/photo';

const photos: Photo[] = [
    {id: '0', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
    {id: '1', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
    {id: '2', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
    {id: '3', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
    {id: '4', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
    {id: '5', address: 'aCountry, b', city: 'b', country: 'aCountry', createDate: new Date(2021, 5-1, 9,10, 20, 20), height: 400, imageUri: "", labels: ['apple'], latitude: 47.497913000000004, longitude: 19.040236, type: 1, width: 400}
];

describe('galleryFilter', () => {
    it('no filter', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: []}})).toStrictEqual(photos);
    });
    it('city filter - not found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: ['a'], labels: []}})).toStrictEqual([]);
    });
    it('city filter - found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: ['b'], labels: []}}))
            .toStrictEqual([{id: '5', address: 'aCountry, b', city: 'b', country: 'aCountry', createDate: new Date(2021, 5-1, 9,10, 20, 20), height: 400, imageUri: "", labels: ['apple'], latitude: 47.497913000000004, longitude: 19.040236, type: 1, width: 400}]);
    });
    it('photoIdsByClusterFilter - not found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: [], photoIdsByClusterFilter: ['10']}}))
            .toStrictEqual([]);
    });
    it('photoIdsByClusterFilter - found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: [], photoIdsByClusterFilter: ['3', '4']}}))
            .toStrictEqual([
                {id: '3', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100},
                {id: '4', imageUri: '', type: ImageType.Camera, labels: [], width: 100, height: 100}
            ]);
    });
    it('circle - not found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: [], circle: {center: {latitude: 10, longitude: 10}, radius: 20} }}))
            .toStrictEqual([]);
    });
    it('circle - found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: [], circle: {center: {latitude: 47.497913000000004, longitude: 19.040236}, radius: 5000} }}))
            .toStrictEqual([{id: '5', address: 'aCountry, b', city: 'b', country: 'aCountry', createDate: new Date(2021, 5-1, 9,10, 20, 20), height: 400, imageUri: "", labels: ['apple'], latitude: 47.497913000000004, longitude: 19.040236, type: 1, width: 400}]);
    });
    it('polygon - not found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: [], polygon: [{latitude: 10, longitude: 10}, {latitude: 10, longitude: 20}, {latitude: 20, longitude: 10}, {latitude: 20, longitude: 20}]}}))
            .toStrictEqual([]);
    });
    it('polygon - found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: [], polygon: [{latitude: 40, longitude: 10}, {latitude: 50, longitude: 10}, {latitude: 40, longitude: 20}, {latitude: 50, longitude: 20}]}}))
            .toStrictEqual([{id: '5', address: 'aCountry, b', city: 'b', country: 'aCountry', createDate: new Date(2021, 5-1, 9,10, 20, 20), height: 400, imageUri: "", labels: ['apple'], latitude: 47.497913000000004, longitude: 19.040236, type: 1, width: 400}]);
    });
    it('labels - not found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: ['pear']}}))
            .toStrictEqual([]);
    });
    it('labels - found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: ['apple']}}))
            .toStrictEqual([{id: '5', address: 'aCountry, b', city: 'b', country: 'aCountry', createDate: new Date(2021, 5-1, 9,10, 20, 20), height: 400, imageUri: "", labels: ['apple'], latitude: 47.497913000000004, longitude: 19.040236, type: 1, width: 400}]);
    });
    it('date - not found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: [], dateFrom: new Date(2021, 5-1, 9,10, 20, 21)}}))
            .toStrictEqual([]);
    });
    it('datefrom - found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: [], dateFrom: new Date(2021, 5-1, 9,10, 20, 19)}}))
            .toStrictEqual([{id: '5', address: 'aCountry, b', city: 'b', country: 'aCountry', createDate: new Date(2021, 5-1, 9,10, 20, 20), height: 400, imageUri: "", labels: ['apple'], latitude: 47.497913000000004, longitude: 19.040236, type: 1, width: 400}]);
    });
    it('dateto - found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: [], dateTo: new Date(2021, 5-1, 9,10, 20, 21)}}))
            .toStrictEqual([{id: '5', address: 'aCountry, b', city: 'b', country: 'aCountry', createDate: new Date(2021, 5-1, 9,10, 20, 20), height: 400, imageUri: "", labels: ['apple'], latitude: 47.497913000000004, longitude: 19.040236, type: 1, width: 400}]);
    });
    it('date interval - found', () => {
        expect(galleryFilter({photos: photos}, {searchTerm: {countries: [], cities: [], labels: [], dateFrom: new Date(2021, 5-1, 9,10, 20, 19), dateTo: new Date(2021, 5-1, 9,10, 20, 21)}}))
            .toStrictEqual([{id: '5', address: 'aCountry, b', city: 'b', country: 'aCountry', createDate: new Date(2021, 5-1, 9,10, 20, 20), height: 400, imageUri: "", labels: ['apple'], latitude: 47.497913000000004, longitude: 19.040236, type: 1, width: 400}]);
    });
});

describe('getCountriesAndCities', () => {
    it('getCountriesAndCities', () => {
        expect(getCountriesAndCities({photos: photos}))
            .toStrictEqual([{country: 'aCountry', cities: [{name: 'b', checked: false}]}]);
    });
});

describe('getCountriesAndCitiesWithPhotosAscending', () => {
    it('getCountriesAndCitiesWithPhotosAscending', () => {
        expect(getCountriesAndCitiesWithPhotosAscending({photos: photos}))
            .toStrictEqual([{country: 'aCountry', cities: [{city: 'b', photos: [{id: '5', address: 'aCountry, b', city: 'b', country: 'aCountry', createDate: new Date(2021, 5-1, 9, 10, 20, 20), height: 400, imageUri: "", labels: ['apple'], latitude: 47.497913000000004, longitude: 19.040236, type: 1, width: 400}]}]}]);
    });
});

describe('getCountriesAndCitiesWithPhotosAscending', () => {
    it('getCountriesAndCitiesWithPhotosAscending', () => {
        expect(getOrderByDateTimeAscending({photos: photos}))
            .toStrictEqual([{date: new Date(2021, 5-1, 9, 0, 0, 0), photos: [{id: '5', address: 'aCountry, b', city: 'b', country: 'aCountry', createDate: new Date(2021, 5-1, 9, 10, 20, 20), height: 400, imageUri: "", labels: ['apple'], latitude: 47.497913000000004, longitude: 19.040236, type: 1, width: 400}]}]);
    });
});
