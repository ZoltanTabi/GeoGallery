import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useState } from 'react';
import { Image, PermissionsAndroid, StyleSheet, View } from 'react-native';
import MapView from "react-native-map-clustering";
import { Region, PROVIDER_GOOGLE, Marker, LatLng, MapEvent, Circle, MapCircleProps, Polygon, MapPolygonProps } from 'react-native-maps';
import { FAB, Portal, Provider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { distanceByLatLng, getDistance } from '../helpers/drawing';
import { devConsoleLog, onlyUnique } from '../helpers/functions';
import { RootState } from '../storage';

enum DrawingMode {
  None,
  Circle,
  Rectangle
}

const MapScreen = (): ReactElement => {
  const navigation = useNavigation();
  const photoState = useSelector((state: RootState) => state.photoState);

  const [region, setRegion] = useState<Region>( {latitude: 47.497913, longitude: 19.040236, latitudeDelta: 2, longitudeDelta: 2 });
  const [fabProps, setFabProps] = useState<{open: boolean, visible: boolean}>({open: false, visible: true});
  const [drawingMode, setDrawingMode] = useState<{type: DrawingMode, enabled: boolean}>({type: DrawingMode.None, enabled: false})
  const [circle, setCircle] = useState<MapCircleProps>();
  const [rectangle, setRectangle] = useState<MapPolygonProps>();

  const onMapReady = () => {
    PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(granted => {
        devConsoleLog(granted)
      });
  }

  const onRegionChangeComplete = (newRegion: Region) => {
    if (newRegion.latitude.toFixed(6) === region.latitude.toFixed(6)
      && newRegion.longitude.toFixed(6) === region.longitude.toFixed(6)) {
        return;
    }
    
    if (newRegion.longitudeDelta < 0) {
      newRegion.longitudeDelta = newRegion.longitudeDelta + 360;
    }

    setRegion(newRegion);
  }

  const onMarkerPress = (markerId: string) => {
    navigation.navigate('Full image', {id: markerId});
  }

  const onClusterPress = (_cluster: Marker, markers?: Marker[]) => {
    let photoIds: string[] = [];
    markers?.forEach(marker => {
      const coordinates = (marker as any).properties.coordinate;
      photoIds =  [...photoIds, ...photoState.photos.filter(x => x.latitude === coordinates.latitude && x.longitude === coordinates.longitude).map(x => x.id)];
    })
    photoIds = photoIds.filter(onlyUnique);
  }

  const onPanDrag = (event: MapEvent) => {
    if (!drawingMode.enabled)
      return;

    const coordinate = event.nativeEvent.coordinate;

    switch(drawingMode.type) {
      case DrawingMode.None:
        return;
      case DrawingMode.Circle:
        {
          if (!circle) {
            setCircle({ center: coordinate, radius: 1 });
          } else {
            setCircle(x => ({center: x?.center as LatLng, radius: distanceByLatLng(x?.center as LatLng, coordinate)}));
          }
        }
        break;
      case DrawingMode.Rectangle:
        {
          if (!rectangle) {
            setRectangle({coordinates: [coordinate, coordinate, coordinate, coordinate]});
          } else {
            const firstCoordinate = rectangle.coordinates[0];
            setRectangle({
              coordinates: [
                firstCoordinate,
                {latitude: coordinate.latitude, longitude: firstCoordinate.longitude},
                coordinate,
                {latitude: firstCoordinate.latitude, longitude: coordinate.longitude}
              ]
            });
          }
        }
        break;
      default:
        return;
    }
    devConsoleLog('onPanDrag - coordinate: ' + coordinate.latitude + ', ' + coordinate.longitude);
  }
  
  const onLongPress = (event: MapEvent) => {
    /*if (!drawingMode.enabled)
      return;

    const coordinate = event.nativeEvent.coordinate;

    switch(drawingMode.type) {
      case DrawingMode.None:
        return;
      case DrawingMode.Circle:
        {
          setCircle({ center: coordinate, radius: 10000 });
        }
        break;
      case DrawingMode.Rectangle:
        {
          setRectangle({
            coordinates: [
              coordinate,
              { latitude: coordinate.latitude - 1, longitude: coordinate.longitude},
              { latitude: coordinate.latitude - 1, longitude: coordinate.longitude - 1},
              { latitude: coordinate.latitude, longitude: coordinate.longitude - 1},
            ]
          });
        }
        break;
      default:
        return;
    }*/
  }

  const onMapTouchEnd = () => {
    if (drawingMode.enabled) {
      let photoIds: string[] = []; 

      switch(drawingMode.type) {
        case DrawingMode.None:
          break;
        case DrawingMode.Circle:
          {
            photoIds = photoState.photos.filter(x => x.latitude && x.longitude && circle &&
                getDistance(x.latitude, x.longitude, circle.center.latitude, circle.center.longitude) < circle.radius
              ).map(x => x.id);
          }
          break;
        case DrawingMode.Rectangle:
          {
            const firstCoordinate: LatLng = (rectangle?.coordinates[0]) as LatLng;
            const thirdCoordinate: LatLng = (rectangle?.coordinates[2]) as LatLng;

            photoIds = photoState.photos.filter(x => x.latitude && x.longitude && rectangle && (
                (firstCoordinate.latitude < thirdCoordinate.latitude && firstCoordinate.latitude <= x.latitude && x.latitude <= thirdCoordinate.latitude)
                ||
                (firstCoordinate.latitude > thirdCoordinate.latitude && firstCoordinate.latitude >= x.latitude && x.latitude >= thirdCoordinate.latitude)
              ) && (
                (firstCoordinate.longitude < thirdCoordinate.longitude && firstCoordinate.longitude <= x.longitude && x.longitude <= thirdCoordinate.longitude)
                ||
                (firstCoordinate.longitude > thirdCoordinate.longitude && firstCoordinate.longitude >= x.longitude && x.longitude >= thirdCoordinate.longitude)
              )
            ).map(x => x.id);
          }
          break;
        default:
          break;
      }

      // TODO navigate to gallery screen and filter photoIds
      devConsoleLog('Selected photo count: ' + photoIds.length);
      devConsoleLog('Selected photos: ' + photoIds);
      setDrawingMode(x => ({ ...x, enabled: false }));
    }
  }

  const onCircleDrawing = () => {
    setDrawingMode({ type: DrawingMode.Circle, enabled: true });
    setFabProps(x => ({...x, open: false}));
  }

  const onRectangleDrawing = () => {
    setDrawingMode({ type: DrawingMode.Rectangle, enabled: true });
    setFabProps(x => ({...x, open: false}));
  }

  const getIcon = (open: boolean): string => {
    return open || drawingMode.enabled || circle || rectangle ? 'close' : 'pencil';
  }

  const onFabStateChange = (stateOpen: boolean) => {
    if (!(drawingMode.enabled || circle || rectangle)) {
      setFabProps(x => ({...x, open: stateOpen}));
    }
  }

  const onFabPress = () => {
    if (drawingMode.enabled || circle || rectangle) {
      if (circle) {
        setCircle(undefined);
      } else if (rectangle) {
        setRectangle(undefined);
      }
      setDrawingMode({ type: DrawingMode.None, enabled: false });
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        onMapReady={onMapReady}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        rotateEnabled={false}
        pitchEnabled={false}
        showsCompass={false}
        showsUserLocation={true}
        onClusterPress={onClusterPress}
        preserveClusterPressBehavior={true}
        scrollEnabled={!drawingMode.enabled}
        zoomEnabled={!drawingMode.enabled}
        toolbarEnabled={false}
        clusterColor='#5cac7b'
        moveOnMarkerPress={false}
        onPress={() => setFabProps(x => ({...x, visible: !x.visible}))}
        onPanDrag={onPanDrag}
        onLongPress={onLongPress}
        onTouchEnd={onMapTouchEnd}
      >
        {
          photoState.photos.filter(x => x.latitude && x.longitude).map((item) => {
            return (
              <Marker
                key={item.id}
                coordinate={{latitude: item.latitude as number, longitude: item.longitude as number}}
                onPress={() => onMarkerPress(item.id)}
              >
                <Image source={{uri: item.imageUri}}
                  style={styles.image}
                  resizeMode="contain" />
              </Marker>
            );
          })
        }
        {
          drawingMode && drawingMode.type === DrawingMode.Circle && circle &&
          <Circle
            center={circle.center}
            radius={circle.radius}
            strokeColor='#5cac7b'
            strokeWidth={2}
            fillColor='rgba(92, 172, 123, 0.25)'
          />
        }
        {
          drawingMode && drawingMode.type === DrawingMode.Rectangle && rectangle &&
          <Polygon
            coordinates={rectangle.coordinates} 
            strokeColor='#5cac7b'
            strokeWidth={2}
            fillColor='rgba(92, 172, 123, 0.25)'
          />
        }
      </MapView>
      <Provider>
        <Portal>
          <FAB.Group
            fabStyle={{backgroundColor: '#5cac7b'}}
            color={'#cccccc'}
            visible={fabProps.visible}
            open={fabProps.open}
            icon={getIcon(fabProps.open)}
            actions={[
              {
                icon: 'circle-outline',
                label: 'Circle',
                color: '#cccccc',
                style: {backgroundColor: '#5cac7b'},
                onPress: onCircleDrawing,
                small: false
              },
              {
                icon: 'rectangle-outline',
                label: 'Rectangle',
                color: '#cccccc',
                style: {backgroundColor: '#5cac7b'},
                onPress: onRectangleDrawing,
                small: false
              },
            ]}
            onStateChange={(state) => onFabStateChange(state.open)}
            onPress={onFabPress}
          />
        </Portal>
      </Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: 60,
    height: 60
  }
});

export default MapScreen;
