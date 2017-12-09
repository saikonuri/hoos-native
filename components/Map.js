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

export default class Map extends Component {
  componentWillMount() {
    console.log(this.props.user);
  }
  render() {
    return (
      
    );
  }
}
