import React, { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Region, PROVIDER_GOOGLE } from 'react-native-maps';

const MapScreen = (): ReactElement => {
  const [region, setRegion] = useState<Region>( {latitude: 47.497913, longitude: 19.040236, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });

  const onRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChange}
      >
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
