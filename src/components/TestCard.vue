<template>
  <div class="w-11/12 flex mx-auto justify-center items-center flex-wrap border-2 border-red-500 rounded-lg mb-3 flex-col">

            <!-- <img class="img" :src="thumbnail1">
        <img class="img" :src="thumbnail2"> -->
        <!-- Want function to ultimately be selectedThumbnail -->
        <div class="container flex flex-row justify-end mt-1">
            <button class="pr-2" @click="shareLink">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </button>
            <button @click="deleteTest" class="pr-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
        <div class="pt-2 w-full pr-10 pl-8">
            <BarChartTest :id="testID"/>
        </div>
        <div class="w-11/12 grid grid-cols-2 gap-2">
        <!-- v-for TestCard Thumbnail with n in range of numberOfImages, pass in both arrays, use prop of n to determine which index to display -->
            <!-- <TestCardThumbnail :image="thumbnail1" :userCreated="userData.photo" :title="title1" :border="'red'" class="mt-2"/>
            <TestCardThumbnail :image="thumbnail2" :userCreated="userData.photo" :title="title2" :border="'blue'" class="mt-2"/> -->
            <TestCardThumbnail v-for="n in numberOfImages" :key="n" :image="image_array[n-1]" :title="title_array[n-1]" :index="n-1" />
        </div>
        <!-- Eventually will change this to grid-cols-2 in order to have a button to extend the sample size -->
        <div class="w-11/12 grid grid-cols-1 my-2 gap-4 text-sm sm:text-base">
            <h1 class="bg-gray-100 rounded-xl border-2 border-red-500 text-center px-10 container flex flex-row w-auto text-sm"> {{total_votes}} / {{this.sampleSize}} votes cast</h1>
        </div>
        <!-- need to change click to image instead of whole thumbnail -->
    </div>
</template>

<script>
import Thumbnail from '../components/Thumbnail.vue';
import firebase from 'firebase';
import { mapGetters } from 'vuex';
import BarChartTest from '../components/BarChartTest.vue'
import TestCardThumbnail from '../components/TestCardThumbnail.vue'

const db = firebase.firestore();
const storageRef = firebase.storage().ref();

export default {
    data(){
        return {
            sampleSize: null,
            numberOfImages: null,
            image_array: [],
            title_array: [],
            total_votes: 0,
        }
    },
    computed: {
        ...mapGetters({
            userData: 'userData',
        })
    },
    components: {Thumbnail,BarChartTest,TestCardThumbnail},
    props: ['testID'],
    methods: {
        async generateTestData(){
            db.collection('CreatedTests').doc(this.testID).onSnapshot((doc) => {
                this.sampleSize = doc.data().sampleSize;
                this.numberOfImages = doc.data().numberOfImages;
                this.title_array = doc.data().title_array;
                this.generateThumbnailsFromTestID();
                this.calculateTotalVotes(doc.data());
            })
        },
        generateThumbnailsFromTestID(){
            console.log("HEYYYYY")
            console.log(this.numberOfImages)
            for (let i = 0; i < this.numberOfImages; i++) {
                const image_no = i+1
                storageRef.child('/tests/' + this.testID + "/img_" + image_no + "/").listAll().then((res) => {
                    console.log(res)
                    res.items[0].getDownloadURL().then(url => {
                        this.image_array[i] = url
                        console.log(url)
                    })
                })                
            }
        },
        calculateTotalVotes(data){
            this.total_votes = data.img_1_votes + data.img_2_votes + data.img_3_votes + data.img_4_votes
        },
        shareLink(){
            this.$router.push('/test/' + this.testID);
            // Want to add a copy link, going to use vue-clipboard on npm
        },
        deleteTest(){
            alert('This is where the deletion will go, going to implement in a cloud function')
        }
    },
    created(){
        this.generateTestData();
    },
    mounted(){
        // this.generateThumbnailsFromTestID();
    }
}
</script>

<style>

</style>