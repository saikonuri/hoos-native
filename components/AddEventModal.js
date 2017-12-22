import { TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import { FormLabel, FormInput } from 'react-native-elements'
import React, { Component } from "react";
import {
    Container,
    Title,
    Content,
    Footer,
    FooterTab,
    Left,
    Right,
    Body,
    Icon
} from "native-base";
import { StyleSheet, View, AsyncStorage, Text } from "react-native";
import { Header, Avatar, Button } from "react-native-elements";
import { MapView } from "expo";
import { Font } from "expo";
import axios from "axios";

export default class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false
        }
    }

    async componentWillMount() {
        await Font.loadAsync({
            bungee: require("../assets/fonts/Bungee-Regular.ttf")
        });
        this.setState({
            fontLoaded: true
        });
    }

    render() {
        return (
            <Modal
                visible={this.props.visible}
                animationType={'slide'}
                onRequestClose={() => this.props.closeModal()}
                style={styles.modal}>
                <View style={styles.innerContainer}>
                    {this.state.fontLoaded ? (
                        <Text style={styles.FormTitle}>Add Event</Text>
                    ) : (
                            <Text>"Add Event"</Text>
                        )}
                    <FormLabel>Name</FormLabel>
                    <FormInput />
                    <FormLabel>Location</FormLabel>
                    <FormInput />
                    <FormLabel>Date</FormLabel>
                    <FormInput />
                    <FormLabel>Time</FormLabel>
                    <FormInput />
                    <View flexDirection="row" justifyContent="center">
                        <Button
                            onPress={() => this.props.closeModal()}
                            title="Add"
                            borderRadius={30}
                            backgroundColor="black"
                        >
                        </Button>
                        <Button
                            onPress={() => this.props.closeModal()}
                            title="Cancel"
                            borderRadius={30}
                            backgroundColor="black"
                        >
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = {
    innerContainer: {
        backgroundColor: "white"
    },
    FormLabel: {
        color: "white"
    },
    FormTitle: {
        textAlign: "center",
        fontSize: 25,
        fontFamily: "bungee",
        color: "black",
    },
    modal: {
        top: 70
    }
}