import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React, { ReactElement, useEffect, useState } from 'react';
import { View, Image, useWindowDimensions, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
import { Button, Chip, DataTable, Dialog, FAB, IconButton, Subheading, Portal, Provider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Photo } from '../interfaces/photo';
import { RootState } from '../storage';
import { commonAddLabelToPhoto, commonDeletePhoto, commonRemoveLabelFromPhoto } from '../storage/actions/commonAction';

const FullImageScreen = (): ReactElement => {

	const dispatch = useDispatch();
	const navigation = useNavigation();
    const windowWidth = useWindowDimensions().width;
	const windowHeight = useWindowDimensions().height;

    const route = useRoute<RouteProp<{ params: { id: string } }, 'params'>>();

	const photoState = useSelector((state: RootState) => state.photoState);
	const labelState = useSelector((state: RootState) => state.labelState);

	const [photoObject, setPhotoObject] = useState(photoState.photos.find((photo) => photo.id == route.params.id) as Photo);

	const actLabels = labelState.labels.filter(label => photoObject.labels.includes(label.id));
	const otherLabels = labelState.labels.filter(label => !(photoObject.labels.includes(label.id)));
	const photoDate = photoObject.createDate ? new Date(photoObject['createDate']).toDateString() : "No date information";	
	const photoCountry = photoObject.country ?? "No country information";
	const photoCity = photoObject.city ?? "No city information";

	useEffect(() => {
		const photo = photoState.photos.find((photo) => photo.id == route.params.id);
		if (photo) {
			setPhotoObject(photo as Photo);
		}
	  }, [photoState, labelState]);

	const onLabelEditing = (propLabel?: string) => {
		const checkId = propLabel ? propLabel : "";
		navigation.navigate('Editing label', {id: checkId});
	}

	const [state, setState] = React.useState( false );
	const onStateChange = (open: boolean) => setState( open );
	const open = state;

	const [visibleInfo, setVisibleInfo] = React.useState(false);
	const showInfo = () => setVisibleInfo(true);
  	const hideInfo = () => setVisibleInfo(false);

	const [visibleDelete, setVisibleDelete] = React.useState(false);
	const showDelete = () => setVisibleDelete(true);	
	const hideDelete = () => setVisibleDelete(false);

	const [visibleLabel, setVisibleLabel] = React.useState(false);
	const showLabel = () => setVisibleLabel(true);	
	const hideLabel = () => setVisibleLabel(false);

	const onDelete = () => {
		dispatch(commonDeletePhoto(photoObject));
		hideDelete();
    	navigation.goBack();
  	}

	return (
		<View style={styles.mainView}>
			<View style={styles.secondView}>
				<ImageZoom
					imageHeight={((Math.round(windowWidth)/photoObject.width) * photoObject.height)}
					imageWidth={Math.round(windowWidth)}
					cropWidth={windowWidth}
					cropHeight={windowHeight}
				>
					<Image
						source={{ uri: photoObject.imageUri }}
						style={{ height: ((Math.round(windowWidth)/photoObject.width) * photoObject.height), width: Math.round(windowWidth)}}
					/>
				</ImageZoom>
			</View>			
			<Provider>
				<Portal>
					<FAB.Group 
					fabStyle={{backgroundColor: '#5c80ac'}}
					color={'#cccccc'}
					visible={true}
					open={open}
					icon={open ? 'close' : 'dots-horizontal'}
					actions={[
						{
							icon: 'information-outline',
							color: '#cccccc',
							style: {backgroundColor: '#5c80ac'},
							onPress: showInfo,
							small: false
						},
						{
							icon: 'tag-text-outline',
							color: '#cccccc',
							style: {backgroundColor: '#5c80ac'},
							onPress: showLabel,
							small: false
						},
						{
							icon: 'trash-can',
							color: '#cccccc',
							style: {backgroundColor: '#5c80ac'},
							onPress: showDelete,
							small: false
						},
					]}
					onStateChange={(state) => onStateChange(state.open)}
					onPress={() => {if (open) {}}}
					/>
					<Dialog visible={visibleInfo}
						onDismiss={hideInfo}
						style={{backgroundColor: '#cccccc'}}>
						<Dialog.Title style={{color: '#5c80ac'}}>About photo</Dialog.Title>
						<Dialog.Content style={{backgroundColor: '#5c80ac'}}>
						<DataTable>
							<DataTable.Row>
								<DataTable.Cell>Date:</DataTable.Cell>
      							<DataTable.Cell>{photoDate}</DataTable.Cell>
							</DataTable.Row>
							<DataTable.Row>
								<DataTable.Cell>Country</DataTable.Cell>
      							<DataTable.Cell>{photoCountry}</DataTable.Cell>
							</DataTable.Row>
							<DataTable.Row>
								<DataTable.Cell>City:</DataTable.Cell>
      							<DataTable.Cell>{photoCity}</DataTable.Cell>
							</DataTable.Row>
							<DataTable.Row>
								<DataTable.Cell >Labels:</DataTable.Cell>
      							<DataTable.Cell>
									{actLabels.length === 0 && "No labels"}		
								</DataTable.Cell>
							</DataTable.Row>
							<View style={styles.dialogView}>						  
								{
								actLabels.map((item) => {
									return (
										<Chip
											children={item.text}
											mode="outlined" 
											textStyle={{ color:'white',fontSize: 15 }}
											style={{ margin: 4, backgroundColor: item.color }}
											key={item.id}
										/>
									);
								})}
							</View>
						</DataTable>
						</Dialog.Content>
					</Dialog>
					<Dialog visible={visibleLabel}
						dismissable={false}
						style={{backgroundColor: '#cccccc'}}>
						<Dialog.Title style={{color: '#5c80ac'}}>Modify labels</Dialog.Title>
						<Dialog.ScrollArea style={{backgroundColor: '#5c80ac', height: '40%'}}>	
							<ScrollView>
								<View style={{maxHeight: '30%'}}>
								<Subheading style={{padding: 5}}>Labels of the photo:</Subheading>
								<View style={styles.dialogView}>
									{
									actLabels.map((item) => {
										return (
											<Chip
												children={item.text}
												mode="outlined" 
												textStyle={{ color:'white',fontSize: 15 }}
												style={{ margin: 4, backgroundColor: item.color }}
												key={item.id}
												onClose={() => dispatch(commonRemoveLabelFromPhoto(photoObject.id, item.id))}
												onPress={() => {}}
												onLongPress={() => onLabelEditing(item.id)}
											/>
										);
									})}							
								</View>					
								<Subheading style={{padding: 5}}>Other labels:</Subheading>
								<View style={styles.dialogView}>
									{
									otherLabels.map((item) => {
										return (
											<Chip
												children={item.text}
												mode="outlined" 
												textStyle={{ color:'white',fontSize: 15 }}
												style={{ margin: 4, backgroundColor: item.color }}
												key={item.id}
												onPress={() => dispatch(commonAddLabelToPhoto(photoObject.id, item.id))}
												onLongPress={() => onLabelEditing(item.id)}
											/>
										);
									})}		
									<IconButton
										icon="plus"
										color='#cccccc'
										size={20}
										onPress={() => onLabelEditing()}
									/>					
								</View>
								</View>
							</ScrollView>						
						</Dialog.ScrollArea>
						<Dialog.Actions>
							<Button color='#5c80ac' onPress={hideLabel}>Confirm</Button>
						</Dialog.Actions>
					</Dialog>
					<Dialog visible={visibleDelete}
						dismissable={false}
						style={{backgroundColor: '#cccccc'}}>
						<Dialog.Title style={{color: '#5c80ac'}}>Delete this photo?</Dialog.Title>
						<Dialog.Actions>
							<Button color='#5c80ac' onPress={hideDelete}>Cancel</Button>
							<Button color='#ac5c5c' onPress={onDelete}>Delete</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>
			</Provider>
		</View>
	);
};

export default FullImageScreen;

const styles = StyleSheet.create({
	mainView: {
		flex: 1
	},
	secondView: {
		flex: 18,
		justifyContent: 'center',
		alignItems: 'center'
	},
	dialogView: {
		flexDirection: 'row', 
		flexWrap: 'wrap', 
		justifyContent: 'center', 
	}
});
