import {
  StyleSheet,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  View,
  TextInput,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import SearchFail from '../components/SearchFail'


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const ItemList = ({ navigation }) => {
  const states = {
    loading:"loading",
    failed:"failed",
    success:"success",
  }
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentState,setCurrentState] = useState(states.success)
  const searchref = useRef();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => loadData('https://dummyjson.com/products/').then(()=>setRefreshing(false)))
  
  }, []);

  let total = 0;
  async function loadData(api) {
    //fetch("https://fakestoreapi.com/products")
    // fetch("https://api.escuelajs.co/api/v1/products")
    // https://dummyjson.com/products/
    setData([])
    setCurrentState(states.loading);
    fetch(api)
      .then((res) => res.json())
      .then((json) => {
        setData(json.products);
        total = json.total;
        if(total>0){
          setCurrentState(states.success)
        }else{
          setCurrentState(states.failed)
        }
      });
  }

  const clearSearch = () => {
    if(iconName==='close-circle'){
      setSearchText('')
      loadData('https://dummyjson.com/products/')
      searchref.current?.focus()
    }
  }

  useEffect(() => {
    loadData('https://dummyjson.com/products/');
  }, []);




  let iconName = searchText.length > 0 ? 'close-circle' : 'search'


  function renderSearchOrFail(){
    if(currentState===states.loading){
      return (
        <ActivityIndicator style={{ flex: 1 }} />
      )
    }
    else if(currentState===states.failed){
      return(<SearchFail query={searchText} color={'lightgray'}/>)
    }
    else return null;
  }


  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.searchInput}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={() => loadData(`https://dummyjson.com/products/search?q=${searchText}`)}
          ref={searchref}
        />
        <Ionicons name={iconName} size={20} color={'lightgray'} onPress={clearSearch} />

      </View>


      { renderSearchOrFail() ?
      renderSearchOrFail()
      :
        (
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
                      <Text style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,200,0,0.7)', color: "white", fontWeight: '700', fontSize: 10, paddingVertical: 2, paddingHorizontal: 4, borderRadius: 2, ...styles.textStyle }}>Available: {item.stock}</Text>
                    ) : (
                      <Text style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(200,0,0,0.7)', color: "white", fontWeight: '700', fontSize: 10, paddingVertical: 2, paddingHorizontal: 4, borderRadius: 2, ...styles.textStyle }}>Not Available</Text>)
                    }
                  </View>
                  {/* bottom part */}
                  <View style={{ padding: 10, flex: 1, width: "100%" }}>
                    <Text style={[styles.textStyle, { fontWeight: 'bold', ...styles.textStyle, fontSize: 14, textTransform: 'uppercase' }]} numberOfLines={2} adjustsFontSizeToFit>
                      {item.title}
                    </Text>

                    {/* brand, rating, price section */}
                    <View style={{ justifyContent: 'center', flex: 1, width: "100%", alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ ...styles.textStyle, flex: 1, textTransform: 'capitalize' }} numberOfLines={1} adjustsFontSizeToFit >{item.brand}</Text>
                        <Text style={{ ...styles.textStyle }} >⭐{item.rating}</Text>
                      </View>

                      {/* price section */}



                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%", alignItems: 'center' }}>


                        <Text style={{ ...styles.textStyle }} >Price: </Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }} >
                          <Text style={{ ...styles.textStyle }} adjustsFontSizeToFit numberOfLines={1}>


                            <Text style={{ color: 'gray', fontWeight: '400', textDecorationLine: 'line-through' }} >
                              ${item.price}
                            </Text>
                            {" "}
                            <Text style={{ color: 'green', ...styles.textStyle }} >
                              (-{item.discountPercentage}%)
                            </Text>

                            {" "}
                            <Text style={{ color: 'tomato', fontWeight: 'bold', letterSpacing: 1, ...styles.textStyle }} >
                              ${item.price - (item.price * (item.discountPercentage / 100)).toFixed(0)}
                            </Text>

                          </Text>

                        </View>

                      </View>

                    </View>
                  </View>
                  <View style={{ width: '100%', backgroundColor: 'black', bottom: -1 }}>
                    <Text style={{ color: 'white', textTransform: 'uppercase', textAlign: 'center', fontWeight: '800', marginBottom: 1 }}>{item.category}</Text>
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
    fontFamily: 'sans-serif-condensed'
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
  searchInput: {
    backgroundColor: 'white',
    padding: 5,
    width: "95%",
    borderRadius: PADDING,
    margin: 5,
    fontFamily: 'sans-serif-light',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
