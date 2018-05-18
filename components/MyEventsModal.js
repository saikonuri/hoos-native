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
import axios from "axios";
import { locale } from 'moment';
import { LinearGradient } from 'expo';
import ModalEvent from './ModalEvent.js'

const url = "http://192.168.1.180:4000"

export default class MyEventsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false,
            events: this.props.events,
            fadeValue : new Animated.Value(0)
        }
    }

    async componentWillMount() {
        await Font.loadAsync({
            bungee: require("../assets/fonts/Bungee-Regular.ttf"),
            arimo: require("../assets/fonts/Arimo-Regular.ttf")
        });

        this.setState({
            fontLoaded: true,
        });
    }

    componentDidMount() {
        Animated.timing(                  
            this.state.fadeValue,           
            {
              toValue: 1,                  
              duration: 700, 
            }
          ).start(); 
    }

    updateEvents(event){
        let events = []
        this.state.events.map(e => {
            if (e._id !== event._id){
                events.push(e)
            }
        })
        this.setState({events: events})
    }

    render() {
        const animStyle = {opacity: this.state.fadeValue};
        let myEvents = this.state.events.map(event => {
            if(event.going.includes(this.props.user.displayName)){
                editable = (event.creator == this.props.user.email) 
                return (
                    <ModalEvent event={event} key={event._id} user={this.props.user} editable = {editable} updateEvents={(event) => this.updateEvents(event)}/>
                )
            }
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
                            <Title style={{ fontFamily: 'arimo', fontSize: 18, color: 'white' }}>My Events</Title>
                        ) : (
                                <Title>My Events</Title>
                            )}
                        {myEvents}
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