<template>
<div class="container flex flex-col gap-2">
  <div class="container flex flex-col bg-gray-100 border-2 border-red-500 justify-center gap-3 w-40 rounded-xl h-36 xs:w-36 xs:h-32 shadow-lg transform hover:scale-105 transition duration-500 ease-in-out select-none"
  :class="
  {'border-green-400':color == 'green',
   'border-blue-400':color == 'blue',
   'border-yellow-300': color == 'yellow',
   }">
      <h1 class="text-7xl mx-auto self-center">{{number}}</h1>
  </div>
  <span class="mx-auto select-none">{{text}}</span>
</div>
</template>

<script>
export default {
    props: ['number','text','color'],

}
</script>

<style>

</style>

