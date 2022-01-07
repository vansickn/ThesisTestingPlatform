import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import store from './store/index'
import './index.css';

// Vue clipboard package
import VueClipboard from 'vue-clipboard2';

// universal modal package
import 'vue-universal-modal/dist/index.css'
import VueUniversalModal from 'vue-universal-modal'

/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTbKpqu2RT7zdDKhXqkIerm8cQxiQdORM",
  authDomain: "thesistestingplatform.firebaseapp.com",
  projectId: "thesistestingplatform",
  storageBucket: "thesistestingplatform.appspot.com",
  messagingSenderId: "127770164075",
  appId: "1:127770164075:web:d18ad95f61b32d815faa2e",
  measurementId: "G-LN23WRDF8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/

/* code from our Firebase console */
var firebaseConfig = {
  apiKey: "AIzaSyDTbKpqu2RT7zdDKhXqkIerm8cQxiQdORM",
  authDomain: "thesistestingplatform.firebaseapp.com",
  projectId: "thesistestingplatform",
  storageBucket: "thesistestingplatform.appspot.com",
  messagingSenderId: "127770164075",
  appId: "1:127770164075:web:d18ad95f61b32d815faa2e",
  measurementId: "G-LN23WRDF8Q"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(async user => {
  store.dispatch("fetchUser", user)
})

const app = createApp(App).use(store);


// app.use(firebase);

// // picker component that I made, that needs to be registered
// import Picker from './components/Picker.vue';
// importing picker fucks my life up, not gonna figure that out yet
import Coin from './components/Coin.vue';
import TestCardThumbnail from './components/TestCardThumbnail.vue';
// import BarChartTest from './components/BarChartTest.vue';

// use vue router
app.use(router)

// use vue clipboard package
app.use(VueClipboard)

// use Vue Universal Modal Package
app.use(VueUniversalModal, {
  teleportTarget: 'body'
})


// use picker component
// app.use(Picker)
// app.component('Picker', Picker);
app.component('Coin', Coin);
app.component('TestCardThumbnail', TestCardThumbnail);
// app.component('BarChartTest', BarChartTest);

app.mount('#app');
