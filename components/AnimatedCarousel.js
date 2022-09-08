import {
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
  
  } from 'react-native'
import React from 'react'
import Animated, {Extrapolate, interpolate, interpolateColor, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';


const { width, height } = Dimensions.get('window');


const AnimatedCarousel=({images})=>{
    
    
    
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
    // Dot
    const Dot = ({ index }) => {

        const dotStyle = useAnimatedStyle(() => {
            // const scale = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [1, 2, 1], Extrapolate.CLAMP)
            // const translateY = withTiming(interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, -1, 0], Extrapolate.CLAMP))
            const elevate = withTiming(interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, 10, 0], Extrapolate.CLAMP))
            const widthInt = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [10, 40, 10], Extrapolate.CLAMP)
            const color = interpolateColor(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], ['rgba(0,0,0,1)', 'rgba(255,255,255,1)', 'rgba(0,0,0,1)'])
            return {
                // transform: [
                //     {
                //         scaleX: scale
                //     },
                //     {
                //         translateY: translateY
                //     }
                // ],
                elevation: elevate,
                backgroundColor: color,
                width:widthInt
            }
        })
  
  
        return (
  <AnimatedTouchable activeOpacity={1} 
            index={index}
            style={[{
                        height: 10,
                        width: 10,
                        borderRadius:5,
                        backgroundColor: 'white',
                        marginHorizontal: 10,
                      },
                      dotStyle
                    ]}
                        onPress={() => onGotoIndex({ index })} 
                        />
        )
    }



    // Main Image

    const MainImage = ({ image, index }) => {
        const ImageStyle = useAnimatedStyle(() => {
            const rotateXval = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [-90, 0, 90], Extrapolate.CLAMP)
            const scale = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0.7, 1, 0.7], Extrapolate.CLAMP)
              return {
                  transform: [
                      {
                          scale,
                      },
                      {
                        rotateY: rotateXval + 'deg'
                      },
                  ]
              }
          })
          return (
            <Animated.View style={[{ width: width, alignItems: 'center', justifyContent: 'center'}, ImageStyle]}>
              {/* Top iamge and background with slider */}
    
              <View
                style={styles.imageContainer}>
                {/* Background Image */}
                <Animated.Image source={{ uri: image }}
                  style={{
                    width: width - 40,
                    height: height * 0.4 - 40,
                    borderRadius: 10,
                    // aspectRatio: 
                  }}
                  resizeMode={'contain'}
                />
    
              </View>
    
            </Animated.View>
          )
      }


    // Background image

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




    const scrollViewImageRef = useAnimatedRef();
  
    const onGotoIndex = ({ index }) => {
      scrollViewImageRef.current?.scrollTo({ x: index * width, y: 0, animated:true});
    }
  
  
  
    const animatedScrollX = useSharedValue(0);
    const animatedScrollHandler = useAnimatedScrollHandler({
      onScroll: (event) => {
          animatedScrollX.value = event.contentOffset.x;
      }
  })


        return(
    <View style={[{
                width: width,
                height: height * 0.4,
                overflow:"hidden",
                borderBottomLeftRadius:20,
                borderBottomRightRadius:20,
                // elevation:5
              }]}
                >
                {
                  images.map((image, index) => {
                    
    
                    return (
                      <AnimatedBackImage image={image} key={index} index={index}/>
                    )
    
                  })
                  }
    
                <Animated.ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} ref={scrollViewImageRef} onScroll={animatedScrollHandler}>
    
                  {
                    images.map((image, index) => {
                      
                      return(
                        <MainImage image={image} key={`image-${index}`} index={index}/>
                      )
                    })}
    
                </Animated.ScrollView>
    
                
    
    
    
                {/* Linear Gradient */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.2)']}
                  style={styles.linearGradient}
                >
                  <ScrollView horizontal contentContainerStyle={{ alignItems: 'flex-end', paddingVertical: 5 }}>
                    {
                      images.map((_, index) => (
                        <Dot key={index} index={index}/>
                      )
                      )
    
                    }
    
                  </ScrollView>
                </LinearGradient>
              </View>
    
        )
      }

export default AnimatedCarousel

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    imageContainer: {
      borderRadius: 10,
      elevation: 10,
    },
    bottomSheetStyle: {
      flex: 1,
      width,
      padding: 10
    },
    textStyle: {
      fontWeight: '800',
      fontSize: 20,
      color: 'black',
      fontFamily:'sans-serif-condensed'
    },
    extraInfoStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical:5,
      justifyContent:'space-between'
    },
    bottomButtonsStyle: {
      position: 'absolute',
      paddingBottom: 5,
      bottom: 0,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
    },
    addtocartButtonStyle: {
      backgroundColor: '#e2f9de',
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
    },
    totalPriceStyle: {
      color: '#3ca98b',
      fontSize: 10,
      marginLeft: 20,
      borderRadius: 3,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    detailsStyle: {
      borderWidth: 1,
      padding: 10,
      marginTop: 10,
      borderColor: 'rgba(0,0,0,0.1)',
      borderRadius: 5,
      flex: 1
    },
    linearGradient: {
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      width: width,
      height: 50
    }
  })