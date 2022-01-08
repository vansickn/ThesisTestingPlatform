<template>
  <div class="container flex flex-col items-center mt-5 w-6/12" v-if="!userLoggedIn">
    <h1 class="text-3xl">Welcome to the Experiment!</h1>
    <span class="text-xl mt-3">We want to thank you for participating, and you will be paid $10 per hour of your time. You have already received a copy of the release form, and we will keep your data private for the duration of the analysis.</span>

    <span class="mt-3">If you have any questions, feel free to email me at vansickn@union.edu</span>
    <span class="mt-1 text-xl">To begin, log in to your google account at the top right of the screen.</span>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>