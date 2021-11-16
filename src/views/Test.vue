<template>

    <div v-if="showTests" class="sm:w-6/12 w-full grid md:grid-cols-2 grid-cols-1 xs:px-5 mx-auto md:gap-4 mt-10">
        <Thumbnail v-for="n in image_count" :key="n" :image="image_array[n-1] " :title="title_array[n-1]" :userCreated="user_profile_image" :index="n" @onClickedThumbnail="selectThumbnail"/>
    </div>
    <div v-if="show_no_test" class="container flex flex-col items-center">
        <h1 class="mx-auto text-center text-5xl">Sorry!</h1>
        <h1 class="mx-auto text-center text-2xl mt-5">This test is processing, or no longer active.</h1>
        <button @click="sendToHome" class="mt-5 bg-red-500 border-2 border-red-600 text-white shadow-lg p-5 rounded-xl transition duration-500 transform hover:scale-110 w-52">Vote on other tests</button>
        
    </div>

    <Modal
            v-model="show_thanks_modal"
            
        >
            <div class="bg-gray-200 rounded-lg md:p-10 p-6 w-11/12 sm:w-auto">
                <h1 class="sm:text-xl text-center">Thanks for Voting!</h1>
                <h3 class="text-center sm:text-lg text-red-500 pb-4">Sign in to create your own test or vote on more!</h3> 
            <div class="container flex flex-row justify-center gap-4">
                <button @click="sendToHome" class="bg-gray-300 border-2 border-gray-400 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> No thanks </button>
                <button @click="signUpPopup" class="bg-red-500 border-2 border-red-500 rounded-lg py-1 px-2 text-white shadow-lg transform hover:scale-110 transition duration-300"> Sign in with Google </button>
            </div>
            </div>
    </Modal>
<!-- going to pass in the user who created the test, and calculate the user photo from here. Could also just calculate that in the home.vue as well and just pass in the photo. Either works -->
</template>


<script>
import Thumbnail from '../components/Thumbnail.vue';
import firebase from 'firebase';
import { mapGetters} from 'vuex';
import {reactive} from 'vue';

const db = firebase.firestore();
var storageRef = firebase.storage().ref();

var provider = new firebase.auth.GoogleAuthProvider();

