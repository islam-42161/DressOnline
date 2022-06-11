import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, StatusBar as SB } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import ReadMore from '@fawazahmed/react-native-read-more';


const statusBarHeight = SB.currentHeight;


const ItemDetails = ({ route, navigation }) => {
  const { height, width } = Dimensions.get('window');
  const { serial } = route.params;
  const [item, setItem] = useState(null);
  const TOP_HEADER_HEIGHT = height * 0.5;

  const [itemNumber, setItemNumber] = useState(0);
  const [inWishList, setInWishList] = useState(false);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${serial}`)
      .then((res) => res.json())
      .then((json) => {
        setItem(json);
      });
  }, []);



  const PreLoader = () => (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator />
    </SafeAreaView>
  )


  if (item === null) {
    return <PreLoader />;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        {/* Top image */}
        <View style={{ marginTop: Platform.OS === "android" ? SB.currentHeight : 0 }}>
          <Image source={{ uri: item.image }} resizeMode={'contain'} style={{ width: width * 0.95, height: TOP_HEADER_HEIGHT - statusBarHeight }} />
          <TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', bottom: PADDING, right: PADDING, flexDirection: 'row', backgroundColor: 'white', borderRadius: 25, alignItems: 'center', borderWidth: 1, borderColor: 'red', padding: PADDING }}>
            <MaterialCommunityIcons name="cards-heart" size={18} color="red" style={{ marginHorizontal: PADDING }} />
            <Text style={{ marginRight: PADDING, color: 'red', fontWeight: '500' }}>Add to wishlist</Text>
          </TouchableOpacity>
        </View>
        {/* Bottom info */}
        <View style={{ width, height: height - TOP_HEADER_HEIGHT, padding: 2 * PADDING }}>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>{item.title}</Text>


          {/* category • ⭐rating(123) • $price*/}

          <Text style={{ textTransform: 'capitalize', fontSize: 16, maxWidth: width * 0.95, marginVertical: PADDING }}>{item.category} • <Text>⭐{item.rating.rate}({item.rating.count})</Text> • <Text style={{ fontWeight: 'bold', letterSpacing: PADDING / 2 }}>${item.price}</Text></Text>


          <View style={{ backgroundColor: 'lightgray', height: 1, width: width * 0.95, marginVertical: PADDING }} />

          {/* description and item add button */}
          <Text style={{ fontSize: 18, fontWeight: '600', marginTop: PADDING }}>Details:</Text>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

            {/* Details text */}
            <View style={{ width: width * 0.8, alignSelf: 'flex-start', paddingBottom: PADDING * 2 }}>
              <ScrollView showsVerticalScrollIndicator={false}>

                <ReadMore numberOfLines={3} style={{ lineHeight: 25, paddingVertical: PADDING, fontSize: 14 }}>
                  {item.description}
                </ReadMore>

              </ScrollView>

            </View>

            {/* +- button to add to cart */}
            <View style={{ alignItems: 'center', flex: 1, padding: PADDING, alignSelf: 'flex-start' }}>
              <View style={{ alignItems: 'center', backgroundColor: '#F3F3F3', borderRadius: 15, elevation: PADDING * 2, alignSelf: 'center' }}>
                <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'white', borderTopLeftRadius: 15, borderTopRightRadius: 15 }} onPress={() => {
                  setItemNumber(itemNumber + 1);
                }}>
                  <MaterialCommunityIcons name="plus" size={40} color="black" />
                </TouchableOpacity>

                <Text style={{ fontWeight: '600', fontSize: 24 }}>{itemNumber}</Text>

                <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'white', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }} 
                onLongPress={() => {
                  setItemNumber(0);
                }}
                onPress={() => {
                  itemNumber > 0 ? setItemNumber(itemNumber - 1) : null;
                }}>
                  <MaterialCommunityIcons name="minus" size={40} color="black" />
                </TouchableOpacity>
              </View>
            </View>


          </View>

          {/* Bottom buttons */}
          <View style={{
            alignSelf: 'center',
            marginBottom: PADDING * 8,
            marginTop: PADDING * 2,
            marginHorizontal: PADDING * 2,
            flexDirection: 'row',
            alignItems: 'center',
          }}>

            {/* back to shopping */}

            <TouchableOpacity activeOpacity={0.6} style={{ marginBottom: PADDING, flexDirection: 'row', backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-evenly', elevation: PADDING, padding: PADDING, borderRadius: 16, marginLeft: PADDING }} onPress={
              () => navigation.goBack()
            }>
              <MaterialCommunityIcons name="format-list-text" size={18} color="tomato" style={{ marginHorizontal: PADDING }} />
              <Text style={{ color: 'tomato', fontWeight: '700', marginHorizontal: PADDING }}>Keep Shopping</Text>
            </TouchableOpacity>

            {
              // add to cart
              itemNumber > 0 ? (
                <View>
                  <TouchableOpacity activeOpacity={0.6} style={{ marginBottom: PADDING, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 16, backgroundColor: 'black', padding: PADDING, marginLeft: PADDING, elevation: PADDING }} disabled={itemNumber > 0 ? false : true}>
                    <MaterialCommunityIcons name="cart" size={18} color={'white'} style={{ marginHorizontal: PADDING }} />

                    <Text style={{ marginHorizontal: PADDING, color: 'white', fontWeight: '700' }}>Cart</Text>

                    {/* total price text */}
                  </TouchableOpacity>
                  <Text style={{ fontSize: 9, backgroundColor: 'green', borderRadius: 100, padding: PADDING / 4, fontWeight: '800', letterSpacing: PADDING / 2, color: 'white', position: 'absolute', top: -PADDING * 2.5, right: -PADDING * 1.5, zIndex: 100 }}>${(item.price * itemNumber).toFixed(2)}</Text>
                </View>
              ) : null
            }
            {
              // delete all items from cart
              itemNumber > 0 ? (
                <TouchableOpacity style={{marginBottom:PADDING,flexDirection:'row',elevation: PADDING, alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 16, backgroundColor: 'black', padding: PADDING, marginHorizontal: PADDING }}>
                  <MaterialCommunityIcons name="shopping" size={18} color={"white"} style={{ marginHorizontal: PADDING }} />
                  <Text style={{ marginHorizontal: PADDING, color: 'white', fontWeight: '700'}}>Buy Now</Text>
                </TouchableOpacity>
              ) : null
            }


          </View>

        </View>

      </SafeAreaView>

    )
  }



}

export default ItemDetails

const PADDING = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: Platform.OS === "android" ? SB.currentHeight : 0
  },
})