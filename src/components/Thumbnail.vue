<template>
    <img class= 'img' @mouseover="hover = true" @mouseleave="hover = false" :class="{'hover': hover}" :src="image">
</template>

<script>
export default {
    name: 'thumbnail',
    props: ['image'],
    data (){
        return {
            hover: false
        } 
    },
    methods: {
    }
}
</script>

<style lang='scss' scoped>

    .img{
        padding: 10px;
        min-width: 256px;
        min-width: 144px;

        max-width: 640px;
        max-height: 360px;
    }
    .img.hover{
        background-color: green;
        
    }
</style>