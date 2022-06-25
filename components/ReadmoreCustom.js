import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'

const {height,width} = Dimensions.get('window');
const ReadmoreCustom = ({ descriptiveText, numberOfLines, style }) => {

    const [textShown, setTextShown] = useState(false); //To show ur remaining Text
    const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
    const toggleNumberOfLines = () => { //To toggle the show text or hide it
        setTextShown(!textShown);
    }

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
      };

    const onTextLayout = useCallback(e => {
        setLengthMore(e.nativeEvent.lines.length > numberOfLines); //to check the text is more than 4 lines or not
        // console.log(e.nativeEvent);
    }, []);
    return (
        <View style={styles.mainContainer}>
        <View style={styles.scrollStyle}>
            <ScrollView
            showsVerticalScrollIndicator={false}
            // onScroll={({nativeEvent}) => {
            //     if (isCloseToBottom(nativeEvent)) {
            //       // console.log('bottom');
            //     }
            //   }}
            >
                <Text
                    onTextLayout={onTextLayout}
                    numberOfLines={textShown ? undefined : numberOfLines}
                    style={style}
                    >{descriptiveText}</Text>
            </ScrollView>

        </View>
        {
               lengthMore ? <Text
                    onPress={toggleNumberOfLines}
                    style={{marginTop:10,fontSize:11, color: '#139576', backgroundColor: '#e2f9de', alignSelf: 'flex-start', paddingHorizontal: 5,paddingVertical:2, borderRadius: 5 }}>{textShown ? 'Read less' : 'Read more'}</Text>
                    : null
            }
        </View>
    )
}

export default ReadmoreCustom

const styles = StyleSheet.create({
    mainContainer: {
    flex:1
    },
    scrollStyle: {
        flex:1,
    },
})