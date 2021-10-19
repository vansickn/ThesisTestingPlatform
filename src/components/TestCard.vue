<template>
  <div class="w-11/12 flex mx-auto justify-center items-center flex-wrap border-2 border-red-500 rounded-lg mb-3 flex-col">

            <!-- <img class="img" :src="thumbnail1">
        <img class="img" :src="thumbnail2"> -->
        <!-- Want function to ultimately be selectedThumbnail -->
        <div class="pt-8 w-full pr-10 pl-8">
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
            <h1 class="bg-gray-100 rounded-xl border-2 border-red-500 text-center px-10 container flex flex-row w-auto"> {{this.img1votes + this.img2votes}} / {{this.sampleSize}} votes cast</h1>
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
            img1votes: null,
            img2votes: null,
            title1: null,
            title2: null,
            thumbnail1: null,
            thumbnail2: null,
            sampleSize: null,
            numberOfImages: null,
            image_array: [],
            title_array: [],
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
                this.title1 = doc.data().title1;
                this.title2 = doc.data().title2;
                this.numberOfImages = doc.data().numberOfImages;
                this.title_array = doc.data().title_array;
                this.generateThumbnailsFromTestID();
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