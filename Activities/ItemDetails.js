import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator} from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import ReadMore from 'react-native-read-more-text';

const ItemDetails = ({ route, navigation}) => {
  const { height, width } = Dimensions.get('window');
  const { serial } = route.params;
  const [item,setItem] = useState(null);
  const TOP_HEADER_HEIGHT = height * 0.5;

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
    <ActivityIndicator/>
  </SafeAreaView>
)


  if (item===null) {
    return <PreLoader/>;
  }else{
    return (
        <SafeAreaView style={styles.container}>
              <View
            style={[StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'transparent',
              height: TOP_HEADER_HEIGHT,
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              elevation: 5,
              top: -PADDING,
            }
            ]}
          >
            <Image source={{ uri: item.image }} style={[styles.imageStyle, {
              height: TOP_HEADER_HEIGHT * 0.8,
              width: width * 0.8,
            }]} />
          </View>
    
          <View style={[styles.bg, {
            height: height - TOP_HEADER_HEIGHT,
            top: TOP_HEADER_HEIGHT,
          }]}>
    

    {/* Bottom info space - bg */}
    <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.name}>{item.title} • {(item.category).toUpperCase()}</Text>


    {/* Description */}
            <Text style={{...styles.addItemText,fontSize:18,fontWeight:'600'}}>Description:</Text>
            <View 
            style={{maxHeight:height*0.12}}>
            {/* Description text scrollview */}
    <ScrollView>
            <ReadMore
            numberOfLines={2}
            >
              <Text>
                {item.description}
              </Text>
              </ReadMore>
          </ScrollView>
          
          </View>
          
    <View style={{
      flexDirection: 'row',
      alignSelf:'center',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: width / 3,
    }}>
      <TouchableOpacity style={{ borderRadius: 25, borderWidth: 2, alignItems: 'center', borderColor: 'lightgreen' }}>
    
        <MaterialCommunityIcons name="plus" size={32} color="green" onPress={() => {
           setItemNumber(itemNumber + 1);
        }} />
      </TouchableOpacity>
      <Text style={{ ...styles.addItemText, paddingHorizontal: PADDING, marginHorizontal: PADDING,fontSize:42}}>{itemNumber}</Text>
      <TouchableOpacity style={{ borderRadius: 25, borderWidth: 2, alignItems: 'center', borderColor: 'tomato' }} >
        <MaterialCommunityIcons name="minus" size={32} color="red" onPress={() => {
          if (itemNumber > 0) {
            setItemNumber(itemNumber - 1);
          }
        }} />
      </TouchableOpacity>
    </View>
    
            
    
    
            <View style={styles.ratingStyle}>
              {/* Rating part */}
              <View style={{flexDirection:'row'}}>
              
              <Text style={{ ...styles.addItemText, fontWeight:'500'}}>Rating: {item.rating.rate}</Text>
              
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{ fontWeight: '400'}}>(</Text>
                <MaterialIcons name="people" size={24} color="black" />
                <Text style={{ fontWeight: '400'}}>{item.rating.count})</Text>
              
              </View>
              
              </View>
              {/* Price Section */}
              <Text style={{ ...styles.addItemText, letterSpacing: PADDING,fontSize:30 }}><Text>$</Text>{item.price}</Text>
            </View>
    
    
          
              </ScrollView>
          </View>


          {/* Bag it */}
          <View style={{ flexDirection: 'row', alignSelf: 'center', position: 'absolute', bottom: PADDING }}>
            <TouchableOpacity activeOpacity={0.5} style={{alignItems:'center',flexDirection:'row', padding: PADDING, borderWidth: 2, borderRadius: 12, borderColor: 'red' }}>
              <MaterialCommunityIcons name="cart-heart" size={34} color="red" />
            {itemNumber > 0 ? null:(<Text style={{ ...styles.addItemText, color: 'red', fontSize: 18, marginHorizontal: PADDING }}>Add to wishlist</Text>)}                 
            </TouchableOpacity>
            {itemNumber > 0 ? (<TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', backgroundColor: 'red', alignItems: 'center', marginHorizontal: PADDING * 2, borderRadius: 12, padding: PADDING }}>
              <MaterialCommunityIcons name="cart-arrow-down" size={24} color="white" backgroundColor={"red"} style={{ marginHorizontal: PADDING }} />
              <Text style={{ ...styles.addItemText, color: 'white', fontSize: 18, marginHorizontal: PADDING }}>Checkout</Text>
              <Text style={{ ...styles.addItemText, color: 'white', fontSize: 18, marginHorizontal: PADDING,letterSpacing:1 }}>${(item.price * itemNumber).toFixed(2)}</Text>
            </TouchableOpacity>
            ):
            null
            }
            
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
    backgroundColor: 'white'
  },
  imageStyle: {
    resizeMode: 'contain'
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'sans-serif-condensed',
  },
  bg: {
    position: 'absolute',
    paddingHorizontal: 2*PADDING,
    marginHorizontal: PADDING,
    width:'100%',
    paddingBottom:38 + 2*PADDING
  },
  addItemText: {
    fontWeight: '800',
    fontSize: 24,
    fontFamily: 'sans-serif-condensed',
  },
  ratingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
  },
})