<template>

    <div class="container flex flex-col items-center">
        <h1 class="text-3xl mt-5">Welcome to the Experiment!</h1>
        <h1 class="text-xl">To get to know you a little better, please fill out this form before we begin.</h1>
        
        <div class="container flex flex-row justify-center mx-auto gap-3 mt-5">
            <h1 class="text-base">What is your age?</h1>
            <input class="pl-3 w-40 border-gray-100 border-2  rounded-lg focus:border-red-500 focus:outline-none shadow-md mx-5 transition duration 500" type="number" name="age" id="age">
        </div>
        <div class="container flex flex-row justify-center mx-auto gap-3 mt-5">
            <h1 class="text-base">Gender? (F:0, M:1, NB:2)</h1>
            <input class="pl-3 w-40 border-gray-100 border-2  rounded-lg focus:border-red-500 focus:outline-none shadow-md mx-5 transition duration 500" type="number" name="gender" id="gender">
        </div>
        <div class="container flex flex-row justify-center mx-auto gap-3 mt-5">
            <h1 class="text-base">Year in College? </h1>
            <input class="pl-3 w-40 border-gray-100 border-2  rounded-lg focus:border-red-500 focus:outline-none shadow-md mx-5 transition duration 500" type="number" name="college" id="college">
        </div>
        <div class="container flex flex-row justify-center mx-auto gap-3 mt-5">
            <h1 class="text-base">Hours Spent on Internet for non-entertainment tasks each week </h1>
            <input class="pl-3 w-40 border-gray-100 border-2  rounded-lg focus:border-red-500 focus:outline-none shadow-md mx-5 transition duration 500" type="number" name="tasks" id="tasks">
        </div>
        <div class="container flex flex-row justify-center mx-auto gap-3 mt-5">
            <h1 class="text-base">Hours Spent on Internet for entertainment each week </h1>
            <input class="pl-3 w-40 border-gray-100 border-2  rounded-lg focus:border-red-500 focus:outline-none shadow-md mx-5 transition duration 500" type="number" name="entertainment" id="entertainment">
        </div>
        <div class="container flex flex-row justify-center mx-auto gap-3 mt-5">
            <h1 class="text-base">Hours Spent on YouTube for non-entertainment tasks each week </h1>
            <input class="pl-3 w-40 border-gray-100 border-2  rounded-lg focus:border-red-500 focus:outline-none shadow-md mx-5 transition duration 500" type="number" name="YTtasks" id="YTtasks">
        </div>
        <div class="container flex flex-row justify-center mx-auto gap-3 mt-5">
            <h1 class="text-base">Hours Spent on YouTube for entertainment each week </h1>
            <input class="pl-3 w-40 border-gray-100 border-2  rounded-lg focus:border-red-500 focus:outline-none shadow-md mx-5 transition duration 500" type="number" name="YTentertainment" id="YTentertainment">
        </div>

        <button @click="startTest" class="bg-red-500 text-white shadow-xl p-5 rounded-xl mt-5">Start Test!</button>
    </div>

</template>

<script>
import firebase from 'firebase';
import { mapGetters, Store } from 'vuex';
var db = firebase.firestore()

export default {

    methods:{
        startTest(){
            if(document.querySelector("#age").value.length == 0 || document.querySelector("#gender").value.length == 0 || document.querySelector("#college").value.length == 0 || document.querySelector("#tasks").value.length == 0 || document.querySelector("#entertainment").value.length == 0 || document.querySelector("#YTtasks").value.length == 0 || document.querySelector("#YTentertainment").value.length == 0){
                alert("Please Fill out the required fields!")
            }else{
                db.collection("users").doc(this.userData.uid).update({
                    age:document.querySelector("#age").value,
                    gender:document.querySelector("#gender").value,
                    college:document.querySelector("#college").value,
                    internetTasks:document.querySelector("#tasks").value,
                    internetEntertainment:document.querySelector("#entertainment").value,
                    youtubeTasks:document.querySelector("#YTtasks").value,
                    youtubeEntertainment:document.querySelector("#YTentertainment").value,
                }).then(()=> {
                    console.log("Saved to users collection")
                    this.$router.push("/thesistest")
                })
            }
        }
    },
    computed: {
        ...mapGetters({
            userData: "userData",
        }),
    },

}
</script>

<style>

</style>