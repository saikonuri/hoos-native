import React, { Component } from "react";
import {
  Container,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text
} from "native-base";
import { StyleSheet, View, AsyncStorage } from "react-native";
import { Header, Avatar } from "react-native-elements";
import { MapView } from "expo";

export default class Home extends Component {
  componentWillMount() {
    console.log(this.props.user);
  }
  render() {
    return (
      <View style={styles.map}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 38.0293,
            longitude: -78.4767,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
        <View>
          <Header
            leftComponent={{ icon: "menu", color: "#fff" }}
            centerComponent={{
              text: this.props.user.displayName,
              style: { color: "#fff" }
            }}
            rightComponent={
              <Avatar
                small
                source={{
                  uri: this.props.user.photoURL
                }}
              />
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
