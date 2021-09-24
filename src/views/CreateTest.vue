<template>
    <h1 class="mx-auto py-5 text-2xl"> Upload your files</h1>


    <div class="w-full flex mx-auto justify-center items-center flex-wrap">
        <Dropzone class="dropzone" v-if="!verified1" @drop.prevent="drop1" @change="select1"/>
        <img v-if="verified1" class="shadow-xl md:w-640 md:h-360 sm:w-11/12 w-11/12 mx-5 sm:mb-5 xs:mb-5" :src="fileURL1" alt="" srcset="">
        <input type="text" placeholder="Enter the title of your Youtube Video" name="title" id="title2" class="pl-3 mb-5 md:w-640 sm:w-426 w-426 border-gray-200  rounded-lg focus:border-red-500 focus:outline-none shadow-md h-10 mx-5 transition duration 500">


        <Dropzone class="dropzone" v-if="!verified2" @drop.prevent="drop2" @change="select2"/>
        <img v-if="verified2" class="shadow-xl md:w-640 md:h-360 sm:w-11/12 w-11/12 mx-5 sm:mb-5 xs:mb-5" :src="fileURL2" alt="" srcset="">
        <input type="text" placeholder="Enter the Title of your Youtube Video" name="title" id="title2" class="pl-3 md:w-640 sm:w-426 w-426 border-gray-200  rounded-lg focus:border-red-500 focus:outline-none shadow-md h-10 mx-5 transition duration 500">
</div>



    <h3 class="sm:text-xl text-lg mx-auto mb-10 mt-5">How large do you want your sample size?</h3>
    <div class="grid lg:grid-cols-4 grid-cols-2 gap-10 gap-y-10 mb-20 sm:mx-auto sm:w-9/12 mx-3">
        <SampleSizeOption v-for="sample in sampleOptions" :key="sample" :input="sample" :activePlan="activePlan" @onUpdatePlan="setActive"/>
 
        <!-- This is extremely, i mean extremely ugly code, and should be using v-model but cannot get it to work, this 
        will have to work for now -->
        <!-- Going to pass an object into each sample size option with number of coins, size text, number of samples -->
    </div>

    <button class="rounded-lg bg-red-500 w-60 mx-auto p-4 text-white shadow-lg transition duration-500 ease-in-out transform hover:scale-110" @click="submitToFirebase"> Create Test! </button>
    

    
    
</template>

<script>
import Dropzone from '../components/Dropzone.vue'
import SampleSizeOption from '../components/SampleSizeOption.vue'
import {reactive, ref} from 'vue'
import { mapGetters, Store } from 'vuex';
import firebase from 'firebase'

const db = firebase.firestore();
var storageRef = firebase.storage().ref();

export default {
    name: 'CreateTest',
    components: {Dropzone,SampleSizeOption},
    computed: {
        ...mapGetters({
            user: "user",
        }),
    },
    methods: {
        verifyFileTest: function (file,order) {
           console.log(file)
            if(file.type != "image/png"){ //also need to deal with jpg,jpeg etc
                console.log("This image is not the correct file type") //Display some sort of error message saying its not a png
            }else{ //condition where it is the correct filetype
                if(order){
                    this.fileURL1 = URL.createObjectURL(file)
                    this.file1 = file
                    this.verified1 = true
                }else{
                    this.fileURL2 = URL.createObjectURL(file)
                    this.file2 = file
                    this.verified2 = true
                }
                console.log(this.fileURL1)
                console.log(this.fileURL2)
                console.log(this.verified1)
                console.log(this.verified2)
            } 
        },
        drop1: function (e) {
            this.verifyFileTest(e.dataTransfer.files[0],true);
        },
        drop2: function (e) {
            this.verifyFileTest(e.dataTransfer.files[0],false)
        },
        select1: function () {
            console.log(document.querySelector(".dropzoneFile").files)
            this.verifyFileTest(document.querySelector(".dropzoneFile").files[0],true)
        },
        select2: function () {
            this.verifyFileTest(document.querySelector(".dropzoneFile").files[0],false)
        },
        setActive: function(e) {
            console.log(e)
            this.activePlan = e
            console.log(this.activePlan)
        },
        submitToFirebase: function() {
            console.log("Submitting")
            var metadata = {
                contentType: "png",
                user: this.user.data.uid,
            }
            db.collection("CreatedTests").add({
                plan: this.activePlan,
                user: this.user.data.uid,
                img1votes: 0,
                img2votes: 0,
                seenBy: []
            }).then(docRef => {
                // this needs to be a for-loop for all of the files, neeeeed to make this extensible
                // this is extraordinarily ugly code I am just getting it to work
                console.log(docRef.id)
                var ref1 = storageRef.child("/tests/" + docRef.id + "/" + this.file1.name)
                ref1.put(this.file1,metadata).then(snapshot => {
                    console.log(snapshot)
                    console.log("uploaded a file")
                })
                var ref2 = storageRef.child("/tests/" + docRef.id + "/" + this.file2.name)
                ref2.put(this.file2,metadata).then(snapshot => {
                    console.log(snapshot)
                    console.log("uploaded a file")
                })

                db.collection("users").doc(this.user.data.uid).update({
                    testsCreated: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                })
            })
        }
    },
    data() {
        return {
            fileURL1: null,
            fileURL2: null,
            file1: null,
            file2: null,
            verified1: false,
            verified2: false,
            activePlan: 'Option 1',
            sampleOptions: [
                    {
                        size: "Small",
                        coin_amount: 10,
                        sample_size: 25
                    },
                    {
                        size: "Medium",
                        coin_amount: 30,
                        sample_size: 100
                    },
                    {
                        size: "Large",
                        coin_amount: 100,
                        sample_size: 500 
                    },
                    {
                        size: "XL",
                        coin_amount: 300,
                        sample_size: 2000  
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