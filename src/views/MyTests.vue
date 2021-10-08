<template>
  <div class="container flex flex-row md:ml-10 md:my-10 ml-5 my-5 items-center max-w-full">
        <img :src="userData.photo" alt="Hey?" srcset="" class="rounded-full lg:w-20 lg:h-20 md:w-16 md:h-16 w-10 h-10  border-2 border-black md:mr-10 mr-5 select-none">
        <h1 class="lg:text-6xl md:text-4xl sm:text-2xl text-lg">{{userData.displayName}}'s Tests</h1>
    </div>

    <div class="mb-20">
        <TestCard v-for="id in testList" :testID="id" :key="id"/>        
    </div>

</template>

<script>
import { mapGetters } from 'vuex';
import firebase from 'firebase';
import TestCard from '../components/TestCard.vue';

const db = firebase.firestore();

export default {
    computed: {
        ...mapGetters({
            userData: 'userData'
        })
    },
    components: {TestCard},
    data(){
        return {
            testList: null,
        }
    },
    methods: {
        async generateTestList(){
            await db.collection('users').doc(this.userData.uid).get().then((doc) => {
                this.testList = doc.data().testsCreated;
            });
            console.log(this.testList);
        }
    },
    mounted(){
        console.log(this.userData.uid)
        this.generateTestList();
    }
}
</script>

<style>

</style>