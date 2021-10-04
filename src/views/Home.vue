<template>
  <h1 class="text-4xl mx-auto py-10 md:text-2xl sm:text-lg sm:pt-5 pb-3 xs:text-sm xs:pt-5"> Which video are you more likely to click on? </h1>
  <Picker v-if="user.data != null" @onChangingThumbnails="setAnimation" />
<!-- // :class="{'transition duration-100 opacity-0': animate}" -->
</template>
<script>
import Picker from '../components/Picker.vue';
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
  mounted() {},
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
    }
  },
  watch: {},
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