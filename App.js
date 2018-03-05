import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import Login from "./components/login.js";
import Home from "./components/home.js";
import * as firebase from "firebase";
import Expo from "expo";
import axios from "axios";
import fb from './firebase.js'
import areas from './assets/areas.json';

// The url to server.js so we can make requests to our express server which is connected to MongoDB
// App.js (or any component) ---> makes request to server/api ---> server.js/api.js ---> Query Database ---> MongoDB
// Note: Change this url everytime to your own IP address since mine not be running when you are coding
// Eventually the URL will change when we deploy our express server to a cloud provider, then everyone can have same URL
var url = 'http://192.168.1.180:4000'

// Firebase offers Google Auth Service
var provider = new firebase.auth.GoogleAuthProvider();

// App Component: The first component that is mounted when the application starts
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: null
    };
  }
  
  // Method triggered one time, right before the component is mounted
  componentWillMount() {
    this.updateLogin();
  }

  // Checks to see if the user recently logged in to the app on their device
  updateLogin() {
    AsyncStorage.getItem("user").then(res => {
      if (res !== null && res !== "{}") {
        this.setState({
          loggedIn: true,
          user: JSON.parse(res)
        }, function () {
          this.checkUser();
        })
      }
    });
  }

  // If new user, inserts them into MongoDB, else ignores
  checkUser() {
    let body = {
      displayName: this.state.user.displayName,
      email: this.state.user.email
    }
    axios.put(url + "/user", body).then(res => {
    }).catch(err => {
      console.log(err);
    })
  }

  // Using Expo and Firebase to allow users login with gmail (don't worry about this)
  async signInWithGoogleAsync() {
    try {
      const result = await Expo.Google.logInAsync({
        iosClientId: "468327093282-o2ncjg0chilf0bujmnsiqoslj2nq9hm3.apps.googleusercontent.com",
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        var that = this;
        var credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
        firebase.auth().signInWithCredential(credential).then(user => {
          AsyncStorage.setItem("user", JSON.stringify(user));
          that.updateLogin();
        }).catch(error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  // When user logs out, changing the local storage so that app doesn't automatically log them in next time they open the app
  logOut() {
    AsyncStorage.setItem("user", "");
    this.setState({
      loggedIn: false
    });
  }

  // Using Expo and firebase to log in with Facebook (Taking out Facebook tho so don't worry)
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
        .catch(error => { });
    }
  }

  // Rendering = Mounting -> Everytime state changes, render is called. "return" has the actual HTML we return to the screen
  render() {
    if (this.state.loggedIn) {
      return <Home user={this.state.user} logOut={() => this.logOut()} />;
    } else {
      return (
        <Login
          googleLogIn={() => {
            this.signInWithGoogleAsync();
          }}
          facebookLogIn={() => {
            this.logIn();
          }}
        />
      );
    }
  }
}
