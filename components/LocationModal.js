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
import { StyleSheet, View, AsyncStorage, Text, Picker,ScrollView } from "react-native";
import { Header, Avatar, Button} from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import { MapView } from "expo";
import { Font } from "expo";
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
            arimo: require("../assets/fonts/Arimo-Regular.ttf"),
            raleway: require("../assets/fonts/Raleway-Black.ttf")
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
                <ModalEvent event={event} key={event._id} user={this.props.user} />
            )
        })
        return ( 
                <Animated.View style={[styles.modal,animStyle]}>
                    <Header
                        outerContainerStyles = {{height: '10%'}}
                        backgroundColor = '#E57200'
                        leftComponent= {<TouchableOpacity
                            onPress={() => {
                                this.props.closeModal();
                            }}
                        >
                            <Icon
                                name={"arrow-left"} size={20} color={'white'}
                            />
                        </TouchableOpacity>}
                        centerComponent =  {this.state.fontLoaded ? (
                            <Title style={{ fontFamily: 'raleway', fontSize: 18, color: 'white' }}>{this.props.location}</Title>
                        ) : (
                                <Title>{"Events at: "}{this.props.location}</Title>
                            )}
                    /> 
                    <ScrollView>
                        {events}
                    </ScrollView>
                </Animated.View>
        );
    }
}

const styles = {
    modal: {
        backgroundColor: '#DCDCDC',
        height: '100%'
    },
    form: {
        flex: 1,
        flexDirection: 'column',
        alignItems:'center'
    }
}