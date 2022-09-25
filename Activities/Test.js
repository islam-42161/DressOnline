import { StyleSheet, Text } from "react-native";
import React from "react";
import BottomSheet from "../components/item_details_components/BottomSheet";

const Test = () => {
  return (
    <BottomSheet>
      <Text>A lovely sunny day</Text>
    </BottomSheet>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
