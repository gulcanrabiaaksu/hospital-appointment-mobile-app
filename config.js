//firebase config key setup

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//your web app's firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeHi483a6VShhsyGsvHyJh2NTuHCtbhVI",
  authDomain: "hastanerandevu-cc9a6.firebaseapp.com",
  projectId: "hastanerandevu-cc9a6",
  storageBucket: "hastanerandevu-cc9a6.appspot.com",
  messagingSenderId: "397834206986",
  appId: "1:397834206986:web:78725a999a88d04a8d84f3",
  measurementId: "G-702TX6L8BV"
}

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export{firebase};