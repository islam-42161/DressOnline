import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, StatusBar as SB } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import ReadMore from 'react-native-read-more-text';

const statusBarHeight = SB.currentHeight;
const ItemDetails = ({ route, navigation }) => {
  const { height, width } = Dimensions.get('window');
  const { serial } = route.params;
  const [item, setItem] = useState(null);
  const TOP_HEADER_HEIGHT = height * 0.6;

  const [itemNumber, setItemNumber] = useState(0);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${serial}`)
      .then((res) => res.json())
      .then((json) => {
        setItem(json);
      });
  }, []);



  const PreLoader = () => (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size={'large'} />
    </SafeAreaView>
  )


  if (item === null) {
    return <PreLoader />;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        {/* Top image */}
        <View style={{ marginTop: statusBarHeight}}>
          <Image source={{ uri: item.image }} resizeMode={'contain'} style={{ width:width*0.95, height: TOP_HEADER_HEIGHT-statusBarHeight}} />
        </View>
        {/* Bottom info */}
        <View style={{width, height: height - TOP_HEADER_HEIGHT,padding:2*PADDING}}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.title}</Text>

          {/* category • ⭐rating(123) • $price*/}
          <View style={{ flexDirection: 'row',width:width*0.95 }}>
            <Text style={{ textTransform: 'capitalize' }}>{item.category} • </Text>
            <Text>⭐{item.rating.rate}({item.rating.count}) • </Text>
            <Text style={{fontWeight:'bold',letterSpacing:PADDING/2}}>${item.price}</Text>
          </View>


      <View style={{backgroundColor:'lightgray',height:1,width:width*0.95,marginVertical:PADDING}}/>

          {/* description and item add button */}
          <Text>Description:</Text>
          <View style={{ flexDirection: 'row',alignItems:'center',marginVertical:PADDING*2}}>

            <ScrollView
              style={{ alignSelf:'flex-start',maxHeight: (height - TOP_HEADER_HEIGHT) * 0.4, maxWidth: width * 0.8}}
            >
              <ReadMore
                numberOfLines={4}
              >
                <Text style={{ lineHeight: 20, fontStyle: 'italic' }}>{item.description}</Text>
              </ReadMore>
            </ScrollView>

            <View style={{ alignItems: 'center',flex:1,padding:PADDING}}>
              <View style={{alignItems:'center',backgroundColor:'rgba(255,255,255,0.4)',borderRadius:15,elevation:PADDING*2}}>
              <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'white', borderTopLeftRadius: 15, borderTopRightRadius: 15 }} onPress={()=>{
                setItemNumber(itemNumber+1);
              }}>
                <MaterialCommunityIcons name="plus" size={30} color="black" />
              </TouchableOpacity>

              <Text style={{fontWeight:'700',fontSize:18}}>{itemNumber}</Text>

              <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'white', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }} onPress={()=>{
                itemNumber>0?setItemNumber(itemNumber-1):null;
              }}>
                <MaterialCommunityIcons name="minus" size={30} color="black" />
              </TouchableOpacity>
            </View>
              </View>
          </View>
        </View>


{/* Bottom buttons */}
<View style={{
  justifyContent:'center',
  position:'absolute',
  bottom:0
  }}>
  <View style={{flexDirection:'row',justifyContent:'center'}}>
  <TouchableOpacity activeOpacity={0.6} style={{elevation:PADDING,marginBottom:PADDING,flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',borderWidth:2,borderRadius:12,borderColor:'red',backgroundColor:'white',padding:PADDING,marginHorizontal:PADDING}}>
    <MaterialCommunityIcons name="cart-heart" size={30} color="red"/>
    {itemNumber===0?(<Text style={{marginHorizontal:PADDING,color:'red'}}>Add to wishlist</Text>):null}
  </TouchableOpacity>
  {itemNumber>0?(
    <TouchableOpacity activeOpacity={0.6} style={{elevation:PADDING,marginBottom:PADDING,flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',borderRadius:12,backgroundColor:'darkgreen',padding:PADDING,marginHorizontal:PADDING}}>
    <MaterialCommunityIcons name="cart-check" size={30} color="white" />
    <Text style={{marginHorizontal:PADDING,color:'white',fontWeight:'800'}}>Checkout Now</Text>
    <Text style={{marginHorizontal:PADDING,color:'white',letterSpacing:PADDING/2}}>${(item.price * itemNumber).toFixed(2)}</Text>
  </TouchableOpacity>
  )
  :
  null
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
  },
})