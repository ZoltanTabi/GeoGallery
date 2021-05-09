import { useNavigation } from "@react-navigation/native";
import React, { FC, ReactElement } from "react";
import { FlatList, Image, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Paragraph, Subheading } from "react-native-paper";
import { Screen } from "../enums/screen";
import { getCountriesAndCitiesWithPhotosAscending, getCountriesAndCitiesWithPhotosDescending, getOrderByDateTimeAscending, getOrderByDateTimeDescending } from "../helpers/searchFilter";
import { Photo, PhotoState } from "../interfaces/photo";

const PressableImage: FC<Photo> = (props): ReactElement => {
  const navigation = useNavigation();
  
  const imageSize = (useWindowDimensions().width / 100) * 24;
  
  const onFullImage = (propPhoto: string) => {
    navigation.navigate(Screen.FullImage, {id: propPhoto});
  }

  return (
    <Pressable onPress={() => onFullImage(props.id)}>
      <Image
        source={{uri: props.imageUri}}
        style={{ height: imageSize, width: imageSize, marginHorizontal: '0.5%', marginVertical: '2%' }}
      />
    </Pressable>
  )
}

const ImageListByLocation: FC<{photos: {country: string; cities: {city: string; photos: Photo[]}[]}[]}> = (props): ReactElement => {
  return (
    <>
      {
        props.photos.map((x) => {
          return (
            <View>
              <Subheading style={styles.heading}>{x.country}</Subheading>
              {
                x.cities.map((y) => {
                  return (
                    <>
                      <Paragraph style={styles.paragraph}>{y.city}</Paragraph>
                      <FlatList
                        numColumns={4}
                        data={y.photos}
                        keyExtractor={item => item.id}
                        renderItem={({item})=>{
                          return (
                            <PressableImage {...item} />
                          )
                        }}
                      />
                    </>
                  )
                })
              }
            </View>
          )
        })
      }
    </>
  );
}

const ImageListByDate: FC<{photos: {date: Date; photos: Photo[]}[]}> = (props): ReactElement => {
  return (
    <>
      {
        props.photos.map((x) => {
          return (
            <View>
              <Subheading style={styles.heading}>{x.date.toDateString()}</Subheading>
              <FlatList
                numColumns={4}
                data={x.photos}
                keyExtractor={item => item.id}
                renderItem={({item})=>{
                  return (
                    <PressableImage {...item} />
                  )
                }}
              />
            </View>
          )
        })
      }
    </>
  );
}

export const ImageList: FC<{photoState: PhotoState, sortingValue: string, sortingOrder: string}> = (props): ReactElement => { 
  return (
    <>
      {
        props.sortingValue === 'default' &&
        <FlatList
         style={styles.fullWidth}
          numColumns={4}
          data={props.sortingOrder === 'ascending' ? props.photoState.photos : props.photoState.photos.reverse()}
          keyExtractor={item => item.id}
          renderItem={({item})=>{
            return (
              <PressableImage {...item} />
            )
          }}
        />
      }
      {
        props.sortingValue === 'location' &&
        <ScrollView
          style={styles.fullWidth}
        >
          <ImageListByLocation photos={
            props.sortingOrder === 'ascending'
              ? getCountriesAndCitiesWithPhotosAscending(props.photoState)
              : getCountriesAndCitiesWithPhotosDescending(props.photoState)
          } />
        </ScrollView>
      }
      {
        props.sortingValue === 'date' &&
        <ScrollView
          style={styles.fullWidth}
        >
          <ImageListByDate photos={
            props.sortingOrder === 'ascending'
              ? getOrderByDateTimeAscending(props.photoState)
              : getOrderByDateTimeDescending(props.photoState)
          } />
        </ScrollView>
      }
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: '#5c80ac',
    fontSize: 20,
    marginLeft: 5
  },
  paragraph: {
    color: '#5c80ac',
    marginLeft: 5
  },
  fullWidth: {
    width: '100%'
  }
});
