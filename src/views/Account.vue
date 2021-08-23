<template>
    <div class='info'>
        <h1> Hi {{user.data.displayName}}!</h1>
        <h3 @click="testlog"> You currently have {{user.data.coins}} coins! </h3>
        <button class="btn" @click="signout">Sign Out</button>
    </div>
  
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from 'firebase';
import {useRouter} from 'vue-router';


export default {
    data(){
        return {
            router: useRouter(),
            db: firebase.firestore(),
        }
    },
    computed: {
        ...mapGetters({
            user: "user",
        }),
    },
    methods: {
        signout() {
            firebase.auth().signOut()
            this.router.push('/')
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