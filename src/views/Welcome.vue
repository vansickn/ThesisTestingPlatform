<template>
  <div class="container flex flex-col items-center mt-5 w-6/12" v-if="!userLoggedIn">
    <h1 class="text-3xl">Welcome to the Experiment!</h1>
    <span class="text-xl mt-3 text-center">We want to thank you for participating, and you will be paid $10 per hour of your time. We will keep all of your data private.</span>

    <span class="mt-5 text-3xl text-center">To begin, log in to your google account at the top right of the screen.</span>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>