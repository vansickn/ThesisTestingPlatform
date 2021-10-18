<template>
  <div class="container inline-flex flex-col justify-center items-center w-full md:w-640 sm:mb-5 xs:mb-5 md:mx-10">
            <Dropzone class="" v-if="!verified" @drop.prevent="drop" @change="select"/>
            <img v-if="verified" class="shadow-xl md:w-640 md:h-360 sm:w-11/12 w-11/12 mx-5 sm:mb-5 xs:mb-5" :src="fileURL" alt="" srcset="">
            <input required v-model="inputText" type="text" placeholder="Enter the Title of your Youtube Video" name="title" id="title" class="pl-3 md:w-640 sm:w-11/12 w-11/12 border-gray-100 border-2  rounded-lg focus:border-red-500 focus:outline-none shadow-md h-10 mx-5 transition duration 500">
    </div>  
</template>

<script>
import Dropzone from '../components/Dropzone.vue';

export default {
    components: {Dropzone},
    data(){
        return{
            verified: false,
            fileURL: null,
            file: null,

        }
    },
    methods: {
        drop(){
            this.verifyFile(e.dataTransfer.files[0])
        },
        select(){
            // will take the first file, may want to check if there are multiple files and throw an error
            this.verifyFile(document.querySelector(".dropzoneFile").files[0])
        },
        verifyFile: function (file) {
           console.log(file)
            if(file.type != "image/png"){ //also need to deal with jpg,jpeg etc
                console.log("This image is not the correct file type") //Display some sort of error message saying its not a png
            }else{ //condition where it is the correct filetype
                this.fileURL = URL.createObjectURL(file)
                this.file = file
                this.verified = true 
                this.sendVerificationToParent()
            } 
        },
        sendVerificationToParent(){
            this.$emit("onImageVerification",this.file)
            console.log(this.inputText)
        },

    }
}
</script>

<style>

</style>