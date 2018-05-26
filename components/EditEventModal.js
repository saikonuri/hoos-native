import { TouchableOpacity, TouchableWithoutFeedback, Modal, Animated, Dimensions} from 'react-native'
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
let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

// The AddModal Component: When we create a new event, this modal pops up
export default class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false,
            selectedLocation: this.props.event.location,
            name: this.props.event.name,
            description: this.props.event.description,
            startDate: this.props.event.startDate,
            fadeValue : new Animated.Value(0),
            confirm: false,
            openStart: false
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

    confirmInputs(){
        let body = this.state
        if (body.name == ''){
            alert('Name field cannot be empty')
        }
        else if (body.startDate == null){
            alert('Please Select a Start Time')
        }
        else if (body.selectedLocation == null){
            alert("Please Select a Location")
        }
        else{
            this.setState({
                confirm: true
            })
        }
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

    editEvent() {
        let event = this.props.event;
        event.name = this.state.name;
        event.description = this.state.description;
        event.startDate = this.state.startDate;
        event.location = this.state.selectedLocation;

        axios({
            method: 'put',
            url: url + '/api/events/'+this.props.event._id,
            data: event
        })
            .then((res) => {})
            .catch((error) => {
                console.log(error);
        });
        this.props.editEvent(event);
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
                                <Title style={{ fontFamily: 'arimo',color:'orange',fontSize:20 }}>Edit {this.state.name}</Title>
                            ) : (
                                    <Title>Edit {this.state.name}</Title>
                                )}
                            <Item>
                                <Input style= {{color: '#ADD8E6'}} placeholder="Name of Event" placeholderTextColor="white" value={this.state.name} onChangeText={(text) => this.setState({ name: text })} />
                            </Item>
                            <Item>
                                <Input style= {{color: '#ADD8E6'}} placeholder="Description" placeholderTextColor="white"  value={this.state.description} onChangeText={(text) => this.setState({ description: text })} />
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
                            date = {new Date(this.state.startDate)}
                        />
                        {this.state.startDate == null ? (
                            <Text/>
                        ):(
                            <View style={{alignItems: 'center'}}>
                                <Text style={{color: '#ADD8E6', fontSize: 17}}>{this.convert(this.state.startDate)}</Text>
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
                            value = {this.state.selectedLocation}
                            />   
                        <View style={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>     
                        <Button
                            onPress= {()=>this.confirmInputs()}
                            buttonStyle={{
                                backgroundColor: "#232D4B",
                                width: 100,
                                height: 40,
                                borderColor: "transparent",
                                borderWidth: 0,
                                borderRadius: 5
                              }}
                            title = "Confirm"
                            fontSize= {14}
                            fontFamily = {this.state.fontLoaded ? ('raleway') : ('Helvetica')}
                        />
                        <Button 
                        onPress= {()=>this.props.closeModal()}
                        buttonStyle={{
                            backgroundColor: "transparent",
                            width: 100,
                            height: 40,
                            borderColor: "#232D4B",
                            borderWidth: 2,
                            borderRadius: 5,
                            marginTop: 18
                          }}
                        title = "Cancel"
                        fontSize= {14}
                        fontFamily = {this.state.fontLoaded ? ('raleway') : ('Helvetica')}
                        textStyle = {{color: '#232D4B'}}
                        />
                        </View>
                    </View>
                    <ConfirmDialog
                        title="Confirm Event"
                        message="Are you sure about editing this event?"
                        visible={this.state.confirm}
                        onTouchOutside={() => this.setState({confirm: false})}
                        positiveButton={{
                            title: "YES",
                            onPress: () => this.editEvent()
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
        backgroundColor: 'white',
        flex: 1,
        width: deviceWidth,
        height: deviceHeight/1.5,
        alignItems: 'center'
    },
    form: {
        width: '90%',
        marginTop: '5%',
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