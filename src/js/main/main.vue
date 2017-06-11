<template>
    <div>
        <h1>This is index file</h1>
        <span @click='openEditor'>Open testing editor</span>
    </div>
</template>

<script>
export default {
    methods: {
        openEditor() {
            this.$router.push({name:'editor-page-view-default',params: {bookId:120565}})
        }
    }
}
</script>

<style>
</style>