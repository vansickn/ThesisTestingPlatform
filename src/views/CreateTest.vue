<template>
    <h1> Upload your files</h1>
    <div class="dropContainer">
    <Dropzone class="dropzone" v-if="!verified1" @drop.prevent="drop1" @change="select1"/>
    <img v-if="verified1" class="timg" :src="fileURL1" alt="hi" srcset="">
    <Dropzone class="dropzone" v-if="!verified2" @drop.prevent="drop2" @change="select2"/>
    <img v-if="verified2" class="timg" :src="fileURL2" alt="" srcset="">
    <!-- <span class="file-info">File1: {{ dropzoneFile1.name }}</span>
    <span class="file-info">File2: {{ dropzoneFile2.name }}</span> -->
    </div>
    <h3>How large do you want your sample size?</h3>
    <div class="viewership">
        <SampleSizeOption :text="'Option 1'" :activePlan="activePlan" @onUpdatePlan="setActive"/>
        <SampleSizeOption :text="'Option 2'" :activePlan="activePlan" @onUpdatePlan="setActive"/>
        <SampleSizeOption :text="'Option 3'" :activePlan="activePlan" @onUpdatePlan="setActive"/>
        <!-- This is extremely, i mean extremely ugly code, and should be using v-model but cannot get it to work, this 
        will have to work for now -->
    </div>
    <button @click="submitToFirebase"> Create the Test! </button>
    

    
    
</template>

<script>
import Dropzone from '../components/Dropzone.vue'
import SampleSizeOption from '../components/SampleSizeOption.vue'
import {reactive, ref} from 'vue'


export default {
    name: 'CreateTest',
    components: {Dropzone,SampleSizeOption},
    setup() {
        
    },
    methods: {
        verifyFileTest: function (file,order) {
           console.log(file)
            if(file.type != "image/png"){ //also need to deal with jpg,jpeg etc
                console.log("This image is not the correct file type") //Display some sort of error message saying its not a png
            }else{ //condition where it is the correct filetype
                if(order){
                    this.fileURL1 = URL.createObjectURL(file)
                    this.verified1 = true
                }else{
                    this.fileURL2 = URL.createObjectURL(file)
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
            this.verifyFileTest(document.querySelector(".dropzoneFile").files[0],true)
        },
        select2: function () {
            this.verifyFileTest(document.querySelector(".dropzoneFile").files[0],false)
        },
        setActive: function(e) {
            this.activePlan = e
            console.log(this.activePlan)
        },
        submitToFirebase: function() {
            console.log("Submitting")
        }
    },
    data() {
        return {
            fileURL1: null,
            fileURL2: null,
            verified1: false,
            verified2: false,
            activePlan: 'Option 1',
        }
    },
  
}
</script>

<style lang='scss'>
    h1{
        margin: 10px;
        align-self: center;
    }
    .dropContainer {
        background-color: lightgray;
        display: flex;
        width: 95%;
        align-self: center;
        flex-direction: space;
        justify-content: space-evenly;
        align-items: center;
        margin: 20px;
        border-radius: 20px;
        flex-wrap: wrap;
        padding: 20px;

        .timg{
            padding: 10px;
            min-width: 256px;
            min-width: 144px;

            max-width: 640px;
            max-height: 360px;
        }
    }
    .viewership{
        width: 80%;
        background-color: lightgrey;
        align-self: center;
        border-radius: 20px;
        display: flex;
        justify-content: space-evenly;
        
        div{
            margin: 10px;
            width: 200px;
            height: 200px;
            background-color: white;
            border-radius: 10px;
        }
    }
    h3{
        align-self: center;
    }
    button {
        width: 30%;
        height: 30px;
        border-radius: 20px;
        align-content: center;
        margin: 20px;
        align-self: center;
    }

    

    
</style>