<template>
<div class="rounded-full bg-yellow-300 text-sm flex justify-center items-center border-2 border-yellow-500" :class="{'text-xs':xtraSmall == true}">
  <span>{{truncate_number(coins)}}</span>
</div>
   <!-- this template will be a little coin svg or something which animates on update: -->
</template>

<script>
export default {
    data(){
        return {
          xtraSmall: false
        }
    },
    props:['coins'],
    methods: {
      truncate_number(num){
        if (num > 999){
          return ((num/1000)+"").substring(0,4)+"k"
        }else{
          return num
        }
      }
    }
}
</script>

<style>

</style>