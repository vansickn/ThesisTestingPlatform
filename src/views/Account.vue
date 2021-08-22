<template>
  <h1> Hi {{user.data.displayName}}!</h1>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            user: "user"
        })
    }
}
</script>

<style>

</style>