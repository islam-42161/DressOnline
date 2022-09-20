import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Share,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import ReadmoreCustom from "../components/ReadmoreCustom";
import AddCommentModal from "../components/AddCommentModal";

import { useDispatch, useSelector } from "react-redux";
import {
  setData,
  setItems,
  setModalVisible,
  toggleWishlisted,
} from "../redux/slices/ItemDetailsStates";
import AnimatedCarousel from "../components/AnimatedCarousel";
import {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import DotsCarousel from "../components/DotsCarousel";
import AddToCart from "../components/AddToCart";

const { width, height } = Dimensions.get("window");

const ItemDetails = ({ route, navigation }) => {
  const { serial } = route.params;

  // redux variables
  const dispatch = useDispatch();

  const { items, data, wishlisted, modalVisible } = useSelector((state) => {
    return {
      items: state.states.items,
      data: state.states.data,
      wishlisted: state.states.wishlisted,
      modalVisible: state.states.modalVisible,
    };
  });

  useEffect(() => {
    //fetch(`https://fakestoreapi.com/products/${serial}`)
    // fetch(`https://api.escuelajs.co/api/v1/products/${serial}`)
    dispatch(setData(null));
    fetch(`https://dummyjson.com/products/${serial}`)
      .then((res) => res.json())
      .then((json) => {
        dispatch(setData(json));
      })
      .catch((err) => {
        alert(`Could not load data: ${err}`);
      });
  }, []);

  const toggleWishList = () => {
    //To toggle the show text or hide it
    !wishlisted
      ? ToastAndroid.showWithGravity(
          `${data.title} added to wishlist`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
      : ToastAndroid.showWithGravity(
          "Removed from wishlist",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
    dispatch(toggleWishlisted(!wishlisted));
  };

  let price = data
    ? data.price - (data.price * (data.discountPercentage / 100)).toFixed(2)
    : 0;

  const TotalPrice = ({ style }) => (
    <Text style={style}>{`$${(items * price).toFixed(2)}`}</Text>
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${data.title} - ${data.brand} | $${
          data.price
        } | ${data.category.toUpperCase()}`,
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
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            padding: 4,
          }}
          onPress={toggleWishList}
        >
          <MaterialCommunityIcons
            name="heart"
            size={24}
            color={wishlisted ? "#ED4255" : "lightgray"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            padding: 4,
            marginHorizontal: 5,
          }}
          onPress={onShare}
        >
          <Ionicons name="ios-share-outline" size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            padding: 4,
          }}
          onPress={() => dispatch(setModalVisible(!modalVisible))}
        >
          <MaterialCommunityIcons name="comment-account-outline" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  // to share into child components
  const scrollViewImageRef = useAnimatedRef();

  const onGotoIndex = ({ index }) => {
    scrollViewImageRef.current?.scrollTo({
      x: index * width,
      y: 0,
      animated: true,
    });
  };

  const animatedScrollX = useSharedValue(0);
  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      animatedScrollX.value = event.contentOffset.x;
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {data ? (
        <View>
          <AddCommentModal
            modalVisible={modalVisible}
            setModalVisible={(value) => dispatch(setModalVisible(value))}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={32} color="black" />
              <Text
                style={{
                  fontWeight: "500",
                  textTransform: "uppercase",
                  fontSize: 16,
                }}
              >
                {data.category}
              </Text>
            </TouchableOpacity>
            <ActionButtons />
          </View>
          {/* Animated carousel*/}
          {/* scrollViewImageRef,onGotoIndex,animatedScrollX,animatedScrollHandler */}
          <AnimatedCarousel
            images={data.images}
            animatedScrollHandler={animatedScrollHandler}
            animatedScrollX={animatedScrollX}
            scrollViewImageRef={scrollViewImageRef}
          />

          {/* bottom sheet */}

          <View style={styles.bottomSheetStyle}>
            {/* extra infos */}

            <View style={styles.extraInfoStyle}>
              <Text
                style={{
                  ...styles.textStyle,
                  fontWeight: "normal",
                  fontSize: 14,
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {data.brand}
              </Text>

              <DotsCarousel
                animatedScrollX={animatedScrollX}
                dots={data.images}
                onGotoIndex={onGotoIndex}
                style={{ paddingVertical: 5 }}
              />
            </View>

            {/* product title and brand*/}
            <Text
              style={[styles.textStyle, { fontSize: 24 }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {data.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 5,
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 20, lineHeight: 30 }}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                ${price}
              </Text>
              <Text
                style={{
                  textDecorationLine: "line-through",
                  fontSize: 11,
                  lineHeight: 37,
                  marginLeft: 2,
                  color: "lightgray",
                }}
              >
                ${data.price}
              </Text>
            </View>

            <View style={{ width: "100%", marginBottom: 10 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* category */}
                <View style={styles.miniscrollItemStyle}>
                  <Text>Rating: ⭐ {data.rating}</Text>
                </View>
                {/* discount rate */}
                <View style={[styles.miniscrollItemStyle]}>
                  <Text>
                    Discount:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {data.discountPercentage}%
                    </Text>
                  </Text>
                </View>
                {/* category */}
                <View style={styles.miniscrollItemStyle}>
                  <Text>
                    In stock:{" "}
                    <Text style={{ fontWeight: "bold" }}>{data.stock}</Text>
                  </Text>
                </View>
              </ScrollView>
            </View>

            {/* rating, discount rate */}
            <ReadmoreCustom
              descriptiveText={data.description}
              numberOfLines={5}
              textstyle={{ lineHeight: 21, fontSize: 14 }}
            />
          </View>

          <AddToCart dispatch={dispatch} setItems={setItems} items={items} />
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </SafeAreaView>
  );
};

export default ItemDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  bottomSheetStyle: {
    flex: 1,
    width,
    padding: 10,
  },
  textStyle: {
    fontWeight: "800",
    fontSize: 20,
    color: "black",
  },
  extraInfoStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  bottomButtonsStyle: {
    // position: 'absolute',
    // bottom: 0,
    paddingBottom: 5,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // flex: 1
  },
  addtocartButtonStyle: {
    // backgroundColor: '#e2f9de',
    backgroundColor: "#3ca98b",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    elevation: 5,
  },
  totalPriceStyle: {
    // color: '#3ca98b',
    color: "#e2f9de",
    fontSize: 10,
    marginLeft: 20,
    borderRadius: 3,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  detailsStyle: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 5,
    flex: 1,
  },
  miniscrollItemStyle: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
});
