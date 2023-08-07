import Vue from 'vue'
import App from './App'
import router from './router'

import "semantic-ui-css/semantic.min.css";

import firebase  from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// console.log(firebase);

Vue.config.productionTip = false;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOnvgJLa9SBnOXHv1yYlgKrNCCmf1wGeA",
  authDomain: "helical-ascent-394410.firebaseapp.com",
  projectId: "helical-ascent-394410",
  storageBucket: "helical-ascent-394410.appspot.com",
  messagingSenderId: "901750585212",
  appId: "1:901750585212:web:90f867435e6e52614656f9"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
