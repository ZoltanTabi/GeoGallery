import { useNavigation } from '@react-navigation/native';
import React, { Children, useState } from 'react';
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
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';

import { Button, Chip, Portal, FAB, Provider } from 'react-native-paper';
import { color } from 'react-native-reanimated';

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

const GalleryScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onLabelEditing = (propLabel?: string) => {
    const checkId = propLabel ? propLabel : "";
    navigation.navigate('Editing label', {id: checkId});
  }

  const onFullImage = (propPhoto: string) => {
    navigation.navigate('Full image', {id: propPhoto});
  }

  const labelState = useSelector((state: RootState) => state.labelState);
  const photoState = useSelector((state: RootState) => state.photoState);

  const [state, setState] = React.useState( false );
  const onStateChange = (open: boolean) => setState( open );
  const open = state;

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
      </View> 
      <View style={{ flex : 5,
                    alignItems: 'center' }}>
        <FlatList
          numColumns={4}
          data={photoState.photos}
          keyExtractor={item => item.id}
          renderItem={({item})=>{
            return (
              <Pressable onPress={() => onFullImage(item.id)}>
                <Image source={{uri: item.imageUri}} 
                        style={{ height: 90, width: 90, marginHorizontal: '0.5%', marginVertical: '2%' }}/>
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
