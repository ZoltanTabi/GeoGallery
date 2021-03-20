import React, { ReactElement, useState } from 'react';
import { View } from 'react-native';
import MapView, { Region } from 'react-native-maps';



const MapScreen = (): ReactElement => {
  const [region, setRegion] = useState<Region>( {latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });

  const onRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MapView
        region={region}
        onRegionChange={onRegionChange}
      />
    </View>
  );
};

export default MapScreen;
