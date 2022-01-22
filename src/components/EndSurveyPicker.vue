<template>
    <div class="container flex flex-col items-center min-w-full">
        <!-- <h1 class="text-2xl">You Chose:</h1>
            <TestCardThumbnail :image="selected_image" class="mb-5"/>
        <div class="grid grid-cols-5 justify-items-center gap-3" v-if="this.showImages">
            <TestCardThumbnail v-for="n in non_selected_image_array" :key="n" :image="n"/>
        </div> -->
        <div class="w-auto pr-10 border-2 border-red-500 container flex flex-row gap-1 mb-2 rounded-xl">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
            <h1>{{search}}</h1>
        </div>
        <div class="sm:w-6/12 w-full grid md:grid-cols-2 grid-cols-1 xs:px-5 mx-auto md:gap-6">
            <!-- <TestCardThumbnail :image="selected_image" class="border-red-500 border-4"/> -->
            <TestCardThumbnail v-for="n in image_array.length" :key="n" :image="image_array[n-1]" :class="{'border-4 border-red-500': position[n-1] == selectedIndex}"/>
        </div>
        <div class="container flex flex-col mt-5 items-start mb-20">
            <label class="mx-auto text-xl mb-2" for="title">Why did you choose this thumbnail?</label>
            <textarea required v-model="whyChooseVideo" type="textarea" @change="updateTextValue" placeholder="What made you decide to click on this YouTube video?" name="title" id="title" class="pl-3 mx-auto w-11/12 border-gray-100 border-2  rounded-lg focus:border-red-500 focus:outline-none shadow-md h-20 transition duration 500" cols=2></textarea>
        </div>

    </div>
    
</template>

<script>
import firebase from 'firebase';
import TestCardThumbnail from '../components/TestCardThumbnail.vue';

var storageRef = firebase.storage().ref();
const db = firebase.firestore();

export default {
    props: ['selectedIndex','numberOfImages','testid','position'],
    components: {TestCardThumbnail},
    data(){
        return{
            // selected_image: null,
            image_array: [],
            showImages: false,
            search: null,
        }
    },

    methods: {
        async fetchImages(){
            for (let i = 0; i < this.numberOfImages; i++) {
                var img_no = this.position[i]; // image number is position[i]
                await storageRef.child('tests/'+this.testid+'/img_'+img_no+'/').listAll().then((res)=>{
                    console.log(res.items)
                    res.items[0].getDownloadURL().then(url => {
                        console.log(this.position)
                        this.image_array[i] = url
                    }).catch(e=>{
                        console.log(e)
                        console.log("Error <3")
                    })
                })   
            }            

        },
        gcd(a, b){
            if (b == 0){
                return a;
            }
            else{
                return this.gcd(b, a % b);
            }
        },
        leftRotate(arr, d, n){
            /* To handle if d >= n */
            d = d % n;
            let g_c_d = this.gcd(d, n);
            for (let i = 0; i < g_c_d; i++) {
                /* move i-th values of blocks */
                let temp = arr[i];
                let j = i;

                while (1) {
                    let k = j + d;
                    if (k >= n)
                        k = k - n;

                    if (k == i)
                        break;

                    arr[j] = arr[k];
                    j = k;
                }
                arr[j] = temp;
            }
        },
        async fetchTitle(){
            await db.collection("Tests").doc(this.testid).get().then((doc)=>{
                this.search = doc.data().ytsearch
                // console.log(this.search)
                // console.log("FETCHING TITLE!!!!!!!!")
            })
        },
        updateTextValue(){
            this.$emit('onUpdatingText', this.whyChooseVideo, this.testid)
        }
    },
    created(){
        // console.log("CREATED IN ENDSURVEYPICKER")
        console.log(this.position)
        console.log(this.testid);
        console.log(this.selectedIndex);
        console.log(this.numberOfImages);
        this.fetchTitle().then(()=>{
            console.log("Fetched Title")
        });
        this.fetchImages().then(()=>{
            // console.log("Fetched Images");
            // const shift_by = this.position.indexOf(1)
            // this.leftRotate(this.image_array,shift_by,6)
            this.showImages = true;
            console.log(this.showImages);
        })
    }
}

</script>

<style>

</style>