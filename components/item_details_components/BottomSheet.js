import { Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
  runOnUI,
  withSpring,
  SlideInDown,
  FadeIn,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setSeeExtra } from "../../redux/slices/ItemDetailsStates";
const { width, height } = Dimensions.get("window");

const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
const BottomSheet = (props) => {
  const dispatch = useDispatch();
  const { IMAGE_HEIGHT_RATIO, snap_points } = props;

  const initialPosition = height * (1 - snap_points[0]) + STATUS_BAR_HEIGHT;
  const secondPosition = height * (1 - snap_points[1]) + STATUS_BAR_HEIGHT;
  const thirdPosition = height * (1 - snap_points[2]); // statusbar matching with bottom sheet color
  // const thirdPosition = height * (1 - snap_points[2]) + STATUS_BAR_HEIGHT;

  const top = useSharedValue(initialPosition);

  function changeView(value) {
    dispatch(setSeeExtra(value));
  }
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startTop = top.value;
    },
    onActive: (event, ctx) => {
      top.value = ctx.startTop + event.translationY;
      if (top.value < thirdPosition) top.value = thirdPosition;
      if (top.value > initialPosition) top.value = initialPosition;
      IMAGE_HEIGHT_RATIO.value = top.value / (height + 50);
      // console.log(top.value);
    },
    onEnd: (_) => {
      if (top.value > secondPosition + 100) {
        top.value = withTiming(initialPosition); // take bottom sheet to initial position
        IMAGE_HEIGHT_RATIO.value = withTiming(1 - snap_points[0]);
        // runOnJS(changeView)(false);
      } else if (top.value > thirdPosition + 200) {
        top.value = withTiming(secondPosition); // take bottom sheet to second position
        IMAGE_HEIGHT_RATIO.value = withTiming(1 - snap_points[1]);
        // runOnJS(changeView)(true);
      } else if (top.value >= thirdPosition || top.value < thirdPosition) {
        top.value = withTiming(thirdPosition); // take bottom sheet to third position
        // runOnJS(changeView)(true);
      }
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      elevation: interpolate(
        top.value,
        [thirdPosition, secondPosition, initialPosition],
        [0, 5, 20],
        Extrapolate.CLAMP
      ),
      borderTopLeftRadius: interpolate(
        top.value,
        [secondPosition, initialPosition],
        [0, 20],
        Extrapolate.CLAMP
      ),
      borderTopRightRadius: interpolate(
        top.value,
        [secondPosition, initialPosition],
        [0, 20],
        Extrapolate.CLAMP
      ),
      top: top.value,
    };
  });
  const draggerStyle = useAnimatedStyle(() => {
    const scaleY = interpolate(
      top.value,
      [thirdPosition, secondPosition, initialPosition],
      [0, -1, 1],
      Extrapolate.CLAMP
    );
    const rotateX = interpolate(
      top.value,
      [thirdPosition, secondPosition],
      [0, 180],
      Extrapolate.CLAMP
    );

    return {
      alignSelf: "center",
      transform: [{ scaleY: scaleY }, { scaleX: 1.5 }],
      position: "absolute",
    };
  });

  const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
  return (
    <Animated.View style={[styles.bottomSheetStyle, animatedStyle]}>
      <GestureHandlerRootView>
        <PanGestureHandler
          onGestureEvent={gestureHandler}
          activeOffsetY={[-10, 10]}
        >
          {/* 
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
           */}
          <Animated.View style={[styles.innerBottomSheetView]}>
            <AnimatedIcon
              name="chevron-up-sharp"
              size={32}
              color={"gray"}
              style={[draggerStyle]}
            />
            {props.children}
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </Animated.View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheetStyle: {
    position: "absolute",
    height: height,
    right: 0,
    left: 0,
    overflow: "hidden",
  },
  innerBottomSheetView: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingTop: STATUS_BAR_HEIGHT,
  },
});
