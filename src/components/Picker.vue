<template>
    <!-- the showTests is VERY IMPORTANT DO NOT DELETE! not sure why but it fucks up my life with the navigation and I have no idea why. -->
    <div v-if="showTests" v-show="showPrompt" class="container flex flex-col justify-center items-center w-full mb-10 mt-5">
        <h1 class="text-3xl">Prompt:</h1>
        <span class="text-lg w-5-/12 mb-4 text-center">{{test_array[currentTest].prompt}}</span>
        
        <div class="w-auto pr-10 border-2 border-red-500 container flex flex-row gap-1 mb-2 rounded-xl">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
            <h1>{{test_array[currentTest].ytsearch}}</h1>
        </div>

        <button class="bg-red-500 rounded-xl px-5 text-white shadow-lg" @click="showPrompt = false">search</button>
        <h1 class="text-xs">*click this</h1>
    </div>

    <div v-show="!showPrompt" class="w-auto pr-10 border-2 border-red-500 container flex flex-row gap-1 mb-3 mt-4 rounded-xl">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
            <h1>{{test_array[currentTest].ytsearch}}</h1>
    </div>
    <div v-if="showTests" v-show="!showPrompt" class="sm:w-6/12 w-full grid md:grid-cols-2 grid-cols-1 xs:px-5 mx-auto md:gap-4"> 
        <!-- Might create a seperate component for the actual tester aspect of this, because the reliability of the images loading is very suspect -->

    
        <Thumbnail v-for="n in test_array[currentTest].imageCount" :key="n" :testid="test_array[currentTest].id" :title="test_array[currentTest].title_array[n-1]" :userCreated="test_array[currentTest].profile_img" :index="n" @onClickedThumbnail="selectThumbnail"/>
    </div>
<!-- going to pass in the user who created the test, and calculate the user photo from here. Could also just calculate that in the home.vue as well and just pass in the photo. Either works -->
</template>


<script>
import firebase from 'firebase';
import { mapGetters} from 'vuex';
import {reactive} from 'vue';
import Thumbnail from '../components/Thumbnail.vue';

const db = firebase.firestore();
// var storageRef = firebase.storage().ref();

// Eventually want to send the data about the thumbnail (photo, title, profImage as an object into the thumbnail)
export default {
    components: { Thumbnail },
    computed: {
        ...mapGetters ({
            user: "user",
            userData: "userData",
        })
    },
    data () {
        return {
            currentTest: 0,
            userCreatedPhoto: null,
            test_array: [], //array of objects
            showTests: false,
            user_profile_images_array: [],
            showPrompt: true,
        }
    },
    created(){
        this.testList();
    },
    mounted(){
        // this.testList();
        // this.verifyTests();
    },
    methods: {
        // Grabs all of the doc ID's of the Tests, then going to use this list to grab from storage //this is a test and I have no idea what i'm doing <3
        async testList() {
            // TODO : Restrict viewing tests for people who have already seen the test, look into new ways i can model the data to handle that functionality
            // TODO : paginate respoonses, only take like the first 5, and then when some threshold is met, load the next 5
            await db.collection('Tests').get().then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    // console.log("" + this.user.data.uid)
                    // console.log(doc.data().user)
                    const numberOfImages = doc.data().numberOfImages;
                    const title_array = doc.data().title_array;
                    const profile_img = doc.data().user_photo_url;
                    const prompt = doc.data().prompt;
                    const ytsearch = doc.data().ytsearch;

                    const obj = {
                        // added to the test_array list as this object
                        id: doc.id,
                        imageCount: numberOfImages,
                        title_array: title_array,
                        profile_img: profile_img,
                        prompt: prompt,
                        ytsearch: ytsearch,
                    }
                    this.test_array.push(obj);
                    this.showTests = true;
                });
            }).catch(err => {
                console.log("Error: " + err)
                console.log(this.test_array)
            })
            console.log(this.test_array)
            // this.setNextThumbnail();
            // this.fetchImages();
        },

        // This thumbnail is pretty ugly and hardcoded, can't really find a better way to do this
        selectThumbnail: function (n) {
            // If user not logged in then cycle test but don't vote
            if(this.userData == null){
                this.currentTest += 1
                return
            }
            // If user is the same as the test in the user, don't vote just cycle
            if(this.userData.uid == this.test_array[this.currentTest].id){
                this.currentTest += 1
                return
            }
            if(n==1){
                db.collection("Tests").doc(this.test_array[this.currentTest].id).update({
                    img_1_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    totalVotes: firebase.firestore.FieldValue.increment(1),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(n==2){
                db.collection("Tests").doc(this.test_array[this.currentTest].id).update({
                    img_2_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    totalVotes: firebase.firestore.FieldValue.increment(1),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(n==3){
                db.collection("Tests").doc(this.test_array[this.currentTest].id).update({
                    img_3_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    totalVotes: firebase.firestore.FieldValue.increment(1),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(n==4){
                db.collection("Tests").doc(this.test_array[this.currentTest].id).update({
                    img_4_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    totalVotes: firebase.firestore.FieldValue.increment(1),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(n==5){
                db.collection("Tests").doc(this.test_array[this.currentTest].id).update({
                    img_5_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    totalVotes: firebase.firestore.FieldValue.increment(1),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(n==6){
                db.collection("Tests").doc(this.test_array[this.currentTest].id).update({
                    img_6_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    totalVotes: firebase.firestore.FieldValue.increment(1),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            
            db.collection("users").doc(this.userData.uid).update({
                seenTests: firebase.firestore.FieldValue.arrayUnion(this.test_array[this.currentTest].id),
                votesCast: firebase.firestore.FieldValue.increment(1)
            })

            this.currentTest += 1;
            this.showPrompt = true;

        },
        async getUserCreatedProfilePhoto(userID){
            console.log(userID)
            await db.collection("users").doc(userID).get().then(doc => {
                console.log(doc.data().photoURL);
                this.user_profile_images_array.push(doc.data().photoURL);
            });
        },
        onChangingThumbnails() {
            this.$emit('onChangingThumbnails')
        }

    }
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

</style>