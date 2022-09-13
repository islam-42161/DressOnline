import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import Animated, {Extrapolate, interpolate, interpolateColor, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming} from 'react-native-reanimated';

const DotsCarousel = ({onGotoIndex,dots,animatedScrollX,style}) => {

  const {width,height} = Dimensions.get('window')
        
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
// Dot
const Dot = ({ index }) => {

    const dotStyle = useAnimatedStyle(() => {
        const elevate = withTiming(interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, 10, 0], Extrapolate.CLAMP))
        const widthInt = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [10, 40, 10], Extrapolate.CLAMP)
        const scale = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [1, 1.2, 1], Extrapolate.CLAMP)
        const color = interpolateColor(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], ['rgba(0,0,0,0.3)', 'rgba(255,255,255,1)', 'rgba(0,0,0,0.3)'])
        return {
            elevation: elevate,
            backgroundColor: color,
            transform:[
              {
                scale:scale
              }
            ],

            // width:widthInt
        }
    })

    const outerpart = useAnimatedStyle(()=>{
      const scale = withTiming(interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, 2, 0], Extrapolate.CLAMP))
      return{
        transform:[
          {
            scale:scale
          }
        ]
      }
    })

    return (
<TouchableOpacity activeOpacity={1} style={{alignItems:'center',justifyContent:'center',marginHorizontal:10}}  onPress={() => onGotoIndex({ index })} >
<AnimatedTouchable
        index={index}
        style={[{
                    height: 10,
                    width: 10,
                    borderRadius:5,
                    backgroundColor: 'white',
                  },
                  dotStyle
                ]}
                   
                    />

<Animated.View style={[outerpart,{
        height: 10,
        width: 10,
        borderRadius:5,
        backgroundColor: 'rgba(255,255,255,0.5)',
        position:'absolute',
        marginHorizontal:5,
      }]}/>
                    </TouchableOpacity>
    )
}

  return (
    <ScrollView horizontal contentContainerStyle={[{ alignItems: 'flex-end', paddingVertical: 5 },style]}>
    {
      dots.map((_, index) => (
        <Dot key={index} index={index}/>
      )
      )

    }

  </ScrollView>
  )
}

export default DotsCarousel