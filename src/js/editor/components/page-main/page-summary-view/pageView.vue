<template>
    <div class="page-view-root">
        <template v-if="editedPageExists">
            <page-connections-up-view :page-id='editedPageId' :page-data='pageData'></page-connections-up-view>
            <page-main-view :page-id='editedPageId' :page-data='pageData'></page-main-view>
            <page-connections-down-view :page-id='editedPageId' :page-data='pageData'></page-connections-down-view>
        </template>
        <template v-else>
            <p>Edited page is missing</p>
        </template>
    </div>
</template>

<script>
    import PageMainView from 'editor/components/page-main/page-summary-view/pageMainView.vue'
    import PageConnectionsUpView from 'editor/components/page-main/page-summary-view/pageConnectionsUpView.vue'
    import PageConnectionsDownView from 'editor/components/page-main/page-summary-view/pageConnectionsDownView.vue'
    import * as mutationTypes from 'editor/store/mutation-types'

    export default {
        components: {
            PageMainView,
            PageConnectionsUpView,
            PageConnectionsDownView
        },
        props: {
            pageId: null,
        },
        computed: {
            editedPageExists() {
                return this.editorStore.pages.editedPage in this.editorStore.pages.pages
            },
            editedPageId() {
                return this.editorStore.pages.editedPage
            },
            pageData() {
                return this.editorStore.pages.pages[this.editedPageId]
            }
        },
        created() {
            this.setUpNewEditedPage(this.pageId) //be sure to open right page when loaded
        },
        watch: {
            pageId(value) { //react to change
                //contains new page id
                this.setUpNewEditedPage(value)
            },
        },
        methods: {
            setUpNewEditedPage(value) {
                if(value != null && Number.isInteger(Number(value))) {
                    if(this.editorStore.pages.editedPage != value) {
                        this.$store.commit('editor/'+mutationTypes.EDIT_PAGE,value)
                    }
                }
            }
        }
    }
</script>

<style>
    .page-view-root {
        /*display: flex;*/
        /*flex-grow: 10;*/
        border: 1px solid black;
        width: 100%;
        height: 100%;
        overflow:auto;
        /*background-color: black;*/
    }
</style>