<template>

    <div class="w-full flex mx-auto justify-center items-center flex-wrap">
            <!-- <img class="img" :src="thumbnail1">
        <img class="img" :src="thumbnail2"> -->
        <!-- Want function to ultimately be selectedThumbnail -->
        <Thumbnail v-if="user.data != null" @onClickedThumbnail="selectThumbnail1" :image="thumbnail1" :userCreated="userCreatedPhoto" :title="title1"/>
        <Thumbnail v-if="user.data != null" @onClickedThumbnail="selectThumbnail2" :image="thumbnail2" :userCreated="userCreatedPhoto" :title="title2"/>
        <!-- need to change click to image instead of whole thumbnail -->
    </div>
<!-- going to pass in the user who created the test, and calculate the user photo from here. Could also just calculate that in the home.vue as well and just pass in the photo. Either works -->
</template>


<script>
import Thumbnail from '../components/Thumbnail.vue';
import firebase from 'firebase';
import { mapGetters} from 'vuex';

const db = firebase.firestore();
var storageRef = firebase.storage().ref();

// Eventually want to send the data about the thumbnail (photo, title, profImage as an object into the thumbnail)
export default {
    components: { Thumbnail },
    computed: {
        ...mapGetters ({
            user: "user",
            userData: "userData"
        })
    },
    data () {
        return {
            thumbnail1: null,
            thumbnail2: null,
            testIDs: [],
            currentTest: -1,
            userCreatedPhoto: null,
            title1: null,
            title2: null,
        }
    },
    mounted(){
        this.testList();
    },
    methods: {
        // Grabs all of the doc ID's of the Tests, then going to use this list to grab from storage //this is a test and I have no idea what i'm doing <3
        async testList() {
            // TODO : Restrict viewing tests for people who have already seen the test, look into new ways i can model the data to handle that functionality
            // Test for now
            await db.collection('CreatedTests').get().then(querySnapshot => {
                querySnapshot.forEach((doc) => {

                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    console.log("" + this.user.data.uid)
                    console.log(doc.data().user)

                    // Checks if the user created it, if they did they will not see it
                    if("" + this.userData.uid != doc.data().user){
                        this.testIDs.push({
                            id: doc.id,
                            userCreated: doc.data().user,
                            title1: doc.data().title1,
                            title2: doc.data().title2,
                        }); 
                    }
                    
                });
            }).catch(err => {
                console.log("Error: " + err)
            })
            this.setNextThumbnail();
        },


        setNextThumbnail: function() {
            this.setCurrentTest(this.currentTest +=1);
            // console.log("hey from here")
            // console.log(this.currentTest)

            // need some sort of validation if the testIDs runs out, and then just displays a screen saying there are no more tests to vote on
           
            storageRef.child('/tests/' + this.testIDs[this.currentTest].id).listAll().then((res) => {
                console.log(res)
                res.items[0].getDownloadURL().then(url => {
                    this.thumbnail1 = url
                })
                res.items[1].getDownloadURL().then(url => {
                    this.thumbnail2 = url
                })
            })
            this.getUserCreatedProfilePhoto(this.testIDs[this.currentTest].userCreated);
            this.title1 = this.testIDs[this.currentTest].title1;
            this.title2 = this.testIDs[this.currentTest].title2;
        },
        setCurrentTest: async function (docID) {
            this.currentTest = docID;
            console.log(this.currentTest)
        },
        selectThumbnail1: function () {
            db.collection("CreatedTests").doc(this.testIDs[this.currentTest].id).update({
                img1votes: firebase.firestore.FieldValue.increment(1),
                seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
            })
            .then(this.onChangingThumbnails())
            .catch(error => {
                console.log(error)
            })
            db.collection("users").doc(this.userData.uid).update({
                seenTests: firebase.firestore.FieldValue.arrayUnion(this.testIDs[this.currentTest].id),
                coins: firebase.firestore.FieldValue.increment(1),
                votesCast: firebase.firestore.FieldValue.increment(1)
            })
            this.setNextThumbnail()
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
            db.collection("users").doc(userID).get().then(doc => {
                console.log(doc.data())
                this.userCreatedPhoto = doc.data().photoURL
                console.log(this.userCreatedPhoto)
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