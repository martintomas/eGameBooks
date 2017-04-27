<template>
    <div class='main-text-edited'>
        <dyn-text-renderer :page-data='pageData' ></dyn-text-renderer>
    </div>
</template>

<script>

import DynTextRenderer from 'editor/components/page-main/page-main-text/dynTextRenderer.js'

export default {
    components: {
        DynTextRenderer
    },
    props: {
        pageData: null,
    },
    data(){
        return {
        }
    },
    computed: {
    },
}

</script>

<style>
.main-text-edited p {
    margin:0;
    padding:0;
    display:inline;
}
</style>