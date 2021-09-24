<template>
<!-- <div class="option" @mouseover="hover = true" @mouseleave="hover = false" :class="{'hover': hover, 'active': activePlan == text}" @click="updateActivePlan" > 
    <h4> {{text}}</h4>
</div> -->

<div class="container bg-gray-200 rounded-xl sm:w-44 w-40 border-4 border-red-500 flex flex-col gap-8 shadow-lg">
    <div class="container flex flex-row justify-between items-center mx-2 mt-2">
        <Coin :coins="coins" class="z-10 w-10 h-10 text-lg shadow-md"/>
        <h3 class="text-2xl mr-5">Medium</h3>
    </div>
    <div class="container flex flex-row mx-2 items-baseline">
        <h1 class="text-6xl">25</h1>
        <span class="text-lg"> results</span>
    </div>
    
</div>
</template>

<script>
import Coin from '../components/Coin.vue'

export default {
    data() {
        return {
            hover: false,
            selected: false,
            coins: 2,
        }
    },
    components: {Coin},
    props: ['text','activePlan'],
    methods: {
        updateActivePlan(){
            this.$emit('onUpdatePlan', this.text)
            console.log("Function run")
            console.log(this.activePlan)
        }
    },
    model: {
        prop: 'activePlan',
        event: 'onUpdatePlan',
    }
}
</script>

<style lang='scss' scoped>
.option {
        justify-content: center;
        display: flex;
        align-items: center;
        padding: 10px;
        border: 5px solid black;

    }
.option.hover {
    border-color: green;
}
.option.active {
    background-color: green;
}
</style>