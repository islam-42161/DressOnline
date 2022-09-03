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
  View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import React, { useCallback, useEffect, useState } from "react";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const ItemList = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      setRefreshing(false);
      loadData();
    });
  }, []);

  async function loadData() {
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
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.thumbnail }} style={styles.imageStyle} />
                  {item.stock > 0 ? (
                    <Text style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,200,0,0.7)', color: "white", fontWeight: '700', fontSize: 10, paddingVertical: 2, paddingHorizontal: 4, borderRadius: 2, fontFamily:'sans-serif-condensed' }}>Available: {item.stock}</Text>
                  ) : (
                    <Text style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(200,0,0,0.7)', color: "white", fontWeight: '700', fontSize: 10, paddingVertical: 2, paddingHorizontal: 4, borderRadius: 2, fontFamily:'sans-serif-condensed' }}>Not Available</Text>)
                  }
                </View>
                {/* bottom part */}
                <View style={{padding:10,flex:1,width:"100%"}}>
                <Text style={[styles.textStyle, { fontWeight: 'bold',fontFamily:'sans-serif-condensed',fontSize:14,textTransform:'uppercase'}]} numberOfLines={2} adjustsFontSizeToFit>
                  {item.title}
                </Text>

                {/* brand, rating, price section */}
                <View style={{justifyContent:'center',flex:1,width:"100%",alignItems:'center'}}>
                <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
                  <Text style={{fontFamily:'sans-serif-condensed',flex:1,textTransform:'capitalize'}} numberOfLines={1} adjustsFontSizeToFit >{item.brand}</Text>
                  <Text style={{fontFamily:'sans-serif-condensed'}} >⭐{item.rating}</Text>
                </View>

{/* price section */}



<View style={{flexDirection:'row',width:"100%",alignItems:'center'}}>
                  <Text style={{fontFamily:'sans-serif-condensed'}} adjustsFontSizeToFit numberOfLines={1} >Price:</Text>


                <View style={{justifyContent:'space-between',flexDirection:'row',alignItems:'center',flex:1,marginLeft:5}} >
                
                
                  <Text style={{ ...styles.textStyle,color:'gray',fontWeight:'400',textDecorationLine:'line-through',fontFamily:'sans-serif-condensed'}} adjustsFontSizeToFit numberOfLines={1}>
                ${item.price}
                </Text>

                  <Text style={{ ...styles.textStyle,color:'green',fontFamily:'sans-serif-condensed',marginHorizontal:5}} adjustsFontSizeToFit numberOfLines={1} >
                  (-{item.discountPercentage}%)
                </Text>
                

                <Text style={{ ...styles.textStyle,color:'tomato',fontWeight:'bold',letterSpacing:1,fontFamily:'sans-serif-condensed'}} adjustsFontSizeToFit numberOfLines={1} >
                ${item.price-(item.price * (item.discountPercentage/100)).toFixed(0)}
                </Text>
                
                </View>


                </View>
                
                </View>
                </View>
                <View style={{width:'100%',backgroundColor:'black',bottom:-1}}>
<Text style={{color:'white',textTransform:'uppercase',textAlign:'center',fontWeight:'800',marginBottom:1}}>{item.category}</Text>
</View>
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
  imageContainer: {
    width: '100%',
    height: Dimensions.get("window").height / 6,

  },
  itemStyle: {
    margin: PADDING * 2,
    alignItems: "center",
    borderRadius: 2 * PADDING,
    backgroundColor: "white",
    width: Dimensions.get("window").width / 2.2,
    
    elevation: 5,
    overflow: "hidden",

  },
  imageStyle: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  textStyle: {
    fontSize: 14,
    textAlign: 'center',
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
