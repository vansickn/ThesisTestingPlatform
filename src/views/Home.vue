<template>
  <Picker/>
<!-- // :class="{'transition duration-1 text-xl00 opacity-0': animate}" -->
</template>

<script setup>
import Picker from '../components/Picker.vue';
</script>

<script>
// import Picker from '../components/Picker.vue';
import firebase from 'firebase';
import { mapGetters } from 'vuex';

const db = firebase.firestore();

export default {
name: "home",
  components: {Picker},
  data() {
    return {
      animate: false,
    };
  },
  created() {
    
  },
  computed: {
    ...mapGetters({
      userData: 'userData',
      user: 'user'
    })
  },
  methods: {
    setAnimation(){
      console.log("Setting animation")
      this.animate = true;
      console.log(this.animate)
      setTimeout(this.setAnimationFalse,2000)
      // setTimeout(1000);
      // this.animate = false;
      // console.log(this.animate)
    },
    setAnimationFalse(){
      this.animate = false
      console.log(this.animate)
    },
    callTestFirebase(){
      //get function reference from firebase
      const sayHello = firebase.functions().httpsCallable("sayHello");
      sayHello().then((result)=>{
          console.log(result.data)
      });
    },
  },
}
</script>

<style scoped>
.picker-slide-enter-active {
  transition: all .3s ease-out;
  /* transform: translateX(0); */
  opacity: 100;
  
}
.picker-slide-leave-active {
  transition: all .3s ease-out;
  opacity: 0;
}
.picker-slide-enter-from
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-300px);
  opacity: 0;
}

.picker-slide-leave-to {
    transform: translateX(-300px);
    opacity: 0;
}
.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}



</style>