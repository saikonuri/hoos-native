import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from "react-native";

import { Avatar, Button, SocialIcon } from "react-native-elements";

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

  googleLogIn() {
    this.props.googleLogIn();
  }

  facebookLogIn() {
    this.props.facebookLogIn();
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
        <Button
          small
          borderRadius={30}
          title="UVA Sign-In"
          backgroundColor="#f65314"
          onPress={() => this.googleLogIn()}
        />
        <Button
          small
          borderRadius={30}
          title="Facebook Sign In"
          backgroundColor="#3b5998"
          onPress={() => this.facebookLogIn()}
        />
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
