<template>
  <div class="app-wrapper">
    <div class="app">
      <Navigation v-if="isLoggedIn != null" :logged-in="isLoggedIn" :user="user" class="w-screen items-between bg-gray-100 rounded-b-2xl"/>
      <router-view />
      <Footer/>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue' // used for conditional rendering
import firebase from 'firebase'
import { useRouter } from 'vue-router'
import store from './store/index'
import {mapGetters} from 'vuex'

const router = useRouter()

const isLoggedIn = ref(null)

// runs after firebase is initialized
firebase.auth().onAuthStateChanged(function(user) {
    console.log("User Status has changed")
    store.dispatch("fetchUser", user)
    if (user) {
      isLoggedIn.value = true // if we have a user
    } else {
      isLoggedIn.value = false // if we do not
    }
    console.log(isLoggedIn.value)
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
  created() {

  },
  computed:{
    ...mapGetters({
        user: 'user'
    })
  },
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