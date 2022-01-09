<template>
    <div class="container flex flex-col items-center">
        <h1 class="text-2xl">You Chose:</h1>
            <TestCardThumbnail :image="selected_image" class="mb-5"/>
        <div class="grid grid-cols-5 justify-items-center gap-3" v-if="this.showImages">
            <TestCardThumbnail v-for="n in non_selected_image_array" :key="n" :image="n"/>
        </div>
        <div class="container flex flex-col mt-5 items-start">
            <label class="mx-auto text-xl mb-2" for="title">Why did you chose this thumbnail?</label>
            <textarea required v-model="whyChooseVideo" type="textarea" @change="updateTextValue" placeholder="What made you decide to click on this YouTube video?" name="title" id="title" class="pl-3 mx-auto w-11/12 border-gray-100 border-2  rounded-lg focus:border-red-500 focus:outline-none shadow-md h-20 transition duration 500" cols=2></textarea>
        </div>

    </div>
    
</template>

<script>
import firebase from 'firebase';
import TestCardThumbnail from '../components/TestCardThumbnail.vue';

var storageRef = firebase.storage().ref();

export default {
    props: ['selectedIndex','numberOfImages','testid'],
    components: {TestCardThumbnail},
    data(){
        return{
            selected_image: null,
            non_selected_image_array: [],
            showImages: false,
        }
    },

    methods: {
        async fetchImages(){
            for (let i = 0; i < this.numberOfImages; i++) {
                var img_no = i+1;
                if(img_no != this.selectedIndex){
                    await storageRef.child('tests/'+this.testid+'/img_'+img_no+'/').listAll().then((res)=>{
                        console.log(res.items)
                        res.items[0].getDownloadURL().then(url => {
                            this.non_selected_image_array.push(url);
                            console.log(url)
                            console.log("HEYYYYYYYYYYY")
                        }).catch(e=>{
                            console.log(e)
                            console.log("Error <3")
                        })
                    })   
                }else{
                   await storageRef.child('tests/'+this.testid+'/img_'+img_no+'/').listAll().then((res)=>{
                        res.items[0].getDownloadURL().then(url => {
                            this.selected_image = url;
                        }).catch(e=>{
                            console.log(e)
                            console.log("Error <3")
                        })
                    })    
                }
                
            }            

        },
        updateTextValue(){
            this.$emit('onUpdatingText', this.whyChooseVideo, this.testid)
        }
    },
    created(){
        console.log("CREATED IN ENDSURVEYPICKER")
        console.log(this.testid);
        console.log(this.selectedIndex);
        console.log(this.numberOfImages);
        this.fetchImages().then(()=>{
            console.log("Fetched Images");
            this.showImages = true;
            console.log(this.showImages);
        })
    }
}

</script>

<style>

</style>