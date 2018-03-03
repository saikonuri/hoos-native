import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyBn91DlEuk_grmuj9BC30PTNCRKEV92zWo",
    authDomain: "hoosnative.firebaseapp.com",
    databaseURL: "https://hoosnative.firebaseio.com",
    projectId: "hoosnative",
    storageBucket: "hoosnative.appspot.com",
    messagingSenderId: "468327093282"
  };

  export var fb = firebase.initializeApp(config);
  