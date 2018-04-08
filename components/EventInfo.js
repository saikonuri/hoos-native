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

const url = "http://192.168.1.180:4000";

export default class EventModal extends Component{
    constructor(props){
        super(props);
       
    }

    render(){
        let people = this.props.going.map(p => {
            return(
                <Text key={p} style={{marginLeft: 15,color:'white'}}>{p}</Text>
            )
        })

        if(this.props.going.length == 0){
            people = <Text style={{marginLeft: 15,color:'white'}}>No One!</Text>
        }

        if(this.props.showGoing){
            return(
                    <View style={{flex: 1, flexDirection: 'column', width: 270, height:80}}>
                        <Title style={{marginTop: 5,color:'white'}}> Going </Title>
                        <ScrollView style={{marginTop: 2}}>
                            {people}
                        </ScrollView>   
                    </View>
            )
        }

        else{
            return(
                <View style={{flex: 1, flexDirection: 'column', width: 270, height: 80}}>
                    <Title style={{color:'white'}}> Description </Title>
                    <ScrollView style={{marginLeft: 15, marginTop: 10, height: 30}}>  
                        <Text style={{color:'white'}}>{this.props.description}</Text>
                    </ScrollView>   
                </View>
        )
        }
    }
};