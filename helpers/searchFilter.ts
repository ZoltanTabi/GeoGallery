import { Photo, PhotoState } from '../interfaces/photo';
import { SearchTerm, SearchTermState } from '../interfaces/searchTerm';
import { MapCircleProps, LatLng } from 'react-native-maps';
import { getDistance } from './drawing';
import { groupBy, onlyUnique } from './functions';
var pointInPolygon = require('point-in-polygon');

export function galleryFilter(photoState: PhotoState, searchTermState: SearchTermState): Photo[] {
    let photos = [...photoState.photos];
    const searchTerm = searchTermState.searchTerm;

    if (searchTerm.countries.length > 0) {
        photos = photos.filter(x => x.country && searchTerm.countries?.includes(x.country));
    }
    if (searchTerm.cities.length > 0) {
        photos = photos.filter(x => x.city && searchTerm.cities?.includes(x.city));
    }
    if (searchTerm.photoIdsByClusterFilter) {
        photos = photos.filter(x => searchTerm.photoIdsByClusterFilter?.includes(x.id));
    }
    if (searchTerm.circle) {
        photos = photos.filter(x => x.latitude && x.longitude && pointInCircle(x.latitude, x.longitude, searchTerm.circle as MapCircleProps));
    }
    if (searchTerm.polygon) {
        photos = photos.filter(x => x.latitude && x.longitude && true == pointInPolygon([x.latitude, x.longitude], latLngsToNumberArrays(searchTerm.polygon as LatLng[])));
    }

    return filterByDateAndlabels(photos, searchTerm);
}

export function mapFilter(photoState: PhotoState, searchTermState: SearchTermState): Photo[] {
    return filterByDateAndlabels(photoState.photos.filter(x => x.latitude && x.longitude), searchTermState.searchTerm);
}

export function getCountriesAndCities(photoState: PhotoState): {country: string; cities: {name: string; checked: boolean;}[]}[] {
    const countriesAndCities: {country: string; cities: {name: string; checked: boolean;}[]}[] = [];
    
    getCountriesAndCitiesWithPhotosAscending(photoState).map(x => {
        const cities: {name: string; checked: boolean;}[] = [];
        x.cities.forEach(city => cities.push({name: city.city, checked: false}));

        countriesAndCities.push({country: x.country, cities: cities});
    });

    return countriesAndCities;
}

export function getCountriesAndCitiesWithPhotosAscending(photoState: PhotoState): {country: string; cities: {city: string; photos: Photo[]}[]}[] {
    return getCountriesAndCitiesWithPhotos(photoState);
}

export function getCountriesAndCitiesWithPhotosDescending(photoState: PhotoState): {country: string; cities: {city: string; photos: Photo[]}[]}[] {
    return getCountriesAndCitiesWithPhotos(photoState).reverse();
}

export function getOrderByDateTimeAscending(photoState: PhotoState): {date: Date; photos: Photo[]}[] {
    return getOrderByDateTime(photoState).reverse();
}

export function getOrderByDateTimeDescending(photoState: PhotoState): {date: Date; photos: Photo[]}[] {
    return getOrderByDateTime(photoState);
}

function latLngToNumberArray(latLng: LatLng): number[] {
    return  [latLng.latitude, latLng.longitude];
}

function latLngsToNumberArrays(latLngs: LatLng[]): number[][] {
    return  latLngs.map(x => latLngToNumberArray(x));
}

function pointInCircle(lat: number, lng: number, circle: MapCircleProps): boolean {
    return getDistance(lat, lng, circle.center.latitude, circle.center.longitude) < circle.radius;
}

function filterByDateAndlabels(photos: Photo[], searchTerm: SearchTerm): Photo[] {
    if (searchTerm.labels.length > 0) {
        photos = photos.filter(x => x.labels.some(label => searchTerm.labels?.includes(label)));
    }
    if (searchTerm.dateTo) {
        photos = photos.filter(x => x.createDate && x.createDate <= (searchTerm.dateTo as Date));
    }
    if (searchTerm.dateFrom) {
        photos = photos.filter(x => x.createDate && x.createDate >= (searchTerm.dateFrom as Date));
    }
    
    return photos;
}

function getCountriesAndCitiesWithPhotos(photoState: PhotoState): {country: string; cities: {city: string; photos: Photo[]}[]}[] {
    const countriesAndCitiesWithPhotos: {country: string; cities: {city: string; photos: Photo[]}[]}[] = [];
    const photos = photoState.photos.filter(x => x.country && x.city);

    const gByCountry = groupBy(photos, 'country');

    for(var country in gByCountry) {
        const gByCity = groupBy(gByCountry[country], 'city');

        const cities: {city: string; photos: Photo[]}[] = [];

        for(var city in gByCity) {
            cities.push({city: city, photos: (gByCity[city] as Photo[])});
        }

        countriesAndCitiesWithPhotos.push({country: country, cities: cities.sort(compareCity)});
    }

    countriesAndCitiesWithPhotos.sort(compareCountry);
    
    return countriesAndCitiesWithPhotos;
}

function compareCountry( a: {country: string; cities: {city: string; photos: Photo[]}[]}, b: {country: string; cities: {city: string; photos: Photo[]}[]} ) {
    if (a.country < b.country){
      return -1;
    }
    if (a.country > b.country){
      return 1;
    }
    return 0;
}

function compareCity( a: {city: string; photos: Photo[]}, b: {city: string; photos: Photo[]} ) {
    if (a.city < b.city){
      return -1;
    }
    if (a.city > b.city){
      return 1;
    }
    return 0;
}

function getOrderByDateTime(photoState: PhotoState): {date: Date; photos: Photo[]}[] {
    const photosByDate: {date: Date; photos: Photo[]}[] =[];

    const gByDate = groupBy(photoState.photos.filter(x => x.createDate), 'createDate');

    for(var date in gByDate) {
        photosByDate.push({date: new Date(date), photos: gByDate[date]})
    }

    return photosByDate.sort(compareDate);
}

function compareDate( a: {date: Date; photos: Photo[]}, b: {date: Date; photos: Photo[]} ) {
    if (a.date < b.date){
      return -1;
    }
    if (a.date > b.date){
      return 1;
    }
    return 0;
}
