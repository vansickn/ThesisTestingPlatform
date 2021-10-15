<template>
  <div class="card-wrapper">
    <Thumbnail :image="img1"/>
    <Thumbnail :image="img2"/>
  </div>
  <div>
    
  </div>
</template>

<script>
import Thumbnail from '../components/Thumbnail.vue'
import firebase from 'firebase'
import { mapGetters } from 'vuex';

const db = firebase.firestore();

export default {
    components: { Thumbnail },
    data() {
      return{
        img1: null,
        img2: null,
        testList: [],
      }
    },
    computed: {
        ...mapGetters({
            user: 'user'
        })
    },
    created(){
        // this.generateTests();
        // this.generateTestImages();
    },
    methods: {
        // async generateTests() {
        //     await db.collection('users').doc(this.user.data.uid).get()
        //     .then(doc => {
        //         doc.data().testsCreated.forEach(test => {
        //             console.log(test)
        //             this.testList.push(test)
        //         })             
        //     })
        //     .catch(err => {console.log(err)})
        // },
        // generateTestImages(testID) {
        //     firebase.storage().ref().child('/tests/' + testID).listAll().then(res => {
        //         res.items[0].getDownloadURL().then(url => {
        //             this.img1 = url
        //         })
        //         res.items[1].getDownloadURL().then(url => {
        //             this.img2 = url
        //         })
        //     })
        // },

    },
}
</script>

<style lang='scss' scoped>

.card-wrapper{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-content: center;
    padding-left: 10px;
    padding-right: 10px;
    margin: 20px;
    background-color: #edf2f4;
    border-radius: 20px;
}

</style>