import NetInfo from '@react-native-community/netinfo';
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux';
import { setConnection } from '../redux/slices/GlobalSlice';
import { SafeAreaView } from 'react-native-safe-area-context';


const NoInternet = () => {

  const dispatch = useDispatch()
  const {connected} = useSelector((state)=>{
    return{
      connected: state.globals.connected
    }
  })

  const [isDisplayed, setIsDisplayed] = useState(false);

  const AniamtedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView)
  useEffect(()=>{

    NetInfo.addEventListener(state => {
        const status = state.isConnected && state.isInternetReachable
        dispatch(setConnection(status))  
        
      })

      setIsDisplayed(false);
      if(connected){
        setTimeout(()=>{
          setIsDisplayed(true);
        },2000)
      }
  },[connected])
  
  
  if (!connected) {
    return (
      <AniamtedSafeAreaView style={styles.containerNoInternet} entering={FadeInUp} exiting={FadeOutUp}>
        <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit>You are offline</Text>
      </AniamtedSafeAreaView>
    )
  }
  else{
    if(!isDisplayed){
      return(
        <AniamtedSafeAreaView style={styles.containerInternet} entering={FadeInUp} exiting={FadeOutUp}>
        <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit>Online</Text>
      </AniamtedSafeAreaView>
      )
    }
    else{
      return null
    }
  }

}

export default NoInternet

const styles = StyleSheet.create({
  containerNoInternet: {
    color: 'white',
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: "100%",
  },
  containerInternet: {
    color: 'white',
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: "100%",
  },
  text: {
    margin: 5,
    fontWeight: 'bold',
    color: 'white',
  }
})