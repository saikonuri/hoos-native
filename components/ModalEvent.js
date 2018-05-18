import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage, Text, Picker,TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { Header, Avatar, Button, Icon } from "react-native-elements";
import { Font } from "expo";
import PopupDialog from 'react-native-popup-dialog';
import EventInfo from './EventInfo.js'
import EditModal from './EditEventModal.js'
var moment = require('moment');

const url = "http://192.168.1.180:4000";

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
            edit: false
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

         axios({
            method: 'put',
            url: url + '/api/events/'+event._id,
            data: body
        })
            .then((res) => {
                this.props.updateModal(res.data)
            })
            .catch((error) => {
                console.log(error);
        });
    }

    editEvent(body){
        this.setState({edit: false, event: body})
    }

    openEdit(){
        this.setState({edit: true})
    }

    closeEditModal(){
        this.setState({edit: false})
    }

    deleteEvent(){
        console.log("deleting")
    }

    render(){
        let event = this.props.event;
        let info;
        if (this.state.showDescription || this.state.showGoing){
           info =  <EventInfo 
                    going = {this.state.event.going} description = {this.state.event.description}
                    showGoing = {this.state.showGoing}
                    showDescription = {this.state.showDescription}
                    />
        }

        if(!this.props.editable){
            return(
                <View style={styles.box}>
                        <View style={styles.title}>
                            <Text style={{ fontWeight: 'bold', fontSize: 17, color:'orange'}}>{event.name}</Text>
                            <TouchableOpacity onPress={()=>this.setState({showDescription:!(this.state.showDescription),showGoing:false})}>
                                <Icon name={"information"} type="material-community" size={17} color={'white'}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.setState({showGoing: !(this.state.showGoing),showDescription: false})}>
                                <Icon name={"account-multiple"} type="material-community" size={17} color={'white'}/>
                            </TouchableOpacity>
                            <Text style={{color:'white'}}> {this.convert(event.startDate)} - {this.convert(event.endDate)} </Text>
                        </View>
                        <View style={styles.selection}>
                        {!this.state.going ? (<TouchableOpacity 
                            style={{borderWidth:1,borderRadius:20,borderColor: 'black',paddingHorizontal: 40,paddingVertical: 6, backgroundColor:'#ADD8E6'}}
                            onPress= {()=>this.updateStatus()}
                            >
                            <Text>Go</Text>
                        </TouchableOpacity>):(<TouchableOpacity 
                            style={{borderWidth:1,borderRadius:20,borderColor: 'black',paddingHorizontal: 40,paddingVertical: 6, backgroundColor:'#FFA07A'}}
                            onPress= {()=>this.updateStatus()}
                            >
                            <Text>Don't Go</Text>
                        </TouchableOpacity>)}
                        {info}
                        </View>
                        
                </View>
            );
        }

        else{
            if(!this.state.edit){
            return(
            <View style={styles.box}>
                        <View style={styles.title}>
                            <Text style={{ fontWeight: 'bold', fontSize: 17, color:'orange'}}>{event.name}</Text>
                            <TouchableOpacity onPress={()=>this.setState({showDescription:!(this.state.showDescription),showGoing:false})}>
                                <Icon name={"information"} type="material-community" size={17} color={'white'}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.setState({showGoing: !(this.state.showGoing),showDescription: false})}>
                                <Icon name={"account-multiple"} type="material-community" size={17} color={'white'}/>
                            </TouchableOpacity>
                            <Text style={{color:'white'}}> {this.convert(event.startDate)} - {this.convert(event.endDate)} </Text>
                        </View>
                        <View style={styles.selection}>
                        <TouchableOpacity 
                            style={{borderWidth:1,borderRadius:20,borderColor: 'black',paddingHorizontal: 40,paddingVertical: 6, backgroundColor:'#ADD8E6'}}
                            onPress= {()=>this.openEdit()}
                            >
                            <Text>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{borderWidth:1,borderRadius:20,borderColor: 'black',paddingHorizontal: 40,paddingVertical: 6, backgroundColor:'#FFA07A'}}
                            onPress= {()=>this.deleteEvent()}
                            >
                            <Text>Delete</Text>
                        </TouchableOpacity>
                        {info}
                        </View>
                </View>
            );
        }
        else{
            return(
                <EditModal event = {this.state.event} editEvent = {(body) => this.editEvent(body)} closeModal = {() => this.closeEditModal()}/>
            )
        }
        }
    }
};

const styles = {
    box:{
        borderWidth: 1,
        borderRadius: 20,
        borderColor:'#ADD8E6',
        marginTop: 7,
        width: 350
    },
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