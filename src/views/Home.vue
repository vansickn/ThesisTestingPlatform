<template>
  <h1> Which Thumbnail are you more likely to click on? </h1>
  <Picker/>
</template>

<script>
import Picker from '../components/Picker.vue';
import firebase from 'firebase';

const db = firebase.firestore();

export default {
name: "home",
  components: {Picker},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
}
</script>

<style lang='scss' scoped>
h1 {
  align-self: center;
  padding-top: 20px;
  font-size: 4vw;
}

</style>