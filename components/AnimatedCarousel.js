import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  Share,

} from 'react-native'
import React from 'react'
import Animated, { Extrapolate, interpolate, interpolateColor, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import DotsCarousel from './DotsCarousel';

const { width, height } = Dimensions.get('window');

const AnimatedCarousel = ({ images, scrollViewImageRef, animatedScrollX, animatedScrollHandler }) => {



  // const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  //     // Dot
  //     const Dot = ({ index }) => {

  //         const dotStyle = useAnimatedStyle(() => {
  //             const elevate = withTiming(interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, 10, 0], Extrapolate.CLAMP))
  //             const widthInt = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [10, 40, 10], Extrapolate.CLAMP)
  //             const scale = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [1, 1.2, 1], Extrapolate.CLAMP)
  //             const color = interpolateColor(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], ['rgba(0,0,0,0.3)', 'rgba(255,255,255,1)', 'rgba(0,0,0,0.3)'])
  //             return {
  //                 elevation: elevate,
  //                 backgroundColor: color,
  //                 transform:[
  //                   {
  //                     scale:scale
  //                   }
  //                 ],

  //                 // width:widthInt
  //             }
  //         })

  //         const outerpart = useAnimatedStyle(()=>{
  //           const scale = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [1, 2, 1], Extrapolate.CLAMP)
  //           return{
  //             transform:[
  //               {
  //                 scale:scale
  //               }
  //             ]
  //           }
  //         })

  //         return (
  // <TouchableOpacity activeOpacity={1} style={{alignItems:'center',justifyContent:'center',marginHorizontal:10}}  onPress={() => onGotoIndex({ index })} >
  //   <AnimatedTouchable
  //             index={index}
  //             style={[{
  //                         height: 10,
  //                         width: 10,
  //                         borderRadius:5,
  //                         backgroundColor: 'white',
  //                       },
  //                       dotStyle
  //                     ]}

  //                         />

  // <Animated.View style={[outerpart,{
  //             height: 10,
  //             width: 10,
  //             borderRadius:5,
  //             backgroundColor: 'rgba(255,255,255,0.5)',
  //             position:'absolute',
  //             marginHorizontal:5,
  //           }]}/>
  //                         </TouchableOpacity>
  //         )
  //     }



  // Main Image

  const MainImage = ({ image, index }) => {
    const ImageStyle = useAnimatedStyle(() => {
      const rotateXval = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [-90, 0, 90], Extrapolate.CLAMP)
      const scale = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [5, 1, 5], Extrapolate.CLAMP)
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
      <Animated.View style={[{ width: width, alignItems: 'center', justifyContent: 'center' }, ImageStyle]}>
        {/* Top iamge and background with slider */}

        {/* Background Image */}
        <Image source={{ uri: image }}
          style={{
            // width: width - 40,
            // height: height * 0.4 - 40,
            height: "100%",
            width: "100%",
            // borderRadius: 10,
          }}
          resizeMode={'contain'}
        />


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
          blurRadius={100}

        />
      </Animated.View>
    )
  }


  //  scrollViewImageRef,onGotoIndex,animatedScrollX,animatedScrollHandler

  //   const scrollViewImageRef = useAnimatedRef();

  //   const onGotoIndex = ({ index }) => {
  //     scrollViewImageRef.current?.scrollTo({ x: index * width, y: 0, animated:true});
  //   }



  //   const animatedScrollX = useSharedValue(0);
  //   const animatedScrollHandler = useAnimatedScrollHandler({
  //     onScroll: (event) => {
  //         animatedScrollX.value = event.contentOffset.x;
  //     }
  // })



  return (
    <View style={[{
      width: width,
      height: height * 0.4,
      overflow: "hidden",
      // padding:5
      // borderBottomLeftRadius:20,
      // borderBottomRightRadius:20,
    }]}
    >

      {
        images.map((image, index) => {


          return (
            <AnimatedBackImage image={image} key={index} index={index} />
          )

        })
      }

      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollViewImageRef}
        onScroll={animatedScrollHandler}
      >

        {
          images.map((image, index) => {

            return (
              <MainImage image={image} key={`image-${index}`} index={index} />
            )
          })}

      </Animated.ScrollView>





      {/* Linear Gradient */}
      {/* <LinearGradient
                  colors={['transparent','rgba(255,255,255,0.3)']}
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
                </LinearGradient> */}

      {/* <DotsCarousel dots={images} onGotoIndex={onGotoIndex} animatedScrollX = {animatedScrollX} /> */}

    </View>

  )
}


export default AnimatedCarousel

const styles = StyleSheet.create({
  linearGradient: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 20,
  }
})