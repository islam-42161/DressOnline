import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated from 'react-native-reanimated'
import NetInfo from '@react-native-community/netinfo';




let offline=false;


const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
  offline = !(state.isConnected && state.isInternetReachable);
});
removeNetInfoSubscription();


const NoInternet = () => {
  return(
      <Animated.View style={styles.container}>
      {offline && (<Text style={styles.text}>No internet connection</Text>)}
    </Animated.View>
  )
}

export default NoInternet

const styles = StyleSheet.create({
  container:{
    marginTop:30,
    color:'white',
    backgroundColor:'red',
    alignItems:'center',
    justifyContent:'center',
    // position:'absolute',
    // top:0,
    // width:"100%"
  },
  text:{
    margin:5,
    fontWeight:'bold',
    color:'white',
  }
})