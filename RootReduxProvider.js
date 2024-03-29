import React from "react";
import { StatusBar } from "expo-status-bar";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import Home from "./Activities/Home";
import Settings from "./Activities/Settings";
import Test from "./Activities/Test";
import ItemList from "./Activities/ItemList";
import NoInternet from "./components/NoInternet";
import ItemDetails from "./Activities/ItemDetails";
const Screen = createBottomTabNavigator().Screen;
const Navigator = createBottomTabNavigator().Navigator;

const RootReduxProvider = () => {
  return (
    <Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "ios-search" : "ios-search-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "ios-settings" : "ios-settings-outline";
          } else if (route.name === "Test") {
            iconName = focused ? "ios-eye" : "ios-eye-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "dodgerblue",
        tabBarInactiveTintColor: "gray",
        header: () => null,
        tabBarBadgeStyle: {
          backgroundColor: "dodgerblue",
        },
      })}
    >
      <Screen name="Home" component={Home} options={{ tabBarBadge: null }} />
      <Screen
        name="Search"
        component={ItemList}
        options={{ tabBarBadge: null }}
      />
      <Screen
        name="Settings"
        component={Settings}
        options={{ tabBarBadge: null }}
      />
      <Screen name="Test" component={Test} options={{ tabBarBadge: null }} />
    </Navigator>
  );
};

export default RootReduxProvider;
