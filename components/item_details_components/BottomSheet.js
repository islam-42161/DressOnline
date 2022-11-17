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
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setSeeExtra } from "../../redux/slices/ItemDetailsStates";
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");

const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
const BottomSheet = (props) => {
  const dispatch = useDispatch();
  const { IMAGE_HEIGHT_RATIO, snap_points } = props;

  const initialPosition = height * (1 - snap_points[0]) + STATUS_BAR_HEIGHT;
  const secondPosition = height * (1 - snap_points[1]) + STATUS_BAR_HEIGHT;
  const thirdPosition = height * (1 - snap_points[2]); // statusbar matching with bottom sheet color
  // const thirdPosition = height * (1 - snap_points[2]) + STATUS_BAR_HEIGHT;

  function changeView(value) {
    dispatch(setSeeExtra(value));
  }

  const top = useSharedValue(initialPosition);
  const start = useSharedValue(0);
  const swipe_velocity = useSharedValue(0);

  // position snapping method
  function snapPosition() {
    "worklet";
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
  }

  // pan gesture
  const panGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onStart(() => (start.value = top.value))
    .onUpdate((e) => {
      top.value = start.value + e.translationY;
      if (top.value < thirdPosition) top.value = thirdPosition;
      if (top.value > initialPosition) top.value = initialPosition;
      // console.log(top.value / (height + 35));
      IMAGE_HEIGHT_RATIO.value = top.value / (height + 35);
      swipe_velocity.value = e.velocityY;
    })
    .onEnd((e, completed) => {
      start.value = top.value;
      snapPosition();
    });

  //swipe gesture
  const swipe_val = useSharedValue(0);
  const swipeGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onStart(() => (swipe_val.value = 0))
    .onUpdate((e) => {
      swipe_val.value = e.translationY;
    })
    .onEnd(() => {
      // swipe up?
      if (swipe_val.value < -20) {
        // take bottom sheet to second position
        if (top.value === initialPosition) {
          top.value = withTiming(secondPosition);
          IMAGE_HEIGHT_RATIO.value = withTiming(1 - snap_points[1]);
        }
        // take bottom sheet to third position
        else if (top.value === secondPosition) {
          top.value = withTiming(thirdPosition);
        }
      }
      // swipe down?
      else if (swipe_val.value > 20) {
        // take bottom sheet to second position
        if (top.value === thirdPosition) {
          top.value = withTiming(secondPosition);
          IMAGE_HEIGHT_RATIO.value = withTiming(1 - snap_points[1]);
        }
        // take bottom sheet to initial position
        else if (top.value === secondPosition) {
          top.value = withTiming(initialPosition); // take bottom sheet to initial position
          IMAGE_HEIGHT_RATIO.value = withTiming(1 - snap_points[0]);
        }
      }
    });

  const composedGesture = Gesture.Race(panGesture, swipeGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      elevation: interpolate(
        top.value,
        [secondPosition, initialPosition],
        [0, 30],
        Extrapolate.CLAMP
      ),
      borderTopLeftRadius: interpolate(
        top.value,
        [secondPosition, initialPosition],
        [0, 30],
        Extrapolate.CLAMP
      ),
      borderTopRightRadius: interpolate(
        top.value,
        [secondPosition, initialPosition],
        [0, 30],
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
    <Animated.View style={[styles.container, animatedStyle]}>
      <GestureHandlerRootView>
        <GestureDetector gesture={panGesture}>
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

          <Animated.View style={[styles.bottomSheetStyle]}>
            <AnimatedIcon
              name="chevron-up-sharp"
              size={32}
              color={"#6750A4"}
              style={[draggerStyle]}
            />
            <SafeAreaView style={styles.innerView}>
              {props.children}
            </SafeAreaView>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Animated.View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: height + STATUS_BAR_HEIGHT,
    right: 0,
    left: 0,
    overflow: "hidden",
    zIndex: 1,
    backgroundColor: "pink",
  },
  bottomSheetStyle: {
    width: "100%",
    height: "100%",
    backgroundColor: "#EADDFF",
  },
  innerView: {
    flex: 1,
    paddingBottom: 100,
  },
});
