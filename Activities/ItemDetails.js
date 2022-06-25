import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient';
import ReadmoreCustom from '../components/ReadmoreCustom';

const { width, height } = Dimensions.get('window');

const ItemDetails = ({ route }) => {
  const { serial } = route.params;
  const [data, setData] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartButtonHeight, setCartButtonHeight] = useState(0);


  const toggleWishList = () => { //To toggle the show text or hide it
    setWishlisted(!wishlisted);
  }


  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${serial}`).then(res => res.json()).then(json => {
      setData(json);
    }).catch(err => { alert(`Could not load data: ${err}`) });
  }, [])
  return (
    <SafeAreaView style={styles.container}>




      {data ? (
        <>
          {/* top image */}
          <View style={styles.imageStyle}>
            <Image source={{ uri: data.image }} style={StyleSheet.absoluteFillObject} resizeMode={'contain'} />
          </View>

          {/* Wishlist button */}
          <LinearGradient
        colors={[ 'transparent','rgba(0,0,0,0.1)',]}
        style={styles.linearGradient}
        >
          <TouchableOpacity style={{
            alignItems: 'center',
            justifyContent: 'space-evenly',
            borderRadius: 10,
            paddingVertical: 2,
            paddingHorizontal: 10,
            flexDirection: 'row',
            backgroundColor: wishlisted ? 'hotpink' : 'pink',
            marginVertical: 5,
          }}
            onPress={toggleWishList}
          >
            <MaterialCommunityIcons name={wishlisted ? 'heart' : 'heart-outline'} color={'white'} size={12} />
            <Text style={{ color: 'white', fontSize: 12, marginHorizontal: 5 }}>{wishlisted ? 'Wishlisted!' : 'Add to wishlist'}</Text>
          </TouchableOpacity>
          </LinearGradient>
          
     
          {/* bottom sheet */}

          <View style={styles.bottomSheetStyle}>
            <Text style={styles.textStyle}>
              {data.title}
            </Text>

            <View style={styles.extraInfoStyle}>
              <Text style={{ ...styles.textStyle, fontWeight: 'normal', fontSize: 14 }}>
                {data.category.toUpperCase()}
              </Text>
              <Text style={{ marginHorizontal: 5 }}>•</Text>
              <MaterialCommunityIcons name="star" size={20} color="yellow" />
              <Text style={{ ...styles.textStyle, fontWeight: 'normal', fontSize: 14 }}>
                {data.rating.rate}({data.rating.count})
              </Text>
              <Text style={{ marginHorizontal: 5 }}>•</Text>
              <Text style={{ ...styles.textStyle, fontWeight: 'bold', fontSize: 14 }}>
                {data.price} USD
              </Text>
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: 5 }} />

            {/* Details */}
            <View style={[styles.detailsStyle,{marginBottom:cartButtonHeight}]}>
              <Text style={{ ...styles.textStyle, fontWeight: 'normal', color: '#3ca98b', fontSize: 14, position: 'absolute', top: -10, left: 10, backgroundColor: '#e2f9de', paddingHorizontal: 5, borderRadius: 5 }}>
                Details
              </Text>
              <ReadmoreCustom descriptiveText={data.description} numberOfLines={10} style={{ lineHeight: 21, fontSize: 14 }} />

            </View>


          </View>

          {/* Bottom Buttons */}
          <View
            style={styles.bottomButtonsStyle}
            
              onLayout={(event) => {
                setCartButtonHeight(event.nativeEvent.layout.height);
              }
            }
          >

            <TouchableOpacity activeOpacity={0.5} style={styles.addtocartButtonStyle}>
              <Text style={{ ...styles.textStyle, color: '#3ca98b', fontSize: 12, fontWeight: 'normal' }}>Add to cart</Text>
              <Text style={styles.totalPriceStyle}>{
                `$ ${data.price.toFixed(2)}`
              }</Text>
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={0.5} style={styles.addtocartButtonStyle}>
              <Text style={{ ...styles.textStyle, color: '#3ca98b', fontSize: 12, fontWeight: 'normal' }}>Add to cart</Text>
              <Text style={styles.totalPriceStyle}>{
                `$ ${data.price.toFixed(2)}`
              }</Text>
            </TouchableOpacity>

          </View>
        </>
      ) : (<ActivityIndicator />)}

    </SafeAreaView>
  )
}

export default ItemDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageStyle: {
    width: width * 0.8,
    height: height * 0.4,
  },
  bottomSheetStyle: {
    flex: 1,
    width,
    padding: 10
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black'
  },
  extraInfoStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  bottomButtonsStyle: {
    position: 'absolute',
    paddingBottom: 5,
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  addtocartButtonStyle: {
    backgroundColor: '#e2f9de',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  totalPriceStyle: {
    color: '#3ca98b',
    fontSize: 10,
    marginLeft: 20,
    borderRadius: 3,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  detailsStyle: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 5,
    flex:1
  },
  linearGradient:{
    alignItems: 'center',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: height * 0.6,
    width:width,
  }
})