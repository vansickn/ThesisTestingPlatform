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
                            <li>Random users</li>
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
                            <li>Your fans</li>
                        </ul>
                        <h1 class="text-xs mx-auto text-center bold mt-1">Best for larger creators</h1>
                    </div>
                </div>
                
            <div class="container flex flex-row justify-center gap-4 mt-2">
                <button @click="closeModal" class="bg-gray-300 border-2 border-gray-400 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> OK </button>
            </div>
            </div>
    </Modal>
    <Modal
    v-model="show_must_be_logged_in"
    :close="closeModal"
    >
        <div class="bg-gray-200 rounded-lg md:p-10 p-6 sm:w-auto">
            <h1 class="text-xl text-center">You must be logged in before submitting tests!</h1>
            <h3 class="text-lg text-center text-red-500">Use the "Log in" button on the top of the screen to log in!</h3>
            <div class="container flex flex-row justify-center mt-3">
                <button @click="closeModal" class="bg-gray-300 border-2 border-gray-400 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> OK </button>
            </div>
        </div>

    </Modal>
    <Modal
            v-model="show_not_enough_coins"
            :close="closeModal"
        >
            <div class="bg-gray-200 rounded-lg md:p-10 p-6 sm:w-auto">
                <div class="container flex flex-row justify-center items-center gap-3 mx-auto">
                    <h1 class="sm:text-xl text-lg">You need</h1>
                    <Coin :coins="coins_to_purchase-user_coins" class="w-8 h-8"/>
                    <h1 class="sm:text-xl text-lg">coins!</h1>
                </div>
                
                <div class="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-2 mt-4 flex-wrap">
                    <!-- <button @click="closeModal" class="bg-yellow-300 border-2 border-yellow-400 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> Sponsored video for 75 coins </button>
                    <button @click="closeModal" class="bg-green-500 border-2 border-green-600 text-white rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> $6 for 1000 coins </button> -->
                    <div class="container flex sm:flex-col flex-row items-center gap-2">
                        <Coin :coins="75" class="w-10 h-10"/>
                        <button @click="closeModal" class="bg-yellow-300 border-2 border-yellow-400 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300">Watch Sponsored video</button> 
                    </div>
                    <div class="container flex sm:flex-col flex-row items-center gap-2">
                        <Coin :coins="1000" class="w-10 h-10"/>
                        <button @click="closeModal" class="bg-green-500 border-2 border-green-600 text-white rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> Premium Membership </button> 
                    </div>
                </div>
                <div class="mx-auto mt-5 container flex flex-row justify-center">
                <button @click="sendToHome" class="bg-red-500 border-2 border-red-600 text-white rounded-lg p-1 mx-auto shadow-lg">Or, vote on more tests!</button>
                </div>
            </div>
    </Modal>
    <Modal
    v-model="show_more_than_one_active_test"
    :close="closeModal"
    >
        <div class="bg-gray-200 rounded-lg md:p-10 p-6 sm:w-auto">
            <h1 class="text-xl text-center">You already have one active test!</h1>
            <h3 class="text-lg text-center text-red-500">Would you like to delete or deactivate it?</h3>
            <TestCard :testID="user_activeTests[0]" @deletedTest="deleteTest" @deactivatedTest="deactivateTest" :active="true"/>
            <h1 class="text-base text-center">*use the icons on the test card to deactivate or delete the test</h1>
            <div class="container flex flex-row justify-center mt-3 gap-2">
                <button @click="closeModal" class="bg-gray-300 border-2 border-gray-400 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> No Thanks </button>
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
import TestCard from '../components/TestCard.vue'

const db = firebase.firestore();
var storageRef = firebase.storage().ref();

const activateTestFunction = firebase.functions().httpsCallable('onTestActivation');
const deactivateTestFunction = firebase.functions().httpsCallable('onTestDeActivation');

