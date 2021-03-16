import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { TriangleColorPicker } from 'react-native-color-picker';
import { Divider, Text, TextInput  } from 'react-native-paper';

const LabelEditingScreen = (): ReactElement => {

	return (
		<View style={{flex: 1, padding: 45, backgroundColor: '#cccccc' }}>
			<Text style={{color: 'black', fontSize: 24}}>Label name:</Text>
			<TextInput label="Label" mode='outlined' selectionColor='#ac5c5c'
				theme={{ colors: { primary: '#ac5c5c', placeholder: '#ac5c5c', text: 'black',background : '#cccccc'}}} />
			<Divider style={{backgroundColor: 'black'}}/>
			<Text style={{color: 'black', fontSize: 24}}>Label color:</Text>
			<TriangleColorPicker
				oldColor='purple'
				style={{flex: 1}}
			/>
		</View>
	);
};

export default LabelEditingScreen;
