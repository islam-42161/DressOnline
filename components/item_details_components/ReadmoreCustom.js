import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState } from "react";
import { useCallback } from "react";

const ReadmoreCustom = ({ descriptiveText, textstyle, numberOfLines }) => {
  const [show, setShow] = useState(true);
  const [lengthMore, setLengthMore] = useState(false);
  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= numberOfLines); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {/* <ReadmoreCustom descriptiveText={"Lorem ipsum dolor sit amet. Aut voluptas velit ut tenetur quibusdam sit quia molestias. Ut quam beatae aut repellat numquam qui fugiat maxime et enim sunt qui minus veniam a earum ipsum. </p><p>Sit pariatur iste sit asperiores tenetur quo porro neque ex dolorum vitae? Et assumenda sunt est perspiciatis pariatur non magni voluptatem non perspiciatis sequi sit voluptatem voluptas sit quod consequatur aut unde dolorem. </p><p>Sit dolorum deserunt et sequi quia sit quisquam veniam et nisi rerum cum odio dolores 33 nihil soluta? Sit perspiciatis commodi aut quam rerum ea architecto tempora"} numberOfLines={lines} textstyle={{ fontFamily:'sans-serif-condensed',lineHeight: 21, fontSize: 14}} /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          onTextLayout={onTextLayout}
          style={textstyle}
          numberOfLines={show ? numberOfLines : undefined}
        >
          {descriptiveText}
        </Text>
        {lengthMore && (
          <Text
            style={[
              textstyle,
              {
                fontSize: 12,
                color: "#3ca98b",
                backgroundColor: "#e2f9de",
                paddingHorizontal: 5,
                alignSelf: "flex-start",
                marginTop: 10,
                borderRadius: 5,
              },
            ]}
            onPress={() => setShow(!show)}
          >
            {show ? "Read more" : "Read less"}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ReadmoreCustom;

const styles = StyleSheet.create({});
