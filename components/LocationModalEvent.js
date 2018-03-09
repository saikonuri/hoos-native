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

    time(hours,mins){
        let h; 
        let m = mins
        let t;
        if(hours < 12){
            t = "AM"
            h = hours.toString()
        }
        else{
            t = "PM"
            h = (hours - 12).toString();
        }

        if(mins < 10){
            m = "0" + mins;
        }

        return (h + ":" + m + " " + t);
    }

    convert(date){
        let obj = new Date(date);
        let year = obj.getFullYear().toString();
        let month = (obj.getMonth()+1).toString();
        let day = (obj.getDate());

        let hour = obj.getHours();
        let mins = obj.getMinutes();
        var ret = month+"/"+ day +"/" + year + " " + this.time(hour,mins);
        return ret
    }

    render(){
        let event = this.props.event;
        return(
            <View style={styles.box}>
                    <View style={styles.title}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17, color:'orange'}}>{event.name}</Text>
                        <Text style={{color:'white'}}> {this.convert(event.startDate)} - {this.convert(event.endDate)} </Text>
                    </View>
                    <View style={styles.selection}>
                    <TouchableOpacity style={{borderWidth:1,borderRadius:20,borderColor: 'black',paddingHorizontal: 40,paddingVertical: 6, backgroundColor:'#ADD8E6'}}>
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
        borderColor: '#ADD8E6',
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