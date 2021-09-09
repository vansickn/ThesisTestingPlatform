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

var db = firebase.firestore()

// Have to return the whole promise here... Took forever to figure that out
async function checkIfUserExists(uid){
  return await db.collection('users').doc(uid)
  .get().then(
  doc => {
    return doc.exists;
  })
}

// Adds user to the firestore, but first checks to see if the user already exits in the db, if not then it writes to the db
async function addUserToFirestore(user){
  checkIfUserExists(user.uid).then((res) => {
    if(res == false){
     db.collection("users").doc(user.uid).set({
      coins: 0,
      testsCreated: [],
      paidAccount: false,
      email: user.email,
      name: user.displayName,
      seenTests: [],
      })
      .then(() => {
          console.log("Document successfully written!");
      })
      .catch((error) => {
          console.error("Error writing document: ", error);
      }); 
    }else{
      console.log("User Already Exists, welcome back!") 
    }
  })
}

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
    addUserToFirestore(user)
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