import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, ToastAndroid, Share, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient';
import ReadmoreCustom from '../components/ReadmoreCustom';
import AddCommentModal from '../components/AddCommentModal';

import Animated, { useSharedValue, useAnimatedStyle, interpolate, useAnimatedScrollHandler, runOnUI, runOnJS, useDerivedValue, Extrapolate } from 'react-native-reanimated';


const { width, height } = Dimensions.get('window');

const ItemDetails = ({ route }) => {
  const { serial } = route.params;
  // states
  const [items, setItems] = useState(0);
  const [data, setData] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartButtonHeight, setCartButtonHeight] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // refs
  const scrollViewImageRef = useRef();

  // reanimated shared values
  const scrollX = useSharedValue(0);
  //const opacityValue = useSharedValue(0);

  //let imageIndex = 0;
  // reanimated styles
   //const index = Math.round(scrollX.value/width);
  const backgroundImageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [( Math.round(scrollX.value/width) - 1) * width, Math.round(scrollX.value/width) * width, (Math.round(scrollX.value/width) + 1) * width], [0, 1, 0]),
  })
  )
  const mainImageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scrollX.value, [(Math.round(scrollX.value/width) - 1) * width, Math.round(scrollX.value/width) * width, (Math.round(scrollX.value/width) + 1) * width], [0.8, 1, 0.8]),
      }
    ]
  }))

  const toggleWishList = () => { //To toggle the show text or hide it
    !wishlisted ? ToastAndroid.showWithGravity(
      `${data.title} added to wishlist`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    )
      :
      ToastAndroid.showWithGravity(
        "Removed from wishlist",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      )
    setWishlisted(!wishlisted);
  }


  useEffect(() => {
    //fetch(`https://fakestoreapi.com/products/${serial}`)
    fetch(`https://api.escuelajs.co/api/v1/products/${serial}`)
      .then(res => res.json()).then(json => {
        setData(json);
      }).catch(err => { alert(`Could not load data: ${err}`) });
  }, [])


  const TotalPrice = ({ style }) =>
  (
    <Text style={style}>{
      `$ ${(items * data.price).toFixed(2)}`
    }</Text>
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${data.title} | $ ${data.price} | ${data.category.name}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onGotoIndex = ({ index }) => {
    scrollViewImageRef.current?.scrollTo({ x: index * width, y: 0, animated: true });
  }
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      
      scrollX.value = event.contentOffset.x;
      runOnJS(setImageIndex)(Math.round(event.contentOffset.x / width));
    },
  }, [])

  return (
    <SafeAreaView style={styles.container}>

      {data ? (
        <View>
          <AddCommentModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
          {/* Top elemesnts*/}
          <View style={{ width: width, height: height * 0.4 }}>

      <Animated.Image source={{ uri: data.images[imageIndex] }} style={[StyleSheet.absoluteFillObject,backgroundImageAnimatedStyle]}
        blurRadius={20}
      />
  
            <Animated.ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} ref={scrollViewImageRef} onScroll={onScrollHandler}>
              {/* scrollview item */}
              {
              data.images.map((image, index) => (
                <Animated.View style={[{ width: width, alignItems: 'center', justifyContent: 'center' },mainImageStyle]} key={index}>
                  {/* Top iamge and background with slider */}


                  <View
                    style={styles.imageStyle}>
                    {/* Background Image */}
                    <Animated.Image source={{ uri: image }}
                      style={{

                        width: width - 40,
                        height: height * 0.4 - 40,
                        borderRadius: 10,
                      }}
                      resizeMode={'contain'}
                    />

                  </View>

                </Animated.View>
              ))}

            </Animated.ScrollView>
            {/* Linear Gradient */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.2)']}
              style={styles.linearGradient}
            >
              <ScrollView horizontal contentContainerStyle={{ alignItems: 'flex-end', marginBottom: 5 }}>
                {
                  data.images.map((_, index) => (
                    <TouchableOpacity activeOpacity={1} key={index} style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: imageIndex === index ? 'white' : 'gray',
                      marginHorizontal: 10,
                      transform: [
                        { scale: imageIndex === index ? 1 : 0.8 }
                      ]
                    }}
                      onPress={() => onGotoIndex({ index })} />
                  )
                  )

                }

              </ScrollView>
            </LinearGradient>
          </View>


          {/* bottom sheet */}

          <View style={styles.bottomSheetStyle}>
            <Text style={styles.textStyle}>
              {data.title}
            </Text>

            <View style={styles.extraInfoStyle}>
              <Text style={{ ...styles.textStyle, fontWeight: 'normal', fontSize: 14 }}>
                {data.category.name}
              </Text>
              <Text style={{ marginHorizontal: 5 }}>•</Text>
              <MaterialCommunityIcons name="star" size={20} color="#F8ED62" />
              <Text style={{ ...styles.textStyle, fontWeight: 'normal', fontSize: 14 }}>
                4.4(200)
              </Text>
              <Text style={{ marginHorizontal: 5 }}>•</Text>
              <Text style={{ ...styles.textStyle, fontWeight: 'bold', fontSize: 14 }}>
                {data.price} USD
              </Text>
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: 5 }} />

            {/* Details and item =- button */}
            <View style={{ flex: 1, flexDirection: 'row' }}>
              {/* Details */}
              <View style={[styles.detailsStyle, { marginBottom: cartButtonHeight }]}>
                <Text style={{ ...styles.textStyle, fontWeight: 'normal', color: '#3ca98b', fontSize: 14, position: 'absolute', top: -10, left: 10, backgroundColor: '#e2f9de', paddingHorizontal: 5, borderRadius: 5 }}>
                  Details
                </Text>
                <ReadmoreCustom descriptiveText={data.description} numberOfLines={10} style={{ lineHeight: 21, fontSize: 14 }} />

              </View>
              {/* +- button, chat button, up/down vote button */}
              <View style={{ alignItems: 'center', marginBottom: cartButtonHeight, marginTop: 10, marginLeft: 10, justifyContent: 'space-between' }}>

                {/* +- button */}
                <View style={{ alignItems: 'center', backgroundColor: '#e2f9de', justifyContent: 'space-evenly', borderRadius: 5, borderColor: 'rgba(0,0,0,0.1)', elevation: 5 }}>
                  <TouchableOpacity
                    style={{ alignItems: 'center', borderRadius: 5, backgroundColor: 'white', margin: 2 }}
                    onPress={() => { setItems(items + 1) }}
                  >
                    <MaterialCommunityIcons name="plus" size={32} color="#3ca98b" />
                  </TouchableOpacity>
                  <Text style={{ fontWeight: 'bold', fontSize: 24, color: '#18866C' }}>
                    {items}
                  </Text>
                  <TouchableOpacity style={{ alignItems: 'center', borderRadius: 5, backgroundColor: 'white', margin: 2 }}
                    onPress={() => { if (items > 0) { setItems(items - 1) } }}
                    onLongPress={() => { setItems(0) }}
                    disabled={!items}
                  >
                    <MaterialCommunityIcons name="minus" size={32} color={items > 0 ? "#3ca98b" : "lightgray"} />
                  </TouchableOpacity>
                </View>

                {/* heart, share, comment */}
                <View style={{ flex: 1, justifyContent: 'space-around', marginTop: 5 }}>

                  <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 20, backgroundColor: 'white', padding: 4, elevation: 3 }} onPress={toggleWishList}>
                    <MaterialCommunityIcons name='heart' size={24} color={wishlisted ? "#ED4255" : "lightgray"} />
                  </TouchableOpacity>

                  <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 20, backgroundColor: 'white', padding: 4, elevation: 3 }} onPress={onShare}>
                    <MaterialCommunityIcons name="share-outline" size={24} color="#3ca98b" />
                  </TouchableOpacity>

                  <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 20, backgroundColor: 'white', padding: 4, elevation: 3 }}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <MaterialCommunityIcons name="comment-account-outline" size={24} color="#3ca98b" />
                  </TouchableOpacity>

                </View>


              </View>
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

            <TouchableOpacity activeOpacity={0.5} style={styles.addtocartButtonStyle} disabled={!items}
              onPress={() => {
                if (items > 0) {
                  setItems(0);
                  ToastAndroid.showWithGravity(`${items} ${data.title} has been added to cart`, ToastAndroid.LONG, ToastAndroid.CENTER)
                }
              }}
            >
              <Text style={{ ...styles.textStyle, color: '#3ca98b', fontSize: 12, fontWeight: 'normal' }}>Add to cart</Text>
              <TotalPrice style={styles.totalPriceStyle} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.5} style={{ ...styles.addtocartButtonStyle, backgroundColor: '#3ca98b' }} disabled={!items}>
              <Text style={{ ...styles.textStyle, color: '#e2f9de', fontSize: 12, fontWeight: 'normal' }}>Buy Now</Text>
              <TotalPrice style={{ ...styles.totalPriceStyle, color: '#e2f9de' }} />
            </TouchableOpacity>

          </View>



        </View>
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
    borderRadius: 10,
    elevation: 10,
  },
  bottomSheetStyle: {
    flex: 1,
    width,
    padding: 10
  },
  textStyle: {
    fontWeight: '800',
    fontSize: 20,
    color: 'black'
  },
  extraInfoStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomButtonsStyle: {
    position: 'absolute',
    paddingBottom: 5,
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
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
    flex: 1
  },
  linearGradient: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 50
  }
})