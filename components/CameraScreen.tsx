import React, { ReactElement } from 'react';
import { View, Text } from 'react-native';

const CameraScreen = (): ReactElement => {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>This will be the camera screen.</Text>
		</View>
	);
};

export default CameraScreen;
