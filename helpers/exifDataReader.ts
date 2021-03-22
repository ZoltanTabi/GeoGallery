
export const convertDMSToDD = (degrees: any, minutes: any, seconds: any, direction: any): number => {
    var dd = degrees + minutes / 60 + seconds / 3600;
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    }
    return dd as number;
}

export const getLatLongFromExif = (exif: any) => {
    if (exif) {
        let latitude = exif.GPSLatitude || (exif["{GPS}"] && exif["{GPS}"].Latitude);
        let longitude = exif.GPSLongitude || (exif["{GPS}"] && exif["{GPS}"].Longitude);
    
        if (latitude && longitude && (latitude.toString().includes("/") || latitude.toString().includes(","))) {
            let splittedLatitude = latitude.split(",").map((d: any) => eval(d));
            let splittedLongitude = longitude.split(",").map((d: any) => eval(d));
    
            if (splittedLatitude && splittedLatitude.length && splittedLongitude && splittedLongitude.length) {
                let finalLatitude = convertDMSToDD(splittedLatitude[0], splittedLatitude[1], splittedLatitude[2], exif.GPSLatitudeRef);
                let finalLongitude = convertDMSToDD( splittedLongitude[0], splittedLongitude[1], splittedLongitude[2], exif.GPSLongitudeRef);
                
                if (finalLatitude && finalLongitude) {
                    let selectedLocation = {
                        lat: finalLatitude,
                        lng: finalLongitude,
                    };
                    return selectedLocation;
                }
            }
        }
    }
}