export default {
    name: 'CreateTest',
    components: {Dropzone,SampleSizeOption,ImageSelector,Coin,TestCard},
    computed: {
        ...mapGetters({
            user: "user",
            userData: "userData",
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
        setActive: function(size,sample_size,coin_amount) {
            console.log(size)
            console.log(coin_amount)
            this.activePlan = size
            this.sampleSize = sample_size
            this.coins_to_purchase = coin_amount
            console.log(this.activePlan)
        },
        submitToFirebase: function() {
            if(this.user.data == null){
                this.show_must_be_logged_in = true;
            }
            // should be this.img_array.length < number of selectors, will change this later
            else if(this.img_array.length < 2){
                console.log("Not enough images")
                return
            }
            else if(this.title_array.length < 2){
                console.log("Not enough titles")
                return
            }
            else if(this.user_coins < this.coins_to_purchase){
                this.show_not_enough_coins = true;
                return
            }
            else if(this.user_activeTests != null && this.user_activeTests.length >= 1){
                this.show_more_than_one_active_test = true
            }
            else{
                db.collection("CreatedTests").add({
                    // Have to do it this way because cant increment a vote inside an array
                    img_1_votes: 0,
                    img_2_votes: 0,
                    img_3_votes: 0,
                    img_4_votes: 0,
                    totalVotes: 0,
                    numberOfImages: this.numberOfSelectors,
                    sample_type: this.sample_type,
                    plan: this.activePlan,
                    sampleSize: this.sampleSize,
                    user: this.user.data.uid,
                    seenBy: [],
                    title_array: this.title_array,
                    coins_to_purchase: this.coins_to_purchase,
                }).then(docRef => {
                    
                    this.sendImagesToStorage(docRef).then(()=>{
                        this.$router.push('/mytests')
                    })
    
                    db.collection("users").doc(this.user.data.uid).update({
                        testsCreated: firebase.firestore.FieldValue.arrayUnion(docRef.id),
                        coins: firebase.firestore.FieldValue.increment(this.coins_to_purchase*-1),
                        activeTests: firebase.firestore.FieldValue.arrayUnion(docRef.id),
                        }).then(() => {
                            activateTestFunction({
                                testid: docRef.id,
                                sampletype: this.sample_type,
                            }).then((res)=>{
                                console.log(res)
                            })
                            console.log('added to users collection')
                        })

                })
            }
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
            this.show_must_be_logged_in = false;
            this.show_not_enough_coins = false;
            this.show_more_than_one_active_test = false;
        },
        async fetchData() {
            await db.collection("users").doc(this.user.data.uid).get().then(doc => {
                this.user_coins = doc.data().coins;
                this.user_activeTests = doc.data().activeTests;
                console.log(this.user_activeTests)
            }).catch(err=> {console.log(err)})
        },
        sendToHome(){
            this.$router.push('/');
        },
        deleteTest(testid,img_names){
            db.collection("CreatedTests").doc(testid).delete().then(()=>{
                db.collection("users").doc(this.userData.uid).update({
                    testsCreated: firebase.firestore.FieldValue.arrayRemove(testid),
                    activeTests: firebase.firestore.FieldValue.arrayRemove(testid),
                }).then(()=>{
                    for (let i = 1; i < img_names.length+1; i++) {
                        var ref = storageRef.child('tests/'+testid +'/'+ 'img_' + i + '/'+ img_names[i-1])
                        ref.delete().then(()=>{
                            // Maybe do some sort of notification on the screen
                            console.log(img_names[i-1] + " has been successfully deleted")
                        }).catch((err)=>{
                            console.log(err)
                            console.log("Error deleting file")
                        });   
                    }
                    this.removeTestFromArray(testid)
                }).catch((e)=>{
                    console.log(e)
                    console.log("couldn't remove created test from user's test array")
                })

            }).catch((error)=>{
                console.log("could not delete test for some reason <3")
            })
        },
        removeTestFromArray(testid){
            console.log(testid)
            var index = this.user_activeTests.indexOf(testid);
            this.user_activeTests.splice(index,1);
        },
        deactivateTest(testid,sampletype){
            // always gonna be the first index of the activeTests, at least in this scenario. Garbage code to the rescue <3
            // eventually going to need to remove the test from whichever active collection its in. AKA randomSampleTests or fanSampleTests
            db.collection("users").doc(this.userData.uid).update({
                activeTests: firebase.firestore.FieldValue.arrayRemove(testid)
            }).then(()=>{
                console.log("successfully deactivated test");
                this.removeTestFromArray(testid);
                deactivateTestFunction({testid:testid,sampletype:sampletype}).then(()=>{
                    this.closeModal();
                    console.log("Successfully deactivated the test")
                }).catch(err=>{
                    console.log(err)
                    console.log("error deactivating the test")
                })
            }).catch(e=>{
                console.log(e);
                console.log("Error deactivating the test");
            })
        }
    },
    data() {
        return {
            user_activeTests: null,
            user_coins: null,
            sample_type: 'Random',
            show_more_than_one_active_test: false,
            show_sample_information: false,
            show_must_be_logged_in: false,
            show_not_enough_coins: false,
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
            coins_to_purchase: 25,
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
                        sample_size: 300
                    },
                    {
                        size: "Medium",
                        coin_amount: 50,
                        sample_size: 1500
                    },
                    {
                        size: "Large",
                        coin_amount: 100,
                        sample_size: 5000 
                    },
                    {
                        size: "XL",
                        coin_amount: 200,
                        sample_size: 15000
                    }
            ],

        }
    },
    mounted(){
        // fetches coin data basically, also active tests
        this.fetchData();
    }
  
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