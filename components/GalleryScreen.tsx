import { useNavigation } from '@react-navigation/native';
import React, { Children } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  useWindowDimensions,
} from 'react-native';

import { Button, Chip } from 'react-native-paper';
import { color } from 'react-native-reanimated';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { useSelector } from 'react-redux';
import { guidToString } from '../helpers/functions';
import { LabelState, Label } from '../interfaces/label';
import { RootState } from '../storage';
import { FlatGrid } from 'react-native-super-grid';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';

const GalleryScreen = () => {

  const navigation = useNavigation();

  const onLabelEditing = () => {
    navigation.navigate('Editing label')
  }

  const labelState = useSelector((state: RootState) => state.labelState);

  return (
    <View style={{flex: 1, margin: 10}}>
      <View style={{
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
                />
          );
        })}
      </View>
      <View style={{flex: 1}}>
        <Button style={{margin: 40}}
                icon='plus' mode='contained' color='#ac5c5c' 
                labelStyle={{ color: '#cccccc'}} onPress={() => onLabelEditing()}>
          New label
        </Button>
      </View>      
      <View style={{ flex : 6, justifyContent: 'center', alignItems: 'center' }}>
        <Text >This will be the gallery screen.</Text>
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
