<template>
<div class="option" @click="selected = !selected" @mouseover="hover = true" @mouseleave="hover = false" :class="{'hover': hover, 'selected':selected}"> 
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
    props: ['text']
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
.option.selected {
    background-color: green;
}
</style>