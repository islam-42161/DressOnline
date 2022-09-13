import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Share,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import ReadmoreCustom from '../components/ReadmoreCustom';
import AddCommentModal from '../components/AddCommentModal';

import { useDispatch, useSelector } from 'react-redux';
import { setCartButtonHeight, setData, setItems, setModalVisible, toggleWishlisted } from '../redux/slices/ItemDetailsStates';
import AnimatedCarousel from '../components/AnimatedCarousel';
import { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import DotsCarousel from '../components/DotsCarousel';






const { width, height } = Dimensions.get('window');

const ItemDetails = ({ route,navigation }) => {
  const { serial } = route.params;

  // redux variables
  const dispatch = useDispatch()

  const { items, data, wishlisted, cartButtonHeight, modalVisible } = useSelector((state) => {
    return {
      items: state.states.items,
      data: state.states.data,
      wishlisted: state.states.wishlisted,
      cartButtonHeight: state.states.cartButtonHeight,
      modalVisible: state.states.modalVisible,
    }
  })


  useEffect(() => {
    //fetch(`https://fakestoreapi.com/products/${serial}`)
    // fetch(`https://api.escuelajs.co/api/v1/products/${serial}`)
    dispatch(setData(null))
    fetch(`https://dummyjson.com/products/${serial}`)
      .then(res => res.json()).then(json => {
        dispatch(setData(json))
      }).catch(err => {
        alert(`Could not load data: ${err}`)
      });
  }, [])



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
    dispatch(toggleWishlisted(!wishlisted));
  }


  let price = data ? data.price - (data.price * (data.discountPercentage / 100)).toFixed(0) : 0

  const TotalPrice = ({ style }) =>
  (
    <Text style={style}>{
      `$${(items * price).toFixed(2)}`
    }</Text>
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${data.title} - ${data.brand} | $${data.price} | ${data.category.toUpperCase()}`,
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



  // heart, share, comment

  const ActionButtons = () => {
    return (
      <View style={{ justifyContent: 'space-between', flexDirection: 'row'}}>

        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 20, backgroundColor: 'white', padding: 4, elevation: 3 }} onPress={toggleWishList}>
          <MaterialCommunityIcons name='heart' size={24} color={wishlisted ? "#ED4255" : "lightgray"} />
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 20, backgroundColor: 'white', padding: 4, elevation: 3, marginHorizontal: 5 }} onPress={onShare}>
          <MaterialCommunityIcons name="share-outline" size={24} color="#3ca98b" />
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 20, backgroundColor: 'white', padding: 4, elevation: 3 }}
          onPress={() => dispatch(setModalVisible(!modalVisible))}
        >
          <MaterialCommunityIcons name="comment-account-outline" size={24} color="#3ca98b" />
        </TouchableOpacity>

      </View>
    )
  }



  // to share into child components
  const scrollViewImageRef = useAnimatedRef();
  
  const onGotoIndex = ({ index }) => {
    scrollViewImageRef.current?.scrollTo({ x: index * width, y: 0, animated:true});
  }

  const animatedScrollX = useSharedValue(0);
  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
        animatedScrollX.value = event.contentOffset.x;
    }
})




  return (
    <SafeAreaView style={styles.container}>
      {data ? (
        <View>
          <AddCommentModal modalVisible={modalVisible} setModalVisible={(value) => dispatch(setModalVisible(value))} />



<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
  <Text onPress={()=>navigation.goBack()}>Back</Text>
  <ActionButtons/>
</View>
          {/* Animated carousel*/}
          {/* scrollViewImageRef,onGotoIndex,animatedScrollX,animatedScrollHandler */}
          <AnimatedCarousel images={data.images} animatedScrollHandler={animatedScrollHandler} animatedScrollX={animatedScrollX} onGotoIndex={onGotoIndex} scrollViewImageRef={scrollViewImageRef}/>

          {/* bottom sheet */}

          <View style={styles.bottomSheetStyle}>

            {/* extra infos */}

            <View style={styles.extraInfoStyle}>
              <Text style={{ ...styles.textStyle, fontWeight: 'normal', fontSize: 14,}} numberOfLines={1} adjustsFontSizeToFit>
              {data.brand}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="star" size={20} color="#F8ED62" />
                <Text style={{ ...styles.textStyle, fontWeight: 'normal', fontSize: 14,}} numberOfLines={1} adjustsFontSizeToFit>
                  ({data.rating})
                </Text>
              </View>
              <DotsCarousel animatedScrollX={animatedScrollX} dots={data.images} onGotoIndex={onGotoIndex}/>
            </View>

            {/* product title and brand*/}
            <Text style={[styles.textStyle, { fontSize: 24 }]} numberOfLines={1} adjustsFontSizeToFit>
              {data.title}
            </Text>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginVertical: 5, alignItems: 'center', }}>
              {/* backgroundColor:'#e2f9de',paddingHorizontal:20 */}

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

<View style={{ flexDirection: 'row', marginRight: 5 }}>
  <Text style={{ fontWeight: '600', fontSize: 18, color: 'gray',backgroundColor:'white',paddingHorizontal: 5, borderRadius: 10, elevation: 2  }} adjustsFontSizeToFit numberOfLines={1}>${price}</Text>

  <Text style={{ fontWeight: 'bold', fontSize: 8, color: 'green', position: 'absolute', top: -12, right: -8, backgroundColor: 'white', padding: 2, borderRadius: 10}} adjustsFontSizeToFit numberOfLines={1}>-{data.discountPercentage}%</Text>
</View>
<Text style={{ textDecorationLine: 'line-through', color: 'lightgray', fontSize: 12 }} adjustsFontSizeToFit numberOfLines={1} >${data.price}</Text>

</View>

              <View style={{ padding: 10, borderWidth: 1, borderColor: 'lightgreen', backgroundColor: '#e2f9de', borderRadius: 20, alignItems: 'center' }}>
                <Text style={{ ...styles.textStyle, fontSize: 16, fontWeight: 'normal', color: '#3ca98b',textTransform:'capitalize' }} numberOfLines={1} adjustsFontSizeToFit>{data.category}</Text>
              </View>

              {/* <ActionButtons /> */}


            </View>

            {/* Divider */}
            {/* <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: 5 }} /> */}

            {/* Details and item +- button */}
            <View style={{ flex: 1, flexDirection: 'row' }}>

              {/* Details */}
              <View style={[styles.detailsStyle]}>
                <Text style={{ ...styles.textStyle, fontWeight: 'normal', color: '#3ca98b', fontSize: 14, position: 'absolute', top: -10, left: 10, backgroundColor: '#e2f9de', paddingHorizontal: 5, borderRadius: 5 }}>
                  Details
                </Text>
                {/* data.description
                Lorem ipsum dolor sit amet. Aut voluptas velit ut tenetur quibusdam sit quia molestias. Ut quam beatae aut repellat numquam qui fugiat maxime et enim sunt qui minus veniam a earum ipsum. </p><p>Sit pariatur iste sit asperiores tenetur quo porro neque ex dolorum vitae? Et assumenda sunt est perspiciatis pariatur non magni voluptatem non perspiciatis sequi sit voluptatem voluptas sit quod consequatur aut unde dolorem. </p><p>Sit dolorum deserunt et sequi quia sit quisquam veniam et nisi rerum cum odio dolores 33 nihil soluta? Sit perspiciatis commodi aut quam rerum ea architecto tempora
                 */}
                <ReadmoreCustom descriptiveText={data.description} numberOfLines={5} textstyle={{lineHeight: 21, fontSize: 14 }} />
              </View>


            </View>

          </View>

          {/* Bottom Buttons */}
          <View
            style={styles.bottomButtonsStyle}

            onLayout={(event) => {
              dispatch(setCartButtonHeight(event.nativeEvent.layout.height));
            }
            }
          >
            {/* plus button */}
            <TouchableOpacity
              style={{ alignItems: 'center', borderRadius: 5, backgroundColor: 'white', margin: 2, elevation: 5 }}
              onPress={() => { dispatch(setItems(items + 1)) }}
            >
              <MaterialCommunityIcons name="plus" size={32} color="#3ca98b" />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.5} style={styles.addtocartButtonStyle} disabled={!items}
              onPress={() => {
                if (items > 0) {
                  dispatch(setItems(0));
                  ToastAndroid.showWithGravity(`${items} ${data.title} has been added to cart`, ToastAndroid.LONG, ToastAndroid.CENTER)
                }
              }}
            >
              {items > 0 && (<Text style={{ fontWeight: 'bold', fontSize: 15, color: '#3ca98b', paddingHorizontal: 10, borderRadius: 20, backgroundColor: '#e2f9de', marginHorizontal: 5 }}>
                {items}
              </Text>)}
              <Text style={{ ...styles.textStyle, color: '#e2f9de', fontSize: 18, fontWeight: 'bold' }}>Add to cart</Text>
              <TotalPrice style={styles.totalPriceStyle} />


            </TouchableOpacity>

            {/* minus button */}
            <TouchableOpacity style={{ alignItems: 'center', borderRadius: 5, backgroundColor: 'white', margin: 2, elevation: 5 }}
              onPress={() => { if (items > 0) { dispatch(setItems(items - 1)) } }}
              onLongPress={() => { dispatch(setItems(0)) }}
              disabled={!items}
            >
              <MaterialCommunityIcons name="minus" size={32} color={items > 0 ? "#3ca98b" : "lightgray"} />
            </TouchableOpacity>

            {/* <TouchableOpacity activeOpacity={0.5} style={{ ...styles.addtocartButtonStyle, backgroundColor: '#3ca98b' }} disabled={!items}>
              <Text style={{ ...styles.textStyle, color: '#e2f9de', fontSize: 12, fontWeight: 'normal' }}>Buy Now</Text>
              <TotalPrice style={{ ...styles.totalPriceStyle, color: '#e2f9de' }} />
            </TouchableOpacity> */}

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
  bottomSheetStyle: {
    flex: 1,
    width,
    padding: 10
  },
  textStyle: {
    fontWeight: '800',
    fontSize: 20,
    color: 'black',
  },
  extraInfoStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-between'
  },
  bottomButtonsStyle: {
    // position: 'absolute',
    // bottom: 0,
    paddingBottom: 5,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    // flex: 1
  },
  addtocartButtonStyle: {
    // backgroundColor: '#e2f9de',
    backgroundColor: '#3ca98b',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    elevation: 5
  },
  totalPriceStyle: {
    // color: '#3ca98b',
    color: '#e2f9de',
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
})