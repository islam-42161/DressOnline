import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const BottomSheet = (props) => {
  const bottomSheetTranslateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = bottomSheetTranslateY.value;
    },
    onActive: (event, ctx) => {
      bottomSheetTranslateY.value = ctx.startY + event.translationY;
    },
    onEnd: (_) => {
      if (bottomSheetTranslateY.value < -(height * 0.3)) {
        bottomSheetTranslateY.value = withTiming(-height * 0.3);
      } else {
        bottomSheetTranslateY.value = withTiming(0);
      }
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: bottomSheetTranslateY.value,
        },
      ],
      top: height * 0.7,
      borderTopLeftRadius: interpolate(
        bottomSheetTranslateY.value,
        [-height * 0.3, 0],
        [0, 20],
        Extrapolate.CLAMP
      ),
      borderTopRightRadius: interpolate(
        bottomSheetTranslateY.value,
        [-height * 0.3, 0],
        [0, 20],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    // <View style={styles.container}>
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.bottomSheetStyle, animatedStyle]}>
          <View
            style={{
              height: 5,
              width: 50,
              alignSelf: "center",
              backgroundColor: "gray",
              marginVertical: 10,
              borderRadius: 25,
            }}
          />
          {props.children}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
    // </View>
  );
};

export default BottomSheet;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  bottomSheetStyle: {
    width: width,
    height: height * 1.1,
    backgroundColor: "white",
    elevation: 10,
    paddingHorizontal: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
