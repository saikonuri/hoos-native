import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Button,
  Image
} from "react-native";

import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Left,
  Right,
  Body,
  Icon,
  Text
} from "native-base";

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  logIn() {
    this.props.logIn();
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{ width: 120, height: 120, marginBottom: "5%" }}
          source={{
            uri:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Virginia_Cavaliers_text_logo.svg/1200px-Virginia_Cavaliers_text_logo.svg.png"
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#000080",
            padding: 20,
            borderRadius: 50
          }}
          onPress={() => {
            this.logIn();
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20
            }}
          >
            {" "}
            Login
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            color: "#e65c00",
            fontSize: 40,
            marginTop: "10%"
          }}
        >
          Hoos Active
        </Text>
      </View>
    );
  }
}
