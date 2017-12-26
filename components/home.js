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
import locations from '../assets/areas.json'
import mapStyle from '../assets/mapstyle.json'
const url = "https://shrouded-forest-95429.herokuapp.com";
const url2 = "http://192.168.1.160:4000"
import socketIOClient from 'socket.io-client'
const socket = socketIOClient(url);

const icons = ["trending-down", "trending-neutral", "trending-up"];

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      events: [],
      addModal: false,
      numEvents: 0
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
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents() {
    axios.get(url2 + "/api/events")
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

  test() {
    socket.emit('message', this.props.user.displayName);
  }

  getCount(name) {
    let count = 0;
    this.state.events.map(event => {
      if (event.location === name) {
        count++;
      }
    })
    return count;
  }

  returnIcon(name) {
    let ratio = this.getCount(name) / (this.state.numEvents);
    if (ratio > 0.67) {
      return (
        <Icon name={icons[2]} type="material-community" />
      )
    }
    else if (ratio > 0.33) {
      return (
        <Icon name={icons[1]} type="material-community" />
      )
    }
    else {
      return (
        <Icon name={icons[0]} type="material-community" />
      )
    }
  }

  getColor(name) {
    let ratio = this.getCount(name) / (this.state.numEvents);
    if (ratio > 0.67) {
      return "#28b21e"
    }
    else if (ratio > 0.33) {
      return (
        "#f9e140"
      )
    }
    else {
      return (
        "#f4563a"
      )
    }
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
            width: 30,
            height: 30,
            borderRadius: 30 / 2,
            borderWidth: 1,
            backgroundColor: color
          }}>
            {this.returnIcon(marker.name)}
          </View>
          <MapView.Callout width={250}>
            <Text style={{ fontWeight: 'bold' }}>{marker.name}</Text>
            <Text>Number of Events: {this.getCount(marker.name)}</Text>
            <Text style={{ color: "#3b79dd" }} onPress={() => console.log(marker.name + " pressed!")}>Click Here For Current Games</Text>
          </MapView.Callout>
        </MapView.Marker>

      )
    })

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
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    borderWidth: 1
  }
});
