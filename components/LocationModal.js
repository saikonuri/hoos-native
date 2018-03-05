import { TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native'
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
        axios.get(url + "/api/events/" + this.props.location).then(res => {
            console.log(this.props.location)

            this.setState({
                events: res.data
            })
        }).catch(err => {
            console.log(err);
        })
    }

    going() {

    }

    render() {
        let events = this.state.events.map(event => {
            return (
                <View style={styles.events} key={event.key}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{event.name}</Text>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{
                            width: 24,
                            height: 24,
                            borderRadius: 24 / 2,
                            borderWidth: 1,
                            backgroundColor: "green"
                        }}>
                            <Icon
                                name={"check"} type="material-community"
                            />
                        </View>
                        <Text style={{ fontWeight: 'bold', fontSize: 13, marginLeft: 5 }}>Go</Text>
                    </View>
                </View>
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
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around' }}>
                            {events}
                        </View>
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
        backgroundColor: 'white',
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
    },
    events: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column'
    }
}