import { useNavigation } from '@react-navigation/native';
import React, { Children, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  useWindowDimensions,
  Pressable,
  Image,
  PermissionsAndroid,
  DatePickerIOSBase,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';

import { Button, Chip, Portal, FAB, Provider, Dialog, Paragraph, List, Surface, Subheading, Divider, RadioButton } from 'react-native-paper';
import { color } from 'react-native-reanimated';
import CheckBox from '@react-native-community/checkbox';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { useDispatch, useSelector } from 'react-redux';
import { devConsoleLog, getNewId, imageToPhoto } from '../helpers/functions';
import { Label } from '../interfaces/label';
import { ImageType, PhotoForAdd } from '../interfaces/photo';
import { RootState } from '../storage';
import { addMultiplePhoto, addPhoto } from '../storage/actions/photoAction';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { updateSearchTerm } from '../storage/actions/searchTermAction';
import DatePicker from 'react-native-date-picker'

const GalleryScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onFullImage = (propPhoto: string) => {
    navigation.navigate('Full image', {id: propPhoto});
  }

  const labelState = useSelector((state: RootState) => state.labelState);
  const photoState = useSelector((state: RootState) => state.photoState);
  const filterState = useSelector((state: RootState) => state.searchTermState);

  const [tempFilterState, setTempFilterState] = React.useState({...filterState.searchTerm});
  useEffect(() => {
    setTempFilterState({...filterState.searchTerm});
  }, [filterState]);

  const [state, setState] = React.useState( false );
  const onStateChange = (open: boolean) => setState( open );
  const open = state;

  const [visibleFilter, setVisibleFilter] = React.useState(false);
	const showFilter = () => setVisibleFilter(true);	
	const hideFilter = () => setVisibleFilter(false);

	const [visibleSort, setVisibleSort] = React.useState(false);
	const showSort = () => setVisibleSort(true);	
	const hideSort = () => setVisibleSort(false);

  const [visibleFrom, setVisibleFrom] = React.useState(false);
	const showForm = () => setVisibleFrom(true);	
	const hideFrom = () => setVisibleFrom(false);

  const [visibleTo, setVisibleTo] = React.useState(false);
	const showTo = () => setVisibleTo(true);	
	const hideTo = () => setVisibleTo(false);

  const [sortingValue, setSortingValue] = React.useState('location');
  const [sortingOrder, setSortingOrder] = React.useState('ascending');
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [isSelected, setSelection] = useState(false);

  const onLabelPress = (label : Label) => {
    const index = tempFilterState.labels.indexOf(label.id);
    if(index == -1)
    {
      tempFilterState.labels.push(label.id);
    }
    else
    {
      tempFilterState.labels.splice(index, 1);
    }
    setTempFilterState({...tempFilterState});
  }

  const onFromDatePress = () => {
    tempFilterState.dateFrom = fromDate;
    setTempFilterState({...tempFilterState});
    hideFrom();
  }

  const onToDatePress = () => {
    tempFilterState.dateTo = toDate;
    setTempFilterState({...tempFilterState});
    hideTo();
  }

  const addPhotoByCamera = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    
    if (granted === 'granted') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000
      }).then(() => {
        ImageCropPicker.openCamera({
          mediaType: "photo",
          includeExif: true,
          includeBase64: true
        }).then(image => {
          Geolocation.getCurrentPosition(async info => 
            {
              const photo = await imageToPhoto(image, ImageType.Camera, {lat: info.coords.latitude, lng: info.coords.longitude});
              dispatch(addPhoto({ photo: photo, base64Encoded: image.data as string, extension: image.mime.split('/')[1] }))
            });
        }).catch(error => devConsoleLog(error));
      })
      .catch((error) => devConsoleLog(error));
    } else {
      //TODO Dialog
    }
  }

  const addPhotoByGallery = () => {
    ImageCropPicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      includeExif: true,
      includeBase64: true
      }).then(async images => {
        const photoForAdds: PhotoForAdd[] = []

        await Promise.all(images.map(async (image) => {
          const photo = await imageToPhoto(image, ImageType.Gallery);
          photoForAdds.push({ photo: photo, base64Encoded: image.data as string, extension: image.mime.split('/')[1] });
        }));

        dispatch(addMultiplePhoto(photoForAdds));
    }).catch(error => console.log(error));
  }

  return (
    <View style={{flex: 1}}>
      {/*<View style={{
            marginTop: 10,
            padding: '2%',
            flexDirection: 'row', 
            flexWrap: 'wrap',
            alignItems: 'center', 
            justifyContent: 'center', 
            }}>
      {
        labelState.labels.map((item) => {
          return (
              <Chip
                children={item.text}
                mode="outlined" 
                textStyle={{ color:'white',fontSize: 15 }}
                style={{ margin: 4, backgroundColor: item.color }}
                key={item.id}
                onPress={() => {}}
                onLongPress={() => onLabelEditing(item.id)}
                />
          );
        })}
      </View>
      <View style={{flex: 1, marginHorizontal: '5%'}}>
        <Button style={{margin: '10%'}}
                icon='plus' mode='contained' 
                color='#5c80ac' 
                labelStyle={{ color: '#cccccc'}} 
                onPress={() => onLabelEditing()}>
          New label
        </Button>
      </View> */}
      <View style={{flex: 1, 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center'}}>
        <Button style={{marginHorizontal: '10%'}}
                icon='filter' mode='contained' 
                color='#5c80ac' 
                labelStyle={{ color: '#cccccc'}} 
                onPress={showFilter}>
          Filter
        </Button>
        <Button style={{marginHorizontal: '10%'}}
                icon='sort-variant' mode='contained' 
                color='#5c80ac' 
                labelStyle={{ color: '#cccccc'}} 
                onPress={showSort}>
          Sort
        </Button>
      </View>
      <View style={{ flex : 10,
                    alignItems: 'center' }}>
        <FlatList
          numColumns={4}
          data={photoState.photos}
          keyExtractor={item => item.id}
          renderItem={({item})=>{
            return (
              <Pressable onPress={() => onFullImage(item.id)}>
                <Image source={{uri: item.imageUri}} 
                        style={{ height: 80, width: 80, marginHorizontal: '0.5%', marginVertical: '2%' }}/>
              </Pressable>
            )
          }}
        />
        <Provider>
          <Portal>
            <FAB.Group 
              fabStyle={{backgroundColor: '#5c80ac'}}
              color={'#cccccc'}
              visible={true}
              open={open}
              icon={open ? 'dots-horizontal' : 'plus'}
              actions={[
                {
                  icon: 'camera-plus',
                  color: '#cccccc',
                  style: {backgroundColor: '#5c80ac'},
                  onPress: () => addPhotoByCamera(),
                  small: false
                },
                {
                  icon: 'image-plus',
                  color: '#cccccc',
                  style: {backgroundColor: '#5c80ac'},
                  onPress: () => addPhotoByGallery(),
                  small: false
                },
              ]}
              onStateChange={(state) => onStateChange(state.open)}
              onPress={() => {if (open) {}}}
            />
            <Dialog visible={visibleFilter}
                  dismissable={false}
                  style={{backgroundColor: '#cccccc'}}>
              <Dialog.Title style={{color: '#5c80ac'}}>Filter images</Dialog.Title>
              <Dialog.Content>
                <Surface style={{
                      backgroundColor: '#5c80ac',
                      padding: 8,
                      marginVertical: '3%',
                      //alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 4}}>                        
                    <Subheading style={{padding: 5}}>Location</Subheading>
                    <View>
                    <CheckBox
                        value={isSelected}
                        onValueChange={setSelection}
                      />
                    </View>                    
                </Surface>
                <Surface style={{
                      backgroundColor: '#5c80ac',
                      padding: 8,                      
                      marginVertical: '3%',
                      //alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 4}}>
                    <Subheading style={{padding: 5}}>Date</Subheading>
                    <View>
                    <Text style={{color: '#ffffff'}}>From:</Text>
                    <Button mode='outlined' color='#ffffff' onPress={showForm}>{tempFilterState.dateFrom?.toDateString()}</Button>
                    <Text style={{color: '#ffffff'}}>To:</Text>
                    <Button mode='outlined' color='#ffffff' onPress={showTo}>{tempFilterState.dateTo?.toDateString()}</Button>
                  </View>
                </Surface>
                <Surface style={{
                      backgroundColor: '#5c80ac',
                      padding: 8,
                      marginVertical: '3%',
                      //alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 4}}>
                    <Subheading style={{padding: 5}}>Label</Subheading>
                    <View style={{
                          marginTop: 10,
                          padding: '2%',
                          flexDirection: 'row', 
                          flexWrap: 'wrap',
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          }}>
                      {
                      labelState.labels.map((item) => {
                        return (
                            <Chip
                              children={item.text}
                              mode="outlined"
                              selected={(tempFilterState.labels.includes(item.id))}
                              textStyle={{ color:'white',fontSize: 15 }}
                              style={{ margin: 4, backgroundColor: item.color }}
                              key={item.id}
                              onPress={() => onLabelPress(item)}
                              />
                        );
                      })}
                    </View>
                </Surface>
              </Dialog.Content>
              <Dialog.Actions>
                <Button color='#5c80ac' onPress={hideFilter}>Cancel</Button>
                <Button color='#5c80ac' onPress={() => {}}>Confirm</Button>
              </Dialog.Actions>
					  </Dialog>

            <Dialog visible={visibleFrom}
                    dismissable={false}
                    style={{backgroundColor: '#cccccc'}}>
              <Dialog.Title style={{color: '#5c80ac'}}>Choose from</Dialog.Title>
              <Dialog.Content>
                <DatePicker
                  date={fromDate}
                  onDateChange={setFromDate}
                  androidVariant='nativeAndroid'
                  mode='date'
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button color='#5c80ac' onPress={hideFrom}>Cancel</Button>
                <Button color='#5c80ac' onPress={() => onFromDatePress()}>Confirm</Button>
              </Dialog.Actions>
            </Dialog>

            <Dialog visible={visibleTo}
                    dismissable={false}
                    style={{backgroundColor: '#cccccc'}}>
              <Dialog.Title style={{color: '#5c80ac'}}>Choose to</Dialog.Title>
              <Dialog.Content>
                <DatePicker
                  date={toDate}
                  onDateChange={setToDate}
                  androidVariant='nativeAndroid'
                  mode='date'
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button color='#5c80ac' onPress={hideTo}>Cancel</Button>
                <Button color='#5c80ac' onPress={() => onToDatePress()}>Confirm</Button>
              </Dialog.Actions>
            </Dialog>

            <Dialog visible={visibleSort}
                  dismissable={false}
                  style={{backgroundColor: '#cccccc'}}>
              <Dialog.Title style={{color: '#5c80ac'}}>Sort images</Dialog.Title>
              <Dialog.Content style={{backgroundColor: '#5c80ac'}}>
                <RadioButton.Group onValueChange={value => setSortingValue(value)} value={sortingValue}>
                  <RadioButton.Item label="Location" 
                                    value="location" 
                                    color='#ffffff'/>
                  <RadioButton.Item label="Date" 
                                    value="date" 
                                    color='#ffffff'/>
                </RadioButton.Group>
                <Divider style={{height: 2, marginVertical: '3%'}}/>
                <RadioButton.Group onValueChange={value => setSortingOrder(value)} value={sortingOrder}>
                  <RadioButton.Item label="Ascending" 
                                    value="ascending" 
                                    color='#ffffff'/>
                  <RadioButton.Item label="Descending" 
                                    value="descending" 
                                    color='#ffffff'/>
                </RadioButton.Group>
              </Dialog.Content>
              <Dialog.Actions>
                <Button color='#5c80ac' onPress={hideSort}>Cancel</Button>
                <Button color='#5c80ac' onPress={() => {}}>Confirm</Button>
              </Dialog.Actions>
					  </Dialog>
          </Portal>
        </Provider>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    alignItems: "center"
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default GalleryScreen;
