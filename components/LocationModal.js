import { TouchableOpacity, TouchableWithoutFeedback, Modal, FlatList, Animated } from 'react-native'
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
import ModalEvent from './ModalEvent.js'
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
                <ModalEvent event={event} key={event._id} user={this.props.user} editable={event.creator == (this.props.user.email)} />
            )
        })
        return ( 
                <Animated.ScrollView style={[styles.modal,animStyle]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.closeModal();
                        }}
                        style={styles.close}
                    >
                        <Icon
                            name={"close-box"} type="material-community" size={28} color={'white'}
                        />
                    </TouchableOpacity>
                    <View style={styles.form}>
                        {this.state.fontLoaded ? (
                            <Title style={{ fontFamily: 'arimo', fontSize: 18, color: 'white' }}>{this.props.location}</Title>
                        ) : (
                                <Title>{"Events at: "}{this.props.location}</Title>
                            )}
                        {events}
                    </View>
                </Animated.ScrollView>
        );
    }
}

const styles = {
    modal: {
        backgroundColor: '#1e3c6d',
        height: '100%'
    },
    close: {
        marginTop: 40,
        marginLeft: 4,
        width: 50
    },
    form: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems:'center'
    }
}