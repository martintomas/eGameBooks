<template>
<div ref="dynPageDetail" class="modal">
    <dyn-text-renderer :page-data='pageData' :parsed-html-text='parsedHtmlText'></dyn-text-renderer>
</div>
</template>

<script>
export default {
    props: {
        pageData: null,
    }
}
</script>

<style>
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1000000; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
</style>