import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage, Text, Picker,TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { Header, Avatar, Button, Icon } from "react-native-elements";
import { Font } from "expo";
var moment = require('moment');

const url = "http://192.168.1.180:4000";

export default class ModalEvent extends Component{
    constructor(props){
        super(props);
        this.state = {
            status: null,
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

    convertDate(date){
        let ret = moment(date).isValid();
        console.log(ret);
        return "Date"
    }

    render(){
        let event = this.props.event;
        return(
            <View style={styles.box}>
                    <View style={styles.title}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, color:'#660033'}}>{event.name}</Text>
                        <Text> {event.startDate} - {event.endDate} </Text>
                    </View>
                    <View style={styles.selection}>
                    <TouchableOpacity style={{borderWidth:1,borderRadius:20,borderColor: 'black',paddingHorizontal: 40,paddingVertical: 6, backgroundColor:'#90EE90'}}>
                        <Text>Going</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderWidth:1,borderRadius:20,borderColor: 'black',paddingHorizontal: 40,paddingVertical: 6, backgroundColor:'#FFA07A'}}>
                        <Text>Not Going</Text>
                    </TouchableOpacity>
                    </View>
            </View>
        );
    }
};

const styles = {
    box:{
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'black',
        marginTop: 7
    },
    title : {
        alignItems: 'center',
        marginTop:3
    },
    selection : {
        marginTop: 3,
        display:'flex',
        flexDirection: 'row',
        justifyContent:'space-around',
        marginBottom: 5
    }
}