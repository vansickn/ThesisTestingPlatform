<template>
    <!-- the showTests is VERY IMPORTANT DO NOT DELETE! not sure why but it fucks up my life with the navigation and I have no idea why. -->
    <div v-if="showTests" v-show="showPrompt" class="container flex flex-col justify-center items-center w-full mb-10 mt-5">
        <h1 class="text-3xl">Prompt:</h1>
        <span class="text-lg w-5-/12 mb-4 text-center">{{test_array[currentTest].prompt}}</span>
        
        <div class="w-auto pr-10 border-2 border-red-500 container flex flex-row gap-1 mb-2 rounded-xl">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
            <h1>{{test_array[currentTest].ytsearch}}</h1>
        </div>

        <button class="bg-red-500 rounded-xl px-5 text-white shadow-lg" @click="toggleShowPrompt()">search</button>
        <h1 class="text-xs">*click this</h1>
    </div>

    <div v-show="!showPrompt" class="w-auto pr-10 border-2 border-red-500 container flex flex-row gap-1 mb-3 mt-4 rounded-xl">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
            <h1>{{test_array[currentTest].ytsearch}}</h1>
    </div>
    <div v-if="showTests" v-show="!showPrompt" class="sm:w-6/12 w-full grid md:grid-cols-2 grid-cols-1 xs:px-5 mx-auto md:gap-4"> 
        <!-- Might create a seperate component for the actual tester aspect of this, because the reliability of the images loading is very suspect -->

    
        <Thumbnail v-for="n in test_array[currentTest].imageCount" :key="n" :testid="test_array[currentTest].id" :title="test_array[currentTest].ytsearch" :userCreated="test_array[currentTest].profile_img" :index="test_array[currentTest].randomizedIndex[n-1]" @onClickedThumbnail="selectThumbnail"/>
    </div>
<!-- going to pass in the user who created the test, and calculate the user photo from here. Could also just calculate that in the home.vue as well and just pass in the photo. Either works -->

   <Modal
            v-model="user_input_continue"
            :close="closeModal"
        >
            <div class="bg-gray-200 rounded-lg md:p-10 p-6 w-auto">
                <div v-if="currentTest == 0">
                    <h1 class="text-xl font-bold text-center mx-auto">Welcome to the test! As a reminder, we are not testing you, we are only testing our experiment. </h1>
                    <h1 class="text-lg w-10/12 mx-auto mt-3 mb-3">You will be shown a prompt, and the goal is to put yourself into the headspace of the prompt. These prompts will explain to you that you are looking for an answer to something on YouTube.
                        Your objective is to click on the YouTube video which you would most likely click on given the information of the prompt. If you have any questions, feel free to ask the interviewer before we start.
                        Otherwise, you will first be shown a sample prompt and selection of videos, and you must click on the video which you would most realistically choose. Then, after the sample you will be shown up to 10 searches, in the same fashion as the sample test.
                    </h1>
                    <h1 class="font-bold text-xl mx-auto text-center mb-5">To begin, and view the sample test, click continue below.</h1>
                </div>
                <div v-if="currentTest == 1">
                    <h1 class="text-xl font-bold text-center mx-auto"> Great! Now the real searches will be shown to you. </h1>
                    <h1 class="text-lg w-10/12 mx-auto mt-3 mb-3 text-center"> Once again, if you have any questions, feel free to ask the interviewer.
                    </h1>
                    <h1 class="font-bold text-xl mx-auto text-center mb-5">Click continue to go on to the experiment.</h1>
                </div>
                <div v-if="currentTest > 1">
                    <h1 class="text-xl font-bold text-center mx-auto mb-5"> Great! Click the button to continue, or anywhere outside of this modal. </h1>
                </div>





            <div class="container flex flex-row justify-center gap-4">
                <button @click="closeModal" class="bg-red-500 text-white rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> Continue </button>
            </div>
            </div>
    </Modal>

</template>

<script setup>
import Thumbnail from '../components/Thumbnail.vue'
</script>

