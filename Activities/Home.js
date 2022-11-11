import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={{
          backgroundColor: "lightgray",
          ...StyleSheet.absoluteFill,
        }}
        // asset\image\turgut.jpg
        //D:/RAW code/JS/Mobile Application/Expo Apps/Under Construction/DressOnline/asset/image/turgut.jpg
        source={{
          uri: "https://github.com/islam-42161/DressOnline/blob/main/asset/image/turgut.jpg",
        }}
      />
      <Text>Something magical is coming InShaAllah!</Text>
      <Text>
        Gutgut got back! Don't forget to pray for aykiz to comeback 😢
      </Text>
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
