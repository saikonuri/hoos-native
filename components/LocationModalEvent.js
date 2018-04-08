import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage, Text, Picker,TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { Header, Avatar, Button, Icon } from "react-native-elements";
import { Font } from "expo";
import PopupDialog from 'react-native-popup-dialog';
import EventModal from './EventInfo.js'
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
            showGoing: false
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
            .then((res) => {})
            .catch((error) => {
                console.log(error);
        });
    }

    render(){
        let event = this.props.event;
        let info;
        if (this.state.showDescription || this.state.showGoing){
           info =  <EventModal 
                    going = {this.state.event.going} description = {this.state.event.description}
                    showGoing = {this.state.showGoing}
                    showDescription = {this.state.showDescription}
                    />
        }
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