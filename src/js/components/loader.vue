<template>
    <div class='modal' ref='loader'>
        <div class='modal-middle-center'>
            <template v-if='numLoaderActions > 0'>
                <div class='loader-root'>
                    <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
                    <br>
                    {{lastLoader.message}}
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        numLoaderActions() {
            return this.$store.state.loader.loaderQueue.length
        },
        lastLoader() {
            return this.$store.state.loader.loaderQueue[this.numLoaderActions-1] //show only last one
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
    font-size:250%;
    text-align:center;
}
</style>