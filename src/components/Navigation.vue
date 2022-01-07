<template>
<!-- <h1 v-if="loggedIn">{{userData.email}}</h1>
<span v-if="loggedIn">{{userData.photo}}</span>
<img v-if="loggedIn" :src="userData.photo" alt="hey"> -->
<header class="shadow-md bg-gray-100">
    <nav class="container flex justify-center items-center max-w-full">
        <div class="container flex-row my-2 ml-8 sm:ml-1 xs:ml-1">
            <a class="md:text-2xl md:ml-5 ml-3" href="/">BetterThumbnails</a>
        </div>
        <div v-if="!mobile" class="container flex flex-row justify-end bg-white my-2 rounded-lg w-3/12 mr-8 shadow-sm max-h-lg">
            <ul v-show="!mobile" class="container flex flex-row justify-around items-center">

                <router-link class = "container flex justify-center items-center p-3 hover:bg-red-500 hover:text-white rounded-lg transition duration-500 ease-in-out transform" active-class="bg-red-500 text-white" to="/">Home</router-link> 
                <button @click="signInWithGoogle" v-if="!loggedIn" class = "container flex justify-center items-center p-3 hover:bg-red-500 hover:text-white rounded-lg transition duration-500 ease-in-out transform" to="/register">Login With Google </button> 
                <div v-if="loggedIn" class = "container h-full flex justify-around items-around p-3 hover:bg-red-500  rounded-lg transition duration-500 ease-in-out transform" active-class="bg-red-500" to="/account">
                    <img :src="userData.photo" alt="" srcset="" class="rounded-full w-10 border-2 fixed -mt-2 mr-3">
                </div> 
            </ul>
        </div>
        <svg class="w-6 h-6 mr-4 focus:none" @click="toggleMobileNav" id='menu-icon' v-show="mobile" aria-hidden="true" focusable="false" data-prefix="far" data-icon="bars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"></path></svg>
    </nav>
    <!-- <menuIcon @click="toggleMobileNav" class='menu-icon' v-show="mobile" /> -->
</header>
    <transition name="slide-fade">
       <ul class="container bg-gray-200 w-9/12 h-full absolute flex flex-col bg-opacity-90 z-30 rounded-r-xl" v-show="mobileNav">
                <router-link @click="toggleMobileNav" v-if="loggedIn" class = "container w-2/3 flex justify-around items-center mt-2 p-3 hover:bg-red-500 rounded-lg transition duration-500 ease-in-out transform" to="/account">
                    <img :src="userData.photo" alt="" srcset="" class="rounded-full w-12 h-12 border-2">
                </router-link>
                <router-link @click="toggleMobileNav" class = "container mb-2 mt-2 w-2/3 flex justify-center items-center p-3 bg-white opacity-100 hover:bg-red-500 hover:text-white rounded-lg transition duration-500 ease-in-out transform" active-class="bg-red-500 text-white" to="/" >Home</router-link> 
                <button @click="signInWithGoogle" v-if="!loggedIn" class = "container mb-2 w-2/3 flex justify-center items-center p-3 bg-white hover:bg-red-500 hover:text-white rounded-lg transition duration-500 ease-in-out transform" to="/register">Login With Google </button> 
                
        </ul>
    </transition>
</template>

<script>

// import { defineComponent } from '@vue/composition-api';
import menuIcon from '../assets/Icons/bars-regular.svg';
import Coin from '../components/Coin.vue'
import firebase from 'firebase';
import { mapGetters} from 'vuex';
import { useRouter } from 'vue-router';
import {ref} from 'vue';


const router = useRouter();
var provider = new firebase.auth.GoogleAuthProvider();

// const db = firebase.firestore();
// const db = firebase.firestore();

export default {
    name: 'navigation',
    components: {
        menuIcon,
        Coin,
    },
    data() {
        return {
            mobile: null,
            mobileNav: null,
            windowWidth: null,
            coins: 0,
        };
    },
    computed:{
        ...mapGetters({
            user: "user",
            userData: "userData"
        }),
    },
    props: {
        loggedIn: Boolean,
        // user: Object
    },
    created() {
        // this.listenForCoins();
    },
    async mounted(){
        window.addEventListener('resize',this.checkScreen);
        this.checkScreen();
        this.listenForCoins();
    },
    beforeUpdate(){
        // this.activeNav = this.activeNav;
    },
    updated(){
        this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been re-rendered
            // checks for new updates to the coins after the dom has re rendered.
            this.listenForCoins();
            this.activeNav = this.activeNav;
            console.log("UPDATE");
            console.log(this.activeNav);
        })
    },
    methods: {
        checkScreen() {
            this.windowWidth = window.innerWidth;
            if (this.windowWidth < 1115){
                this.mobile = true;
                return;
            }
            this.mobile = false
            this.mobileNav = false
            return;
        },
        toggleMobileNav() {
            this.mobileNav = !this.mobileNav;
        },
        listenForCoins(){
            console.log("Firing")
            firebase.firestore().collection("users").doc(this.userData.uid).onSnapshot({}, doc => {
                this.coins = doc.data().coins
                console.log("Coin Update")
                console.log(doc.data())
            })
        },
        signInWithGoogle(){
            firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                // /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...
                this.addUserToFirestore(user)
                // console.log("Hello!!!!!")
                this.listenForCoins(); //this is required for the update on next tick update lifecycle hook. Not sure why but need to leave this in.
                this.activeNav = 'Home';

            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
                console.log(errorCode)
            })
                 
        },
        async addUserToFirestore(user){
            this.checkIfUserExists(user.uid).then((res) => {
                if(res == false){
                    firebase.firestore().collection("users").doc(user.uid).set({
                    photoURL: user.providerData[0].photoURL,
                    testsCreated: [],
                })
                .then(() => {
                    console.log("User Successfully Created!");
                })
                .catch((error) => {
                    console.error("Error Creating User: ", error);
                }); 
                }else{
                console.log("User Already Exists, welcome back!") 
                }
            })
        },
        async checkIfUserExists(uid){
            return await firebase.firestore().collection('users').doc(uid)
            .get().then(
            doc => {
                return doc.exists;
            })
        },       
    }
};
</script>

<style>
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .3s ease-out;
  /* transform: translateX(0); */
  opacity: 100;
  
}
.slide-fade-leave-active {
  transition: all .3s ease-out;
  opacity: 0;
}
.slide-fade-enter-from
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-300px);
  opacity: 0;
}

.slide-fade-leave-to {
    transform: translateX(-300px);
    opacity: 0;
}

</style>
