import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import Login from "./components/login.js";
import Home from "./components/home.js";
import * as firebase from "firebase";
import Expo from "expo";

var config = {
  apiKey: "AIzaSyBn91DlEuk_grmuj9BC30PTNCRKEV92zWo",
  authDomain: "hoosnative.firebaseapp.com",
  databaseURL: "https://hoosnative.firebaseio.com",
  projectId: "hoosnative",
  storageBucket: "hoosnative.appspot.com",
  messagingSenderId: "468327093282"
};

firebase.initializeApp(config);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: null
    };
  }

  componentWillMount() {
    this.updateLogin();
  }

  updateLogin() {
    AsyncStorage.getItem("user").then(res => {
      console.log(res);
      if (res !== null && res !== "{}") {
        this.setState({
          loggedIn: true,
          user: JSON.parse(res)
        });
      }
    });
  }

  logOut() {
    AsyncStorage.setItem("user", "");
    this.setState({
      loggedIn: false
    });
  }

  async logIn() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      "132357100763432",
      { permissions: ["public_profile"] }
    );

    if (type === "success") {
      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      // Sign in with credential from the Facebook user.
      var that = this;
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(user => {
          AsyncStorage.setItem("user", JSON.stringify(user));
          that.updateLogin();
        })
        .catch(error => {});
    }
  }

  render() {
    if (this.state.loggedIn) {
      return <Home user={this.state.user} logOut={() => this.logOut()} />;
    } else {
      return (
        <Login
          logIn={() => {
            this.logIn();
          }}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
