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
        <TestCard v-for="t in testIDList" :key="t" :testID="t" @deletedTest="deleteTest"/>
    </div>


</template>

<script>
import { mapGetters } from 'vuex';
import firebase from 'firebase';
import TestCard from '../components/TestCard.vue';
import TestBarChart from '../components/TestBarChart.vue';
import BarChartTest from '../components/BarChartTest.vue';


const db = firebase.firestore();
const storageRef = firebase.storage().ref();

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
            noTests: false
        }
    },
    methods: {
        async generateTestList(){
            await db.collection('users').doc(this.userData.uid).get().then((doc) => {
                // reverse test list so newest ones are on top
                this.testIDList = doc.data().testsCreated.reverse();
                if(this.testIDList.length == 0){this.noTests = true};
            });
            console.log(this.testIDList);
        },
        sendToCreateTest(){
            this.$router.push('/createtest')
        },
        deleteTest(testid,img_names){
            db.collection("CreatedTests").doc(testid).delete().then(()=>{
                db.collection("users").doc(this.userData.uid).update({
                    testsCreated: firebase.firestore.FieldValue.arrayRemove(testid)
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
            var index = this.testIDList.indexOf(testid);
            this.testIDList.splice(index,1);
        },
    },
    mounted(){
        this.generateTestList();
    }
}
</script>

<style>

</style>