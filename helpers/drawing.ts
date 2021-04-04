import { LatLng } from 'react-native-maps';

export function distanceByLatLng(latLng1: LatLng, latLng2: LatLng): number {
    return getDistance(latLng1.latitude, latLng1.longitude, latLng2.latitude, latLng2.longitude);
}

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    var p = 0.017453292519943295;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 2 * 6371000 * Math.asin(Math.sqrt(a));
}
