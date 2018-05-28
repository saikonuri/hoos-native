import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage, Text, Picker,TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { Header, Avatar, Button, Icon} from "react-native-elements";
import {Title} from "native-base"
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { Font } from "expo";
import PopupDialog from 'react-native-popup-dialog';
import EventInfo from './EventInfo.js'
import EditModal from './EditEventModal.js'
var moment = require('moment');
import { ConfirmDialog } from 'react-native-simple-dialogs';
import server from './socket.js'

var url = 'http://192.168.1.180:4000'


export default class ModalEvent extends Component{
    constructor(props){
        super(props);
        this.state = {
            event: this.props.event,
            fontLoaded: false,
            created: false,
            going: false,
            showDescription: false,
            showGoing: false,
            edit: false,
            confirmDelete: false
        }
    }

    async componentWillMount() {
        await Font.loadAsync({
            bungee: require("../assets/fonts/Bungee-Regular.ttf"),
            raleway: require("../assets/fonts/Raleway-Black.ttf"),
            ralewayExtraLight: require("../assets/fonts/Raleway-ExtraLight.ttf"),
            ralewayRegular: require("../assets/fonts/Raleway-Regular.ttf"),
            ralewayMedium: require("../assets/fonts/Raleway-Medium.ttf")
        });
        this.setState({
            fontLoaded: true
        });

        this.getGoing();
    }

    componentDidMount(){
        server.on('updateGoing',(event) => {
            if(event._id == this.state.event._id){
                this.setState({
                    event: event
                })
            }
        })

        server.on('editEventInModal',(event) => {
            if(event._id == this.state.event._id){
                this.setState({
                    event: event
                })
            }
        })
    }

    getGoing(){
        if(this.state.event.going.includes(this.props.user.displayName)){
            this.setState({going: true})
        }
    }

    closeInfo(){
        this.setState({
           info: false 
        })
    }

