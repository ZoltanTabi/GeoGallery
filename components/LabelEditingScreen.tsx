import { useNavigation } from '@react-navigation/native';
import { Guid } from 'guid-typescript';
import React, { ReactElement, useState } from 'react';
import { View, useWindowDimensions, } from 'react-native';
import { TriangleColorPicker, fromHsv } from 'react-native-color-picker';
import { Text, TextInput, Chip, Button  } from 'react-native-paper';
import { Label } from '../interfaces/label';
import { createLabel } from '../storage/actions/labelAction';
import { useDispatch } from 'react-redux';

const LabelEditingScreen = (): ReactElement => {

	const dispatch = useDispatch();

	const windowHeight = useWindowDimensions().height;

	const [labelObject, changeObject] = useState<Label>({id: Guid.create(),text: 'Label', color: 'purple', photos: []});

	const onTextChange = (value: string) => {
		changeObject({...labelObject, text: value});
	}
	  
	const onColorChange= (value: string) => {
		changeObject({...labelObject, color: value});
	}

	const navigation = useNavigation();

  	const onConfirming = () => {
		dispatch(createLabel(labelObject));
    	navigation.goBack();
  	}

	return (
		<View style={{
				flex: 1, 
				minHeight: Math.round(windowHeight) }}>
			<View style={{ 
					flex: 1, 
					flexDirection: 'row', 
					flexWrap: 'wrap', 
					justifyContent: 'center', 
					backgroundColor: '#cccccc', 
					paddingTop: '5%' }}>
				<Chip style={{ 
						flexDirection: 'row', 
						backgroundColor: labelObject.color}}
					textStyle={{ color:'white',fontSize: 20, }}
					mode='flat' 
					children={labelObject.text} />
			</View>
			<View style={{ 
				flex: 2, 
				paddingHorizontal: 40, 
				backgroundColor: '#cccccc'}}>
				<Text style={{ color: '#ac5c5c', fontSize: 24 }}>
					Label name:
				</Text>
				<TextInput  
					mode='outlined' 
					selectionColor='#ac5c5c' 
					style={{fontSize: 20}}
					theme={{ colors: { primary: '#ac5c5c', 
									placeholder: '#ac5c5c', 
									text: 'black', 
									background: '#cccccc' } }}
					onChangeText={(changedText => onTextChange(changedText))} />
			</View>
			<View style={{ 
				flex: 10, 
				padding: 40, 
				backgroundColor: '#cccccc'}}>
				<Text style={{ color: '#ac5c5c', fontSize: 24 }}>
					Label color:
				</Text>
				<TriangleColorPicker
					hideControls={true} 
					style={{ flex: 1 }} 
					oldColor={labelObject.color} 
					onColorChange={(changedColor => onColorChange(fromHsv(changedColor)))}/>
			</View>
			<View style={{ 
					flex: 3, 
					flexDirection: 'row', 
					flexWrap: 'wrap', 
					justifyContent: 'flex-end', 
					backgroundColor: '#cccccc', 
					paddingRight: '5%'}}>
				<Button icon='check-bold' mode='contained' color='#ac5c5c' labelStyle={{ color: '#cccccc'}}
						onPress={() => onConfirming()}>
					Confirm
				</Button>
			</View>
		</View>
	);
};

export default LabelEditingScreen;
