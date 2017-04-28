<template>
    <div>
        <editor></editor>
        <loader></loader>
    </div>
</template>

<script>
import Vue from 'vue'
import Loader from 'components/loader.vue'
import Editor from 'editor/editor.vue'

export default {
    components: {
        Editor,
        Loader
    },
    created() {
        Vue.use(Editor, { 'store': this.$store })

        this.$store.dispatch('loadEditor')
    }
}
</script>

<style>
</style>