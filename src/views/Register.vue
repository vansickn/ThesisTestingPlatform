<template>
    <h1> Create an Account </h1>
    <div class="register">
      <!-- <p> <input type='text' placeholder="Email" v-model='email'/> </p>
      <p> <input type='password' placeholder="Password" v-model='password'/> </p>
      <p> <button @click="register"> Submit </button> </p> -->
      <button @click="register" class='googleLogin'>Click me</button>
    </div>
    
</template>

<script setup>
import { onMounted, ref } from 'vue'
import firebase from 'firebase'
import { useRouter } from 'vue-router' // import router

const email = ref('')
const password = ref('')

var provider = new firebase.auth.GoogleAuthProvider();

const router = useRouter() // get a reference to our vue router
const register = () => {
  // firebase
  //   .auth() // get the auth api
  //   .createUserWithEmailAndPassword(email.value, password.value) // need .value because ref()
  //   .then((data) => {
  //     console.log('Successfully registered!');
  //     router.push('/feed') // redirect to the feed
  //   })
  //   .catch(error => {
  //     console.log(error.code)
  //     alert(error.message);
  //   });
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
    router.push('/account')
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
  
}
</script>



<style lang='scss' scoped>
  h1 {
    align-self: center;
    font-size: 5vw;
  }
  .register {
    align-self: center;
  }
</style>