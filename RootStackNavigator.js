import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Checkout from "./Activities/Checkout";
import RootReduxProvider from "./RootReduxProvider";
import ItemDetails from "./Activities/ItemDetails";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import NoInternet from "./components/NoInternet";
import { SafeAreaProvider } from "react-native-safe-area-context";

const StackNavigator = createNativeStackNavigator().Navigator;
const StackScreen = createNativeStackNavigator().Screen;

export default function RootStackNavigator() {
  return (
    // parnt stack navigator
    <SafeAreaProvider>
      <NavigationContainer>
        <StackNavigator
          initialRouteName="RootView"
          screenOptions={{
            header: () => null,
          }}
        >
          {/* <StackScreen name="ItemList" component={ItemList} /> */}
          <StackScreen name="ItemDetails" component={ItemDetails} />
          <StackScreen name="Checkout" component={Checkout} />
          <StackScreen name="RootView" component={RootReduxProvider} />
        </StackNavigator>
        <StatusBar style="auto" />
        <NoInternet />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const PADDING = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemStyle: {
    margin: PADDING,
    alignItems: "center",
    borderRadius: 2 * PADDING,
    backgroundColor: "white",
    padding: PADDING,
    elevation: 10,
  },
  imageStyle: {
    width: Dimensions.get("window").width / 2.2,
    height: Dimensions.get("window").height / 4,
    resizeMode: "contain",
  },
  textStyle: {
    fontSize: 14,
    width: Dimensions.get("window").width / 3,
  },
  tagStyle: {
    transform: [{ rotateZ: "-90deg" }],
    zIndex: 1,
    position: "absolute",
    left: -(Dimensions.get("window").width / 8),
    top: Dimensions.get("window").height / 8,
    textAlign: "center",
    paddingVertical: PADDING,
    marginLeft: PADDING,
    backgroundColor: "rgba(255,0,0,0.4)",
    borderRadius: PADDING,
    fontWeight: "bold",
  },
  flatlistStyle: {},
});
