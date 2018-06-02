import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage, Text, Picker,TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { Header, Avatar, Button, Icon } from "react-native-elements";
import { Font } from "expo";
import PopupDialog from 'react-native-popup-dialog';
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
var moment = require('moment');
import server from './socket.js'

const url = 'https://mighty-castle-27764.herokuapp.com';

export default class EventInfo extends Component{
    constructor(props){
        super(props);
    }

    componentWillMount(){
        console.log(this.props.description)
    }

    render(){
        let people = this.props.going.map(p => {
            return(
                <Text key={p} style={{marginLeft: 15,color:'black'}}>{p}</Text>
            )
        })

        if(this.props.going.length == 0){
            people = <Text style={{marginLeft: 15,color:'black'}}>No One!</Text>
        }

        if(this.props.showGoing){
            return(
                    <View style={{height: 100,width: '100%'}}>
                        <Title style={{color:'black'}}> Going </Title>
                        <ScrollView>
                            {people}
                        </ScrollView>   
                    </View>
            )
        }

        else{
            return(
                <View style={{height: 100, width: '100%'}}>
                    <Title style={{color:'black'}}> Description </Title>
                    <ScrollView >  
                        <Text style={{color:'black'}}>{this.props.description}</Text>
                    </ScrollView>   
                </View>
        )
        }
    }
};