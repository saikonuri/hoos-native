import React, { Component } from "react";
import {
  Container,
  Title,
  Content,
  Footer,
  FooterTab,
  Left,
  Right,
  Body
} from "native-base";
import { StyleSheet, View, AsyncStorage, Text, TouchableWithoutFeedback, FlatList, TouchableOpacity } from "react-native";
import { Header, Avatar, Button, Icon } from "react-native-elements";
import { MapView } from "expo";
import { Font } from "expo";
import axios from "axios";
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import AddModal from './AddEventModal.js'
import LocationModal from './LocationModal.js'
import MyEventsModal from './MyEventsModal.js'
import mapStyle from '../assets/mapstyle.json'
import locations from '../assets/areas.json'
import fb from '../firebase.js'
import * as firebase from "firebase";
import server from './socket.js';

var url = 'http://192.168.1.180:4000'
// The three trends that we use to show how popular a location is on the map
const icons = ["trending-down", "trending-neutral", "trending-up"];

// The Home Component: Consists of Map, buttons to trigger Add and Edit Modals, and Logout button 
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      fontLoaded: false,
      events: [],
      addModal: false,
      numEvents: 0,
      locationModal: false,
      selectedLocation: "",
      myEventsModal: false,
      region:
        {
          latitude: 38.0329,
          longitude: -78.5135,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
    };
  }

  // Show Add Events Modal
  showModal() {
    this.setState({ addModal: true });
  }

  // Close Add Events Modal
  closeModal() {
    this.fetchEvents();
    this.setState({ addModal: false });
  }

  // Close LocationModal
  closeLocationModal() {
    this.fetchEvents();
    this.setState({ locationModal: false });
  }

  async componentWillMount() {
    await Font.loadAsync({
      bungee: require("../assets/fonts/Bungee-Regular.ttf"),
      acme : require("../assets/fonts/Acme-Regular.ttf"),
      arimo: require("../assets/fonts/Arimo-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }

  componentDidMount() {
    this.fetchEvents();

    server.on('newEvent',(event)=>{
      var arr = this.state.events;
      arr.push(event);
      this.setState({
        events: arr
      })
    });

    server.on('editEvent', (event)=>{
      if(event.going.includes(this.props.user.displayName)){
        alert(event.name + ' ' + 'has been edited!');
        this.fetchEvents();
      }
    })

    server.on('deleteEvent', (event) => {
      if(event.going.includes(this.props.user.displayName)){
        alert(event.name + ' ' + 'has been deleted!');
        this.fetchEvents();
      }
    })
  }

  fetchEvents() {
    axios.get(url + "/api/events")
      .then(res => {
        this.setState({
          events: res.data,
          numEvents: res.data.length
        })
      })
      .catch(function (error) {
        console.log('Request failure: ', error);
      });
  }

  logOut() {
    this.props.logOut();
  }

  // Adds Event on the front end (the map)
  addEvent(event){
    var arr = this.state.events;
    arr.push(event);
    var numEvents = this.state.numEvents;
    numEvents+=1;
    this.setState({
      addModal: false,
      events: arr,
      numEvents : numEvents
    });
    server.emit('newEvent',event);
  }

  // Gets number of events at location
  getCount(name) {
    let count = 0;
    this.state.events.map(event => {
      if (event.location === name) {
        count++;
      }
    })
    return count;
  }

  // Gets color scheme for the marker callout
  getColor(name) {
    let ratio = this.getCount(name) / (this.state.numEvents);
    if (ratio > 0.67) {
      return ["#065e02","#08c101"]
    }
    else if (ratio > 0.1) {
      return (
        ["#968504","#efde5d"]
      )
    }
    else {
      return (
        ["#800000",'#FF6347']
      )
    }
  }

  // Closes all Modals
  closeAll(){
    this.setState({ addModal: false, locationModal: false });
  }

  // Open the My Events Modal
  showMyEvents(){
    this.setState({
      myEventsModal: true
    })
  }

  // Close the My Events Modal
  closeMyEventsModal(){
    this.fetchEvents();
    this.setState({
      myEventsModal: false
    })
  }

  changeRegion(region){
    this.setState({region:region})
  }

  render() {
    let markers;
    markers = locations.map(marker => {
      let color = this.getColor(marker.name);
      return (
        <MapView.Marker
          coordinate={marker.coordinates}
          title={marker.name}
          key={marker.id}
        >
          <View style={{
            width: 24,
            height: 24,
            borderRadius: 24 / 2,
            borderWidth: 2,
            borderColor: color[0],
            backgroundColor: color[1]
          }}>
            
          </View>
          <MapView.Callout width={250}>
            <TouchableOpacity onPress={() => this.setState({ locationModal: true, selectedLocation: marker.name })}>
            <Text style={{ fontWeight: 'bold', color: color[1] }}>{marker.name}</Text>
            <View style={{flex: 1, flexDirection: 'row'}}>
            <Text>Number of Events: </Text>
            <Text style={{color: color[1]}}>{this.getCount(marker.name)}</Text>
            </View>
            </TouchableOpacity>
          </MapView.Callout>
        </MapView.Marker>

      )
    })

    let locModal;
    if (this.state.locationModal) {
      locModal = <LocationModal location={this.state.selectedLocation} closeModal={() => this.closeLocationModal()} user={this.props.user}/>
    }
    
    let addModal;
    if (this.state.addModal) {
      addModal = <AddModal closeModal={() => this.closeModal()} user={this.props.user} addEvent = {(event) => this.addEvent(event)}/>
    }

    let myEventsModal;
    if(this.state.myEventsModal){
      myEventsModal = <MyEventsModal events={this.state.events} closeModal={() => this.closeMyEventsModal()} user={this.props.user}/>
    }

    if(this.state.locationModal){
      return(
        <View>
          {locModal}
        </View>
      )
    }

    if(this.state.myEventsModal){
      return(
        <View>
          {myEventsModal}
        </View>
      )
    }
    else {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={this.state.region}
          onRegionChangeComplete = {(region) => this.changeRegion(region)}
        >
          {markers}
        </MapView>
        {addModal}
        <View style={styles.header}>
          <View>
            <Avatar
              medium
              rounded
              source={{
                uri: this.props.user.photoURL
              }}
            />
          </View>
          <View>
            {this.state.fontLoaded ? (
              <Text style={styles.name}>{this.props.user.displayName.toUpperCase()}</Text>
            ) : (
                <Text>"Welcome"</Text>
              )}
          </View>
          <View>
            <TouchableOpacity
              onPress={() => this.logOut()}
              style={{borderWidth:1,width: 50,borderColor: 'black',paddingVertical: 6, backgroundColor:'#e9967a',alignItems: 'center'}}
            >
            <Text style={{fontSize: 10}}>Log Out </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.nav}>
          <View style={styles.tab}>
            <TouchableOpacity
              style={{borderWidth:3,width: 120,borderColor: '#1e3c6d',paddingVertical: 9,paddingHorizontal: 15, backgroundColor:'orange',alignItems: 'center'}}
              onPress={() => this.showModal()}
            >
              <Text style={{fontSize: 17}}>Add Event</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tab}>
          <TouchableOpacity
          style={{borderWidth:3,width: 120, borderColor: '#1e3c6d',paddingVertical: 9,paddingHorizontal: 15, backgroundColor:'orange',alignItems: 'center'}}
          onPress = {() => this.showMyEvents()}
          >
          <Text style={{fontSize: 17}}>My Events</Text>
          </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity >
    );
  }
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "10%",
    right: 0,
    left: 0,
    position: 'absolute',
    zIndex: 1
  },
  name: {
    backgroundColor: "transparent",
    fontFamily: "arimo",
    fontSize: 22,
    color: '#1e3c6d',
    marginTop: "10%"
  },
  nav: {
    left: 0,
    right: 0,
    bottom: 20,
    height: 80,
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-around",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center"
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    borderWidth: 1
  }
});
