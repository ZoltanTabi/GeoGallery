/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
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

declare const global: {HermesInternal: null | {}};
const Tab = createMaterialBottomTabNavigator();

const NavBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="GalleryScreen"
      activeColor="#cccccc"
      inactiveColor="#333333"
      barStyle={{ backgroundColor: '#ac5c5c' }}
      shifting={true}
    >
      <Tab.Screen
        name="GalleryScreen"
        component={GalleryScreen}
        options={{
          tabBarLabel: 'Gallery',
          tabBarColor: '#ac5c5c',
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
      <Tab.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          tabBarColor: '#5c80ac',
          tabBarLabel: 'Camera',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="camera-plus" color={color} size={26} />
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
    <PaperProvider>
      <NavigationContainer>
        <NavBar />
      </NavigationContainer>
    </PaperProvider>
  );
}
