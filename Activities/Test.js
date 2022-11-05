import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import BottomSheet from "../components/item_details_components/BottomSheet";

const Test = () => {
  const AnimatedSafeView = Animated.createAnimatedComponent(SafeAreaView);
  const [images, setImages] = useState([]);
  const { height, width } = useWindowDimensions();
  useEffect(() => {
    fetch(`https://dummyjson.com/products/4`)
      .then((res) => res.json())
      .then((json) => {
        setImages(json.images);
      })
      .catch((err) => {
        alert(`Could not load data: ${err}`);
      });
  }, []);
  return (
    <View style={styles.container}>
      <AnimatedSafeView
        entering={SlideInUp}
        exiting={SlideOutUp}
        style={styles.navBar}
      >
        <View style={styles.backbutton}>
          <Ionicons name="arrow-back" style={styles.backIconStyle} />
          <Text style={{ fontSize: 18 }} numberOfLines={1} adjustsFontSizeToFit>
            Test page
          </Text>
        </View>
        <View style={styles.actionButtonsView}>
          <Ionicons name="heart-outline" style={styles.heartStyle} />
          <Ionicons name="share-outline" style={styles.shareStyle} />
          <Ionicons name="menu-outline" style={styles.moreStyle} />
        </View>
      </AnimatedSafeView>
      {/* Image scroll */}
      <View style={styles.imageScrollContainer}>
        <ScrollView
          style={{ flex: 1 }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {images.map((image, index) => {
            return (
              <Image
                key={index}
                source={{ uri: image }}
                style={{
                  height: "100%",
                  width,
                }}
                resizeMode={"contain"}
              />
            );
          })}
        </ScrollView>
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>This is title</Text>
      </View>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  navBar: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "lightblue",
    justifyContent: "space-between",
    // borderBottomRightRadius: 24,
    // borderBottomLeftRadius: 24,
    // elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageScrollContainer: {
    flex: 0.7,
    // backgroundColor: "red",
  },
  backbutton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIconStyle: {
    fontSize: 24,
    marginRight: 5,
  },
  actionButtonsView: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartStyle: {
    fontSize: 24,
    color: "black",
    marginRight: 5,
  },
  shareStyle: {
    fontSize: 24,
    color: "black",
    marginRight: 5,
  },
  moreStyle: {
    fontSize: 24,
    color: "black",
    marginRight: 5,
  },
});
