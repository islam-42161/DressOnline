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
  const [detailsfull,setDetailsFull] = useState(true);

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
        <View style={{marginTop:Platform.OS === "android" ? SB.currentHeight : 0}}>
          <TouchableOpacity style={{zIndex:1,position:'absolute',top:4*PADDING,right:PADDING,backgroundColor:'white', padding:PADDING, borderRadius:20,alignItems:'center',elevation:PADDING}}>
          <MaterialCommunityIcons name="cards-heart" size={30} color="red" />
          </TouchableOpacity>
          <Image source={{ uri: item.image }} resizeMode={'contain'} style={{ width:width*0.95, height: TOP_HEADER_HEIGHT-statusBarHeight}} />
        </View>
        {/* Bottom info */}
        <View style={{width, height: height - TOP_HEADER_HEIGHT,padding:2*PADDING}}>
          <Text style={{ fontSize: 20, fontWeight: '600'}}>{item.title}</Text>


          {/* category • ⭐rating(123) • $price*/}
            <Text style={{ textTransform: 'capitalize',maxWidth:width*0.95,fontSize:16,marginVertical:PADDING}}>{item.category} • <Text>⭐{item.rating.rate}({item.rating.count})</Text> • <Text style={{fontWeight:'bold',letterSpacing:PADDING/2}}>${item.price}</Text></Text>





      <View style={{backgroundColor:'lightgray',height:1,width:width*0.95,marginVertical:PADDING}}/>

          {/* description and item add button */}
          <Text style={{fontSize:15,fontWeight:'bold',marginTop:PADDING}}>Details:</Text>
          <View style={{ flexDirection: 'row',alignItems:'center'}}>

{/* Details text */}
<View style={{height: (height - TOP_HEADER_HEIGHT) * 0.35,width: width * 0.8,alignSelf:'flex-start'}}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <ReadMore numberOfLines={5} style={{lineHeight:20,paddingVertical:PADDING}}>
                {item.description}
                </ReadMore>

            </ScrollView>
            
            </View>

            <View style={{ alignItems: 'center',flex:1,padding:PADDING}}>
              <View style={{alignItems:'center',backgroundColor:'lightgray',borderRadius:15,elevation:PADDING*2,alignSelf:'flex-end'}}>
              <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'white', borderTopLeftRadius: 15, borderTopRightRadius: 15 }} onPress={()=>{
                setItemNumber(itemNumber+1);
              }}>
                <MaterialCommunityIcons name="plus" size={34} color="black" />
              </TouchableOpacity>

              <Text style={{fontWeight:'600',fontSize:20}}>{itemNumber}</Text>

              <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'white', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }} onPress={()=>{
                itemNumber>0?setItemNumber(itemNumber-1):null;
              }}>
                <MaterialCommunityIcons name="minus" size={34} color="black" />
              </TouchableOpacity>
            </View>
              </View>
          </View>
        </View>


{/* Bottom buttons */}
<View style={{
  justifyContent:'center',
  position:'absolute',
  bottom:0,
  }}>
  <View style={{flexDirection:'row',justifyContent:'center'}}>

  {itemNumber>0?(
    <TouchableOpacity activeOpacity={0.6} style={{marginBottom:PADDING,flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',borderRadius:6,backgroundColor:'black',padding:PADDING,marginHorizontal:PADDING,elevation:PADDING}}>
    <MaterialCommunityIcons name="cart-check" size={24} color="white" />
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
    paddingTop: Platform.OS === "android" ? SB.currentHeight : 0
  },
})