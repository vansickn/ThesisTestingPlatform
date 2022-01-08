<template>
    <div class="container flex flex-row md:ml-10 md:my-10 ml-5 my-5 items-center max-w-full">
        <img :src="userData.photo" alt="Hey?" srcset="" class="rounded-full lg:w-20 lg:h-20 md:w-16 md:h-16 w-10 h-10  border-2 border-black md:mr-10 mr-5 select-none">
        <h1 class="lg:text-6xl md:text-4xl sm:text-2xl text-lg">{{userData.displayName}}'s Account</h1>
        <button class="mx-10 sm:text-lg text-xs rounded-lg bg-red-500 shadow-md px-3 py-1 text-white md:-mb-3" @click="signout">Sign Out</button>
    </div>


    <!-- <div class='info'>
        <h1> Hi {{user.data.displayName}}!</h1>
        <h3 @click="testlog"> You currently have {{coins}} coins! </h3>
        <button class="btn" @click="signout">Sign Out</button>
        <button @click="testing"> ey </button>
    </div>
    <h2> Here are the Tests you have created</h2>
    <MyTestCard v-if="isLoggedIn != null"/> -->
  
</template>

<script setup>
import { ref, watchEffect } from 'vue' // used for conditional rendering
import firebase from 'firebase';
import store from '../store/index.js'

var isLoggedIn = ref(null)

// runs after firebase is initialized
firebase.auth().onAuthStateChanged(function(user) {
    store.dispatch("fetchUser", user)
    if (user) {
      isLoggedIn.value = true // if we have a user
    } else {
      isLoggedIn.value = false // if we do not
    }
    console.log(isLoggedIn)
})


</script>

<script>
import { mapGetters } from 'vuex';
// import firebase from 'firebase';
import {useRouter} from 'vue-router';




const db = firebase.firestore();
const youtubeSignInFunction = firebase.functions().httpsCallable('youtubeSignIn');
const saveTokens = firebase.functions().httpsCallable('saveTokens');



export default {
  components: {},
    data(){
        return {
            router: useRouter(),
            coins: null,
            votesCast: null,
            testsCreatedNumber: null,
            activeTests: null,
        }
    },
    computed: {
        ...mapGetters({
            user: "user",
            userData: "userData"
        }),
    },
    mounted(){
    },
    methods: {
        signout() {
            firebase.auth().signOut()
            this.router.push('/')
        },
    },
    watch:{
    },

}
</script>

<style lang='scss'>

    .info {
        align-self: center;
        padding: 20px;
        background-color: grey;
        margin: 20px;
        border-radius: 15px;
        width: 70%;

        .btn {
            border-radius: 5px;
            width: 100px;
            height: 30px;
            font-size: 1em;
            background-color: red;
            color: white;
        }

    }

</style>