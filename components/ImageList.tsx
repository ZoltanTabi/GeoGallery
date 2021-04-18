import { useNavigation } from "@react-navigation/native";
import React, { FC, ReactElement } from "react";
import { FlatList, Image, Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Paragraph, Subheading } from "react-native-paper";
import { getCountriesAndCitiesWithPhotosAscending, getCountriesAndCitiesWithPhotosDescending, getOrderByDateTimeAscending, getOrderByDateTimeDescending } from "../helpers/searchFilter";
import { PhotoState } from "../interfaces/photo";

export const ImageList: FC<{photoState: PhotoState, sortingValue: string, sortingOrder: string}> = (props): ReactElement => { 
    const navigation = useNavigation();

    const onFullImage = (propPhoto: string) => {
        navigation.navigate('Full image', {id: propPhoto});
    }

    return (
        <>
            {
                props.sortingValue === 'none' &&
                <FlatList
                    numColumns={4}
                    data={props.photoState.photos}
                    keyExtractor={item => item.id}
                    renderItem={({item})=>{
                        return (
                        <Pressable onPress={() => onFullImage(item.id)}>
                            <Image source={{uri: item.imageUri}} 
                                    style={{ height: 80, width: 80, marginHorizontal: '0.5%', marginVertical: '2%' }}/>
                        </Pressable>
                        )
                    }}
                />
            }
            {
                props.sortingValue === 'location' && props.sortingOrder === 'ascending' &&
                <ScrollView>
                {
                    getCountriesAndCitiesWithPhotosAscending(props.photoState).map((x) => {
                        return (
                            <View>
                                <Subheading style={{color: '#5c80ac', fontSize: 20}}>{x.country}</Subheading>
                                {
                                    x.cities.map((y) => {
                                        return (
                                            <>
                                                <Paragraph style={{color: '#5c80ac'}}>{y.city}</Paragraph>
                                                <FlatList
                                                    numColumns={4}
                                                    data={y.photos}
                                                    keyExtractor={item => item.id}
                                                    renderItem={({item})=>{
                                                        return (
                                                        <Pressable onPress={() => onFullImage(item.id)}>
                                                            <Image source={{uri: item.imageUri}}
                                                                    style={{ height: 80, width: 80, marginHorizontal: '0.5%', marginVertical: '2%' }}/>
                                                        </Pressable>
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
                </ScrollView>
            }
            {
                props.sortingValue === 'location' && props.sortingOrder === 'descending' &&
                <ScrollView>
                {
                    getCountriesAndCitiesWithPhotosDescending(props.photoState).map((x) => {
                        return (
                            <View>
                                <Subheading style={{color: '#5c80ac', fontSize: 20}}>{x.country}</Subheading>
                                {
                                    x.cities.map((y) => {
                                        return (
                                            <>
                                                <Paragraph style={{color: '#5c80ac'}}>{y.city}</Paragraph>
                                                <FlatList
                                                    numColumns={4}
                                                    data={y.photos}
                                                    keyExtractor={item => item.id}
                                                    renderItem={({item})=>{
                                                        return (
                                                        <Pressable onPress={() => onFullImage(item.id)}>
                                                            <Image source={{uri: item.imageUri}}
                                                                    style={{ height: 80, width: 80, marginHorizontal: '0.5%', marginVertical: '2%' }}/>
                                                        </Pressable>
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
                </ScrollView>
            }
            {
                props.sortingValue === 'date' && props.sortingOrder === 'ascending' &&
                <ScrollView>
                {
                    getOrderByDateTimeAscending(props.photoState).map((x) => {
                        return (
                            <View>
                                <Subheading style={{color: '#5c80ac', fontSize: 20}}>{x.date.toDateString()}</Subheading>
                                <FlatList
                                    numColumns={4}
                                    data={x.photos}
                                    keyExtractor={item => item.id}
                                    renderItem={({item})=>{
                                        return (
                                        <Pressable onPress={() => onFullImage(item.id)}>
                                            <Image source={{uri: item.imageUri}}
                                                    style={{ height: 80, width: 80, marginHorizontal: '0.5%', marginVertical: '2%' }}/>
                                        </Pressable>
                                        )
                                    }}
                                />
                            </View>
                        )
                    })
                }
                </ScrollView>
            }
            {
                props.sortingValue === 'date' && props.sortingOrder === 'descending' &&
                <ScrollView>
                {
                    getOrderByDateTimeDescending(props.photoState).map((x) => {
                        return (
                            <View>
                                <Subheading style={{color: '#5c80ac', fontSize: 20}}>{x.date.toDateString()}</Subheading>
                                <FlatList
                                    numColumns={4}
                                    data={x.photos}
                                    keyExtractor={item => item.id}
                                    renderItem={({item})=>{
                                        return (
                                        <Pressable onPress={() => onFullImage(item.id)}>
                                            <Image source={{uri: item.imageUri}}
                                                    style={{ height: 80, width: 80, marginHorizontal: '0.5%', marginVertical: '2%' }}/>
                                        </Pressable>
                                        )
                                    }}
                                />
                            </View>
                        )
                    })
                }
                </ScrollView>
            }
        </>
    );
}

