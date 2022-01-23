<template>
<!-- Div container, flex column, first item is image, second item is another div with flex row, aligned to left -->
    <div class="w-auto h-auto container mb-5 flex-col">
        <div>
        <img v-show="!isLoaded" class="shadow-xl transition duration-300 ease-in-out transform md:hover:scale-105 filter md:hover:brightness-105 select-none animate-pulse" src="/src/assets/loadingthumbnail2.png" alt="hey">
        <!-- <div class="w-360 h-202 bg-gray-300 border-2 border-gray-400">loading</div> -->
        <img v-show="isLoaded" class= 'shadow-xl transition duration-300 ease-in-out transform md:hover:scale-105 filter md:hover:brightness-105 select-none' @click="clickedThumbnail" @mouseover="hover = true" @mouseleave="hover = false" :src="image" @load="loadImage" 
        :class="{
            'hover': hover,
            'border-4 border-red-500 rounded-md': border == 'red',
            'border-4 border-blue-500 rounded-md': border == 'blue',
            }">
        </div>
        <div class="container flex-row flex"> 
            <!-- <img :src="userCreated" class="bg-red-100 md:w-10 md:h-10 rounded-full mt-3 w-8 h-8 mb-0"> -->
            <svg class="w-8 h-8 mt-3 border-black border-2 rounded-full" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            <span class="md:ml-5 ml-3 mt-3 text-sm md:text-base"> {{title}}</span>
        </div>
        
    </div>
    <!-- <div class="container mx-auto w-5/12">
        <img class="rounded-full border-2 border-red-500 mx-auto h-10 w-10" :src="userData.photo" alt="" srcset="">
    </div> -->
</template>

<script>
import {mapGetters} from 'vuex';
import firebase from 'firebase';

var storageRef = firebase.storage().ref();

export default {
    name: 'thumbnail',
    props: ['userCreated','title', 'border','index','testid','currentTest'],
    computed: {
        ...mapGetters({
            userData: 'userData',
            user: 'user'
        })
    },
    data (){ 
        return {
            hover: false,
            isLoaded: false,
            userPhotoLoaded: false,
            image: null,
            show_image: false,
        } 
    },
    created(){
        console.log(this.title)
        console.log(this.border)
        console.log(this.image)
    },
    mounted(){
        console.log("mounted")
        console.log(this.userCreated)
        this.fetchImage();
    },
    watch: {
        testid: function(val){
            this.isLoaded = false;
            this.fetchImage();
            console.log(val)
        }
    },
    methods: {
        clickedThumbnail(){
            if(!this.isLoaded){
                return
            }else{
                this.$emit('onClickedThumbnail',this.index)
                this.isLoaded = false;
            }
        },
        loadImage(){
            this.isLoaded = true;
        },
        borderColor(color){
            if(color == 'red'){
                return {'border-4 border-red-500 rounded-md':border != null};
            }
        },
        async fetchImage(){
            await storageRef.child('tests/'+this.testid+'/img_'+this.index+'/').listAll().then((res)=>{
                res.items[0].getDownloadURL().then(url => {
                    this.image = url;
                }).catch(e=>{
                    console.log(e)
                    console.log("Error <3")
                })
            })
        }

    }
}
</script>

<style lang='scss' scoped>

    // .img{
    //     padding: 10px;
    //     min-width: 256px;
    //     min-width: 144px;

    //     max-width: 640px;
    //     max-height: 360px;
    // }
    // .img.hover{
    //     background-color: green;
        
    // }
</style>