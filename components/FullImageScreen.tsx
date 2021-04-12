import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React, { ReactElement } from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { Badge, Button, Chip, Dialog, Divider, FAB, Modal, Paragraph, Portal, Provider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Photo } from '../interfaces/photo';
import { RootState } from '../storage';
import { commonAddLabelToPhoto, commonDeletePhoto, commonRemoveLabelFromPhoto } from '../storage/actions/commonAction';
import { removeLabelFromPhoto } from '../storage/actions/photoAction';

const FullImageScreen = (): ReactElement => {

	const dispatch = useDispatch();
	const navigation = useNavigation();
    const windowWidth = useWindowDimensions().width;

    const route = useRoute<RouteProp<{ params: { id: string } }, 'params'>>();

	const photoState = useSelector((state: RootState) => state.photoState);
	const labelState = useSelector((state: RootState) => state.labelState);

	const photoObject = photoState.photos.find((photo) => photo.id == route.params.id)as Photo;

	const actLabels = labelState.labels.filter(label => photoObject.labels.includes(label.id));
	const otherLabels = labelState.labels.filter(label => !(photoObject.labels.includes(label.id)));
	const photoDate = photoObject.createDate != undefined ? photoObject.createDate : "No date information";	
	const photoCountry = photoObject.country != undefined ? photoObject.country : "No country information";
	const photoCity = photoObject.city != undefined ? photoObject.city : "No city information";

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
		<View style={{ flex: 1}}>
			<View style={{ flex: 18, justifyContent: 'center', alignItems: 'center' }}>
				<Image source={{ uri: photoObject.imageUri }}
					style={{ height: ((Math.round(windowWidth)/photoObject.width) * photoObject.height), width: Math.round(windowWidth)}} />
			</View>			
			<Provider>
				<Portal>
					<FAB.Group 
					fabStyle={{backgroundColor: '#5c80ac'}}
					color={'#cccccc'}
					visible={true}
					open={open}
					icon={open ? 'close' : 'plus'}
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
						<Dialog.Content>
						<Paragraph style={{padding: 5, color: '#5c80ac'}}>Date: {photoDate}</Paragraph>
						<Paragraph style={{padding: 5, color: '#5c80ac'}}>Country: {photoCountry}</Paragraph>						
						<Paragraph style={{padding: 5, color: '#5c80ac'}}>City: {photoCity}</Paragraph>
						<Paragraph style={{padding: 5, color: '#5c80ac'}}>Labels: {actLabels.length === 0 && "No labels"}</Paragraph>
							<View style={{
									flexDirection: 'row', 
									flexWrap: 'wrap', 
									justifyContent: 'flex-start', 
									}}>
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
						</Dialog.Content>
					</Dialog>
					<Dialog visible={visibleLabel}
						dismissable={false}
						style={{backgroundColor: '#cccccc'}}>
						<Dialog.Title style={{color: '#5c80ac'}}>Modify labels</Dialog.Title>
						<Dialog.Content>							
							<Paragraph style={{padding: 5, color: '#5c80ac'}}>Labels of the photo:</Paragraph>
							<View style={{
									flexDirection: 'row', 
									flexWrap: 'wrap', 
									justifyContent: 'center', 
									}}>
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
										/>
									);
								})}							
      						</View>					
							<Paragraph style={{padding: 5, color: '#5c80ac'}}>Other labels:</Paragraph>
							<View style={{
									flexDirection: 'row', 
									flexWrap: 'wrap', 
									justifyContent: 'center', 
									}}>
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
										/>
									);
								})}							
      						</View>
						</Dialog.Content>
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
