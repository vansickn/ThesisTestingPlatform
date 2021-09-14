<template>
    <div class='info'>
        <h1> Hi {{user.data.displayName}}!</h1>
        <h3 @click="testlog"> You currently have {{coins}} coins! </h3>
        <button class="btn" @click="signout">Sign Out</button>
        <button @click="testing"> ey </button>
    </div>
    <h2> Here are the Tests you have created</h2>
    <MyTestCard v-if="isLoggedIn != null"/>
  
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
import MyTestCard from '../components/MyTestCard.vue';


const db = firebase.firestore();




export default {
  components: { MyTestCard },
    data(){
        return {
            router: useRouter(),
            coins: null,
        }
    },
    computed: {
        ...mapGetters({
            user: "user",
        }),
    },
    mounted(){
        this.fetchCoins();
    },
    methods: {
        signout() {
            firebase.auth().signOut()
            this.router.push('/')
        },
        async fetchCoins() {
            await db.collection("users").doc(this.user.data.uid).get().then(doc => {
                this.coins = doc.data().coins
            }).catch(err=> {console.log(err)})
        },
    }

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