<template>
  <h1 class="text-4xl mx-auto py-10 md:text-2xl sm:text-lg sm:pt-5 pb-3 xs:text-sm xs:pt-5"> Which Thumbnail are you more likely to click on? </h1>
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


</style>