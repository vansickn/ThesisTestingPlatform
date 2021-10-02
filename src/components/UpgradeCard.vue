<template>
  <div class="container flex flex-col bg-gray-100 border-2 border-red-500 justify-center gap-3 w-auto xs:w-11/12 px-5 rounded-xl h-auto shadow-lg select-none"
  :class="
  {'border-green-400':color == 'green',
   'border-blue-400':color == 'blue',
   'border-yellow-300': color == 'yellow',
   }">
      <h1 class="text-md md:text-lg lg:text-2xl mx-auto self-center mt-2">{{text}}</h1>
      <div v-if="unlimited == true" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button class="container flex flex-row items-center gap-2 rounded-xl bg-yellow-300 border-2 border-yellow-400 p-3 text-sm transform hover:scale-105 transition duration-500 ease-in-out justify-around">
            <Coin coins="1000" class="md:w-10 md:h-10 sm:w-8 sm:h-8 w-10 h-10"/>
            <span class="text-sm" >for one month</span>
        </button>
        <button class="container flex flex-row items-center md:gap-2 gap-0 rounded-xl bg-gray-200 border-2 border-gray-300 p-3 text-sm transform hover:scale-105 transition duration-500 ease-in-out justify-around">
            <Coin coins="$5" class="md:w-10 md:h-10 sm:w-8 sm:h-8 w-10 h-10 border-green-700 bg-green-600 text-white"/>
            <span class="text-sm">for one month</span>
        </button>
      </div>
      <div v-if="unlimited == false" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button class="container flex flex-row items-center gap-5 rounded-xl bg-gray-200 border-2 border-gray-300 p-3 text-sm transform hover:scale-105 transition duration-500 ease-in-out justify-center mb-2">
            <Coin coins="$6" class="w-10 h-10 border-green-700 bg-green-600 text-white"/>
            <span class="text-md">for</span>
            <Coin coins="1000" class="w-10 h-10"/> 
        </button>
        <button class="container flex flex-row items-center gap-5 rounded-xl bg-gray-200 border-2 border-gray-300 p-3 text-sm transform hover:scale-105 transition duration-500 ease-in-out justify-center mb-2">
            <Coin coins="$3" class="w-10 h-10 border-green-700 bg-green-600 text-white"/>
            <span class="text-md">for</span>
            <Coin coins="400" class="w-10 h-10"/> 
        </button>
      </div>
      <span v-if="unlimited == true" class='text-xs mx-auto'>*Plus, Get 1000 coins each month with unlimited!</span>
  </div>
</template>

<script>
import Coin from '../components/Coin.vue'
export default {
    props: ['text','unlimited'],
    components: {
        Coin
    }

}
</script>

<style>

</style>

