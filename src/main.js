import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

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
firebase.initializeApp(firebaseConfig)

const app = createApp(App)

app.use(router)

app.mount('#app')
