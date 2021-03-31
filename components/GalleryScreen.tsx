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
import { devConsoleLog, getNewId } from '../helpers/functions';
import { Label } from '../interfaces/label';
import { ImageType, InitPhoto } from '../interfaces/photo';
import { RootState } from '../storage';
import { addMultiplePhoto, addPhoto } from '../storage/actions/photoAction';

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

  const addPhotoByCamera = () => {
    ImageCropPicker.openCamera({
      mediaType: "photo",
      includeExif: true,
      includeBase64: true
    }).then(image => {
      dispatch(addPhoto({ id: getNewId(), type: ImageType.Gallery, height: image.height, width: image.width, exif: image.exif, base64Encoded: image.data as string, extension: image.mime.split('/')[1] }))
    }).catch(error => console.log(error));
  }

  const addPhotoByGallery = () => {
    ImageCropPicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      includeExif: true,
      includeBase64: true
      }).then(images => {
        const initPhotos: InitPhoto[] = []
        images.forEach(image => {
          initPhotos.push({ id: getNewId(), type: ImageType.Gallery, height: image.height, width: image.width, exif: image.exif, base64Encoded: image.data as string, extension: image.mime.split('/')[1] })
        });
        dispatch(addMultiplePhoto(initPhotos));
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
                    padding: '1%',
                    alignItems: 'center' }}>
        <FlatList
          numColumns={2}
          data={photoState.photos}
          keyExtractor={item => item.id}
          renderItem={({item})=>{
            return (
              <Pressable onPress={() => onFullImage(item.id)}>
                <Image source={{uri: item.imageUri}} 
                        style={{ height: 180, width: 180, margin: '0.8%' }}/>
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
