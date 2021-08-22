<template>
  <div class="thumbnail-picker">
      <!-- <img class="img" :src="thumbnail1">
      <img class="img" :src="thumbnail2"> -->
      <Thumbnail :image="thumbnail1"/>
      <Thumbnail :image="thumbnail2"/>
  </div>
</template>

<script>
import t1 from '../assets/tempThumbnails/ChessThumbnail3.png';
import t2 from '../assets/tempThumbnails/ChessThumbnail.png';
import Thumbnail from '../components/Thumbnail.vue'
export default {
  components: { Thumbnail },
    data () {
        return {
            thumbnail1: t1,
            thumbnail2:t2,
        }
    },
}
</script>

<style lang='scss' scoped>

.thumbnail-picker {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-content: center;
    padding-left: 10px;
    padding-right: 10px;
    margin: 20px;
    background-color: #edf2f4;
    border-radius: 20px;


    .img{
        padding: 10px;
        min-width: 256px;
        min-width: 144px;

        max-width: 640px;
        max-height: 360px;

    }
}


</style>