// Eventually want to send the data about the thumbnail (photo, title, profImage as an object into the thumbnail)
export default {
    components: { Thumbnail },
    props: ['testid'],
    computed: {
        ...mapGetters ({
            user: "user",
            userData: "userData",
        })
    },
    data () {
        return {
            userCreatedPhoto: null,
            test_array: [], //array of objects
            image_array: [],
            title_array: [],
            showTests: true,
            image_count: null,
            user_profile_image: null,
            user_id: null,
            show_thanks_modal: false,
            show_no_test: false,
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
            await db.collection('fanSampleTests').doc(this.testid).get().then(doc => {
                this.title_array = doc.data().title_array;
                this.image_count = doc.data().numberOfImages;
                this.user_id = doc.data().user;
                this.fetchImages(this.testid,this.image_count);
                // this.getUserCreatedProfilePhoto(doc.data().user); //function no longer needed, one less read call!
                this.user_profile_image = doc.data().user_photo_url;

            }).catch(err => {
                console.log("Error: " + err);
                console.log(this.testIDs);
                this.show_no_test = true;
            })
            console.log(this.test_array)
            // this.setNextThumbnail();
            // this.fetchImages();
        },

        async fetchImages(testid, numberOfImages){
            console.log(testid)
            console.log(numberOfImages)
            var img_array = []
            for (let i = 0; i < numberOfImages; i++) {
                // for each image in test
                const image_no = i+1
                await storageRef.child('/tests/'+ testid + '/img_' + image_no + "/").listAll().then((res) => {
                    // console.log(res);
                    res.items[0].getDownloadURL().then(url => {
                        this.image_array[i] = url
                        // console.log(url)
                    })
                })
            }
            console.log(img_array)
            return img_array;
        },
        async verifyArray(img_array,number){
            if(img_array.length == number){
                console.log("verified")
                console.log(img_array)
                this.showTests = true;
            }else{
                setTimeout(()=>{
                    console.log("not verified")
                    return this.verifyArray(img_array,number)
                },50)
            }
        },

        // This thumbnail is pretty ugly and hardcoded, can't really find a better way to do this
        selectThumbnail: function (n) {
            if(this.userData == null){
                console.log('not logged in')
                if(n==1){
                    // since i'll eventually allow non-logged in users to vote, need to conditionally do the seenBy: argument
                    // probably if (user) then this.userData.uid else 'anonymous'
                    db.collection("fanSampleTests").doc(this.testid).update({
                        img_1_votes : firebase.firestore.FieldValue.increment(1),
                        totalVotes: firebase.firestore.FieldValue.increment(1),
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
                if(n==2){
                    db.collection("fanSampleTests").doc(this.testid).update({
                        img_2_votes : firebase.firestore.FieldValue.increment(1),
                        totalVotes: firebase.firestore.FieldValue.increment(1),
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
                if(n==3){
                    db.collection("fanSampleTests").doc(this.testid).update({
                        img_3_votes : firebase.firestore.FieldValue.increment(1),
                        totalVotes: firebase.firestore.FieldValue.increment(1),
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
                if(n==4){
                    db.collection("fanSampleTests").doc(this.testid).update({
                        img_4_votes : firebase.firestore.FieldValue.increment(1),
                        totalVotes: firebase.firestore.FieldValue.increment(1),
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
            }
            else if(this.userData.uid == this.user_id){
                console.log("You can't vote on your own posts!")
                return
            }else{
                if(n==1){
                    // since i'll eventually allow non-logged in users to vote, need to conditionally do the seenBy: argument
                    // probably if (user) then this.userData.uid else 'anonymous'
                    db.collection("fanSampleTests").doc(this.testid).update({
                        img_1_votes : firebase.firestore.FieldValue.increment(1),
                        seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                        totalVotes: firebase.firestore.FieldValue.increment(1),
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
                if(n==2){
                    db.collection("fanSampleTests").doc(this.testid).update({
                        img_2_votes : firebase.firestore.FieldValue.increment(1),
                        seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                        totalVotes: firebase.firestore.FieldValue.increment(1),
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
                if(n==3){
                    db.collection("fanSampleTests").doc(this.testid).update({
                        img_3_votes : firebase.firestore.FieldValue.increment(1),
                        seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                        totalVotes: firebase.firestore.FieldValue.increment(1),
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
                if(n==4){
                    db.collection("fanSampleTests").doc(this.testid).update({
                        img_4_votes : firebase.firestore.FieldValue.increment(1),
                        seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                        totalVotes: firebase.firestore.FieldValue.increment(1),
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
                
                // conditionally do this as well, if anonymous user than don't do any of this stuff
                db.collection("users").doc(this.userData.uid).update({
                    seenTests: firebase.firestore.FieldValue.arrayUnion(this.testid),
                    coins: firebase.firestore.FieldValue.increment(1),
                    votesCast: firebase.firestore.FieldValue.increment(1)
                })

                this.$router.push('/')
            }

            this.show_thanks_modal = true;
 

        },
        async getUserCreatedProfilePhoto(userID){
            console.log(userID)
            await db.collection("users").doc(userID).get().then(doc => {
                console.log(doc.data().photoURL);
                this.user_profile_image = doc.data().photoURL;
            });
        },
        closeModal(){
            this.show_thanks_modal = false;
        },
        signUpPopup(){
            firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                // /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...
                this.addUserToFirestore(user)
                // console.log("Hello!!!!!")
                // this.listenForCoins(); //this is required for the update on next tick update lifecycle hook. Not sure why but need to leave this in.
                // this.activeNav = 'Home';
                this.$router.push('/');

            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
                console.log(errorCode)
            })
        },
        async addUserToFirestore(user){
            this.checkIfUserExists(user.uid).then((res) => {
                if(res == false){
                    firebase.firestore().collection("users").doc(user.uid).set({
                    coins: 1,
                    testsCreated: [],
                    paidAccount: false,
                    email: user.email,
                    name: user.displayName,
                    seenTests: [],
                    photoURL: user.providerData[0].photoURL,
                    votesCast: 0,
                })
                .then(() => {
                    console.log("User Successfully Created!");
                })
                .catch((error) => {
                    console.error("Error Creating User: ", error);
                }); 
                }else{
                console.log("User Already Exists, welcome back!") 
                }
            })
        },
        async checkIfUserExists(uid){
            return await firebase.firestore().collection('users').doc(uid)
            .get().then(
            doc => {
                return doc.exists;
            })
        },
        sendToHome(){
            this.$router.push('/');
        },       

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