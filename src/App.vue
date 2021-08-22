<template>
  <div class="app-wrapper">
    <div class="app">
      <Navigation :logged-in="isLoggedIn" />
      <span v-if="isLoggedIn"> 
        <button @click="signOut"> Logout </button> 
      </span>
      <router-view />
      <Footer/>
    </div>
  </div>


  <!-- <div>
    <Navigation/>
    <nav>
      <router-link to="/"> Home </router-link> |
      <span> 
        <router-link to="/feed"> Feed </router-link> |
      </span>
      
      
      <span v-else>
        <router-link to="/register"> Register </router-link> |
        <router-link to="/sign-in"> Login </router-link>
      </span>
      
    </nav>
    <router-view />
  </div> -->
</template>

<script setup>
import { ref, watchEffect } from 'vue' // used for conditional rendering
import firebase from 'firebase'
import { useRouter } from 'vue-router'
// import store from './store'

const router = useRouter()

const isLoggedIn = ref(true)

// runs after firebase is initialized
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      isLoggedIn.value = true // if we have a user
    } else {
      isLoggedIn.value = false // if we do not
    }
})

const signOut = () => {
  firebase.auth().signOut()
  router.push('/')
};
</script>

<script>
// import { defineComponent } from '@vue/composition-api'
import Navigation from './components/Navigation.vue'


export default {
  name: "app",
  components: {Navigation},
  data() {
    return {
      loggedIn: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    checkloggedIn(){
      if(isLoggedIn.value == true){
        return true;
      }else{
        return false;
      }
    }
  },
  watch: {},
};

</script>


<style lang='scss'>
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
}

.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: black;
}

.link-light {
  color: #fff;
}
</style>