import React, { useLayoutEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { 
  Provider as PaperProvider 
} from 'react-native-paper';

import { 
  NavigationContainer 
} from '@react-navigation/native';

import {
   createMaterialBottomTabNavigator 
} from '@react-navigation/material-bottom-tabs';

import
  MaterialCommunityIcons
from 'react-native-vector-icons/MaterialCommunityIcons';

import
  CameraScreen
from './components/CameraScreen';

import
  MapScreen
from './components/MapScreen';

import
  GalleryScreen
from './components/GalleryScreen';

import { Provider as StoreProvider, useDispatch } from "react-redux";
import store from './storage/store';
import { initState } from './storage/actions/commonAction';
import LabelEditingScreen from './components/LabelEditingScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { color } from 'react-native-reanimated';
import FullImageScreen from './components/FullImageScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const NavBar = () => {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(initState());
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="GalleryScreen"
      activeColor="#cccccc"
      inactiveColor="#333333"
      barStyle={{ backgroundColor: '#5c80ac' }}
      shifting={true}
    >
      <Tab.Screen
        name="GalleryScreen"
        component={GalleryScreen}
        options={{
          tabBarLabel: 'Gallery',
          tabBarColor: '#5c80ac',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="camera-burst" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          tabBarColor: '#5cac7b',
          tabBarLabel: 'Map',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
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

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="GeoGallery" component={NavBar} 
                          options={{
                            headerShown: false
                          }}/>
            <Stack.Screen name="Editing label" component={LabelEditingScreen} 
                          options={{
                            headerTintColor: '#cccccc',
                            headerStyle: { backgroundColor: '#5c80ac' }
                          }}/>
            <Stack.Screen name="Full image" component={FullImageScreen} 
                          options={{
                            headerShown: false
                          }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
}
