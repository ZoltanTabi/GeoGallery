import { useNavigation } from '@react-navigation/native';
import { Guid } from 'guid-typescript';
import React, { ReactElement, useState } from 'react';
import { View, useWindowDimensions, } from 'react-native';
import { TriangleColorPicker, fromHsv } from 'react-native-color-picker';
import { Text, TextInput, Chip, Button  } from 'react-native-paper';
import { Label } from '../interfaces/label';
import { createLabel, deleteLabel, updateLabel } from '../storage/actions/labelAction';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, RouteProp } from '@react-navigation/native';
import { commonDeleteLabel } from '../storage/actions/commonAction';
import { RootState } from '../storage';
import { guidToString } from '../helpers/functions';

const LabelEditingScreen = (): ReactElement => {

	const dispatch = useDispatch();
	
	const windowHeight = useWindowDimensions().height;

	const route = useRoute<RouteProp<{ params: { id: string } }, 'params'>>();

	const id = route.params?.id;

	const labelState = useSelector((state: RootState) => state.labelState);

	const initLabel : Label = id != "" 
							? (labelState.labels.find((label) => guidToString(label.id) == route.params.id)as Label) 
							: {id: Guid.create(),text: 'Label', color: 'purple', photos: []}

	const [labelObject, changeObject] = useState<Label>(initLabel);

	const onTextChange = (value: string) => {
		changeObject({...labelObject, text: value});
	}
	  
	const onColorChange= (value: string) => {
		changeObject({...labelObject, color: value});
	}

	const navigation = useNavigation();

  	const onConfirming = () => {
		if(id == "")
		{
			dispatch(createLabel(labelObject));
		}
		else
		{
			dispatch(updateLabel(labelObject));
		}
    	navigation.goBack();
  	}

	const onCanceling = () => {
		navigation.goBack();
	}

	const onDeleting = () => {
		dispatch(commonDeleteLabel(labelObject.id));
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
					textStyle={{ color:'white',fontSize: 15, }}
					mode='flat' 
					children={labelObject.text} />
			</View>
			<View style={{ 
				flex: 2, 
				paddingHorizontal: '10%', 
				backgroundColor: '#cccccc'}}>
				<Text style={{ color: '#5c80ac', fontSize: 18 }}>
					Label name:
				</Text>
				<TextInput  
					mode='outlined' 
					selectionColor='#5c80ac' 
					style={{fontSize: 15,
							height: 45,
							justifyContent: 'center'}}
					theme={{ colors: { primary: '#5c80ac', 
									placeholder: '#5c80ac', 
									text: 'black', 
									background: '#cccccc' } }}
					value={labelObject.text}
					onChangeText={(changedText => onTextChange(changedText))} />
			</View>
			<View style={{ 
				flex: 10, 
				paddingTop: '10%',
				paddingHorizontal: '10%', 
				backgroundColor: '#cccccc'}}>
				<Text style={{ color: '#5c80ac', fontSize: 18 }}>
					Label color:
				</Text>
				<TriangleColorPicker
					hideControls={true} 
					style={{ flex: 1}} 
					oldColor={labelObject.color}
					onColorChange={(changedColor => onColorChange(fromHsv(changedColor)))}/>
			</View>
			<View style={{ 
					flex: 3.5, 
					flexDirection: 'row', 
					flexWrap: 'wrap',
					alignItems: 'center', 
					justifyContent: 'center',
					backgroundColor: '#cccccc', 
					paddingHorizontal: '2%'}}>
				<Button icon='cancel' mode='contained' color='#5c80ac' style={{marginHorizontal: '0.5%'}} 
						labelStyle={{ color: '#cccccc', fontSize: 12}}
						onPress={() => onCanceling()}>
					Cancel
				</Button>
				{ id != "" &&
				<Button icon='trash-can' mode='contained' color='#5c80ac' style={{marginHorizontal: '0.5%'}} 
						labelStyle={{ color: '#cccccc', fontSize: 12}}
						onPress={() => onDeleting()}>
					Delete
				</Button>}
				<Button icon='check-bold' mode='contained' color='#5c80ac' style={{marginHorizontal: '0.5%'}} 
						labelStyle={{ color: '#cccccc', fontSize: 12}}
						onPress={() => onConfirming()}>
					Confirm
				</Button>
			</View>
		</View>
	);
};

export default LabelEditingScreen;
