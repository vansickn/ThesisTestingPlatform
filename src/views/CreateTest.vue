<template>
    <h1 class="mx-auto py-5 text-2xl"> Upload your files</h1>    

    <div class="w-full flex mx-auto justify-center items-center flex-wrap">
        <ImageSelector v-for="n in numberOfSelectors" :key="n" :image_no="n" @onImageVerification="onVerifiedImage" @onTitleChange="updateTitle" @onTypeChange="updateType"/>
    </div>

    <div class=" border-2 border-red-500 w-11/12 mx-auto focus:outline-none">
        <textarea class="w-full" name="prompt" id="prompt" cols="30" rows="10"></textarea>
    </div>
    <div class=" border-2 border-red-500 w-11/12 mx-auto focus:outline-none">
        <textarea class="w-full" name="ytsearch" id="ytsearch" cols="30" rows="3"></textarea>
    </div>

    <button class="rounded-lg bg-red-500 w-60 mx-auto p-4 text-white shadow-lg transition duration-500 ease-in-out transform hover:scale-110 mt-10 mb-20" @click="submitToFirebase"> Create Test! </button>
    
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
        updateType(type, image_no){
            console.log(type);
            console.log(image_no);
            this.thumbnail_type_array[image_no-1] = type;

            console.log(this.thumbnail_type_array);
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
            document.querySelector("#ytsearch").value;
            if(this.user.data == null){
                this.show_must_be_logged_in = true;
            }
            // should be this.img_array.length < number of selectors, will change this later
            else if(this.img_array.length < this.numberOfSelectors){
                console.log("Not enough images")
                return
            }
            else if(this.title_array.length < this.numberOfSelectors){
                console.log("Not enough titles")
                return
            }
            else if(document.querySelector("#prompt").value == ""){
                console.log("No Prompt");
                console.log(document.querySelector("#ytsearch").value)
                return
            }
            else if(document.querySelector("#ytsearch").value == ""){
                console.log("No yt search")
                return
            }
            else{
                db.collection("Tests").add({
                    // Have to do it this way because cant increment a vote inside an array
                    img_1_votes: 0,
                    img_2_votes: 0,
                    img_3_votes: 0,
                    img_4_votes: 0,
                    img_5_votes: 0,
                    img_6_votes: 0,
                    totalVotes: 0,
                    numberOfImages: this.numberOfSelectors,
                    user: this.user.data.uid,
                    seenBy: [],
                    title_array: this.title_array,
                    type_array: this.thumbnail_type_array,
                    user_photo_url: this.user_profile_photo,
                    prompt: document.querySelector("#prompt").value,
                    ytsearch: document.querySelector("#ytsearch").value,
                }).then(docRef => {
                    
                    this.sendImagesToStorage(docRef).then(()=>{
                        this.$router.push('/mytests')
                    })
    
                    db.collection("users").doc(this.user.data.uid).update({
                        testsCreated: firebase.firestore.FieldValue.arrayUnion(docRef.id),
                        }).then(() => {
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
            await db.collection("users").doc(this.user.data.uid).get().then((doc) => {
                this.user_profile_photo = doc.data().photoURL;
            }).catch(err=> {console.log(err)})
        },
        sendToHome(){
            this.$router.push('/');
        },
    },
    data() {
        return {
            paidAccount: null,
            user_activeTests: null,
            user_coins: null,
            sample_type: 'Random',
            show_more_than_one_active_test: false,
            show_sample_information: false,
            show_must_be_logged_in: false,
            show_not_enough_coins: false,
            show_creating_test: false,
            img_array: [],
            title_array: [],
            numberOfSelectors: 6,
            fileURL1: null,
            fileURL2: null,
            file1: null,
            file2: null,
            verified1: false,
            verified2: false,
            activePlan: 'Small',
            sampleSize: 25,
            coins_to_purchase: 25,
            thumbnail_type_array:[],

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