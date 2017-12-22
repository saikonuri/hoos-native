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
import { StyleSheet, View, AsyncStorage, Text } from "react-native";
import { Header, Avatar, Button } from "react-native-elements";
import { MapView } from "expo";
import { Font } from "expo";
import axios from "axios";
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
const url = "https://shrouded-forest-95429.herokuapp.com";
const url2 = "http://192.168.1.13:4000"
import socketIOClient from 'socket.io-client'
const socket = socketIOClient(url);
socket.on('message', data => {
  alert(data);
})

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }
  async componentWillMount() {
    await Font.loadAsync({
      bungee: require("../assets/fonts/Bungee-Regular.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }

  logOut() {
    this.props.logOut();
  }

  test() {
    socket.emit('message', this.props.user.displayName);
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 38.0293,
            longitude: -78.4767,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
        <View style={{ height: 50 }}>
          <View style={styles.header}>
            <Avatar
              medium
              rounded
              source={{
                uri: this.props.user.photoURL
              }}
              onPress={() => this.test()}
            />
            <View>
              {this.state.fontLoaded ? (
                <Text style={styles.name}>{this.props.user.displayName}</Text>
              ) : (
                  <Text>"Welcome"</Text>
                )}
            </View>
            <Button
              small
              borderRadius={30}
              title="Log Out"
              backgroundColor="black"
              onPress={() => this.logOut()}
            />
          </View>
        </View>
        <BottomNavigation
          labelColor="white"
          rippleColor="white"
          style={{ height: 56, position: 'absolute', left: 0, bottom: 0, right: 0 }}
        >
          <Tab
            barBackgroundColor="#37474F"
            label="Add Event"
          />
          <Tab
            barBackgroundColor="#37474F"
            label="Main"
          />
          <Tab
            barBackgroundColor="#37474F"
            label="My Events"
          />
        </BottomNavigation>
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
    marginTop: "10%"
  },
  name: {
    backgroundColor: "transparent",
    fontFamily: "bungee",
    fontSize: 20,
    marginTop: "10%"
  },
  nav: {
    marginBottom: "1%"
  }
});
