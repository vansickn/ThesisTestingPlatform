<template>
  <div class="container flex flex-row md:ml-10 md:my-10 ml-5 my-5 items-center max-w-full">
        <img :src="userData.photo" alt="Hey?" srcset="" class="rounded-full lg:w-20 lg:h-20 md:w-16 md:h-16 w-10 h-10  border-2 border-black md:mr-10 mr-5 select-none">
        <h1 class="lg:text-6xl md:text-4xl sm:text-2xl text-lg">{{userData.displayName}}'s Tests</h1>
    </div>

    <!-- <div class="mb-20">
        <TestCard v-for="id in testList" :testID="id" :key="id"/>        
    </div> -->
    <div v-if="testIDList != null && testIDList.length == 0" class="mx-auto flex flex-col gap-5 mt-10">
        <h1 class="text-3xl">You have no tests!</h1>
        <button class="bg-red-500 rounded-xl p-4 text-white text-2xl shadow-xl" @click="sendToCreateTest">Create one</button>
    </div>
    <div class="mb-20 grid lg:grid-cols-2 grid-cols-1 gap-y-4">
        <TestCard v-for="t in testIDList" :key="t" :testID="t" :active="activeTestList.includes(t)" @deletedTest="deleteTest" @deactivatedTest="deactivateTest" @reactivatedTest="reactivateTest"/>
    </div>
    <Modal
    v-model="show_more_than_one_active_test"
    :close="closeModal"
    >
        <div class="bg-gray-200 rounded-lg md:p-10 p-6 sm:w-auto">
            <h1 class="text-xl text-center">You already have one active test!</h1>
            <h3 class="text-lg text-center text-red-500">Would you like to delete or deactivate it?</h3>
            <TestCard :testID="activeTestList[0]" @deletedTest="deleteTest" :active="true"/>
            <div class="container flex flex-row justify-center mt-3 gap-2">
                <button @click="closeModal" class="bg-gray-300 border-2 border-gray-400 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> No Thanks </button>
                <button @click="deactivateTest(activeTestList[0])" class="bg-gray-300 border-2 border-red-500 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> De-Activate Test </button>
            </div>
        </div>

    </Modal>

</template>

<script>
import { mapGetters } from 'vuex';
import firebase from 'firebase';
import TestCard from '../components/TestCard.vue';
import TestBarChart from '../components/TestBarChart.vue';
import BarChartTest from '../components/BarChartTest.vue';


const db = firebase.firestore();
const storageRef = firebase.storage().ref();
const activateTestFunction = firebase.functions().httpsCallable('onTestActivation');
const deactivateTestFunction = firebase.functions().httpsCallable('onTestDeActivation');

// Heres the plan:
// Create an array of objects with the root of each object as the test ID
// Create a separate function which handles the imgvotes snapshot which directly mutates the object
// that way the graph functions in real time

export default {
    computed: {
        ...mapGetters({
            userData: 'userData'
        })
    },
    components: {TestCard,TestBarChart,BarChartTest},
    data(){
        return {
            testIDList: null,
            testList: [],
            noTests: false,
            activeTestList: null,
            show_more_than_one_active_test: false,

        }
    },
    methods: {
        async generateTestList(){
            await db.collection('users').doc(this.userData.uid).get().then((doc) => {
                // reverse test list so newest ones are on top
                this.testIDList = doc.data().testsCreated.reverse();
                this.activeTestList = doc.data().activeTests;
                if(this.testIDList.length == 0){this.noTests = true};
            });
            console.log(this.testIDList);
        },
        sendToCreateTest(){
            this.$router.push('/createtest')
        },
        deleteTest(testid,img_names,sample_type){
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
                    this.removeTestFromActiveArray(testid)
                    deactivateTestFunction({
                        testid:testid,
                        sampletype:sample_type,
                    }).then(res=>{
                        console.log(res);
                        console.log("deactivated test");
                    })
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
            var index = this.testIDList.indexOf(testid);
            this.testIDList.splice(index,1);
        },
        removeTestFromActiveArray(testid){
            if(!this.activeTestList.includes(testid)){return}
            else{
                console.log(testid)
                var index = this.activeTestList.indexOf(testid);
                this.activeTestList.splice(index,1);
            }
        },
        deactivateTest(testid,sampletype){
            // always gonna be the first index of the activeTests, at least in this scenario. Garbage code to the rescue <3
            // eventually going to need to remove the test from whichever active collection its in. AKA randomSampleTests or fanSampleTests
            db.collection("users").doc(this.userData.uid).update({
                activeTests: firebase.firestore.FieldValue.arrayRemove(testid)
            }).then(()=>{
                deactivateTestFunction({testid:testid,sampletype:sampletype}).then(()=>{
                    console.log("deactivated test")
                })
                console.log("successfully deactivated test");
                this.removeTestFromActiveArray(testid);
                this.closeModal();
            }).catch(e=>{
                console.log(e);
                console.log("Error deactivating the test");
            })
        },
        reactivateTest(testid,sampletype){
            if(this.activeTestList.length >= 1){
                this.show_more_than_one_active_test = true;
                return
            }else{
                this.reactivateTestInDB(testid);
                activateTestFunction({
                    testid: testid,
                    sampletype: sampletype,
                }).then(res=>{
                    console.log(res.data)
                })
            }
        },
        reactivateTestInDB(testid){
            db.collection("users").doc(this.userData.uid).update({
             activeTests: firebase.firestore.FieldValue.arrayUnion(testid)
         }).then(()=>{
             console.log("successfully reactivated test");
             this.activeTestList.push(testid)
             this.closeModal();
         }).catch(e=>{
             console.log(e);
             console.log("Error reactivating the test");
         }) 
        },
        closeModal(){
            this.show_more_than_one_active_test = false;
        }
    },
    mounted(){
        this.generateTestList();
    }
}
</script>

<style>

</style>