import { Photo, PhotoState } from '../interfaces/photo';
import { SearchTerm, SearchTermState } from '../interfaces/searchTerm';
import { MapCircleProps, LatLng } from 'react-native-maps';
import { getDistance } from './drawing';
import { onlyUnique } from './functions';
var pointInPolygon = require('point-in-polygon');

export function getCountries(photoState: PhotoState): string[] {
    return photoState.photos.map(x => x.country).filter(x => x).filter(onlyUnique);
}

export function getCities(photoState: PhotoState): string[] {
    return photoState.photos.map(x => x.city).filter(x => x).filter(onlyUnique);
}

export function galleryFilter(photoState: PhotoState, searchTermState: SearchTermState): Photo[] {
    let photos = [...photoState.photos];
    const searchTerm = searchTermState.searchTerm;

    if (searchTerm.countries) {
        photos = photos.filter(x => x.country && searchTerm.countries?.includes(x.country));
    }
    if (searchTerm.cities) {
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
    return filterByDateAndlabels([...photoState.photos], searchTermState.searchTerm);
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
    if (searchTerm.labels) {
        photos = photos.filter(x => x.labels.some(label => searchTerm.labels?.includes(label)));
    }
    if (searchTerm.dateTo) {
        photos = photos.filter(x => x.createDate && x.createDate >= (searchTerm.dateTo as Date));
    }
    if (searchTerm.dateFrom) {
        photos = photos.filter(x => x.createDate && x.createDate <= (searchTerm.dateFrom as Date));
    }
    
    return photos;
}
