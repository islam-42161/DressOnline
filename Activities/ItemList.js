import {
  StyleSheet,
  Text,
  NetInfo,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar as SB,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import React, { useCallback, useEffect, useState } from "react";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const ItemList = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [refreshing,setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      setRefreshing(false);
      loadData();
    });
  }, []);

  async function loadData(){
    //fetch("https://fakestoreapi.com/products")
    // fetch("https://api.escuelajs.co/api/v1/products")
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((json) => {
        setData(json.products);
      });
  }

  useEffect(() => {
loadData();
  }, []);


  return (
    
    <SafeAreaView style={styles.container}>
      {data.length === 0 ? (
          <ActivityIndicator />
      ) : (
        <FlatList
          numColumns={2}
          data={data}
          contentContainerStyle={styles.flatlistStyle}
          initialNumToRender={10}
          extraData={data}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity style={styles.itemStyle}
                onPress={() => navigation.navigate('ItemDetails', { serial: item.id })}
              >
                {/* <Text style={{ ...styles.textStyle, ...styles.tagStyle }}>
                  {item.category.name.toUpperCase()}
                </Text> */}
                <Image source={{ uri: item.thumbnail }} style={styles.imageStyle}/>
                <Text style={[styles.textStyle,{fontWeight:'bold'}]} numberOfLines={2}>
                  {item.title}
                </Text>

                  <Text style={{ ...styles.textStyle}} numberOfLines={1}>
                    $ {item.price}
                  </Text>
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
    backgroundColor: "#F5FCFF",
  },
  itemStyle: {
    margin: PADDING*2,
    alignItems: "center",
    borderRadius: 2 * PADDING,
    backgroundColor: "white",
    width: Dimensions.get("window").width / 2.2,
    height: Dimensions.get("window").height /4,
    elevation:5,
    overflow: "hidden",

  },
  imageStyle: {
    width: '100%',
    height:"70%",
  },
  textStyle: {
    fontSize: 14,
    textAlign:'center',
    alignSelf: 'auto'
  },
  tagStyle: {
    transform: [{ rotateZ: "-90deg" }],
    zIndex: 1,
    width: Dimensions.get("window").width / 3,
    position: "absolute",
    left: -(Dimensions.get("window").width / 8),
    top: Dimensions.get("window").height / 8,
    textAlign: "center",
    paddingVertical: PADDING,
    marginLeft: PADDING,
    backgroundColor: "rgba(0,255,0,0.4)",
    borderRadius: PADDING,
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
  },
  flatlistStyle: {},
});
