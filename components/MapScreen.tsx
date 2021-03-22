import React, { ReactElement, useState } from 'react';
import { Image, PermissionsAndroid, StyleSheet, View } from 'react-native';
import MapView, { Region, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { devConsoleLog, guidToString } from '../helpers/functions';
import { RootState } from '../storage';


const MapScreen = (): ReactElement => {
  const [region, setRegion] = useState<Region>( {latitude: 47.497913, longitude: 19.040236, latitudeDelta: 2, longitudeDelta: 2 });

  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  }

  const onMapReady = () => {
    PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(granted => {
        devConsoleLog(granted)
      });
  } 
  
  const photoState = useSelector((state: RootState) => state.photoState);
  
  return (
    <View style={styles.container}>
      <MapView
        onMapReady={onMapReady}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
      >
      {
        //TODO remove filter, if handling images without latitude and longitude
        photoState.photos.filter(x => x.latitude && x.longitude).map((item) => {
          return (
            <Marker
              key={guidToString(item.id)}
              coordinate={{latitude: item.latitude as number, longitude: item.longitude as number}}
            >
              <Image source={{uri: item.imageUri}}
                style={{width: 60, height: 60}}
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
 });
 

export default MapScreen;
