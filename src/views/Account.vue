<template>
    <div class='info'>
        <h1> Hi {{user.data.displayName}}!</h1>
        <h3 @click="testlog"> You currently have {{coins}} coins! </h3>
        <button class="btn" @click="signout">Sign Out</button>
    </div>
  
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from 'firebase';
import {useRouter} from 'vue-router';

const db = firebase.firestore()

export default {
    data(){
        return {
            router: useRouter(),
            db: firebase.firestore(),
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
        testing: function() {
            console.log(this.user.data)
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