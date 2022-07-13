import React, {useEffect, useRef} from "react";
import { Modal, StyleSheet, Text, Pressable, View, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AddCommentModal = ({ modalVisible, setModalVisible }) => {
    const commentTextRef = useRef();
    let inputText = "";
        const onSubmit = ()=>{
            if(inputText.length > 0){
            commentTextRef.current?.clear();
            // Processing comment
            setTimeout(()=>setModalVisible(false),500);
        }
        }
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }
        }
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalBackground}
                >
                <Pressable style={{ flex: 1 }} onPress={() =>setModalVisible(!modalVisible)} />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Comment</Text>
                    {/* <View style={{width:'100%',height:1,backgroundColor:'rgba(0,0,0,0.1)'}}/> */}
                    <TextInput style={styles.modalTextInput}
                        placeholder="Type your comment here"
                        placeholderTextColor="#000"
                        multiline={true}
                        blurOnSubmit
                        ref = {commentTextRef}
                        onLayout={()=>setTimeout(()=>commentTextRef.current?.focus(),100)}
                        onChangeText={(text)=>{inputText=text}}
                        onSubmitEditing={onSubmit}
                    />
                    <View style={styles.commentButtons}>

                        <MaterialCommunityIcons.Button name="close" size={15} color="white" style={{ backgroundColor: 'red' }}
                            onPress={() => setModalVisible(!modalVisible)}>
                            Close
                        </MaterialCommunityIcons.Button>

                        <MaterialCommunityIcons.Button name="send" size={15} color="white" onPress={onSubmit} >
                            Submit
                        </MaterialCommunityIcons.Button>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        width: "100%",
        height: '100%',
    },
    modalView: {
        backgroundColor: "white",
        padding: 10,
        alignSelf: 'center',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        position: 'absolute',
        height: "50%",
        width: '100%',
        bottom: 0
    },
    modalTextInput: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        flex: 1,
        width: '100%',
        start: 0,
        alignItems:'flex-start'

    },
    modalText: {
        margin: 5,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
    commentButtons: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical: 10
    }
});

export default AddCommentModal;