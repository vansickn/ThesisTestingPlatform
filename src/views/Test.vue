<template>

    <div v-if="showTests" class="sm:w-6/12 w-full grid md:grid-cols-2 grid-cols-1 xs:px-5 mx-auto md:gap-4 mt-10">
        <Thumbnail v-for="n in image_count" :key="n" :image="image_array[n-1] " :title="title_array[n-1]" :userCreated="user_profile_image" :index="n" @onClickedThumbnail="selectThumbnail"/>
    </div>

    <Modal
            v-model="show_thanks_modal"
            :close="closeModal"
        >
            <div class="bg-gray-200 rounded-lg md:p-10 p-6 w-11/12 sm:w-auto">
                <h1 class="sm:text-xl text-center">Thanks for Voting!</h1>
                <h3 class="text-center sm:text-lg text-red-500 pb-4">Sign in to create your own test or vote on more!</h3> 
            <div class="container flex flex-row justify-center gap-4">
                <button @click="closeModal" class="bg-gray-300 border-2 border-gray-400 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> No thanks </button>
                <button @click="confirmedDeletion" class="bg-red-500 border-2 border-red-500 rounded-lg py-1 px-2 text-white shadow-lg transform hover:scale-110 transition duration-300"> Sign in with Google </button>
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
            user_profile_images: null,
            user_id: null,
            show_thanks_modal: false,
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
            await db.collection('CreatedTests').doc(this.testid).get().then(doc => {
                this.title_array = doc.data().title_array;
                this.image_count = doc.data().numberOfImages;
                this.user_id = doc.data().user;
                this.fetchImages(this.testid,this.image_count);
                this.getUserCreatedProfilePhoto(doc.data().user);

            }).catch(err => {
                console.log("Error: " + err)
                console.log(this.testIDs)
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
            }
            else if(this.userData.uid == this.user_id){
                console.log("You can't vote on your own posts!")
                return
            }else{
                if(n==1){
                    // since i'll eventually allow non-logged in users to vote, need to conditionally do the seenBy: argument
                    // probably if (user) then this.userData.uid else 'anonymous'
                    db.collection("CreatedTests").doc(this.testid).update({
                        img_1_votes : firebase.firestore.FieldValue.increment(1),
                        seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
                if(n==2){
                    db.collection("CreatedTests").doc(this.testid).update({
                        img_2_votes : firebase.firestore.FieldValue.increment(1),
                        seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
                if(n==3){
                    db.collection("CreatedTests").doc(this.testid).update({
                        img_3_votes : firebase.firestore.FieldValue.increment(1),
                        seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
                if(n==4){
                    db.collection("CreatedTests").doc(this.testid).update({
                        img_4_votes : firebase.firestore.FieldValue.increment(1),
                        seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
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
        onChangingThumbnails() {
            this.$emit('onChangingThumbnails')
        },
        closeModal(){
            this.show_thanks_modal = false;
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