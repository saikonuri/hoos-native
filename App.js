import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Login from "./components/login.js";
import Home from "./components/home.js";

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
