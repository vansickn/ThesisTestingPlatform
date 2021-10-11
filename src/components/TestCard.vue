<template>
  <div class="w-11/12 flex mx-auto justify-center items-center flex-wrap border-2 border-red-500 rounded-lg mb-3">
            <!-- <img class="img" :src="thumbnail1">
        <img class="img" :src="thumbnail2"> -->
        <!-- Want function to ultimately be selectedThumbnail -->
        <Thumbnail :image="thumbnail1" :userCreated="userData.photo" :title="title1" class="pt-10"/>
        <Thumbnail :image="thumbnail2" :userCreated="userData.photo" :title="title2" class="md:pt-10"/>
        <!-- need to change click to image instead of whole thumbnail -->
    </div>
    <div>
        <span>{{img1votes}}</span> <br>
        <span>{{img2votes}}</span>
    </div>
</template>

<script>
import Thumbnail from '../components/Thumbnail.vue';
import firebase from 'firebase';
import { mapGetters } from 'vuex';

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
        }
    },
    computed: {
        ...mapGetters({
            userData: 'userData',
        })
    },
    components: {Thumbnail},
    props: ['testID'],
    methods: {
        generateTestData(){
            db.collection('CreatedTests').doc(this.testID).onSnapshot((doc) => {
                this.img1votes = doc.data().img1votes;
                this.img2votes = doc.data().img2votes;
                this.sampleSize = doc.data().sampleSize;
                this.title1 = doc.data().title1;
                this.title2 = doc.data().title2;
            })
        },
        generateThumbnailsFromTestID(){
            storageRef.child('/tests/' + this.testID).listAll().then((res) => {
                console.log(res)
                res.items[0].getDownloadURL().then(url => {
                    this.thumbnail1 = url
                })
                res.items[1].getDownloadURL().then(url => {
                    this.thumbnail2 = url
                })
            })
        }
    },
    mounted(){
        this.generateTestData();
        this.generateThumbnailsFromTestID();
    }
}
</script>

<style>

</style>