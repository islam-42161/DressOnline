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
import GridItem from "../components/GridItem";


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
    <GridItem item={item}
    onPress={() => navigation.navigate('ItemDetails', { serial: item.id })}
    />
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
