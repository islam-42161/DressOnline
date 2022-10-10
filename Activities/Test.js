import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import BottomSheet from "../components/item_details_components/BottomSheet";
import ReadmoreCustom from "../components/item_details_components/ReadmoreCustom";
import AddToCart from "../components/item_details_components/AddToCart";
import { useDerivedValue } from "react-native-reanimated";

const Test = () => {
  const IMAGE_HEIGHT_RATIO = useDerivedValue(() => 0.7);
  return (
    <View style={{ flex: 1, height: "100%", width: "100%" }}>
      <BottomSheet IMAGE_HEIGHT_RATIO={IMAGE_HEIGHT_RATIO}>
        <View style={{ marginHorizontal: 20, flex: 1 }}>
          <Text
            style={[styles.textStyle, { fontSize: 24, fontWeight: "900" }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {"iPhone 14 Pro Max"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 5,
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 20, lineHeight: 30 }}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              ${100}
            </Text>
            <Text
              style={{
                textDecorationLine: "line-through",
                fontSize: 11,
                lineHeight: 37,
                marginLeft: 2,
                color: "lightgray",
              }}
            >
              ${90}
            </Text>
          </View>

          <View style={{ width: "100%", marginBottom: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* category */}
              <View style={styles.miniscrollItemStyle}>
                <Text>Rating: ⭐ {4.4}</Text>
              </View>
              {/* discount rate */}
              <View style={[styles.miniscrollItemStyle]}>
                <Text>
                  Discount: <Text style={{ fontWeight: "bold" }}>{10}%</Text>
                </Text>
              </View>
              {/* category */}
              <View style={styles.miniscrollItemStyle}>
                <Text>
                  In stock: <Text style={{ fontWeight: "bold" }}>{32}</Text>
                </Text>
              </View>
            </ScrollView>
          </View>

          {/* rating, discount rate */}
          <ReadmoreCustom
            descriptiveText={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            }
            numberOfLines={2}
            textstyle={{ lineHeight: 21, fontSize: 14 }}
          />
        </View>
      </BottomSheet>
      <AddToCart />
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  miniscrollItemStyle: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
});
