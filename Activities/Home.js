import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
const Home = () => {
  const { height, width } = useWindowDimensions();
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={{
          position: "absolute",
          width,
          height,
        }}
        // asset\image\turgut.jpg
        //D:/RAW code/JS/Mobile Application/Expo Apps/Under Construction/DressOnline/asset/image/turgut.jpg
        source={require("../asset/image/turgut.jpg")}
        blurRadius={10}
      />
      <View
        style={{
          padding: 10,
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.3)",
          borderRadius: 10,
        }}
      >
        <Text>Something magical is coming InShaAllah!</Text>
        <Text>
          Gutgut got back! Don't forget to pray for aykiz to comeback 😢
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: 5,
  },
});
