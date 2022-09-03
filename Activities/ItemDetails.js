
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Share,
  ScrollView,

} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient';
import ReadmoreCustom from '../components/ReadmoreCustom';
import AddCommentModal from '../components/AddCommentModal';
import Animated, { event, Extrapolate, interpolate, interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';





const { width, height } = Dimensions.get('window');

const ItemDetails = ({ route }) => {
  const { serial } = route.params;
  // states
  const [items, setItems] = useState(0);
  const [data, setData] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartButtonHeight, setCartButtonHeight] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  //const [imageIndex, setImageIndex] = useState(0);

  // refs
  const scrollViewImageRef = useRef();




  // Animated shared values
  const scrollX = useRef(new Animated.Value(0)).current;
  const imageIndex = useRef(new Animated.Value(0)).current;

  // Reanimated styles
  // const color = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor: Animated.interpolateColors(scrollX,{
  //       inputRange: [0, width, width * 2],
  //       outputRange: ['gray', 'white', 'gray']
  //     })
  //   }
  // })

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
    // fetch(`https://api.escuelajs.co/api/v1/products/${serial}`)
    fetch(`https://dummyjson.com/products/${serial}`)
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
        message: `${data.title} - ${data.brand} | $ ${data.price} | ${data.category.toUpperCase()}`,
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



  const animatedScrollX = useSharedValue(0);
  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
        animatedScrollX.value = event.contentOffset.x;
        console.log(animatedScrollX.value)
    }
})
  
      const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

      const AnimatedBackImage = ({ index, image }) => {
        const ImageStyle = useAnimatedStyle(() => {
            const opacity = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, 1, 0], Extrapolate.CLAMP)
            return {
                opacity: opacity
            }
        })
        return (
            <Animated.View key={index} style={[StyleSheet.absoluteFillObject, ImageStyle]}>
                <Image
                    source={{ uri: image }}
                    style={StyleSheet.absoluteFillObject}
                    blurRadius={10}

                />
            </Animated.View>
        )
    }

    const MainImage = ({ image, index }) => {
        const ImageStyle = useAnimatedStyle(() => {
            const scale = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0.7, 1, 0.7], Extrapolate.CLAMP)
            return {
                transform: [
                    {
                        scale
                    }
                ]
            }
        })
        return (
          <Animated.View style={[{ width: width, alignItems: 'center', justifyContent: 'center' }, ImageStyle]}>
            {/* Top iamge and background with slider */}

            <View
              style={styles.imageContainer}>
              {/* Background Image */}
              <Image source={{ uri: image }}
                style={{
                  width: width - 40,
                  height: height * 0.4 - 40,
                  borderRadius: 10,
                }}
                resizeMode={'contain'}
              />

            </View>

          </Animated.View>
        )
    }

    const Dot = ({ index }) => {

      const dotStyle = useAnimatedStyle(() => {
          const scale = interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0.7, 1, 0.7], Extrapolate.CLAMP)
          const elevate = withTiming(interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, 10, 0], Extrapolate.CLAMP))
          const translateY = withTiming(interpolate(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, -1, 0], Extrapolate.CLAMP))
          const color = interpolateColor(animatedScrollX.value, [(index - 1) * width, index * width, (index + 1) * width], ['rgba(255,255,255,0.5)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.5)'])
          return {
              transform: [
                  {
                      scaleX: scale
                  },
                  {
                      translateY: translateY
                  }
              ],
              elevation: elevate,
              backgroundColor: color
          }
      })


      return (
<AnimatedTouchable activeOpacity={1} 
          index={index}
          style={[{
                      height: 10,
                      width: 20,
                      borderRadius: 5,
                      backgroundColor: 'white',
                      marginHorizontal: 10,
                    },
                    dotStyle
                  ]}
                      onPress={() => onGotoIndex({ index })} 
                      />
      )
  }


  return (
    <SafeAreaView style={styles.container}>

      {data ? (
        <View>
          <AddCommentModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
          {/* Top elemesnts*/}
          <View style={{ 
            width: width,
            height: height * 0.4,
            borderBottomLeftRadius:20,
            borderBottomRightRadius:20,
            overflow:"hidden"
          }}
            >

            {
              data.images.map((image, index) => {
                

                return (
                  <AnimatedBackImage image={image} key={index} index={index}/>
                )

              })}
            <Animated.ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} ref={scrollViewImageRef}  onScroll={animatedScrollHandler}>
              {/* scrollview item */}

              {
                data.images.map((image, index) => {
                  imageIndex.setValue(index);
                  
                  return(
                    <MainImage image={image} key={index} index={index}/>
                  )
                })}

            </Animated.ScrollView>
            {/* Linear Gradient */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.2)']}
              style={styles.linearGradient}
            >
              <ScrollView horizontal contentContainerStyle={{ alignItems: 'flex-end', marginBottom: 5 }}>
                {
                  data.images.map((_, index) => (
                    <Dot key={index} index={index}/>
                  )
                  )

                }

              </ScrollView>
            </LinearGradient>
          </View>


          {/* bottom sheet */}

          <View style={styles.bottomSheetStyle}>
            <Text style={styles.textStyle} numberOfLines={1} adjustsFontSizeToFit>
              {data.title} • {data.brand}
            </Text>

            <View style={styles.extraInfoStyle}>
              <Text style={{ ...styles.textStyle, fontWeight: 'normal', fontSize: 14}}>
                {data.category.toUpperCase()}
              </Text>
              <Text style={{ marginHorizontal: 5 }}>•</Text>
              <MaterialCommunityIcons name="star" size={20} color="#F8ED62" />
              <Text style={{ ...styles.textStyle, fontWeight: 'normal', fontSize: 14 }}>
                {data.rating}
              </Text>
              <Text style={{ marginHorizontal: 5 }}>•</Text>
              <Text style={{ ...styles.textStyle, fontWeight: 'bold', fontSize: 14 }}>
                $ {data.price} <Text style={{fontWeight:'normal',fontSize:12,color:'green'}}>(-{data.discountPercentage}%)</Text>
              </Text>
              {/* <Text style={{ ...styles.textStyle,fontWeight:'normal', fontSize: 14 }} adjustsFontSizeToFit>
                In stock: {data.stock}
              </Text> */}
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
  imageContainer: {
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