<script>
import firebase from 'firebase';
import { mapGetters} from 'vuex';
import {reactive} from 'vue';
// import Thumbnail from '../components/Thumbnail.vue';

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
            startTime: null,
            pickedTime: null,
            user_input_continue: true,
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

            // Sample Search gets found and pushed to test array first
            await db.collection('Tests').doc('Aouq7tEHh7ILYG3w4zpY').get().then(doc => {
                const totalVotes = doc.data().totalVotes;
                    const numberOfImages = doc.data().numberOfImages;
                    const title_array = doc.data().title_array;
                    const profile_img = doc.data().user_photo_url;
                    const prompt = doc.data().prompt;
                    const ytsearch = doc.data().ytsearch;
                    const randomizedIndex = this.psuedoScramble(totalVotes,numberOfImages);

                    const obj = {
                        // added to the test_array list as this object
                        id: doc.id,
                        imageCount: numberOfImages,
                        title_array: title_array,
                        profile_img: profile_img,
                        prompt: prompt,
                        ytsearch: ytsearch,
                        randomizedIndex: randomizedIndex,
                    }
                    this.test_array.push(obj);
                    this.showTests = true;
            })

            await db.collection('Tests').get().then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    // if it's not the sample search
                    if(doc.id != 'Aouq7tEHh7ILYG3w4zpY'){
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                        // console.log("" + this.user.data.uid)
                        // console.log(doc.data().user)
                        const totalVotes = doc.data().totalVotes;
                        const numberOfImages = doc.data().numberOfImages;
                        const title_array = doc.data().title_array;
                        const profile_img = doc.data().user_photo_url;
                        const prompt = doc.data().prompt;
                        const ytsearch = doc.data().ytsearch;
                        const randomizedIndex = this.psuedoScramble(totalVotes,numberOfImages);
    
                        const obj = {
                            // added to the test_array list as this object
                            id: doc.id,
                            imageCount: numberOfImages,
                            title_array: title_array,
                            profile_img: profile_img,
                            prompt: prompt,
                            ytsearch: ytsearch,
                            randomizedIndex: randomizedIndex,
                        }
                        this.test_array.push(obj);
                        this.showTests = true;
                    }
                });
            }).catch(err => {
                console.log("Error: " + err)
                console.log(this.test_array)
            })
            console.log(this.test_array)
            this.shuffleExceptFirst(this.test_array);
            // this.setNextThumbnail();
            // this.fetchImages();
        },
        shuffleExceptFirst(array) {
            let currentIndex = array.length,  randomIndex;
            console.log(this.test_array[0])
            // While there remain elements to shuffle...
            while (currentIndex > 1) {
                console.log(currentIndex)
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex)+1;
                currentIndex--;

                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
            }

            console.log(array)
            return array;
        },

        psuedoScramble(totalVotes,numberOfImages){
            console.log(totalVotes);
            let arr = []
            for (let i = 1; i <= numberOfImages; i+=1){
                arr.push(i) 
            }
            this.leftRotate(arr,totalVotes,numberOfImages);
            console.log(arr)
            return arr;
            // console.log((totalVotes + numberOfImages)%numberOfImages);
        },

        gcd(a, b){
            if (b == 0){
                return a;
            }
            else{
                return this.gcd(b, a % b);
            }
        },
        leftRotate(arr, d, n){
            /* To handle if d >= n */
            d = d % n;
            let g_c_d = this.gcd(d, n);
            for (let i = 0; i < g_c_d; i++) {
                /* move i-th values of blocks */
                let temp = arr[i];
                let j = i;

                while (1) {
                    let k = j + d;
                    if (k >= n)
                        k = k - n;

                    if (k == i)
                        break;

                    arr[j] = arr[k];
                    j = k;
                }
                arr[j] = temp;
            }
        },

        toggleShowPrompt(){
            this.showPrompt = false;
            this.startTime = Date.now();
        },
        closeModal(){
            this.user_input_continue = false;
        },


        // This thumbnail is pretty ugly and hardcoded, can't really find a better way to do this
        selectThumbnail: function (n) {
            // If user not logged in then cycle test but don't vote

            this.pickedTime = Date.now();
            let secondsToChoose = (this.pickedTime - this.startTime)/1000;

            console.log(this.startTime)
            console.log(this.pickedTime)
            console.log(secondsToChoose);

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
                // seenTests: firebase.firestore.FieldValue.arrayUnion(this.test_array[this.currentTest].id),
                seenTests: firebase.firestore.FieldValue.arrayUnion({test:this.test_array[this.currentTest].id , selected: n, positionState:this.test_array[this.currentTest].randomizedIndex, time_to_choose: secondsToChoose}),
                votesCast: firebase.firestore.FieldValue.increment(1)
            })

            this.currentTest += 1;
            this.showPrompt = true;
            this.startTime = null;
            this.pickedTime = null;
            this.user_input_continue = true;

            if(this.currentTest == 7){
                this.$router.push('/endsurvey')
            }

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