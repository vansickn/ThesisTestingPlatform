<template>
  <div class="container flex flex-col items-center mt-3">
      <h1 class="text-3xl">Thank you for participating in the experiment!</h1>
      <span class="text-lg">Before you go, please help us understand why you made the choices you did.</span>
      <!-- {{seenTests[0]['selected']}} -->
      <div class="container flex flex-col gap-5 items-center mb-5" v-if="showTests">
        <EndSurveyPicker v-for="n in seenTests.length" :key="n" :numberOfImages="6" :selectedIndex="selectedImageIndicies[n-1]" :testid="seenTests[n-1]" @onUpdatingText="updateResponses"/>
        <button class="rounded-xl bg-red-500 shadow-xl p-5 text-white cursor-pointer" @click="submitToFirebase">Submit</button>
      </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import { mapGetters } from 'vuex';
import EndSurveyPicker from '../components/EndSurveyPicker.vue';

const db = firebase.firestore();


export default {
    components: {EndSurveyPicker},
    data(){
        return {
            seenTests: [],
            selectedImageIndicies: [],
            showTests: false,
            responses: {},
        }
    },
    methods: {
        async fetchData(){
            await db.collection('users').doc(this.userData.uid).get().then((doc)=>{
                // this.seenTests = doc.data().seenTests
                for (let i = 0; i < doc.data().seenTests.length; i++) {
                    this.seenTests.push(doc.data().seenTests[i]['test']);
                    this.selectedImageIndicies.push(doc.data().seenTests[i]['selected'])
                    // console.log(doc.data().seenTests[i])
                }
            });
            console.log(this.seenTests);
            console.log(this.selectedImageIndicies);
        },
        updateResponses(response,testid){
            this.responses[testid] = response;
            console.log(this.responses)
        },
        submitToFirebase(){
            let responsesArray = []
            for (let i = 0; i < this.seenTests.length; i++) {
                responsesArray.push({test:this.seenTests[i],response:this.responses[this.seenTests[i]]});
            }
            // storing the response in the user's data. Probably should store it in the Tests as well
            db.collection('users').doc(this.userData.uid).update({
                responses: responsesArray,
            }).then(()=>{
                console.log("stored data in user's data")
            }).catch(err=>{
                console.log("There's an Error lmao: " + err);
            })
            // putting response into Tests collection and test document as well
            for (let i = 0; i < responsesArray.length; i++) {
                db.collection("Tests").doc(responsesArray[i].test).update({
                    responses: firebase.firestore.FieldValue.arrayUnion(responsesArray[i].response)
                }).then(()=>{
                    console.log("Successfully added response to the test document")
                }).catch(err=>{
                    console.log("There was an error adding the response to the test document" + err)
                })
            }
        }
    },
    computed: {
        ...mapGetters({
            userData: "userData",
        })
    },
    mounted(){
        // this.fetchData();
        console.log("mounted endsurvey")
    },
    watch: {
        userData: function(newval,oldval){
            console.log(newval);
            if(newval != null){
                this.fetchData().then(()=>{
                    this.showTests = true;
                    console.log(this.seenTests);
                })
            }
        }
    }
}
</script>

<style>

</style>