import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const DotsCarousel = ({ onGotoIndex, dots, animatedScrollX, style }) => {
  const { width, height } = Dimensions.get("window");

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  // Dot
  const Dot = ({ index }) => {
    const dotStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        animatedScrollX.value,
        [(index - 1) * width, index * width, (index + 1) * width],
        [0.8, 1, 0.8],
        Extrapolate.CLAMP
      );
      const color = interpolateColor(
        animatedScrollX.value,
        [(index - 1) * width, index * width, (index + 1) * width],
        ["lightgray", "black", "lightgray"]
      );
      return {
        backgroundColor: color,
        transform: [
          {
            scale: scale,
          },
        ],
        zIndex: 1,
      };
    });

    const outerpart = useAnimatedStyle(() => {
      const scale = withTiming(
        interpolate(
          animatedScrollX.value,
          [(index - 1) * width, index * width, (index + 1) * width],
          [0, 2, 0],
          Extrapolate.CLAMP
        )
      );
      const elevate = withTiming(
        interpolate(
          animatedScrollX.value,
          [(index - 1) * width, index * width, (index + 1) * width],
          [0, 5, 0],
          Extrapolate.CLAMP
        )
      );
      return {
        transform: [
          {
            scale: scale,
          },
        ],
        elevation: elevate,
      };
    });

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[
          {
            alignItems: "center",
            justifyContent: "center",
            // marginHorizontal: 10
            margin: 10,
          },
        ]}
        onPress={() => onGotoIndex({ index })}
      >
        {/* Inner circle */}
        <AnimatedTouchable
          activeOpacity={1}
          index={index}
          style={[
            {
              height: 10,
              width: 10,
              borderRadius: 5,
            },
            dotStyle,
          ]}
        />

        {/* outer circle */}
        <Animated.View
          style={[
            outerpart,
            {
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: "white",
              position: "absolute",
              zIndex: -1,
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[{ paddingVertical: 5 }]}
      >
        {dots.map((_, index) => (
          <Dot key={index} index={index} />
        ))}
      </ScrollView>
    </View>
  );
};

export default DotsCarousel;
