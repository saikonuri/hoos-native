import { TouchableOpacity, TouchableWithoutFeedback, Modal, ScrollView, Animated } from 'react-native'
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
            events: [],
            fadeValue : new Animated.Value(0)
        }
    }

    async componentWillMount() {
        await Font.loadAsync({
            bungee: require("../assets/fonts/Bungee-Regular.ttf"),
            arimo: require("../assets/fonts/Arimo-Regular.ttf")
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
        });
        Animated.timing(                  
            this.state.fadeValue,           
            {
              toValue: 1,                  
              duration: 700, 
            }
          ).start(); 
    }

    render() {
        const animStyle = {opacity: this.state.fadeValue};
        let events = this.state.events.map(event => {
            return (
                <ModalEvent event={event} key={event.key} />
            )
        })
        return ( 
                <Animated.View style={[styles.modal,animStyle]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.closeModal();
                        }}
                        style={styles.close}
                    >
                        <Icon
                            name={"close-box"} type="material-community" size={28}
                        />
                    </TouchableOpacity>
                    <View style={styles.form}>

                        {this.state.fontLoaded ? (
                            <Title style={{ fontFamily: 'arimo', fontSize: 15, color: '#660033' }}>{this.props.location}</Title>
                        ) : (
                                <Title>{"Events at: "}{this.props.location}</Title>
                            )}
                        <ScrollView style={{ flex: 1, flexDirection: 'column'}}>
                            {events}
                        </ScrollView>
                    </View>
                </Animated.View>
        );
    }
}

const styles = {
    modal: {
        ...StyleSheet.absoluteFillObject,
        marginTop: 100,
        backgroundColor: '#FFEFD5',
        borderRadius: 30,
        height: 600,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 5,
        borderColor: '#1e3c6d'
    },
    close: {
        marginTop: 8,
        marginLeft: 4,
        width: 50
    },
    form: {
        width: 300,
        marginLeft: '6%',
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'space-around'
    }
}