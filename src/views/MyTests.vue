<template>
  <div class="container flex flex-row md:ml-10 md:my-10 ml-5 my-5 items-center max-w-full">
        <img :src="userData.photo" alt="Hey?" srcset="" class="rounded-full lg:w-20 lg:h-20 md:w-16 md:h-16 w-10 h-10  border-2 border-black md:mr-10 mr-5 select-none">
        <h1 class="lg:text-6xl md:text-4xl sm:text-2xl text-lg">{{userData.displayName}}'s Tests</h1>
    </div>

    <!-- <div class="mb-20">
        <TestCard v-for="id in testList" :testID="id" :key="id"/>        
    </div> -->
    <div class="mb-20 grid grid-cols-2">
        <BarChartTest v-for="t in testIDList" :key="t" :id="t"/>
    </div>


</template>

<script>
import { mapGetters } from 'vuex';
import firebase from 'firebase';
import TestCard from '../components/TestCard.vue';
import TestBarChart from '../components/TestBarChart.vue';
import BarChartTest from '../components/BarChartTest.vue';

const db = firebase.firestore();

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
        }
    },
    methods: {
        async generateTestList(){
            await db.collection('users').doc(this.userData.uid).get().then((doc) => {
                this.testIDList = doc.data().testsCreated
                // doc.data().testsCreated.forEach((id)=>{
                //     this.generateBarObjects(id);
                // })
            });
            console.log(this.testIDList);
        },
        // async generateBarObjects(testid){
        //     await db.collection('CreatedTests').doc(testid).get().then((doc) => {
        //         console.log(doc.data())
        //         this.testList.push(this.createBarObject(doc.data(),testid));
        //     })
        // },
        // createBarObject(docdata,idNumber){
        //     // console.log(docdata)
        //     return {
        //         id: idNumber,
        //         dataForBar: {
        //             labels: [docdata.title1,docdata.title2],
        //             datasets: [
        //                 {
        //                     label: "Sample Test",
        //                     backgroundColor: ["#1abc9c", "#f1c40f", "#2980b9", "#34495e"],
        //                     data: [docdata.img1votes,docdata.img2votes] 
        //                 }
        //             ]
        //         }
        //     }
        // }
    },
    mounted(){
        this.generateTestList();
    }
}
</script>

<style>

</style>