    time(hours,mins){
        let h; 
        let m = mins
        let t;
        if(hours < 12){
            t = "AM"
            h = hours.toString()
            if(h == 0){
                h = 12
            }
        }
        else{
            t = "PM"
            h = (hours - 12).toString();
            if(h == 0){
                h = 12;
            }
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

    updateStatus(){
         let status = this.state.going;
         let event = this.state.event;
         let arr = this.state.event.going;
         let exists = (this.state.event.going.indexOf(this.props.user.displayName) > -1)
         if(status){
            arr = arr.filter(item => item !== this.props.user.displayName)
         }
         else{ 
                if(!exists){
                    arr.push(this.props.user.displayName)
                }
         }
         event.going = arr;
         this.setState({
             going: !status,
             event: event
         })

         let body = {
             event: event
         }

         server.emit('updateGoing',body.event)

         axios({
            method: 'put',
            url: url + '/api/events/'+event._id,
            data: body
        })
            .then((res) => {
            })
            .catch((error) => {
                console.log(error);
        });
    }

    editEvent(body){
        server.emit('editEvent', body);
        this.setState({edit: false, event: body})
    }

    openEdit(){
        this.setState({edit: true})
    }

    closeEditModal(){
        this.setState({edit: false})
    }

    deleteEvent(){
        event = null
        axios.delete(url + '/api/events/'+this.state.event._id).then((res) => {
            event = res.data
            this.setState({confirmDelete: false})
            server.emit('deleteEvent', event);
            this.props.updateEvents(event)
        }).catch((error) =>{
            console.log(error)
        })
    }

    render(){
        let event = this.state.event;

        let going = this.state.event.going.map(person => {
            return(
                <Text key = {person} style={{marginLeft: 3, fontFamily: 'raleway'}}>{person}</Text>
            )
        }) 

        let edit =  <EditModal event = {this.state.event} editEvent = {(body) => this.editEvent(body)} closeModal = {() => this.closeEditModal()}/>

        if(!this.props.editable){
            return(
                <Card style={{borderRadius: 12}}>
                    <View style={{flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: '2%', borderBottomColor: '#232D4B', borderBottomWidth: 2}}>
                        <Title style={{fontFamily: 'raleway', fontSize: 25, marginLeft: '5%', color: '#232D4B'}}>{event.name}</Title>
                        <Text style={this.state.fontLoaded ? ({fontFamily: 'ralewayRegular', marginTop: 5, marginRight:'5%'}):({})}>{this.convert(event.startDate)}</Text>
                    </View>
                    <CardContent style={{marginTop: 5}}>
                        <View>
                            <Text style={this.state.fontLoaded ? ({fontFamily: 'ralewayExtraLight'}):({})}> {event.description}</Text>
                        </View>
                        <Text style={this.state.fontLoaded ? ({fontFamily: 'ralewayMedium', marginTop: 8, fontSize: 16,color: '#E57200'}):({})}> Going </Text>
                        <ScrollView horizontal style={{marginTop: 10}}>
                            {going}
                        </ScrollView>
                    </CardContent>
                    <CardAction  
                    inColumn={false}
                    style={{marginBottom: 8}}
                    >
                   {!this.state.going ? (<Button
                            onPress= {()=>this.updateStatus()}
                            title = "Go"
                            buttonStyle={{
                                backgroundColor: "#4caf50",
                                width: 70,
                                height: 30,
                                borderColor: "transparent",
                                borderWidth: 0,
                                borderRadius: 5,
                                marginLeft: '8%'
                              }}
                              titleStyle={{fontFamily: this.state.fontLoaded ? ('raleway') : ('Helvetica'), fontSize: 12}}
                            />   
                        ):(<Button
                            onPress= {()=>this.updateStatus()}
                            title = "Can't Go"
                            buttonStyle={{
                                backgroundColor: "#fa5a4e",
                                width: 80,
                                height: 30,
                                borderColor: "transparent",
                                borderWidth: 0,
                                borderRadius: 5,
                                marginLeft: '8%'
                              }}
                              titleStyle={{fontFamily: this.state.fontLoaded ? ('raleway') : ('Helvetica'), fontSize: 12}}
                            />   )}
                    </CardAction>
                </Card>
            );
        }

        else{
            return(
                <Card style={{borderRadius: 12}}>
                    <View style={{flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: '2%', borderBottomColor: '#232D4B', borderBottomWidth: 2}}>
                        <Title style={{fontFamily: 'raleway', fontSize: 25, marginLeft: '5%', color: '#232D4B'}}>{event.name}</Title>
                        <Text style={this.state.fontLoaded ? ({fontFamily: 'ralewayRegular', marginTop: 5, marginRight:'5%'}):({})}>{this.convert(event.startDate)}</Text>
                    </View>
                    <CardContent style={{marginTop: 5}}>
                        <View>
                            <Text style={this.state.fontLoaded ? ({fontFamily: 'ralewayExtraLight'}):({})}> {event.description}</Text>
                        </View>
                        <Text style={this.state.fontLoaded ? ({fontFamily: 'ralewayMedium', marginTop: 8, fontSize: 16,color: '#E57200'}):({})}> Going </Text>
                        <ScrollView horizontal style={{marginTop: 10}}>
                            {going}
                        </ScrollView>
                    </CardContent>
                    <CardAction  
                    inColumn={false}
                    style={{marginBottom: 8}}
                    >
                    <Button
                            onPress= {()=>this.openEdit()}
                            title = "Edit"
                            buttonStyle={{
                                backgroundColor: "#232D4B",
                                width: 70,
                                height: 30,
                                borderColor: "transparent",
                                borderWidth: 0,
                                borderRadius: 5,
                                marginLeft: '9%'
                              }}
                              titleStyle={{fontFamily: this.state.fontLoaded ? ('raleway') : ('Helvetica'), fontSize: 12}}
                            /> 
                    <Button
                            onPress= {()=>this.setState({confirmDelete:true})}
                            title = "Delete"
                            buttonStyle={{
                                backgroundColor: "#fa5a4e",
                                width: 70,
                                height: 30,
                                borderColor: "transparent",
                                borderWidth: 0,
                                borderRadius: 5,
                                marginLeft: '2%'
                              }}
                              titleStyle={{fontFamily: this.state.fontLoaded ? ('raleway') : ('Helvetica'), fontSize: 12}}
                            />   
                    </CardAction>
                    {this.state.edit ? (edit): (<View/>)}
                    <ConfirmDialog
                            title="Delete Event?"
                            message="Are you sure about deleting this event?"
                            visible={this.state.confirmDelete}
                            onTouchOutside={() => this.setState({confirmDelete: false})}
                            positiveButton={{
                                title: "YES",
                                onPress: () => this.deleteEvent()
                            }}
                            negativeButton={{
                                title: "NO",
                                onPress: () => this.setState({confirmDelete: false}) 
                            }}
                        />
                </Card>
            );
        }
    }
};

const styles = {
    
    title : {
        alignItems: 'center',
        marginTop:3
    },
    selection : {
        marginTop: 3,
        alignItems: 'center',
        marginBottom: 5
    }
}