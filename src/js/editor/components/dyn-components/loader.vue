<template>
    <div class='modal' ref='loader' style="z-index:1000000">
        <div class='modal-middle-center'>
            <template v-if='numLoaderActions > 0'>
                <div class='loader-root'>
                    <i class="fa fa-spinner fa-spin fa-3x" aria-hidden="true"></i>
                    <br>
                    {{lastLoader.message}}
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import {editorLoaderWrapper} from 'editor/services/defaults.js'

export default {
    computed: {
        numLoaderActions() {
            //return this.$store.state.loader.loaderQueue.length
            return editorLoaderWrapper.getLoaders(this.$store).length
        },
        lastLoader() {
            return editorLoaderWrapper.getLoaders(this.$store)[this.numLoaderActions-1] //show only last one
        }
    },
    watch: {
        numLoaderActions(value) {
            this.toogleLoader()
        }
    },
    mounted() {
        this.toogleLoader()
    },
    methods: {
        toogleLoader() {
            if(this.numLoaderActions > 0) this.show()
            else this.close()
        },
        show() {
            this.$refs.loader.style.display = "table"
        },
        close() {
            this.$refs.loader.style.display = "none"
        },
    }
}
</script>

<style>
.loader-root {
    margin:auto;
    font-size:180%;
    text-align:center;
}
</style>