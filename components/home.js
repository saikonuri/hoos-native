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
  Icon
} from "native-base";
import { StyleSheet, View, AsyncStorage, Text, TouchableWithoutFeedback } from "react-native";
import { Header, Avatar, Button } from "react-native-elements";
import { MapView } from "expo";
import { Font } from "expo";
import axios from "axios";
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import AddModal from './AddEventModal.js'
import locations from '../assets/areas.json'
import mapStyle from '../assets/mapstyle.json'
const url = "https://shrouded-forest-95429.herokuapp.com";
const url2 = "http://192.168.1.13:4000"
import socketIOClient from 'socket.io-client'
const socket = socketIOClient(url);



export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      events: [],
      addModal: false
    };
  }

  showModal() {
    this.setState({ addModal: true });
  }

  closeModal() {
    this.setState({ addModal: false });
  }

  async componentWillMount() {
    await Font.loadAsync({
      bungee: require("../assets/fonts/Bungee-Regular.ttf")
    });
    this.setState({
      fontLoaded: true
    });
    axios.get(url + "/api/events").then(res => {
      this.setState({
        events: res.data
      })
    }).catch(err => {

    })
  }

  logOut() {
    this.props.logOut();
  }

  test() {
    socket.emit('message', this.props.user.displayName);
  }

  render() {
    let markers;
    if (this.state.events.length > 0) {
      markers = locations.map(marker => (
        <MapView.Marker
          coordinate={marker.coordinates}
          title={marker.name}
          key={marker.id}
        >
          <View style={styles.circle} />
          <MapView.Callout>
            <Text style={{ width: 100 }}>{marker.name}</Text>
          </MapView.Callout>
        </MapView.Marker>
      ))
    }
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 38.0293,
            longitude: -78.4767,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          customMapStyle={mapStyle}
          provider={MapView.PROVIDER_GOOGLE}
        >
          {markers}
        </MapView>

        <AddModal visible={this.state.addModal} closeModal={() => this.closeModal()} user={this.props.user} />

        <View style={styles.header}>
          <View>
            <Avatar
              medium
              rounded
              source={{
                uri: this.props.user.photoURL
              }}
              onPress={() => this.test()}
            />
          </View>
          <View>
            {this.state.fontLoaded ? (
              <Text style={styles.name}>{this.props.user.displayName}</Text>
            ) : (
                <Text>"Welcome"</Text>
              )}
          </View>
          <View>
            <Button
              small
              borderRadius={30}
              title="Log Out"
              backgroundColor="black"
              onPress={() => this.logOut()}
            />
          </View>
        </View>

        <View style={styles.nav}>
          <View style={styles.tab}>
            <Button
              small
              borderRadius={30}
              title="Add Event"
              backgroundColor="black"
              onPress={() => this.showModal()}
            />
          </View>
          <View style={styles.tab}><Button
            small
            borderRadius={30}
            title="Home"
            backgroundColor="black"
          /></View>
          <View style={styles.tab}><Button
            small
            borderRadius={30}
            title="My Events"
            backgroundColor="black"
          /></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "10%",
    right: 0,
    left: 0,
    position: 'absolute'
  },
  name: {
    backgroundColor: "transparent",
    fontFamily: "bungee",
    fontSize: 20,
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
    width: 20,
    height: 20,
    borderRadius: 30 / 2,
    backgroundColor: 'rgba(255,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,0,0,1)'
  }
});
