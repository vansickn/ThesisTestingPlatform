<template>
<!-- Div container, flex column, first item is image, second item is another div with flex row, aligned to left -->
    <div class="md:w-5/12 sm:w-100 sm:mb-5 xs:w-100 xs:mb-5 container flex-col">
        <img class= 'shadow-xl transition duration-300 ease-in-out transform md:hover:scale-105 filter md:hover:brightness-105 select-none' @click="clickedThumbnail" @mouseover="hover = true" @mouseleave="hover = false" :src="image" @load="loadImage" 
        :class="{
            'hover': hover,
            'border-4 border-red-500 rounded-md': border == 'red',
            'border-4 border-blue-500 rounded-md': border == 'blue',
            }">
        <div class="container flex-row flex"> 
            <img :src="userCreated" class="bg-red-100 md:w-10 md:h-10 rounded-full mt-3 w-8 h-8 mb-0">
            <span class="md:ml-5 ml-3 mt-3 text-sm md:text-base"> {{title}}</span>
            
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
    props: ['image','userCreated','title', 'border'],
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
        console.log(this.border)
    },
    methods: {
        clickedThumbnail(){
            this.$emit('onClickedThumbnail')
            this.isLoaded = false;
        },
        loadImage(){
            this.isLoaded = true;
        },
        borderColor(color){
            if(color == 'red'){
                return {'border-4 border-red-500 rounded-md':border != null};
            }
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