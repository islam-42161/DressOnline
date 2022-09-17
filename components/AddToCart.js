import { StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import Animated, { Extrapolate, Extrapolation, FadeInRight, FadeOutRight, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { useState } from 'react';

const AddToCart = ({ dispatch, setItems, items }) => {


    const [showExtra, setShowExtra] = useState(false)
    const shown = useSharedValue(0)




    const fadeOutStyle = useAnimatedStyle(() => {
        const translateX = interpolate(shown.value, [0, 1], [0, -50])
        const opacity = interpolate(shown.value, [0, 1], [0, 1])
        const scaleX = interpolate(shown.value, [0, 1], [0, 1])
        return {
            transform: [
                { scaleX },
                {
                    translateX
                }
            ],
            opacity
        }
    })

    const toggleView = (show) => {
        shown.value = show ? withTiming(1) : withTiming(0)
        setShowExtra(show)
    }



    const CartButton = ({ items, shown }) => {

        const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity)
        const iconStyle = useAnimatedStyle(() => {
            const iconColor = interpolateColor(shown.value, [0, 1], ['rgba(0,0,0,1)', 'rgba(255,255,255,1)'])
            return {
                color: iconColor
            }

        })
        const cartButtonStyle = useAnimatedStyle(() => {
            const backgroundColor = interpolateColor(shown.value, [0, 1], ['white', 'black'])
            return {
                backgroundColor
            }

        })
        const AnimatedIcon = Animated.createAnimatedComponent(Ionicons)
        return (
            <AnimatedButton activeOpacity={1} style={[styles.cartButton, cartButtonStyle]} onPress={() => toggleView(!showExtra)}>
                <AnimatedIcon name="ios-cart" size={24} style={iconStyle} />
                {items > 0 && (
                    <View style={{ position: 'absolute', right: -0, top: -0, width: 10, height: 10, backgroundColor: 'lightgreen', borderRadius: 5 }} />
                )}
            </AnimatedButton>
        )
    }

    return (
        <View style={styles.container}>


            <Animated.View style={[styles.cartExtras, fadeOutStyle]}>
                <TouchableWithoutFeedback
                    onPress={() => { dispatch(setItems(items + 1)) }}
                >
                    <Ionicons name="ios-add" size={24} color="black" />
                </TouchableWithoutFeedback>

                <Text style={{ marginHorizontal: 10 }}>{items}</Text>

                <TouchableWithoutFeedback
                    onPress={() => { if (items > 0) { dispatch(setItems(items - 1)) } }}
                    onLongPress={() => { dispatch(setItems(0)) }}
                    disabled={!items}
                >
                    <Ionicons name="ios-remove" size={24} color="black" />
                </TouchableWithoutFeedback>
            </Animated.View>




            <CartButton items={items} shown={shown} />


        </View>
    )
}

export default AddToCart

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        alignItems: 'center',
        // justifyContent: 'space-between',
        flexDirection: 'row',
    },
    cartButton: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17,
        elevation: 5
    },
    cartExtras: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopLeftRadius: 17,
        borderBottomLeftRadius: 17,
        // backgroundColor: 'pink',
        paddingLeft: 5,
        paddingRight: 20,
        height: "100%",
        position: 'absolute',
        left: -40,
    }
})