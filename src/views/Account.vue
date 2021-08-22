<template>
  <h1 @click="testinguser">This is the Account Screen</h1>
</template>

<script>
import firebase from 'firebase';

const user = firebase.auth().currentUser;

export default {
    methods: {
        testinguser(){
            console.log(user)
        }
    }
}
</script>

<style>

</style>