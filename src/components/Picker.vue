<template>
  <div class="thumbnail-picker">
      <!-- <img class="img" :src="thumbnail1">
      <img class="img" :src="thumbnail2"> -->
      <!-- Want function to ultimately be selectedThumbnail -->
      <Thumbnail @click="selectThumbnail1" :image="thumbnail1"/>
      <Thumbnail @click="selectThumbnail2" :image="thumbnail2"/>
  </div>
</template>

<script>
import Thumbnail from '../components/Thumbnail.vue';
import firebase from 'firebase';
import { mapGetters} from 'vuex';

const db = firebase.firestore();
var storageRef = firebase.storage().ref();

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
        }
    },
    mounted(){
        this.testList();
    },
    methods: {
        // Grabs all of the doc ID's of the Tests, then going to use this list to grab from storage
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
                        this.testIDs.push(doc.id); 
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
           
            storageRef.child('/tests/' + this.testIDs[this.currentTest]).listAll().then((res) => {
                console.log(res)
                res.items[0].getDownloadURL().then(url => {
                    this.thumbnail1 = url
                })
                res.items[1].getDownloadURL().then(url => {
                    this.thumbnail2 = url
                })
            })
        },
        setCurrentTest: async function (docID) {
            this.currentTest = docID;
            console.log(this.currentTest)
        },
        selectThumbnail1: function () {
            db.collection("CreatedTests").doc(this.testIDs[this.currentTest]).update({
                img1votes: firebase.firestore.FieldValue.increment(1),
                seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
            })
            .then( console.log("added one to img1 votes"))
            .catch(error => {
                console.log(error)
            })
            db.collection("users").doc(this.userData.uid).update({
                seenTests: firebase.firestore.FieldValue.arrayUnion(this.testIDs[this.currentTest]),
                coins: firebase.firestore.FieldValue.increment(1)
            })
            this.setNextThumbnail()
        },
        selectThumbnail2: function () {
            db.collection("CreatedTests").doc(this.testIDs[this.currentTest]).update({
                img2votes: firebase.firestore.FieldValue.increment(1),
                seenBy: firebase.firestore.FieldValue.arrayUnion(this.userData.uid),
            })
            .then( console.log("added one to img2 votes"))
            .catch(error => {
                console.log(error)
            })
            console.log(this.userData.uid)
            db.collection("users").doc(this.userData.uid).update({
                seenTests: firebase.firestore.FieldValue.arrayUnion(this.testIDs[this.currentTest]),
                coins: firebase.firestore.FieldValue.increment(1)
            })
            this.setNextThumbnail()
        }

    }
}
</script>

<style lang='scss' scoped>

.thumbnail-picker {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-content: center;
    padding-left: 10px;
    padding-right: 10px;
    margin: 20px;
    background-color: #edf2f4;
    border-radius: 20px;


    .img{
        padding: 10px;
        min-width: 256px;
        min-width: 144px;

        max-height: 360px;
        max-width: 640px;

    }
}


</style>