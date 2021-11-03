<template>
    <h1 class="mx-auto py-5 text-2xl"> Upload your files</h1>


    <div class="w-full flex mx-auto justify-center items-center flex-wrap">
        <ImageSelector v-for="n in numberOfSelectors" :key="n" :image_no="n" @onImageVerification="onVerifiedImage" @onTitleChange="updateTitle"/>
    </div>


    <div class="container flex flex-row justify-center sm:text-xl text-lg">
        <h1 class="text-center">Which population would you like to sample from?</h1>
        <button @click="show_sample_information = true">
            <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </button>
    </div>
    <div class="container flex flex-row justify-center items-center gap-4 mt-2">
        <button class="bg-gray-100 border-red-500 border-2 rounded-lg p-2 flex gap-2 transition duration-500 transform hover:scale-110" :class="{'bg-red-500 border-yellow-300 text-white':sample_type == 'Random'}" @click="sample_type = 'Random'">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h1> Random </h1>
        </button>
        <button class="bg-gray-100 border-red-500 border-2 rounded-lg p-2 flex gap-2 transition duration-500 transform hover:scale-110" :class="{'bg-red-500 border-yellow-300 text-white':sample_type == 'Fans'}" @click="sample_type = 'Fans'">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <h1> Your Fans </h1>
        </button>
    </div>

    <h3 class="sm:text-xl text-lg mx-auto mb-10 mt-5 text-center">How large do you want your sample size?</h3>
    <div class="grid lg:grid-cols-4 grid-cols-2 gap-10 gap-y-10 mb-5 sm:mx-auto sm:w-9/12 mx-3" v-if="sample_type == 'Random'">
        <SampleSizeOption v-for="sample in sample_options_random" :key="sample" :input="sample" :activePlan="activePlan" @onUpdatePlan="setActive"/>
    </div>
    <div class="grid lg:grid-cols-4 grid-cols-2 gap-10 gap-y-10 mb-5 sm:mx-auto sm:w-9/12 mx-3" v-if="sample_type == 'Fans'">
        <SampleSizeOption v-for="sample in sample_options_fans" :key="sample" :input="sample" :activePlan="activePlan" @onUpdatePlan="setActive"/>
    </div>

    <button class="rounded-lg bg-red-500 w-60 mx-auto p-4 text-white shadow-lg transition duration-500 ease-in-out transform hover:scale-110 mt-10 mb-20" @click="submitToFirebase"> Create Test! </button>
    
    <Modal
            v-model="show_sample_information"
            :close="closeModal"
        >
            <div class="bg-gray-200 rounded-lg md:p-10 p-6 sm:w-auto">
                <h1 class="sm:text-xl text-center mb-3">Which population should I sample?</h1>
                <div class="container flex flex-row gap-4 mb-5">
                    <div class="container border-red-500 border-2 bg-gray-100 flex-col rounded-lg">
                        <div class="container flex flex-row items-center justify-center gap-2 mt-1 mb-2">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <h1 class="text-sm md:text-base">Random</h1>
                        </div>
                        <ul class="list-disc list-inside ml-4 sm:ml-8 sm:text-sm text-xs">
                            <li>Less Bias</li>
                            <li>More coins</li>
                        </ul>
                        <h1 class="text-xs mx-auto text-center bold mt-1">Best for smaller creators</h1>
                    </div>
                    <div class="container border-red-500 border-2 bg-gray-100 flex-col rounded-lg">
                        <div class="container flex flex-row items-center justify-center gap-2 mt-1 mb-2">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            <h1 class="text-sm md:text-base">Fans</h1>
                        </div>
                        <ul class="list-disc list-inside ml-4 sm:ml-8 sm:text-sm text-xs">
                            <li>More Bias</li>
                            <li>Less coins</li>
                        </ul>
                        <h1 class="text-xs mx-auto text-center bold mt-1">Best for larger creators</h1>
                    </div>
                </div>
                
            <div class="container flex flex-row justify-center gap-4 mt-2">
                <button @click="closeModal" class="bg-gray-300 border-2 border-gray-400 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> OK </button>
            </div>
            </div>
    </Modal>
    
    
</template>

<script>
import Dropzone from '../components/Dropzone.vue';
import SampleSizeOption from '../components/SampleSizeOption.vue';
import {reactive, ref} from 'vue';
import { mapGetters, Store } from 'vuex';
import firebase from 'firebase';
import ImageSelector from '../components/ImageSelector.vue'
import Coin from '../components/Coin.vue'

const db = firebase.firestore();
var storageRef = firebase.storage().ref();

export default {
    name: 'CreateTest',
    components: {Dropzone,SampleSizeOption,ImageSelector,Coin},
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
                
                this.sendImagesToStorage(docRef).then(()=>{
                    this.$router.push('/mytests')
                })

                db.collection("users").doc(this.user.data.uid).update({
                    testsCreated: firebase.firestore.FieldValue.arrayUnion(docRef.id)}).then(() => {
                        console.log('added to users collection')
                    })
            })
        },
        sendToAccountRoute(){
            this.$router.push('/account')
        },
        async sendImagesToStorage(docRef){
            for (let i = 0; i < this.img_array.length; i++) {
                console.log(this.img_array[i])
                console.log(this.title_array[i])
                const i_no = i+1
                var ref = storageRef.child("/tests/" + docRef.id + "/img_" + i_no + "/" + this.img_array[i].name)
                await ref.put(this.img_array[i]).then(snapshot => {
                    console.log(snapshot)
                    console.log("Uploaded file " + this.img_array[i].name)
                })
            }
        },
        closeModal(){
            this.show_sample_information = false;
        },
    },
    data() {
        return {
            fan_coin_cost: 50,
            sample_type: 'Random',
            show_sample_information: false,
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
            sample_options_random: [
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
            ],
            sample_options_fans: [
                    {
                        size: "Small",
                        coin_amount: 25,
                        sample_size: 1000
                    },
                    {
                        size: "Medium",
                        coin_amount: 50,
                        sample_size: 3000
                    },
                    {
                        size: "Large",
                        coin_amount: 100,
                        sample_size: 9000 
                    },
                    {
                        size: "XL",
                        coin_amount: 200,
                        sample_size: 'inf'  
                    }
            ],

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