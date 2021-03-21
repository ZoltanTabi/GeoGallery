import { RouteProp, useRoute } from '@react-navigation/core';
import React, { ReactElement } from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { Photo } from '../interfaces/photo';

const FullImageScreen = (): ReactElement => {

    const windowWidth = useWindowDimensions().width;

    const route = useRoute<RouteProp<{ params: { propPhoto: Photo } }, 'params'>>();

	const photoObject = route.params?.propPhoto;

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Image source={{uri: photoObject.imageUri}} 
                    style={{ height: '50%', width: Math.round(windowWidth), margin: 5 }}/>
		</View>
	);
};

export default FullImageScreen;
