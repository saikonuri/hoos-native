import { TouchableOpacity, TouchableWithoutFeedback, Animated, Dimensions} from 'react-native'
import Modal from 'react-native-modal';
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
    Item
} from "native-base";
import { StyleSheet, View, AsyncStorage, Text, Picker } from "react-native";
import { Header, Avatar, Button, Input, Icon } from "react-native-elements";
import { MapView } from "expo";
import { Font } from "expo";
import locations from '../assets/areas.json'
import axios from "axios";
import { locale } from 'moment';
import * as firebase from "firebase";
import fb from "../firebase.js";
import { Dropdown } from 'react-native-material-dropdown';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import DateTimePicker from 'react-native-modal-datetime-picker';
var moment = require('moment');

var url = 'https://mighty-castle-27764.herokuapp.com';
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
            openStart: false,
            visible: true
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
        let cur = new Date();
        let today = false
        if(obj.setHours(0,0,0,0) == cur.setHours(0,0,0,0)) {
            today = true
        }
        obj = new Date(date);
        let hour = obj.getHours();
        let mins = obj.getMinutes();

        if(today){
            var ret =  "Today " + this.time(hour,mins);
        }
        else{
            var ret =  "Tomorrow " + this.time(hour,mins);
        }
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
                    <View style={{ width: '100%', marginTop: '5%'}}>
                    <Title style={{ fontFamily: 'raleway',fontSize: 16, color: 'black', marginTop: '4%'}}>Edit{' '} {this.props.event.name}</Title>
                    <View style={styles.form}>
                                <Title style={{fontFamily: 'raleway', color: '#232D4B'}}>{'Name'}</Title>
                                <Input 
                                containerStyle={styles.input}
                                inputContainerStyle={{marginRight: '2%', marginLeft: '2%', borderColor: 'white'}} 
                                onChangeText={(text) => this.setState({ name: text })}
                                value = {this.state.name}
                                leftIcon = {<Icon
                                    name='ios-american-football'
                                    type='ionicon'
                                    color='#517fa4'
                                  />}
                                  inputStyle={{fontFamily: 'ralewayRegular', color: '#E57200'}}
                                />
                                 <Title style={{fontFamily: 'raleway', color: '#232D4B', marginTop: '10%'}}>{'Description'}</Title>
                                <Input 
                                containerStyle={styles.input} 
                                inputContainerStyle={{marginRight: '2%', marginLeft: '2%',borderColor: 'white'}} 
                                onChangeText={(text) => this.setState({ description: text })}
                                value = {this.state.description}
                                leftIcon = {<Icon
                                    name='description'
                                    color='#517fa4'
                                  />}
                                  inputStyle={{fontFamily: 'ralewayRegular', color: '#E57200'}}
                                />     
                    </View> 
                    <Title style={{color:'black',fontFamily: 'raleway', color: '#232D4B', marginTop: '10%'}}>Start Time</Title>
                        <View style={{flexDirection: 'row', width: '100%'}}>
                        <TouchableOpacity onPress={() => this.setState({openStart: true})} style={{width: '15%', marginLeft: '10%'}}>
                            <Icon name="calendar-clock" type="material-community" size={32} color='#517fa4'/>
                            <Text style={{color: 'orange', fontFamily: 'ralewayMedium'}}> Select </Text>
                        </TouchableOpacity>
                        {this.state.startDate == null ? (
                            <Text/>
                        ):(
                                <Text style={{marginLeft: '30%', marginTop: '5%', fontFamily: 'ralewayRegular',fontSize: 17, color: '#E57200'}}>{this.convert(this.state.startDate)}</Text> 
                        )}
                        </View>
                        <DateTimePicker
                            isVisible={this.state.openStart}
                            onConfirm={(date) => {
                                this.setState({startDate: date, openStart: false})
                            }}
                            onCancel={() => this.setState({openStart: false})}
                            mode = {'datetime'}
                            minimumDate = {new Date()}
                            maximumDate = {new Date(new Date().getTime()+(24*60*60*1000))}
                            date = {this.state.startDate == null ? (new Date()):(new Date(this.state.startDate))}
                        />
                        <Title style={{color:'black',fontFamily: 'raleway', color: '#232D4B', marginTop: '10%'}}>Location</Title>
                        <Dropdown
                            onChangeText={(itemValue, itemIndex) => this.setState({ selectedLocation: itemValue })}
                            data = {pickerItems}
                            pickerStyle = {{width: 380, borderWidth: 1.5}}
                            itemTextStyle = {{fontFamily: 'ralewayMedium', fontSize: 17}}
                            baseColor='black'
                            lineWidth= {1}
                            selectedItemColor = '#E57200'
                            style={{fontFamily: 'ralewayRegular'}}
                            textColor = '#E57200'
                            inputContainerStyle={{marginRight: '5%',marginLeft: '5%'}}
                            value = {this.state.selectedLocation}
                            />   
                        <View style={{display: 'flex',flexDirection: 'column',alignItems: 'center',marginTop: '8%'}}>     
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
                            titleStyle={{fontFamily: this.state.fontLoaded ? ('raleway') : ('Helvetica'), fontSize: 14.5}}
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
                            marginTop: 18,
                            marginBottom: 4
                          }}
                        title = "Cancel"
                        titleStyle = {{color: '#232D4B',fontFamily: this.state.fontLoaded ? ('raleway') : ('Helvetica'), fontSize: 14.5}}
                        />
                        </View>
                        <ConfirmDialog
                        title="Confirm Event"
                        message="Are you sure about creating this event?"
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
                    </View>
        );
    }
}

const styles = {
    modal: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        height: '100%'
    },
    form: {
        width: '100%',
        marginTop: '5%',
        alignItems: 'center'
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
    },
    input: {
        borderWidth: 2,
        borderColor: '#232D4B',
        marginLeft: '10%',
        marginRight: '10%',
        borderRadius: 8,
        marginTop: '2%'
    }
}