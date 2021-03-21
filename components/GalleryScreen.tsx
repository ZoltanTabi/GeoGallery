import { useNavigation } from '@react-navigation/native';
import { Guid } from 'guid-typescript';
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
import { guidToString } from '../helpers/functions';
import { Label } from '../interfaces/label';
import { ImageType, Photo } from '../interfaces/photo';
import { RootState } from '../storage';
import { addMultiplePhoto } from '../storage/actions/photoAction';

const GalleryScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onLabelEditing = (propLabel?: Label) => {
    navigation.navigate('Editing label', {propLabel});
  }

  const onFullImage = (propPhoto?: Photo) => {
    navigation.navigate('Full image', {propPhoto});
  }

  const labelState = useSelector((state: RootState) => state.labelState);
  const photoState = useSelector((state: RootState) => state.photoState);

  const [state, setState] = React.useState( false );
  const onStateChange = (open: boolean) => setState( open );
  const open = state;

  /*const pics = () => {
    const photos: Photo[] = [{id: Guid.create(), imageUri: 'https://www.mamaison.com/data/destinations/df/750x640.exact.q85/budapest-lg.jpg?_images_storage', type: ImageType.Gallery, labels: []},
                            {id: Guid.create(), imageUri: 'https://www.globeguide.ca/wp-content/uploads/2015/12/hungary-budapest-parliament-building-1.jpg', type: ImageType.Gallery, labels: []},
                            {id: Guid.create(), imageUri: 'https://travelhouse.hu/wp-content/uploads/2020/05/the-hungarian-parliament-on-the-danube-river-at-sunset-in-budapest-hungary-945207010-23afbc9012d54bc4bb7c8a1f8c90075b.jpg', type: ImageType.Gallery, labels: []}]
  
    dispatch(addMultiplePhoto(photos));
  }*/

  return (
    <View style={{flex: 1}}>
      <View style={{
            marginTop: 10,
            padding: 5,
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
                key={guidToString(item.id)}
                onPress={() => {}}
                onLongPress={() => onLabelEditing(item)}
                />
          );
        })}
      </View>
      <View style={{flex: 1, marginHorizontal: 10}}>
        <Button style={{margin: 40}}
                icon='plus' mode='contained' 
                color='#5c80ac' 
                labelStyle={{ color: '#cccccc'}} 
                onPress={() => onLabelEditing()}>
          New label
        </Button>
      </View> 
      <View style={{ flex : 5, 
                    padding: 5,
                    alignItems: 'center' }}>
        <FlatList
          numColumns={2}
          data={photoState.photos}
          keyExtractor={item => guidToString(item.id)}
          renderItem={({item})=>{
            return (
              <Pressable onPress={() => onFullImage(item)}>
                <Image source={{uri: item.imageUri}} 
                        style={{ height: 180, width: 180, margin: 5 }}/>
              </Pressable>
            )
          }}
          
        />
        <Provider>
          <Portal >
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
                  onPress: () => console.log('Pressed star'),
                  small: false
                },
                {
                  icon: 'image-plus',
                  color: '#cccccc',
                  style: {backgroundColor: '#5c80ac'},
                  onPress: () => console.log('Pressed email'),
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
