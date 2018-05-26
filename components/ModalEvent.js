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
            bungee: require("../assets/fonts/Bungee-Regular.ttf")
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
        let year = obj.getFullYear().toString();
        let month = (obj.getMonth()+1).toString();
        let day = (obj.getDate());

        let hour = obj.getHours();
        let mins = obj.getMinutes();
        var ret = month+"/"+ day +"/" + year + " " + this.time(hour,mins);
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
        let info;
        if (this.state.showDescription || this.state.showGoing){
           info =  <EventInfo 
                    going = {this.state.event.going} description = {this.state.event.description}
                    showGoing = {this.state.showGoing}
                    showDescription = {this.state.showDescription}
                    />
        }

        let going = this.state.event.going.map(person => {
            return(
                <Text key = {person} style={{marginLeft: 10}}>{person}</Text>
            )
        }) 

        if(!this.props.editable){
            return(
                <Card >
                    <CardTitle
                    title={event.name}
                    subtitle ={this.convert(event.startDate)}
                    />
                    <CardContent>
                        <View>
                            <Text> {event.description}</Text>
                        </View>
                        <Title style={{marginTop: 5}}> Going </Title>
                        <ScrollView horizontal style={{marginTop: 20}}>
                            {going}
                        </ScrollView>
                    </CardContent>
                    <CardAction 
                    separator={true} 
                    inColumn={false}>
                   {!this.state.going ? (<CardButton
                            onPress= {()=>this.updateStatus()}
                            title = "Go"
                            />   
                        ):(<CardButton
                            onPress= {()=>this.updateStatus()}
                            title = "Don't Go"
                            />   )}
                    </CardAction>
                </Card>
            );
        }

        else{
            if(!this.state.edit){
            return(
                <Card >
                    <CardTitle
                    title={event.name}
                    subtitle ={this.convert(event.startDate)}
                    />
                    <CardContent>
                        <View>
                            <Text> {event.description}</Text>
                        </View>
                        <Title style={{marginTop: 5}}> Going </Title>
                        <ScrollView horizontal style={{marginTop: 20}}>
                            {going}
                        </ScrollView>
                    </CardContent>
                    <CardAction 
                    separator={true} 
                    inColumn={false}>
                    <CardButton
                            onPress= {()=>this.openEdit()}
                            title = "Edit"
                            /> 
                    <CardButton
                            onPress= {()=>this.setState({confirmDelete:true})}
                            title = "Delete"
                            />   
                    </CardAction>
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
        else{
            return (
                <EditModal event = {this.state.event} editEvent = {(body) => this.editEvent(body)} closeModal = {() => this.closeEditModal()}/>
            )
        }
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