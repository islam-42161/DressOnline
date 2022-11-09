import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Directions, FlingGestureHandler } from "react-native-gesture-handler";

const Test = () => {
  return (
    <View style={styles.container}>
      <FlingGestureHandler
        direction={Directions.RIGHT | Directions.LEFT}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            Alert.alert("I'm flinged!");
          }
        }}
      >
        <View style={styles.box} />
      </FlingGestureHandler>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "dodgerblue",
  },
});
