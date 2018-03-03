import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import { LinearGradient } from 'expo';
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
      <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '100%'
          }}
       >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{ width: 325, height: 325, marginBottom: "5%" }}
          source={require("../assets/hoosLogo.png")}
        />
        <Button
          small
          borderRadius={30}
          title="UVA Sign-In"
          backgroundColor="#f65314"
          onPress={() => this.googleLogIn()}
        />
        {/* <Button
          small
          borderRadius={30}
          title="Facebook Sign In"
          backgroundColor="#3b5998"
          onPress={() => this.facebookLogIn()}
          style={{ marginTop: "2%" }}
        /> */}
      </View>
      </LinearGradient>
    );
  }
}
