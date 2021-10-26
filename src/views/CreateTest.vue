<template>
    <h1 class="mx-auto py-5 text-2xl"> Upload your files</h1>


    <div class="w-full flex mx-auto justify-center items-center flex-wrap">
        <ImageSelector v-for="n in numberOfSelectors" :key="n" :image_no="n" @onImageVerification="onVerifiedImage" @onTitleChange="updateTitle"/>
    </div>



    <h3 class="sm:text-xl text-lg mx-auto mb-10 mt-5">How large do you want your sample size?</h3>
    <div class="grid lg:grid-cols-4 grid-cols-2 gap-10 gap-y-10 mb-20 sm:mx-auto sm:w-9/12 mx-3">
        <SampleSizeOption v-for="sample in sampleOptions" :key="sample" :input="sample" :activePlan="activePlan" @onUpdatePlan="setActive"/>
    </div>

    <button class="rounded-lg bg-red-500 w-60 mx-auto p-4 text-white shadow-lg transition duration-500 ease-in-out transform hover:scale-110" @click="submitToFirebase"> Create Test! </button>
    

    
    
</template>

<script>
import Dropzone from '../components/Dropzone.vue';
import SampleSizeOption from '../components/SampleSizeOption.vue';
import {reactive, ref} from 'vue';
import { mapGetters, Store } from 'vuex';
import firebase from 'firebase';
import ImageSelector from '../components/ImageSelector.vue'

const db = firebase.firestore();
var storageRef = firebase.storage().ref();

export default {
    name: 'CreateTest',
    components: {Dropzone,SampleSizeOption,ImageSelector},
    computed: {
        ...mapGetters({
            user: "user",
        }),
    },
    methods: {
        onVerifiedImage(file,image_no){
            console.log(file)
            console.log(image_no)
            // image_no -1 because image numbers start at 1
            this.img_array[image_no-1] = file
        },
        updateTitle(textValue, image_no){
            console.log(textValue);
            console.log(image_no);
            // image_no -1 because image numbers start at 1
            this.title_array[image_no-1] = textValue
            console.log(this.img_array)
            console.log(this.title_array)
        },
        setActive: function(size,coin_amount) {
            console.log(size)
            console.log(coin_amount)
            this.activePlan = size
            this.sampleSize = coin_amount
            console.log(this.activePlan)
        },
        submitToFirebase: function() {

            if(this.img_array.length < 2){
                console.log("Not enough images")
                return
            }
            if(this.title_array.length < 2){
                console.log("Not enough titles")
                return
            }
            db.collection("CreatedTests").add({
                // Have to do it this way because cant increment a vote inside an array
                img_1_votes: 0,
                img_2_votes: 0,
                img_3_votes: 0,
                img_4_votes: 0,
                totalVotes: 0,
                numberOfImages: this.numberOfSelectors,
                plan: this.activePlan,
                sampleSize: this.sampleSize,
                user: this.user.data.uid,
                seenBy: [],
                title_array: this.title_array,
            }).then(docRef => {
                for (let i = 0; i < this.img_array.length; i++) {
                    console.log(this.img_array[i])
                    console.log(this.title_array[i])
                    const i_no = i+1
                    var ref = storageRef.child("/tests/" + docRef.id + "/img_" + i_no + "/" + this.img_array[i].name)
                    ref.put(this.img_array[i]).then(snapshot => {
                        console.log(snapshot)
                        console.log("Uploaded file " + this.img_array[i].name)
                        ready_to_reroute += 1
                    })
                }
                db.collection("users").doc(this.user.data.uid).update({
                    testsCreated: firebase.firestore.FieldValue.arrayUnion(docRef.id)}).then(() => {
                        this.$router.push('/mytests')
                    })

            })
            // create test in firestore
            // loop through the img array and create 







            // need to add regex here for the title
            // if(document.getElementById("title1").value === "" || document.getElementById("title2").value === ""){
            //     console.log("Error in Title")
            //     return
            // }
            // console.log("Submitting")
            // var metadata = {
            //     contentType: "png",
            //     user: this.user.data.uid,
            // }
            // db.collection("CreatedTests").add({
            //     plan: this.activePlan,
            //     sampleSize: this.sampleSize,
            //     user: this.user.data.uid,
            //     img1votes: 0,
            //     img2votes: 0,
            //     seenBy: [],
            //     title1: document.getElementById("title1").value,
            //     title2: document.getElementById("title2").value,
            //     imageNames: [this.file1.name, this.file2.name]
            // }).then(docRef => {
            //     // this needs to be a for-loop for all of the files, neeeeed to make this extensible
            //     // this is extraordinarily ugly code I am just getting it to work
            //     console.log(docRef.id)
            //     var ref1 = storageRef.child("/tests/" + docRef.id + "/" + this.file1.name)
            //     ref1.put(this.file1,metadata).then(snapshot => {
            //         console.log(snapshot)
            //         console.log("uploaded a file")
            //     })
            //     var ref2 = storageRef.child("/tests/" + docRef.id + "/" + this.file2.name)
            //     ref2.put(this.file2,metadata).then(snapshot => {
            //         console.log(snapshot)
            //         console.log("uploaded a file")
            //     })
            //     db.collection("users").doc(this.user.data.uid).update({
            //         testsCreated: firebase.firestore.FieldValue.arrayUnion(docRef.id)
            //     }).then(() => {
            //         this.$router.push('/mytests')
            //     })
            // })
            // this.$router.push('/account')
        },
        sendToAccountRoute(){
            this.$router.push('/account')
        }
    },
    data() {
        return {
            img_array: [],
            title_array: [],
            numberOfSelectors: 2,
            fileURL1: null,
            fileURL2: null,
            file1: null,
            file2: null,
            verified1: false,
            verified2: false,
            activePlan: 'Small',
            sampleSize: 25,
            sampleOptions: [
                    {
                        size: "Small",
                        coin_amount: 25,
                        sample_size: 25
                    },
                    {
                        size: "Medium",
                        coin_amount: 90,
                        sample_size: 100
                    },
                    {
                        size: "Large",
                        coin_amount: 420,
                        sample_size: 500 
                    },
                    {
                        size: "XL",
                        coin_amount: 800,
                        sample_size: 1000  
                    }
                ]
        }
    },
  
}
</script>

// <style lang='scss'>
//     h1{
//         margin: 10px;
//         align-self: center;
//     }
//     .dropContainer {
//         background-color: lightgray;
//         display: flex;
//         width: 95%;
//         align-self: center;
//         flex-direction: space;
//         justify-content: space-evenly;
//         align-items: center;
//         margin: 20px;
//         border-radius: 20px;
//         flex-wrap: wrap;
//         padding: 20px;

//         .timg{
//             padding: 10px;
//             min-width: 256px;
//             min-width: 144px;

//             max-width: 640px;
//             max-height: 360px;
//         }
//     }
//     .viewership{
//         width: 80%;
//         background-color: lightgrey;
//         align-self: center;
//         border-radius: 20px;
//         display: flex;
//         justify-content: space-evenly;
        
//         div{
//             margin: 10px;
//             width: 200px;
//             height: 200px;
//             background-color: white;
//             border-radius: 10px;
//         }
//     }
//     h3{
//         align-self: center;
//     }
//     button {
//         width: 30%;
//         height: 30px;
//         border-radius: 20px;
//         align-content: center;
//         margin: 20px;
//         align-self: center;
//     }

    

    
// </style>