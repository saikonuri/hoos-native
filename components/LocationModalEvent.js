import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage, Text, Picker,TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { Header, Avatar, Button, Icon } from "react-native-elements";
import { Font } from "expo";

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

    render(){
        let event = this.props.event;
        return(
            <View>
                    <View style={styles.title}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20}}>{event.name}</Text>
                    </View>
                    <View style={styles.selection}>
                    <TouchableOpacity style={{borderWidth:1,borderColor: 'black',paddingHorizontal: 40,paddingVertical: 6, backgroundColor:'#90EE90'}}>
                        <Text>Going</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderWidth:1,borderColor: 'black',paddingHorizontal: 40,paddingVertical: 6, backgroundColor:'#FFA07A'}}>
                        <Text>Not Going</Text>
                    </TouchableOpacity>
                    </View>
            </View>
        );
    }
};

const styles = {
    title : {
        alignItems: 'center',
        marginTop:10
    },
    selection : {
        marginTop: 4,
        display:'flex',
        flexDirection: 'row',
        justifyContent:'space-around'
    },
    button :{
        borderWidth:1,
        borderColor: 'black',
        paddingHorizontal: 40,
        paddingVertical: 6
    }
}