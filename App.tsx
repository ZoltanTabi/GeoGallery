import React, { useLayoutEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapScreen from './components/MapScreen';
import GalleryScreen from './components/GalleryScreen';
import { Provider as StoreProvider, useDispatch } from "react-redux";
import store from './storage/store';
import { initState } from './storage/actions/commonAction';
import LabelEditingScreen from './components/LabelEditingScreen';
import { createStackNavigator } from '@react-navigation/stack';
import FullImageScreen from './components/FullImageScreen';
import { Screen } from './enums/screen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const NavBar = () => {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(initState());
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={Screen.GalleryScreen}
      activeColor="#cccccc"
      inactiveColor="#333333"
      barStyle={{ backgroundColor: '#5c80ac' }}
      shifting={true}
    >
      <Tab.Screen
        name={Screen.GalleryScreen}
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
        name={Screen.MapScreen}
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

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name={Screen.GeoGallery} component={NavBar} 
                          options={{
                            headerShown: false
                          }}/>
            <Stack.Screen name={Screen.EditingLabel} component={LabelEditingScreen} 
                          options={{
                            headerTintColor: '#cccccc',
                            headerStyle: { backgroundColor: '#5c80ac' },
                            headerLeft: ()=> null
                          }}/>
            <Stack.Screen name={Screen.FullImage} component={FullImageScreen} 
                          options={{
                            headerShown: false
                          }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
}
