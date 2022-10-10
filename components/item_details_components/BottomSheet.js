import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
  runOnUI,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setSeeExtra } from "../../redux/slices/ItemDetailsStates";
const BottomSheet = (props) => {
  const bottomSheetPositionY = useSharedValue(0);
  const { IMAGE_HEIGHT_RATIO } = props;
  const dispatch = useDispatch();

  function changeView(value) {
    dispatch(setSeeExtra(value));
  }
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = bottomSheetPositionY.value;
      IMAGE_HEIGHT_RATIO.value = interpolate(
        ctx.startY,
        [0, -height * 0.3],
        [0.65, 0.3],
        Extrapolate.CLAMP
      );
    },
    onActive: (event, ctx) => {
      bottomSheetPositionY.value = ctx.startY + event.translationY;
      IMAGE_HEIGHT_RATIO.value = interpolate(
        bottomSheetPositionY.value,
        [0, -height * 0.3],
        [0.65, 0.3],
        Extrapolate.CLAMP
      );
    },
    onEnd: (_) => {
      if (bottomSheetPositionY.value <= -(height * 0.3)) {
        runOnJS(changeView)(true);
        bottomSheetPositionY.value = -height * 0.3;
      } else {
        runOnJS(changeView)(false);
        bottomSheetPositionY.value = 0;
      }
      IMAGE_HEIGHT_RATIO.value = withTiming(
        interpolate(
          bottomSheetPositionY.value,
          [0, -height * 0.3],
          [0.65, 0.3],
          Extrapolate.CLAMP
        )
      );
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      elevation: interpolate(
        bottomSheetPositionY.value,
        [-height * 0.3, 0],
        [20, 0],
        Extrapolate.CLAMP
      ),
      // transform: [
      //   {
      //     translateY: bottomSheetPositionY.value,
      //   },
      // ],
      top: 1 - IMAGE_HEIGHT_RATIO.value,
      borderTopLeftRadius: interpolate(
        bottomSheetPositionY.value,
        [-height * 0.3, 0],
        [20, 0],
        Extrapolate.CLAMP
      ),
      borderTopRightRadius: interpolate(
        bottomSheetPositionY.value,
        [-height * 0.3, 0],
        [20, 0],
        Extrapolate.CLAMP
      ),
    };
  });
  const draggerStyle = useAnimatedStyle(() => {
    const scaleY = interpolate(
      bottomSheetPositionY.value,
      [-height * 0.3, 0],
      [-1, 1],
      Extrapolate.CLAMP
    );
    return {
      alignSelf: "center",
      transform: [{ scaleY: scaleY }, { scaleX: 2 }],
    };
  });

  const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
  return (
    // <View style={styles.container}>
    <GestureHandlerRootView>
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        activeOffsetY={[-10, 10]}
      >
        <Animated.View style={[styles.bottomSheetStyle, animatedStyle]}>
          {/* <View
            style={{
              height: 5,
              width: 50,
              alignSelf: "center",
              backgroundColor: "gray",
              marginVertical: 10,
              borderRadius: 25,
            }}
          /> */}
          <AnimatedIcon
            name="chevron-up-sharp"
            size={24}
            color={"gray"}
            style={[draggerStyle]}
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
    height: height,
    backgroundColor: "white",
    // elevation: 20,
  },
});
