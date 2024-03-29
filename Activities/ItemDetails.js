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
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import ReadmoreCustom from "../components/item_details_components/ReadmoreCustom";

import { useDispatch, useSelector } from "react-redux";
import {
  setData,
  setItems,
  toggleWishlisted,
} from "../redux/slices/ItemDetailsStates";
import AnimatedCarousel from "../components/item_details_components/AnimatedCarousel";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import DotsCarousel from "../components/item_details_components/DotsCarousel";
import AddToCart from "../components/item_details_components/AddToCart";
import BottomSheet from "../components/item_details_components/BottomSheet";
import { useState } from "react";

const { width, height } = Dimensions.get("window");

const ItemDetails = ({ route, navigation }) => {
  const { serial } = route.params;

  // redux variables
  const dispatch = useDispatch();

  const { items, data, wishlisted, seeExtra } = useSelector((state) => {
    return {
      items: state.states.items,
      data: state.states.data,
      wishlisted: state.states.wishlisted,
      seeExtra: state.states.seeExtra,
    };
  });

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     header: () => <CustomHeader />,
  //   });
  // }, []);

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
    ? data.price - (data.price * (data.discountPercentage / 100)).toFixed(1)
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
  const CustomHeader = () => {
    return (
      <SafeAreaView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 4,
          paddingHorizontal: 4,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          // position: "absolute",
          width: width,
          // top: 0,
          right: 0,
          left: 0,
          alignSelf: "center",
          // backgroundColor: "white",
          // elevation: 5,
          // zIndex: 1000000000000,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => navigation.goBack()}
          activeOpacity={1}
        >
          <Ionicons
            name="arrow-back"
            style={{
              color: "black",
              fontSize: 24,
              backgroundColor: "white",
              height: 28,
              width: 28,
              borderRadius: 14,
              textAlign: "center",
              textAlignVertical: "center",
              marginHorizontal: 5,
              // elevation: 5,
            }}
          />
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
      </SafeAreaView>
    );
  };

  // heart, share, comment

  const ActionButtons = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons
          name={wishlisted ? "heart" : "heart-outline"}
          style={{
            fontSize: 24,
            color: "#ED4255",
            marginRight: 5,
          }}
          onPress={toggleWishList}
        />

        <Ionicons
          name="share-outline"
          style={{
            fontSize: 24,
            color: "black",
            marginRight: 5,
          }}
          onPress={onShare}
        />
        <Ionicons
          name="add"
          style={{
            fontSize: 24,
            color: "black",
            marginRight: 5,
          }}
          onPress={() => console.log("clicked on two dots menu")}
        />
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

  const TitleandPrice = ({ extraStyle }) => (
    <View
      style={{
        width: "100%",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        paddingTop: 5,
        justifyContent: "center",
        // backgroundColor: "pink",
        // position: "absolute",
        ...extraStyle,
      }}
    >
      <Text
        style={{
          ...styles.textStyle,
          fontWeight: "normal",
          fontSize: 16,
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {data.brand}
      </Text>
      {/* product title and brand*/}
      <Text
        style={[styles.textStyle, { fontSize: 32, fontWeight: "900" }]}
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
          style={{ fontWeight: "bold", fontSize: 24, lineHeight: 30 }}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          ${price}
        </Text>
        <Text
          style={{
            textDecorationLine: "line-through",
            fontSize: 12,
            lineHeight: 37,
            marginLeft: 2,
            color: "lightgray",
          }}
        >
          ${data.price}
        </Text>
      </View>
    </View>
  );

  const IMAGE_HEIGHT_RATIO = useSharedValue(0.7);
  if (data) {
    return (
      <View style={styles.container}>
        <CustomHeader />

        {/* Animated carousel*/}
        {/* scrollViewImageRef,onGotoIndex,animatedScrollX,animatedScrollHandler */}
        <AnimatedCarousel
          images={data.images}
          animatedScrollHandler={animatedScrollHandler}
          animatedScrollX={animatedScrollX}
          scrollViewImageRef={scrollViewImageRef}
          IMAGE_HEIGHT_RATIO={IMAGE_HEIGHT_RATIO}
          onGotoIndex={onGotoIndex}
        />

        {/* <DotsCarousel
          animatedScrollX={animatedScrollX}
          dots={data.images}
          onGotoIndex={onGotoIndex}
          style={{
            alignItems: "center",
            width: "100%",
          }}
        /> */}

        <BottomSheet
          IMAGE_HEIGHT_RATIO={IMAGE_HEIGHT_RATIO}
          snap_points={[0.3, 0.6, 1]}
        >
          <View style={styles.bottomSheetStyle}>
            {/* reanimated extra info */}
            {!seeExtra && (
              <Animated.Text
                entering={FadeIn}
                exiting={FadeOut}
                style={{ alignSelf: "center" }}
              >
                Slide up to see more
              </Animated.Text>
            )}
            <TitleandPrice
              extraStyle={{ paddingHorizontal: 0, paddingTop: 0 }}
            />
            {seeExtra && (
              <Animated.View
                style={{ flex: 1 }}
                entering={FadeInDown}
                exiting={FadeOutDown}
              >
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
              </Animated.View>
            )}
          </View>
        </BottomSheet>

        <AddToCart dispatch={dispatch} setItems={setItems} items={items} />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
};

export default ItemDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  bottomSheetStyle: {
    marginHorizontal: 20,
    flex: 1,
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
