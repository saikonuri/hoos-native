import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Login from "./components/login.js";
import Home from "./components/home.js";
import * as firebase from "firebase";
import { GoogleSignin } from "react-native-google-signin";

var config = {
  apiKey: "AIzaSyBn91DlEuk_grmuj9BC30PTNCRKEV92zWo",
  authDomain: "hoosnative.firebaseapp.com",
  databaseURL: "https://hoosnative.firebaseio.com",
  projectId: "hoosnative",
  storageBucket: "hoosnative.appspot.com",
  messagingSenderId: "468327093282"
};

var provider = new firebase.auth.GoogleAuthProvider();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }
  logIn() {
    this.setState({
      loggedIn: true
    });
  }

  componentWillMount() {
    firebase.initializeApp(config);
  }
  render() {
    if (this.state.loggedIn) {
      return <Home />;
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
