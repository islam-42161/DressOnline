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
          <TouchableOpacity style={{zIndex:1,position:'absolute',bottom:4*PADDING,right:PADDING,backgroundColor:'white', padding:PADDING, borderRadius:25,alignItems:'center',elevation:PADDING}}>
          <MaterialCommunityIcons name="cards-heart" size={35} color="red" />
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
          <Text style={{fontSize:16,fontWeight:'700',marginTop:PADDING}}>Details:</Text>
          <View style={{ height: (height - TOP_HEADER_HEIGHT) * 0.35,flexDirection: 'row',alignItems:'center'}}>

{/* Details text */}
<View style={{width: width * 0.8,alignSelf:'flex-start',paddingBottom:PADDING*2}}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <ReadMore numberOfLines={4} style={{lineHeight:25,paddingVertical:PADDING,fontSize:16}}>
                {item.description}
                </ReadMore>

            </ScrollView>
            
            </View>

            <View style={{ alignItems: 'center',flex:1,padding:PADDING}}>
              <View style={{alignItems:'center',backgroundColor:'#F3F3F3',borderRadius:15,elevation:PADDING*2,alignSelf:'flex-end'}}>
              <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'white', borderTopLeftRadius: 15, borderTopRightRadius: 15 }} onPress={()=>{
                setItemNumber(itemNumber+1);
              }}>
                <MaterialCommunityIcons name="plus" size={50} color="black" />
              </TouchableOpacity>

              <Text style={{fontWeight:'600',fontSize:30}}>{itemNumber}</Text>

              <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'white', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }} onPress={()=>{
                itemNumber>0?setItemNumber(itemNumber-1):null;
              }}>
                <MaterialCommunityIcons name="minus" size={50} color="black" />
              </TouchableOpacity>
            </View>
              </View>
          </View>

        </View>
{/* Bottom buttons */}
<View style={{
  justifyContent:'center',
  position:'absolute',
  bottom:PADDING,
  }}>
  <View style={{flexDirection:'row',justifyContent:'center'}}>


    <TouchableOpacity activeOpacity={0.6} style={{marginBottom:PADDING,flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',borderRadius:6,backgroundColor:itemNumber>0?'white':'lightgray',padding:PADDING,marginHorizontal:PADDING,elevation:itemNumber>0?PADDING:0}} disabled={itemNumber>0?false:true}>
    <MaterialCommunityIcons name="cart" size={24} color={itemNumber>0?'black':'gray'} />
    <Text style={{marginHorizontal:PADDING,color:'black',fontWeight:'800',color:itemNumber>0?'black':'gray'}}>Checkout Now</Text>
    <Text style={{marginHorizontal:PADDING,color:'black',letterSpacing:PADDING/2,color:itemNumber>0?'black':'gray'}}>${(item.price * itemNumber).toFixed(2)}</Text>
  </TouchableOpacity>


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