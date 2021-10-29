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




/* code from our Firebase console */
var firebaseConfig = {
  apiKey: 'AIzaSyAfJU3-Skg-oqBzwajTPXTvtPXuhi0WeEE',
  authDomain: "abtesting-fb780.firebaseapp.com",
  projectId: "abtesting-fb780",
  storageBucket: "abtesting-fb780.appspot.com",
  messagingSenderId: "887536811640",
  appId: "1:887536811640:web:6c51efc186554b684e778d",
  measurementId: "G-H0T67PB5YN"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(async user => {
  store.dispatch("fetchUser", user)
})

const app = createApp(App).use(store)

// // picker component that I made, that needs to be registered
// import Picker from './components/Picker.vue';

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

app.mount('#app')
