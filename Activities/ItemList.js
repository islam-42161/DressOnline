import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
const ItemList = ({ navigation }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      });
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      {data.length === 0 ? (
        <View>
          <ActivityIndicator />
          <Text style={{ fontSize: 15, color: "black" }}>
            Content loading...
          </Text>
        </View>
      ) : (
        <FlatList
          numColumns={2}
          data={data}
          contentContainerStyle={styles.flatlistStyle}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity style={styles.itemStyle}
                onPress={() => navigation.navigate('ItemDetails', { serial: item.id })}
              >
                <Text style={{ ...styles.textStyle, ...styles.tagStyle }}>
                  {item.category.toUpperCase()}
                </Text>
                <Image source={{ uri: item.image }} style={styles.imageStyle} />
                <Text style={styles.textStyle} numberOfLines={1}>
                  {item.title}
                </Text>

                <Text style={{ ...styles.textStyle, textAlign: "center" }}>
                  Price:
                  <Text
                    style={{ ...styles.textStyle, fontWeight: "bold" }}
                    numberOfLines={1}
                  >
                    {" "}
                    {item.price} USD
                  </Text>
                </Text>

                <Text numberOfLines={1}>In stock: {item.rating.count} pcs</Text>
                <Text>⭐ {item.rating.rate}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
};

export default ItemList;
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
    alignSelf: 'center'
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
    fontFamily: "sans-serif-condensed",
  },
  flatlistStyle: {},
});
