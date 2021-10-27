<template>

    <div v-if="showTests" class="sm:w-6/12 w-full grid md:grid-cols-2 grid-cols-1 xs:px-5 mx-auto md:gap-4">
            <!-- <img class="img" :src="thumbnail1">
        <img class="img" :src="thumbnail2"> -->
        <!-- Want function to ultimately be selectedThumbnail -->
        <!-- <Thumbnail @onClickedThumbnail="selectThumbnail1" :image="thumbnail1" :userCreated="userCreatedPhoto" :title="title1" class="mx-5"/>
        <Thumbnail @onClickedThumbnail="selectThumbnail2" :image="thumbnail2" :userCreated="userCreatedPhoto" :title="title2" class="mx-5"/> -->
        <!-- need to change click to image instead of whole thumbnail -->

        <!-- New system for the thumbnails -->
        <!-- v-for on thumbnail, data given by array similar to how it works in mytests -->
        <!-- need the img_array to be reactive since it takes so long -->

        <!-- Might create a seperate component for the actual tester aspect of this, because the reliability of the images loading is very suspect -->

        <Thumbnail v-for="n in test_array[currentTest].imageCount" :key="n" :image="test_array[currentTest].img_array[n-1] " :title="test_array[currentTest].title_array[n-1]" :userCreated="user_profile_images_array[currentTest]" :index="n" @onClickedThumbnail="selectThumbnail"/>

    </div>
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
            title0: null,
            title2: null,
            test_array: [], //array of objects
            image_array: [],
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
            await db.collection('ActiveTests').get().then(querySnapshot => {
                querySnapshot.forEach((doc) => {

                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    // console.log("" + this.user.data.uid)
                    // console.log(doc.data().user)
                    const numberOfImages = doc.data().numberOfImages;
                    const title_array = doc.data().title_array;
                    const sampleSize = doc.data().sampleSize;
                    const img_array = []

                    // Checks if the user created it, if they did they will not see it
                    // only if theyre logged in though, if not they can see it
                    if(this.userData != null){
                        console.log("Userdata is not null")
                        if("" + this.userData.uid != doc.data().user){
                            console.log("Logged in")
                            // This solution works for now, kinda still shitty but works for now
                            this.fetchImages(doc.id, numberOfImages).then((img_array) => {
                                this.getUserCreatedProfilePhoto(doc.data().user);
                                this.verifyArray(img_array,numberOfImages);
                                const obj = {
                                    // added to the test_array list as this object
                                    id: doc.id,
                                    imageCount: numberOfImages,
                                    title_array: title_array,
                                    sampleSize: sampleSize,
                                    img_array: img_array,
                                }
                                this.test_array.push(obj);
                            });
                        }
                    }else{
                        console.log("Not logged in")
                        console.log(doc.id)
                        this.fetchImages(doc.id, numberOfImages).then((img_array) => {
                                this.verifyArray(img_array,numberOfImages);
                                this.getUserCreatedProfilePhoto(doc.data().user)
                                const obj = {
                                    // added to the test_array list as this object
                                    id: doc.id,
                                    imageCount: numberOfImages,
                                    title_array: title_array,
                                    sampleSize: sampleSize,
                                    img_array: img_array,
                                }
                                this.test_array.push(obj);
                            })
                    }
                });
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
                        img_array[i] = url
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
                this.currentTest += 1
                return
            }
            if(n==1){
                db.collection("CreatedTests").doc(this.test_array[this.currentTest].id).update({
                    img_1_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(n==2){
                db.collection("CreatedTests").doc(this.test_array[this.currentTest].id).update({
                    img_2_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(n==3){
                db.collection("CreatedTests").doc(this.test_array[this.currentTest].id).update({
                    img_3_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(n==4){
                db.collection("CreatedTests").doc(this.test_array[this.currentTest].id).update({
                    img_4_votes : firebase.firestore.FieldValue.increment(1),
                    seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
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
        selectThumbnail2: function () {
            db.collection("CreatedTests").doc(this.testIDs[this.currentTest].id).update({
                img2votes: firebase.firestore.FieldValue.increment(1),
                seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
            })
            .then( console.log(this.onChangingThumbnails()))
            .catch(error => {
                console.log(error)
            })
            console.log(this.userData.uid)
            db.collection("users").doc(this.userData.uid).update({
                seenTests: firebase.firestore.FieldValue.arrayUnion(this.testIDs[this.currentTest].id),
                coins: firebase.firestore.FieldValue.increment(1),
                votesCast: firebase.firestore.FieldValue.increment(1)
            })
            this.setNextThumbnail()
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