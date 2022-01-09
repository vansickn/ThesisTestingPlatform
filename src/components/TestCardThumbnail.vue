<template>
<!-- Div container, flex column, first item is image, second item is another div with flex row, aligned to left -->
    <div class="">
        <img v-show="!isLoaded" class="animate-pulse" src="/src/assets/loadingthumbnail2.png" alt="">
        <img v-show="isLoaded" class= 'shadow-xl transition duration-300 ease-in-out transform md:hover:scale-105 filter md:hover:brightness-105 select-none' @click="clickedThumbnail" @mouseover="hover = true" @mouseleave="hover = false" :src="image" @load="loadImage" 
        :class="{
            'hover': hover,
            'border-4 border-red-500 rounded-md': index == 0,
            'border-4 border-blue-500 rounded-md': index == 1,
            'border-4 border-yellow-300 rounded-md': index == 2,
            'border-4 border-purple-500 rounded-md': index == 3,
            }">
        <div class="container mx-auto"> 
            <span class=" mt-3 text-xs md:text-base"> {{title}}</span>
            
        </div>
        
    </div>
    <!-- <div class="container mx-auto w-5/12">
        <img class="rounded-full border-2 border-red-500 mx-auto h-10 w-10" :src="userData.photo" alt="" srcset="">
    </div> -->
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    name: 'thumbnail',
    props: ['image','title', 'index','testid'],
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
        } 
    },
    created(){
        console.log(this.title)
    },
    methods: {
        clickedThumbnail(){
            this.$emit('onClickedThumbnail')
            this.isLoaded = false;
        },
        loadImage(){
            this.isLoaded = true;
            console.log("LOADED IS TRUE")
        },
    
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