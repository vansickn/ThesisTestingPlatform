<template>

    <div class="container flex flex-row md:ml-10 md:my-10 ml-5 my-5 items-center max-w-full">
        <img :src="userData.photo" alt="Hey?" srcset="" class="rounded-full lg:w-20 lg:h-20 md:w-16 md:h-16 w-10 h-10  border-2 border-black md:mr-10 mr-5 select-none">
        <h1 class="lg:text-6xl md:text-4xl sm:text-2xl text-lg">{{userData.displayName}}'s Account</h1>
        <button class="mx-10 sm:text-lg text-xs rounded-lg bg-red-500 shadow-md px-3 py-1 text-white md:-mb-3" @click="signout">Sign Out</button>
    </div>

    <div class="grid grid-cols-2 lg:max-w-7xl max-w-full gap-5 md:grid-cols-4">
        <ActiveTestCard :number="testsCreatedNumber" :text="correctS(testsCreatedNumber,'total test')"/>
        <ActiveTestCard number="1" :text="correctS(1,'active test')" color="green" />
        <ActiveTestCard :number="truncateNumber(votesCast)" :text="correctS(votesCast,'vote')+' cast'" color="blue"/>
        <ActiveTestCard :number="truncateNumber(coins)" :text="correctS(coins,'coin')" color="yellow"/>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:max-w-7xl max-w-full gap-5 mt-10">
        <UpgradeCard text="Want unlimited active tests?" :unlimited="true"/>
        <UpgradeCard text="Want more coins?" :unlimited="false"/>
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
import MyTestCard from '../components/MyTestCard.vue';
import ActiveTestCard from '../components/ActiveTestCard.vue'
import UpgradeCard from '../components/UpgradeCard.vue'




const db = firebase.firestore();




export default {
  components: { ActiveTestCard, UpgradeCard},
    data(){
        return {
            router: useRouter(),
            coins: null,
            votesCast: null,
            testsCreatedNumber: null,
            activeTests: 1 //this will eventually be something that is queried, but for right now I have no system in place to determine active tests vs completed tests
        }
    },
    computed: {
        ...mapGetters({
            user: "user",
            userData: "userData"
        }),
    },
    mounted(){
        this.fetchData();
    },
    methods: {
        signout() {
            firebase.auth().signOut()
            this.router.push('/')
            console.log(this.user.data)
        },
        async fetchData() {
            await db.collection("users").doc(this.user.data.uid).get().then(doc => {
                this.coins = doc.data().coins
                this.votesCast = doc.data().votesCast
                this.testsCreatedNumber = doc.data().testsCreated.length
                console.log(doc.data().testsCreated)
            }).catch(err=> {console.log(err)})
        },
        correctS(number,string){
            if(number == 0 || number > 1){
                return string+"s"
            }else{
                return string
            }
        },
        truncateNumber(number){
            if(number > 1000){
                return (number/1000).toFixed(1) + 'k'
            }else{
                return number
            }
        },
        round(value, precision) {
            var multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }
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