<template>
  <div class="container inline-flex flex-col justify-center items-center w-full md:w-640 sm:mb-5 xs:mb-5 md:mx-10">
            <Dropzone class="" v-if="!verified" @drop.prevent="drop" @change="select"/>
            <img v-if="verified" class="shadow-xl md:w-640 md:h-360 sm:w-11/12 w-11/12 mx-5 sm:mb-5 xs:mb-5" :src="fileURL" alt="" srcset="">
            <input required v-model="textValue" type="text" @change="updateTextValue" placeholder="Enter the Title of your Youtube Video" name="title" id="title" class="pl-3 md:w-640 sm:w-11/12 w-11/12 border-gray-100 border-2  rounded-lg focus:border-red-500 focus:outline-none shadow-md h-10 mx-5 transition duration 500">
            <div class="grid grid-cols-3 mt-3 self-start">
                <button>
                    <svg class="w-10 h-10" :class="{'text-red-500':happyFace ==true}" @click="toggleTypeValue('happy')" @change="updateTypeValue(happyFace)" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"></path></svg>
                </button>
                <button>
                    <svg class="w-10 h-10" :class="{'text-red-500':neutralFace ==true}" @click="toggleTypeValue('neutral')" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clip-rule="evenodd"></path></svg>
                </button>
                <button>
                    <svg class="w-10 h-10" :class="{'text-red-500':noFace == true}" @click="toggleTypeValue('noFace')" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
    </div> 

    <Modal
            v-model="show_file_issue"
            :close="closeModal"
        >
            <div class="bg-gray-200 rounded-lg md:p-10 p-6 w-11/12 sm:w-auto">
                <h1 class="sm:text-xl text-center text-red-500">File was not accepted</h1>
                <h3 class="text-center sm:text-lg pb-4">Your file must match the following specifications</h3>
                <ul class="mb-3 list-disc list-inside">
                    <li>Image must be in JPEG/JPG or PNG Format</li>
                    <li>Image must be in a 16x9 aspect ratio</li>
                    <li>Image must be 2mb or smaller in file size</li>
                </ul> 
            <div class="container flex flex-row justify-center gap-4">
                <button @click="closeModal" class="bg-gray-300 border-2 border-gray-400 rounded-lg py-1 px-2 shadow-lg transform hover:scale-110 transition duration-300"> OK </button>
            </div>
            </div>
        </Modal>

</template>

<script>
import Dropzone from '../components/Dropzone.vue';

export default {
    props: ['image_no'],
    components: {Dropzone},
    data(){
        return{
            verified: false,
            fileURL: null,
            file: null,
            show_file_issue: false,
            happyFace: false,
            neutralFace: false,
            noFace: false,

        }
    },
    methods: {
        drop(e){
            this.verifyFile(e.dataTransfer.files[0])
        },
        select(){
            // will take the first file, may want to check if there are multiple files and throw an error
            this.verifyFile(document.querySelector(".dropzoneFile").files[0])
        },
        verifyFile: function (file) {
        //    console.log(file)
            if(file.type != "image/png"){ //also need to deal with jpg,jpeg etc
                console.log("This image is not the correct file type"); //Display some sort of error message saying its not a png
                this.show_file_issue = true;
            }else{ //condition where it is the correct filetype
                this.fileURL = URL.createObjectURL(file)
                this.file = file
                this.verified = true 
                this.sendVerificationToParent()
            } 
        },
        sendVerificationToParent(){
            // emmits the file when it has been verified
            this.$emit("onImageVerification",this.file,this.image_no)
        },
        updateTextValue(){
            // whenever the text is changed, emits the value to the parent container
            this.$emit("onTitleChange",this.textValue,this.image_no)
        },
        toggleTypeValue(type){
            if(type == 'happy'){
                this.happyFace = true;
                this.neutralFace = false;
                this.noFace = false;
            }
            else if(type == 'neutral'){
                this.neutralFace = true;
                this.happyFace = false;
                this.noFace = false;
            }
            else if(type == 'noFace'){
                this.noFace = true;
                this.happyFace = false;
                this.neutralFace = false;
            }
            this.$emit("onTypeChange",type,this.image_no);

        },
        closeModal(){
            this.show_file_issue = false;
        },

    },
}
</script>

<style>

</style>