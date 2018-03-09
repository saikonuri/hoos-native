import { TouchableOpacity, TouchableWithoutFeedback, Modal, Animated } from 'react-native'
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
import { Header, Avatar, Button } from "react-native-elements";
import { MapView } from "expo";
import { Font } from "expo";
import TimePicker from './TimePicker.js'
import locations from '../assets/areas.json'
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';
import { locale } from 'moment';
import * as firebase from "firebase";
import fb from "../firebase.js";
import { Dropdown } from 'react-native-material-dropdown';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import DateTimePicker from 'react-native-modal-datetime-picker';
var moment = require('moment');

var url = 'http://192.168.1.180:4000';

// The AddModal Component: When we create a new event, this modal pops up
export default class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false,
            selectedLocation: 'Aquatics and Fitness Center',
            name: '',
            description: '',
            startDate: null,
            endDate: null,
            fadeValue : new Animated.Value(0),
            confirm: false,
            openStart: false,
            openEnd: false
        }
    }

    async componentWillMount() {
        await Font.loadAsync({
            bungee: require("../assets/fonts/Bungee-Regular.ttf"),
            acme: require("../assets/fonts/Acme-Regular.ttf"),
            arimo: require("../assets/fonts/Arimo-Regular.ttf")
        });
        this.setState({
            fontLoaded: true
        });
    }

    componentDidMount(){
        Animated.timing(                  
            this.state.fadeValue,           
            {
              toValue: 1,                  
              duration: 700, 
            }
          ).start();
    }

    createEvent() {
        let body = {
            name: this.state.name,
            description: this.state.description,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            location: this.state.selectedLocation,
            creator: this.props.user.email
        }
        axios({
            method: 'post',
            url: url + '/api/events',
            data: body
        })
            .then((res) => {})
            .catch((error) => {
                console.log(error);
            });
        this.props.closeModal();
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

    render() {
        let count = 0;
        let pickerItems = []
        locations.map(location => {
            pickerItems.push({
                value: location.name
            })
        })
        const animStyle = {opacity: this.state.fadeValue};

        return (
                <Animated.View style={[styles.modal,animStyle]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.closeModal();
                        }}
                        style={styles.close}
                    >
                        <Icon name="arrow-left" size={20} color={'white'}/>
                    </TouchableOpacity>
                    <View style={styles.form}>
                        <Form>
                            {this.state.fontLoaded ? (
                                <Title style={{ fontFamily: 'arimo',color:'orange',fontSize:20 }}>Add Event</Title>
                            ) : (
                                    <Title>"Add Event"</Title>
                                )}
                            <Item>
                                <Input style= {{color: '#ADD8E6'}} placeholder="Name of Event" placeholderTextColor="white"  onChangeText={(text) => this.setState({ name: text })} />
                            </Item>
                            <Item>
                                <Input style= {{color: '#ADD8E6'}} placeholder="Description" placeholderTextColor="white"  onChangeText={(text) => this.setState({ description: text })} />
                            </Item>
                        </Form>
                        <Title style={{ fontFamily: 'arimo',color:'white',fontSize:14 }}>Start Time</Title>
                        <TouchableOpacity onPress={() => this.setState({openStart: true})} style={{alignItems: 'center'}}>
                            <Icon name="clock-o" size={32} color='white'/>
                            <Text style={{color: 'orange'}}> Select </Text>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.openStart}
                            onConfirm={(date) => {this.setState({startDate: date, openStart: false})}}
                            onCancel={() => this.setState({openStart: false})}
                            mode = {'datetime'}
                            date = {this.state.startDate == null ? (new Date()):(this.state.startDate)}
                        />
                        {this.state.startDate == null ? (
                            <Text/>
                        ):(
                            <View style={{alignItems: 'center'}}>
                                <Text style={{color: '#ADD8E6', fontSize: 17}}>{this.convert(this.state.startDate)}</Text>
                            </View>
                        )}
                        
                        <Title style={{ fontFamily: 'arimo',color:'white',fontSize:14 }}>End Time</Title>
                        <TouchableOpacity onPress={() => this.setState({openEnd: true})} style={{alignItems: 'center'}}>
                            <Icon name="clock-o" size={32} color='white' />
                            <Text style={{color: 'orange'}}> Select </Text>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.openEnd}
                            onConfirm={(date) => {this.setState({endDate: date, openEnd: false});}}
                            onCancel={() => this.setState({openEnd: false})}
                            mode = {'datetime'}
                            date = {this.state.endDate == null ? (new Date()):(this.state.endDate)}
                        />
                        {this.state.endDate == null ? (
                            <Text/>
                        ):(
                            <View style={{alignItems: 'center'}}>
                                <Text style={{color: '#ADD8E6', fontSize: 17}}>{this.convert(this.state.endDate)}</Text>
                            </View>
                        )}
                        <Dropdown
                            label="Select a location"
                            onChangeText={(itemValue, itemIndex) => this.setState({ selectedLocation: itemValue })}
                            data = {pickerItems}
                            pickerStyle = {{width: 280, borderWidth: 1.5}}
                            baseColor='white'
                            lineWidth= {1.5}
                            selectedItemColor = 'orange'
                            textColor = '#ADD8E6'
                            />   
                        <View style={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>     
                        <TouchableOpacity 
                            onPress= {()=>this.setState({confirm: true})}
                            style={{borderWidth:1,width: 140,borderRadius:20,borderColor: 'black',paddingVertical: 6, backgroundColor:'#ADD8E6',alignItems: 'center',}}>
                            <Text>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress= {()=>this.props.closeModal()}
                        style={{marginTop: 10,borderWidth:1,width: 140,borderRadius:20,borderColor: 'black',paddingVertical: 6, backgroundColor:'#FFA07A', alignItems: 'center'}}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    <ConfirmDialog
                        title="Confirm Event"
                        message="Are you sure about creating this event?"
                        visible={this.state.confirm}
                        onTouchOutside={() => this.setState({confirm: false})}
                        positiveButton={{
                            title: "YES",
                            onPress: () => this.createEvent()
                        }}
                        negativeButton={{
                            title: "NO",
                            onPress: () => this.setState({confirm: false}) 
                        }}
                    />
                </Animated.View>
        );
    }
}

const styles = {
    modal: {
        marginTop: 100,
        backgroundColor: '#1e3c6d',
        borderRadius: 30,
        height: 600,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 5,
        borderColor: 'orange'
    },
    close: {
        marginTop: 8,
        marginLeft: 8,
        width: 20
    },
    form: {
        width: 300,
        marginLeft: '6%',
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    button:{
        borderWidth:1,
        borderRadius:20,
        borderColor: 'black',
        paddingHorizontal: 40,
        paddingVertical: 6, 
        backgroundColor:'#90EE90',
        width: 70,
        alignItems: 'center'
    }
}