<template>
    <!-- the showTests is VERY IMPORTANT DO NOT DELETE! not sure why but it fucks up my life with the navigation and I have no idea why. -->
    <div v-if="showTests" class="sm:w-6/12 w-full grid md:grid-cols-2 grid-cols-1 xs:px-5 mx-auto md:gap-4"> 
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
            await db.collection('randomSampleTests').get().then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    // console.log("" + this.user.data.uid)
                    // console.log(doc.data().user)
                    const numberOfImages = doc.data().numberOfImages;
                    const title_array = doc.data().title_array;
                    const sampleSize = doc.data().sampleSize;
                    const profile_img = doc.data().user_photo_url;

                    // Checks if the user created it, if they did they will not see it
                    // only if theyre logged in though, if not they can see it
                    if(this.userData != null){
                        console.log("Userdata is not null")
                        if("" + this.userData.uid != doc.data().user){
                            console.log("Logged in")
                            // This solution works for now, kinda still shitty but works for now
                            const obj = {
                                // added to the test_array list as this object
                                id: doc.id,
                                imageCount: numberOfImages,
                                title_array: title_array,
                                sampleSize: sampleSize,
                                profile_img: profile_img,
                            }
                            this.test_array.push(obj);
                            this.showTests = true;
                        }
                    }else{
                        console.log("Not logged in")
                        console.log(doc.id)
                        const obj = {
                            // added to the test_array list as this object
                            id: doc.id,
                            imageCount: numberOfImages,
                            title_array: title_array,
                            sampleSize: sampleSize,
                            profile_img: profile_img,
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
                db.collection("randomSampleTests").doc(this.test_array[this.currentTest].id).update({
                    img_1_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    totalVotes: firebase.firestore.FieldValue.increment(1),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(n==2){
                db.collection("randomSampleTests").doc(this.test_array[this.currentTest].id).update({
                    img_2_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    totalVotes: firebase.firestore.FieldValue.increment(1),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(n==3){
                db.collection("randomSampleTests").doc(this.test_array[this.currentTest].id).update({
                    img_3_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    totalVotes: firebase.firestore.FieldValue.increment(1),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(n==4){
                db.collection("randomSampleTests").doc(this.test_array[this.currentTest].id).update({
                    img_4_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                    totalVotes: firebase.firestore.FieldValue.increment(1),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            
            db.collection("users").doc(this.userData.uid).update({
                seenTests: firebase.firestore.FieldValue.arrayUnion(this.test_array[this.currentTest].id),
                coins: firebase.firestore.FieldValue.increment(1),
                votesCast: firebase.firestore.FieldValue.increment(1)
            })

            this.currentTest += 1

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