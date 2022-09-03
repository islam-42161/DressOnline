import { ActivityIndicator, Image, StyleSheet, Text, View, Animated as Anime, Button, ScrollView, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Animated, { event, Extrapolate, interpolate, interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');

const ImageOpacity = () => {

    const scrollX = useRef(new Anime.Value(0)).current;




    const [data, setData] = useState(null);
    useEffect(() => {
        //fetch(`https://fakestoreapi.com/products/${serial}`)
        // fetch(`https://api.escuelajs.co/api/v1/products/1`)
        fetch(`https://dummyjson.com/products/8`)
            .then(res => res.json()).then(json => {
                setData(json);
            }).catch(err => { alert(`Could not load data: ${err}`) });

    }, [])


    const animatedScrollX = useSharedValue(0);
    const animatedScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            animatedScrollX.value = event.contentOffset.x;
        }
    })

    //   const dotIndex =useDerivedValue(()=>{
    //     const index = Math.round(animatedScrollX.value/width)
    //     return index;
    //   })




    const Dot = ({ index }) => {

        const dotStyle = useAnimatedStyle(() => {
            const scale = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0.5, 1.5, 0.5], Extrapolate.CLAMP)
            const elevate = withTiming(interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, 10, 0], Extrapolate.CLAMP))
            const translateY = withTiming(interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, -2, 0], Extrapolate.CLAMP))
            const color = interpolateColor(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], ['rgba(255,255,255,0.5)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.5)'])
            return {
                transform: [
                    {
                        scaleX: scale
                    },
                    {
                        translateY: translateY
                    }
                ],
                elevation: elevate,
                backgroundColor: color
            }
        })


        return (<Animated.View
            key={index}
            index={index}
            style={[{
                width: 20,
                height: 10,
                borderRadius: 5,
                margin: 10,
                backgroundColor: 'white'
            }, dotStyle]}
        >

        </Animated.View>)
    }



    const AnimatedBackImage = ({ index, image }) => {
        const ImageStyle = useAnimatedStyle(() => {
            const opacity = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, 1, 0], Extrapolate.CLAMP)
            return {
                opacity: opacity
            }
        })
        return (
            <Animated.View key={index} style={[StyleSheet.absoluteFillObject, ImageStyle]}>
                <Image
                    source={{ uri: image }}
                    style={StyleSheet.absoluteFillObject}
                    blurRadius={50}

                />
            </Animated.View>
        )
    }

    const MainImage = ({ image, index }) => {
        const ImageStyle = useAnimatedStyle(() => {
            const scale = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0.7, 1, 0.7], Extrapolate.CLAMP)
            return {
                transform: [
                    {
                        scale
                    }
                ]
            }
        })
        return (
            <Animated.View
                style={[styles.imageContainer, ImageStyle]}>
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                />
            </Animated.View>
        )
    }



    return (
        <View style={styles.mainContainer}>
            {data === null ? (
                <ActivityIndicator size={'small'} style={{ alignSelf: 'center' }} />
            ) :
                (

                    <View style={styles.container}>
                        {
                            data.images.map((image, index) => {

                                return (
                                    <AnimatedBackImage image={image} key={index} index={index} />
                                )
                            })
                        }


                        <Animated.ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.scrollViewContainer}
                            onScroll={animatedScrollHandler}
                        // onScroll={Anime.event(
                        //     // scrollX = e.nativeEvent.contentOffset.x
                        //     [{ nativeEvent: {
                        //          contentOffset: {
                        //            x: scrollX
                        //          }
                        //        }
                        //      }],
                        //     { useNativeDriver: true }
                        //   )}

                        >
                            {


                                data.images.map((image, index) => {
                                    return (
                                        <MainImage key={index} index={index} image={image} />
                                    )
                                })

                            }

                        </Animated.ScrollView>

                        <ScrollView horizontal>
                            {
                                data.images.map((_, index) => {
                                    return (
                                        <Dot key={index} index={index} />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                )
            }
        </View>
    )
}

export default ImageOpacity

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        height: height,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    scrollViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: width - 20,
        height: height / 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: "80%",
        height: "80%",
        resizeMode: 'cover',
        borderRadius: 10,

    }
})