<template>
<div class="rounded-full bg-yellow-300 text-sm flex justify-center items-center border-2 border-yellow-500" :class="{'text-xs':xtraSmall == true}">
  <span>{{coins}}</span>
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
    }
}
</script>

<style>

</style>