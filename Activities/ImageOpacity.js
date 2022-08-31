import { ActivityIndicator, Image, StyleSheet, Text, View, Animated as Anime, Button, ScrollView, Dimensions} from 'react-native'
import React, { useEffect,useRef,useState } from 'react'
import Animated from 'react-native-reanimated';

const {height,width} = Dimensions.get('window');

const ImageOpacity = () => {

    const scrollX = useRef(new Anime.Value(0)).current;

    const [data, setData] = useState(null);
    useEffect(() => {
        //fetch(`https://fakestoreapi.com/products/${serial}`)
        // fetch(`https://api.escuelajs.co/api/v1/products/1`)
        fetch(`https://dummyjson.com/products/8`)
          .then(res => res.json()).then(json => {
            setData(json);
          }).catch(err => { alert(`Could not load data: ${err}`) });
      }, [])

      let index = 0;






    return (
    <View style={styles.mainContainer}>
        {data === null ? (
        <ActivityIndicator size={'small'}/>
        ): 
        (



            <View style={styles.container}>


{

    data.images.map((image, index) => {
        const inputRange = [(index -1 )*width, (index)*width, (index+1)*width];
        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
        },
        )
        return (
            <Anime.View key={index} style={[StyleSheet.absoluteFillObject,{opacity:opacity}]}>
            <Image
            source={{ uri: image}}
            style={StyleSheet.absoluteFillObject}
            blurRadius={50}

            />
           </Anime.View>
        )
    })
}


                <Anime.ScrollView 
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContainer}
                onScroll={Anime.event(
                    // scrollX = e.nativeEvent.contentOffset.x
                    [{ nativeEvent: {
                         contentOffset: {
                           x: scrollX
                         }
                       }
                     }],
                    { useNativeDriver: true }
                  )}
                >
                    {
                        data.images.map((image, index) => {
                            return (
                                <View
                                key={index}
                                style={styles.imageContainer}>
                                <Image 
                                source={{uri: image}}
                                style={styles.image}
                                />
                                </View>
                            )
                        })
                        
                        }
                        
                    </Anime.ScrollView>

<ScrollView horizontal>
                    {
                        data.images.map((_, index) => {
                            return (
                                <Animated.View
                                key={index}
                                style={{
                                    width:10,
                                    height:10,
                                    borderRadius:5,
                                    marginRight:10,
                                    backgroundColor:'white'
                                }}
                                />
                            )
                        })
                    }
                    </ScrollView>
            </View>
        )
}
    </View>
    )}

export default ImageOpacity

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container:{
        height: height,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    scrollViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer:{
width: width-20,
height: height/3,
alignItems: 'center',
justifyContent: 'center',
    },
    image: {
        width:"80%",
        height:"80%",
        resizeMode:'cover',
        borderRadius:10,

    }
})