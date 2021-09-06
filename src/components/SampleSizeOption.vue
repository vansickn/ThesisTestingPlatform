<template>
<div class="option" @mouseover="hover = true" @mouseleave="hover = false" :class="{'hover': hover, 'active': activePlan == text}" @click="updateActivePlan" > 
    <h4> {{text}}</h4>
</div>
</template>

<script>
export default {
    data() {
        return {
            hover: false,
            selected: false,
        }
    },
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