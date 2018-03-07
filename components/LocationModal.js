import { TouchableOpacity, TouchableWithoutFeedback, Modal, ScrollView } from 'react-native'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
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
    Form,
    Item,
    Input
} from "native-base";
import { StyleSheet, View, AsyncStorage, Text, Picker } from "react-native";
import { Header, Avatar, Button, Icon } from "react-native-elements";
import { MapView } from "expo";
import { Font } from "expo";
import TimePicker from './TimePicker.js'
import locations from '../assets/areas.json'
import axios from "axios";
import { locale } from 'moment';
import ModalEvent from './LocationModalEvent.js'
import { LinearGradient } from 'expo';

const url = "http://192.168.1.180:4000"

export default class LocationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false,
            events: []
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

    componentDidMount() {
        axios.get(url + "/api/events/location/" + this.props.location).then(res => {
            this.setState({
                events: res.data
            })
        }).catch(err => {
            console.log(err);
        })
    }

    render() {
        let events = this.state.events.map(event => {
            return (
                <ModalEvent event={event} key={event.key} />
            )
        })
        return (
            <Modal
                visible={this.props.visible}
                animationType='slide'
                transparent={true}
            >
                <View style={styles.modal}>

                    <TouchableOpacity
                        onPress={() => {
                            this.props.closeModal();
                        }}
                        style={styles.close}
                    >
                        <Icon
                            name={"close-box"} type="material-community"
                        />
                    </TouchableOpacity>
                    <View style={styles.form}>

                        {this.state.fontLoaded ? (
                            <Title style={{ fontFamily: 'bungee', fontSize: 13.5 }}>{this.props.location}</Title>
                        ) : (
                                <Title>{"Events at: "}{this.props.location}</Title>
                            )}
                        <ScrollView style={{ flex: 1, flexDirection: 'column'}}>
                            {events}
                        </ScrollView>
                        <View style={{ width: 150, marginLeft: 75 }}>
                            <Button
                                small
                                borderRadius={30}
                                title="Cancel"
                                backgroundColor="black"
                                onPress={() => this.props.closeModal()}
                            />
                        </View>
                    </View>
                </View>
            </Modal >
        );
    }
}

const styles = {
    modal: {
        marginTop: 100,
        backgroundColor: '#FFEFD5',
        borderRadius: 30,
        height: 600,
        marginLeft: 20,
        marginRight: 20,
    },
    close: {
        marginTop: 8,
        marginLeft: 8,
        width: 20
    },
    form: {
        width: 300,
        marginLeft: '6%',
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'space-around'
    }
}