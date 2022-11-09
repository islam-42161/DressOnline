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
  // const swipeGesture = Gesture.Pan()
  // const panGesture = Gesture.Pan()
  //   .activeOffsetY([-10,10])
  //   .onStart(()=>start.value = 0)
  //   .onUpdate(()=>{

  //   })
  // const composedGesture = Gesture.Race([swipeGesture,panGesture])
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startTop = top.value;
    },
    onActive: (event, ctx) => {
      top.value = ctx.startTop + event.translationY;
      if (top.value < thirdPosition) top.value = thirdPosition;
      if (top.value > initialPosition) top.value = initialPosition;
      // console.log(top.value / (height + 35));
      IMAGE_HEIGHT_RATIO.value = top.value / (height + 35);

      // event.translationY = -50 --> swipe up for 50px
      // event.translationY = 50  --> swipe down for 50px
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
      {/* GestureHandlerRootView for PanGestureHandler from Reanimated */}
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
        </PanGestureHandler>
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
