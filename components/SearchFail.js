import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { color } from 'react-native-reanimated';

const {height,width} = Dimensions.get('window')
const SearchFail = ({query,color}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="sad-outline" size={width*0.5} color={color} />
      <Text style={styles.textStyle}>We couldn't find any result for '<Text style={styles.subText}>{query}</Text>'</Text>
    </View>
  )
}

export default SearchFail

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    textStyle:{
        fontSize:width*0.04,
        color:color,
        fontFamily:'sans-serif-light'
    },
    subText:{
        fontStyle:'italic',
        fontWeight:'bold'
    }
})