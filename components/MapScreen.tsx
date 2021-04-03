import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useState } from 'react';
import { Image, PermissionsAndroid, StyleSheet, View } from 'react-native';
import MapView from "react-native-map-clustering";
import { Region, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { devConsoleLog, onlyUnique } from '../helpers/functions';
import { RootState } from '../storage';

interface Coordinate {
  latitude: number;
  longitude: number;
}

const MapScreen = (): ReactElement => {
  const navigation = useNavigation();
  const photoState = useSelector((state: RootState) => state.photoState);

  let clustersCoordinates: Coordinate[] = [];

  const [region, setRegion] = useState<Region>( {latitude: 47.497913, longitude: 19.040236, latitudeDelta: 2, longitudeDelta: 2 });

  const onRegionChangeComplete = (newRegion: Region) => {
    if (newRegion.latitude.toFixed(6) === region.latitude.toFixed(6)
      && newRegion.longitude.toFixed(6) === region.longitude.toFixed(6)) {
        return;
    }
    
    setRegion(newRegion);
  }

  const onMarkerPress = (markerId: string) => {
    navigation.navigate('Full image', {id: markerId});
  }

  const onClusterPress = (_cluster: Marker, markers?: Marker[]) => {
    let photoIds: string[] = [];
    markers?.forEach(marker => {
      const coordinates = (marker as any).properties.coordinate;
      photoIds =  [...photoIds, ...photoState.photos.filter(x => x.latitude === coordinates.latitude && x.longitude === coordinates.longitude).map(x => x.id)];
    })
    photoIds = photoIds.filter(onlyUnique);
    devConsoleLog('photo count: ' + photoIds.length);
    devConsoleLog('Ids: ' + photoIds);
  }

  const onMarkersChange = (markers?: Marker[]) => {
    clustersCoordinates = [];
    markers?.forEach(marker => {
      const coordinates = (marker as any).geometry.coordinates;
      clustersCoordinates.push({ latitude: coordinates[1], longitude: coordinates[0] })
    })
    devConsoleLog(clustersCoordinates);
    devConsoleLog('Marker count: ' + markers?.length);
  }

  const onMapReady = () => {
    PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(granted => {
        devConsoleLog(granted)
      });
  }
  
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        onMapReady={onMapReady}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        rotateEnabled={false}
        showsUserLocation={true}
        onClusterPress={onClusterPress}
        preserveClusterPressBehavior={true}
        onMarkersChange={onMarkersChange}
      >
      {
        photoState.photos.filter(x => x.latitude && x.longitude).map((item) => {
          return (
            <Marker
              key={item.id}
              coordinate={{latitude: item.latitude as number, longitude: item.longitude as number}}
              onPress={() => onMarkerPress(item.id)}
            >
              <Image source={{uri: item.imageUri}}
                style={styles.image}
                resizeMode="contain" />
            </Marker>
          );
      })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: 60,
    height: 60
  }
 });
 

export default MapScreen;
