<template>
  <div class="w-11/12 flex mx-auto justify-center items-center flex-wrap border-2 border-red-500 rounded-lg mb-3 flex-col">

            <!-- <img class="img" :src="thumbnail1">
        <img class="img" :src="thumbnail2"> -->
        <!-- Want function to ultimately be selectedThumbnail -->
        <div class="container flex flex-row justify-end mt-1">
            <h1 v-show="show_copy" class="mr-2 transition duration-200">Copied Link!</h1>
            <button class="pr-2" @click="shareLink">
                <svg class="w-6 h-6 focus:none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </button>
            <button @click="deleteTestConfirmation" class="pr-2">
                <svg class="w-6 h-6 focus:none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
            <h1 class="bg-gray-100 rounded-xl border-2 border-red-500 text-center px-10 container flex flex-row w-auto text-sm"> {{total_votes}} / {{sampleSize}} votes cast</h1>
        </div>
        <Modal
            v-model="show_confirm_deletion"
            :close="closeModal"
        >
            <div class="bg-gray-200 rounded-lg md:p-10 p-6 w-11/12 sm:w-auto">
                <h1 class="sm:text-xl text-center">Do you really want to delete this test?</h1>
                <h3 class="text-center sm:text-lg text-red-500 pb-4">This action cannot be undone</h3> 
            <div class="container flex flex-row justify-center gap-4">
                <button @click="closeModal" class="bg-gray-300 border-2 border-gray-400 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> Cancel </button>
                <button @click="confirmedDeletion" class="bg-red-500 border-2 border-red-500 rounded-lg py-1 px-2 text-white shadow-lg transform hover:scale-110 transition duration-300"> Delete </button>
            </div>
            </div>
        </Modal>
        <!-- need to change click to image instead of whole thumbnail -->
    </div>
</template>

<script>
import Thumbnail from '../components/Thumbnail.vue';
import firebase from 'firebase';
import { mapGetters } from 'vuex';
import BarChartTest from '../components/BarChartTest.vue';
import TestCardThumbnail from '../components/TestCardThumbnail.vue';


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
            show_copy: false,
            show_confirm_deletion: false,
            image_names: [],
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

                    // this block of code is necessary, because if page isn't refreshed the thumbnail won't have been scaled down yet. 
                    // if someone tries to delete it, the wrong name in the storage ref will be called.
                    // image_names is so that MyTests knows which direct paths are to the image
                    if((res.items[0].name).includes('_360x202')){this.image_names[i] = res.items[0].name}
                    else{var i_n = res.items[0].name.replace('.png','_360x202.png'); this.image_names[i] = i_n}

                    res.items[0].getDownloadURL().then(url => {
                        this.image_array[i] = url
                        // console.log(url)
                    });
                })                
            }
        },
        calculateTotalVotes(data){
            this.total_votes = data.img_1_votes + data.img_2_votes + data.img_3_votes + data.img_4_votes
        },
        shareLink(){
            this.$copyText(window.location.origin + '/test/' +this.testID).then(()=> {
                console.log("copied")
                this.show_copy = true;
                setTimeout(()=>{
                    this.show_copy = false;
                },2000)
            });
        },
        deleteTestConfirmation(){
            this.show_confirm_deletion = true;
            // alert('This is where the deletion will go, going to implement in a cloud function')
            // this is where the deletion will go, probably work on a cloud function in order to implement this.
            // Need to delete the test from user created, and also delete it from activeTests and CreatedTests
            // this.$emit("deletedTest",this.testID)
        },
        closeModal(){
            this.show_confirm_deletion = false;
        },
        confirmedDeletion(){
            console.log(this.image_names)
            this.$emit('deletedTest',this.testID,this.image_names);
            this.show_confirm_deletion = false;
            this.image_names = []
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

<style lang="scss" scoped>
// /* Slide up transition when open modal */
// .vue-universal-modal-enter-from,
// .vue-universal-modal-enter-to,
// .vue-universal-modal-leave-from,
// .vue-universal-modal-leave-to {
//   .modal {
//     transition: 0.3s transform;
//   }
// }
// .vue-universal-modal-enter-to .modal,
// .vue-universal-modal-leave-from .modal {
//   transform: translate3d(0, 0, 0);
// }
// .vue-universal-modal-enter-from .modal,
// .vue-universal-modal-leave-to .modal {
//   transform: translate3d(0, 50px, 0);
// }
</style>