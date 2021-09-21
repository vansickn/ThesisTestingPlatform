<template>
<!-- Div container, flex column, first item is image, second item is another div with flex row, aligned to left -->
    <div class="md:w-5/12 mx-5 sm:w-100 sm:mb-5 xs:w-100 xs:mb-5 container flex-col">
        <img class= 'shadow-xl transform md:hover:scale-105 filter md:hover:brightness-105' @click="clickedThumbnail" @mouseover="hover = true" @mouseleave="hover = false" :class="{'hover': hover}" :src="image">
        <div class="container flex-row flex"> 
            <img :src="userCreated" class="bg-red-100 md:w-10 md:h-10 rounded-full mt-3 w-8 h-8 mb-0">
            <span class="md:ml-5 ml-3 mt-3 text-sm md:text-base"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, eos.</span>
            
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
    props: ['image','userCreated'],
    computed: {
        ...mapGetters({
            userData: 'userData',
            user: 'user'
        })
    },
    data (){
        return {
            hover: false
        } 
    },
    created(){
        console.log(this.userCreated)
    },
    methods: {
        clickedThumbnail(){
            this.$emit('onClickedThumbnail')
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