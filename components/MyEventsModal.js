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
import { StyleSheet, View, AsyncStorage, Text, Picker, ScrollView } from "react-native";
import { Header, Avatar, Button} from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import { MapView } from "expo";
import { Font } from "expo";
import axios from "axios";
import { locale } from 'moment';
import { LinearGradient } from 'expo';
import ModalEvent from './ModalEvent.js'

const url = 'https://mighty-castle-27764.herokuapp.com'

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
            arimo: require("../assets/fonts/Arimo-Regular.ttf"),
            raleway: require("../assets/fonts/Raleway-Black.ttf")
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
                            <Title style={{ fontFamily: 'raleway', fontSize: 18, color: 'white' }}>My Events</Title>
                        ) : (
                                <Title>My Events</Title>
                            )}
                    /> 
                    <ScrollView>
                        {myEvents}
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