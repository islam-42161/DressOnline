import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const GridItem = ({item,onPress}) => {
  return (
    <TouchableOpacity style={styles.itemStyle}
    onPress={onPress}
  >
    {/* <Text style={{ ...styles.textStyle, ...styles.tagStyle }}>
{item.category.name.toUpperCase()}
</Text> */}
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.thumbnail }} style={styles.imageStyle} />
      {item.stock > 0 ? (
        <Text style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,200,0,0.7)', color: "white", fontWeight: '700', fontSize: 10, paddingVertical: 2, paddingHorizontal: 4, borderRadius: 2, ...styles.textStyle }}>Available: {item.stock}</Text>
      ) : (
        <Text style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(200,0,0,0.7)', color: "white", fontWeight: '700', fontSize: 10, paddingVertical: 2, paddingHorizontal: 4, borderRadius: 2, ...styles.textStyle }}>Not Available</Text>)
      }
    </View>
    {/* bottom part */}
    <View style={{ padding: 10, flex: 1, width: "100%" }}>
      <Text style={[styles.textStyle, { fontWeight: 'bold', ...styles.textStyle, fontSize: 14, textTransform: 'uppercase' }]} numberOfLines={2} adjustsFontSizeToFit>
        {item.title}
      </Text>

      {/* brand, rating, price section */}
      <View style={{ justifyContent: 'center', flex: 1, width: "100%", alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ ...styles.textStyle, flex: 1, textTransform: 'capitalize' }} numberOfLines={1} adjustsFontSizeToFit >{item.brand}</Text>
          <Text style={{ ...styles.textStyle }} >⭐{item.rating}</Text>
        </View>

        {/* price section */}



        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%", alignItems: 'center' }}>


          <Text style={{ ...styles.textStyle }} >Price: </Text>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }} >
            <Text style={{ ...styles.textStyle }} adjustsFontSizeToFit numberOfLines={1}>


              <Text style={{ color: 'gray', fontWeight: '400', textDecorationLine: 'line-through' }} >
                ${item.price}
              </Text>
              {" "}
              <Text style={{ color: 'green', ...styles.textStyle }} >
                (-{item.discountPercentage}%)
              </Text>

              {" "}
              <Text style={{ color: 'tomato', fontWeight: 'bold', letterSpacing: 1, ...styles.textStyle }} >
                ${item.price - (item.price * (item.discountPercentage / 100)).toFixed(0)}
              </Text>

            </Text>

          </View>

        </View>

      </View>
    </View>
    <View style={{ width: '100%', backgroundColor: 'black', bottom: -1 }}>
      <Text style={{ color: 'white', textTransform: 'uppercase', textAlign: 'center', fontWeight: '800', marginBottom: 1 }}>{item.category}</Text>
    </View>
  </TouchableOpacity>
  )
}

export default GridItem

const PADDING = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF",
  },
  imageContainer: {
    width: '100%',
    height: Dimensions.get("window").height / 6,

  },
  itemStyle: {
    margin: PADDING * 2,
    alignItems: "center",
    borderRadius: 2 * PADDING,
    backgroundColor: "white",
    width: Dimensions.get("window").width / 2.2,

    elevation: 5,
    overflow: "hidden",

  },
  imageStyle: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  textStyle: {
    fontFamily: 'sans-serif-condensed'
  },
  tagStyle: {
    transform: [{ rotateZ: "-90deg" }],
    zIndex: 1,
    width: Dimensions.get("window").width / 3,
    position: "absolute",
    left: -(Dimensions.get("window").width / 8),
    top: Dimensions.get("window").height / 8,
    textAlign: "center",
    paddingVertical: PADDING,
    marginLeft: PADDING,
    backgroundColor: "rgba(0,255,0,0.4)",
    borderRadius: PADDING,
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 5,
    width: "95%",
    borderRadius: PADDING,
    margin: 5,
    fontFamily: 'sans-serif-light',
    alignItems: 'center',
    flexDirection: 'row'
  }
});