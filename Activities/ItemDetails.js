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

import ReadmoreCustom from '../components/ReadmoreCustom';
import AddCommentModal from '../components/AddCommentModal';

import {useDispatch, useSelector } from 'react-redux';
import { setCartButtonHeight, setData, setItems, setModalVisible, toggleWishlisted } from '../redux/slices/ItemDetailsStates';
import AnimatedCarousel from '../components/AnimatedCarousel';



const { width, height } = Dimensions.get('window');

const ItemDetails = ({ route }) => {
  const { serial } = route.params;

  // redux variables
  const dispatch = useDispatch()

const {items,data,wishlisted,cartButtonHeight,modalVisible} = useSelector((state)=>{
  return{
    items: state.states.items,
    data: state.states.data,
    wishlisted: state.states.wishlisted,
    cartButtonHeight: state.states.cartButtonHeight,
    modalVisible: state.states.modalVisible
  }
})


  useEffect(() => {
    //fetch(`https://fakestoreapi.com/products/${serial}`)
    // fetch(`https://api.escuelajs.co/api/v1/products/${serial}`)
    fetch(`https://dummyjson.com/products/${serial}`)
      .then(res => res.json()).then(json => {
        dispatch(setData(json))
      }).catch(err => { alert(`Could not load data: ${err}`) });
  },[])



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




  const TotalPrice = ({ style }) =>
  (
    <Text style={style}>{
      `$ ${(items * data.price).toFixed(2)}`
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

    const ActionButtons = ()=>{
     
      return(
                      <View style={{ justifyContent: 'space-around', flexDirection:'row',backgroundColor:'#e2f9de',borderColor:'lightgreen',borderWidth:1,borderRadius:20}}>

                      <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 20, backgroundColor: 'white', padding: 4, elevation: 3, margin:5}} onPress={toggleWishList}>
                        <MaterialCommunityIcons name='heart' size={24} color={wishlisted ? "#ED4255" : "lightgray"} />
                      </TouchableOpacity>
    
                      <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 20, backgroundColor: 'white', padding: 4, elevation: 3, margin:5}} onPress={onShare}>
                        <MaterialCommunityIcons name="share-outline" size={24} color="#3ca98b" />
                      </TouchableOpacity>
    
                      <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 20, backgroundColor: 'white', padding: 4, elevation: 3, margin:5 }}
                        onPress={() => dispatch(setModalVisible(!modalVisible))}
                      >
                        <MaterialCommunityIcons name="comment-account-outline" size={24} color="#3ca98b" />
                      </TouchableOpacity>
    
                    </View>
      )
    }



    


  

  return (
    <SafeAreaView style={styles.container}>

      {data ? (
        <View>
          <AddCommentModal modalVisible={modalVisible} setModalVisible={(value)=>dispatch(setModalVisible(value))} />
          
          {/* Animated carousel*/}
          <AnimatedCarousel images={data.images}/>

          {/* bottom sheet */}

          <View style={styles.bottomSheetStyle}>

{/* extra infos */}

          <View style={styles.extraInfoStyle}>
              <Text style={{ ...styles.textStyle, fontWeight: 'normal', fontSize: 14,fontFamily:'sans-serif-light'}} numberOfLines={1} adjustsFontSizeToFit>
                {data.category.toUpperCase()}
              </Text>
              <View style={{flexDirection:'row',alignItems:'center'}}>
              <MaterialCommunityIcons name="star" size={20} color="#F8ED62" />
              <Text style={{ ...styles.textStyle, fontWeight: 'normal', fontSize: 14, fontFamily:'sans-serif-light'}} numberOfLines={1} adjustsFontSizeToFit>
                ({data.rating})
              </Text>
              </View>
            </View>

{/* product title and brand*/}
            <Text style={[styles.textStyle,{fontSize:24}]} numberOfLines={1} adjustsFontSizeToFit>
              {data.title}
            </Text>
<View style={{justifyContent:'space-between',flexDirection:'row',marginVertical:5,alignItems:'center'}}>
            {/* backgroundColor:'#e2f9de',paddingHorizontal:20 */}
            
            <Text style={{...styles.textStyle,paddingVertical:10,paddingHorizontal:15,fontSize:16,fontWeight:'normal',borderWidth:1,borderColor:'lightgreen',color:'#3ca98b',backgroundColor:'#e2f9de',borderRadius:20}} numberOfLines={1} adjustsFontSizeToFit>{data.brand}</Text>

            
<ActionButtons/>
              
<View style={{flexDirection:'row',alignItems:'center'}}>
            
            <View style={{flexDirection:'row',marginRight:5}}>
        <Text style={{fontWeight:'bold',fontSize:18,color:'white',backgroundColor:'green',paddingHorizontal:5,borderRadius:10}}>${data.price - (data.price * (data.discountPercentage / 100)).toFixed(0)}</Text>
            
            <Text style={{fontWeight:'bold',fontSize:8,color:'green',position:'absolute',top:-12,right:-8,backgroundColor:'white',padding:2,borderRadius:10,elevation:2}}>-{data.discountPercentage}%</Text>
            </View>
            <Text style={{textDecorationLine:'line-through',color:'lightgray',fontSize:12}}>${data.price}</Text>
          
          </View>


              </View>

            {/* Divider */}
            {/* <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: 5 }} /> */}

            {/* Details and item +- button */}
            <View style={{ flex: 1, flexDirection: 'row' }}>

              {/* Details */}
              <View style={[styles.detailsStyle, { marginBottom: cartButtonHeight }]}>
                <Text style={{ ...styles.textStyle, fontWeight: 'normal', color: '#3ca98b', fontSize: 14, position: 'absolute', top: -10, left: 10, backgroundColor: '#e2f9de', paddingHorizontal: 5, borderRadius: 5 }}>
                  Details
                </Text>
                <ReadmoreCustom descriptiveText={data.description} numberOfLines={10} style={{ fontFamily:'sans-serif-condensed',lineHeight: 21, fontSize: 14}} />
              </View>


              {/* +- button, chat button, up/down vote button */}
              <View style={{ alignItems: 'center', marginBottom: cartButtonHeight, marginTop: 10, marginLeft: 10, justifyContent: 'flex-end' }}>
                {/* +- button */}
                <View style={{ alignItems: 'center', backgroundColor: '#e2f9de', justifyContent: 'space-evenly', borderRadius: 5, borderColor: 'rgba(0,0,0,0.1)', elevation: 5}}>
                  <TouchableOpacity
                    style={{ alignItems: 'center', borderRadius: 5, backgroundColor: 'white', margin: 2 }}
                    onPress={() => { dispatch(setItems(items + 1)) }}
                  >
                    <MaterialCommunityIcons name="plus" size={32} color="#3ca98b" />
                  </TouchableOpacity>
                  <Text style={{ fontWeight: 'bold', fontSize: 24, color: '#18866C' }}>
                    {items}
                  </Text>
                  <TouchableOpacity style={{ alignItems: 'center', borderRadius: 5, backgroundColor: 'white', margin: 2 }}
                    onPress={() => { if (items > 0) { dispatch(setItems(items - 1)) } }}
                    onLongPress={() => { dispatch(setItems(0)) }}
                    disabled={!items}
                  >
                    <MaterialCommunityIcons name="minus" size={32} color={items > 0 ? "#3ca98b" : "lightgray"} />
                  </TouchableOpacity>
                </View>

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

            <TouchableOpacity activeOpacity={0.5} style={styles.addtocartButtonStyle} disabled={!items}
              onPress={() => {
                if (items > 0) {
                  dispatch(setItems(0));
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
  bottomSheetStyle: {
    flex: 1,
    width,
    padding: 10
  },
  textStyle: {
    fontWeight: '800',
    fontSize: 20,
    color: 'black',
    fontFamily:'sans-serif-condensed'
  },
  extraInfoStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical:5,
    justifyContent:'space-between'
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
})