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
import { Font } from "expo";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      fontLoaded: false
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      bungee: require("../assets/fonts/Bungee-Regular.ttf"),
      acme : require("../assets/fonts/Acme-Regular.ttf"),
      arimo: require("../assets/fonts/Arimo-Bold.ttf"),
      raleway: require("../assets/fonts/Raleway-Black.ttf"),
      ralewayExtraLight: require("../assets/fonts/Raleway-ExtraLight.ttf"),
      ralewayRegular: require("../assets/fonts/Raleway-Regular.ttf"),
      ralewayMedium: require("../assets/fonts/Raleway-Medium.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }

  googleLogIn() {
    this.props.googleLogIn();
  }

  facebookLogIn() {
    this.props.facebookLogIn();
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'white' }}>
      {this.state.fontLoaded ? (
              <Text style={{fontFamily: "raleway",fontSize: 41,color: '#E57200'}}>Hoos Active</Text>
            ) : (
                <Text style={{fontSize: 41,color: '#E57200'}}>Hoos Active</Text>
              )}
        <Button
          small
          buttonStyle={{
            backgroundColor: "white",
            width: 100,
            height: 40,
            borderColor: "#232D4B",
            borderWidth: 2,
            borderRadius: 5,
            marginTop: '60%'
          }}
          title="Log In"
          titleStyle = {{color: '#232D4B',fontFamily: this.state.fontLoaded ? ('raleway') : null}}
          onPress={() => this.googleLogIn()}
        />
      </View>
    );
  }
}
