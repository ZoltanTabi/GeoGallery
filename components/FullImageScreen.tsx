import { RouteProp, useRoute } from '@react-navigation/core';
import { Guid } from 'guid-typescript';
import React, { ReactElement } from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { guidToString } from '../helpers/functions';
import { Photo } from '../interfaces/photo';
import { RootState } from '../storage';

const FullImageScreen = (): ReactElement => {

    const windowWidth = useWindowDimensions().width;

    const route = useRoute<RouteProp<{ params: { id: string } }, 'params'>>();

	const photoState = useSelector((state: RootState) => state.photoState);

	const photoObject = photoState.photos.find((photo) => guidToString(photo.id) == route.params.id)as Photo;

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Image source={{uri: photoObject.imageUri}} 
                    style={{ height: '50%', width: Math.round(windowWidth), margin: 5 }}/>
		</View>
	);
};

export default FullImageScreen;
