import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useState } from 'react';
import { Image, PermissionsAndroid, StyleSheet, View } from 'react-native';
import MapView from "react-native-map-clustering";
import { Region, PROVIDER_GOOGLE, Marker, LatLng, MapEvent, Circle, MapCircleProps, Polygon, MapPolygonProps, MapTypes, Heatmap, WeightedLatLng } from 'react-native-maps';
import { Button, Dialog, FAB, Paragraph, Portal, Provider, RadioButton, Subheading } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { ClusterType } from '../enums/clusterType';
import { DrawingMode } from '../enums/drawingMode';
import { MapStyle } from '../enums/mapStyle';
import { Screen } from '../enums/screen';
import { distanceByLatLng, getDistance } from '../helpers/drawing';
import { devConsoleLog, onlyUnique } from '../helpers/functions';
import { mapFilter } from '../helpers/searchFilter';
import { RootState } from '../storage';
import { updateSearchTerm } from '../storage/actions/searchTermAction';
const nightMapStyle = require('../assets/nightMapStyle.json');

const MapScreen = (): ReactElement => {
	const dispatch = useDispatch();
  const navigation = useNavigation();
  const photoState = useSelector((state: RootState) => state.photoState);
  const searchTermState = useSelector((state: RootState) => state.searchTermState);

  const photos = mapFilter(photoState, searchTermState);

  const mapStyles: {code: MapStyle; label: string;}[] = [{code: MapStyle.standard, label: 'Deafult'}, {code: MapStyle.hybrid, label: 'Satellite'}, {code: MapStyle.terrain, label: 'Terrain'}, {code: MapStyle.night, label: 'Night'}];
  const clusterTypes: {code: ClusterType; label: string;}[] = [{code: ClusterType.cluster, label: 'Clustering'}, {code: ClusterType.heatMap, label: 'Heat Map'}];

  const [style, setStyle] = useState<MapStyle>(MapStyle.standard);
  const [clusterType, setClusterType] = useState<ClusterType>(ClusterType.cluster);
  const [region, setRegion] = useState<Region>( {latitude: 47.497913, longitude: 19.040236, latitudeDelta: 2, longitudeDelta: 2 });
  const [fabProps, setFabProps] = useState<{open: boolean, visible: boolean}>({open: false, visible: true});
  const [drawingMode, setDrawingMode] = useState<{type: DrawingMode, enabled: boolean}>({type: DrawingMode.None, enabled: false})
  const [circle, setCircle] = useState<MapCircleProps>();
  const [rectangle, setRectangle] = useState<MapPolygonProps>();

  const [visibleMapOption, setVisibleMapOption] = useState(false);
	const showMapOption = () => setVisibleMapOption(true);	
	const hideMapOption = () => setVisibleMapOption(false);

  const weightedLatLngs: WeightedLatLng [] = photoState.photos.filter(x => x.latitude && x.longitude).map(photo => ({
    latitude: photo.latitude as number,
    longitude: photo.longitude as number,
    weight: 1
  }))

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
    navigation.navigate(Screen.FullImage, {id: markerId});
  }

  const onClusterPress = (_cluster: Marker, markers?: Marker[]) => {
    let photoIds: string[] = [];
    markers?.forEach(marker => {
      const coordinates = (marker as any).properties.coordinate;
      photoIds =  [...photoIds, ...photos.filter(x => x.latitude === coordinates.latitude && x.longitude === coordinates.longitude).map(x => x.id)];
    })
    photoIds = photoIds.filter(onlyUnique);

    searchTermState.searchTerm.photoIdsByClusterFilter = photoIds;
    dispatch(updateSearchTerm(searchTermState.searchTerm));
    navigation.navigate(Screen.GalleryScreen);
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
      switch(drawingMode.type) {
        case DrawingMode.None:
          setDrawingMode(x => ({ ...x, enabled: false }));
          break;
        case DrawingMode.Circle:
          {
            setDrawingMode(x => ({ ...x, enabled: false }));

            searchTermState.searchTerm.circle = circle;
            dispatch(updateSearchTerm(searchTermState.searchTerm));

            navigation.navigate(Screen.GalleryScreen);
          }
          break;
        case DrawingMode.Rectangle:
          {
            setDrawingMode(x => ({ ...x, enabled: false }));

            searchTermState.searchTerm.polygon = rectangle?.coordinates;
            dispatch(updateSearchTerm(searchTermState.searchTerm));

            navigation.navigate(Screen.GalleryScreen);
          }
          break;
        default:
          setDrawingMode(x => ({ ...x, enabled: false }));
          break;
      }
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
    return open || drawingMode.enabled || circle || rectangle ? 'close' : 'image-size-select-large';
  }

  const onFabStateChange = (stateOpen: boolean) => {
    if (!(drawingMode.enabled || circle || rectangle)) {
      setFabProps(x => ({...x, open: stateOpen}));
    }
  }

  const onFabPress = () => {
    if (drawingMode.enabled || circle || rectangle) {
      if (circle) {
        searchTermState.searchTerm.circle = undefined;
        dispatch(updateSearchTerm(searchTermState.searchTerm));
        setCircle(undefined);
      } else if (rectangle) {
        searchTermState.searchTerm.polygon = undefined;
        dispatch(updateSearchTerm(searchTermState.searchTerm));
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
        showsMyLocationButton={false}
        mapType={(style === MapStyle.night ? MapStyle.standard : style) as MapTypes}
        customMapStyle={(style === MapStyle.night ? nightMapStyle : [])}
        clusteringEnabled={clusterType === ClusterType.cluster}
      >
        {
          clusterType === ClusterType.cluster &&
          photos.filter(x => x.latitude && x.longitude).map((item) => {
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
          clusterType === ClusterType.heatMap &&
          <Heatmap
            points={weightedLatLngs}
          />
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
          <FAB
            style={styles.fabStyle}
            color={'#cccccc'}
            visible={fabProps.visible}
            icon='layers-outline'
            onPress={showMapOption}
          />
          <FAB.Group
            fabStyle={{backgroundColor: '#5cac7b'}}
            color={'#cccccc'}
            visible={fabProps.visible}
            open={fabProps.open}
            icon={getIcon(fabProps.open)}
            actions={[
              {
                icon: 'selection-ellipse',
                label: 'Circle',
                color: '#cccccc',
                style: {backgroundColor: '#5cac7b'},
                onPress: onCircleDrawing,
                small: false
              },
              {
                icon: 'selection',
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
          <Dialog
          visible={visibleMapOption}
						dismissable={false}
						style={{backgroundColor: '#cccccc'}}
          >
						<Dialog.Title style={{color: '#5cac7b'}}>Map options</Dialog.Title>
            <Dialog.Content>
              <Subheading style={{color: '#5cac7b'}}>Map type</Subheading>
              <RadioButton.Group onValueChange={value => setStyle(value as MapStyle)} value={style}>
                {
                  mapStyles.map((item) => {
                    return (
                      <RadioButton.Item key={item.code} label={item.label} value={item.code} color='#5cac7b' uncheckedColor='#5cac7b' labelStyle={{color: '#5cac7b'}} />
                    )
                  })
                }
              </RadioButton.Group>
              <Subheading style={{color: '#5cac7b'}}>Cluster type</Subheading>
              <RadioButton.Group onValueChange={value => setClusterType(value as ClusterType)} value={clusterType}>
                {
                  clusterTypes.map((item) => {
                    return (
                      <RadioButton.Item key={item.code} label={item.label} value={item.code} color='#5cac7b' uncheckedColor='#5cac7b' labelStyle={{color: '#5cac7b'}} />
                    )
                  })
                }
              </RadioButton.Group>
            </Dialog.Content>
						<Dialog.Actions>
							<Button color='#5cac7b' onPress={hideMapOption}>Close</Button>
						</Dialog.Actions>
					</Dialog>
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
  },
  fabStyle: {
    backgroundColor: '#5cac7b',
    position: 'absolute',
    marginBottom: 620,
    right: 16,
    bottom: 0
  }
});

export default MapScreen;
