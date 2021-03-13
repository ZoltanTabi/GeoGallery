import React, { ReactElement } from 'react';
import { View, Text } from 'react-native';

const MapScreen = (): ReactElement => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This will be the map screen.</Text>
    </View>
  );
};

export default MapScreen;
