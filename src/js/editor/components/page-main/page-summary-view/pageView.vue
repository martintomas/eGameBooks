<template>
    <div class="page-view-root">
        <template v-if="editedPageExists">
            <page-connections-up-view :page-id='editedPageId' :page-data='pageData'></page-connections-up-view>
            <page-main-view :page-id='editedPageId' :page-data='pageData'></page-main-view>
            <page-connections-down-view :page-id='editedPageId' :page-data='pageData'></page-connections-down-view>
        </template>
        <template v-else-if="pagesExists">
            <div class='page-view-missing-page'>
                {{String.doTranslationEditor('missing-page-error',pageId)}}
                <span style='text-decoration:underline;cursor:pointer;' @click='createNewPage'>{{String.doTranslationEditor('missing-page-create-new')}}</span>
            </div>
        </template>
    </div>
</template>

<script>
import {bus} from 'app.js'
import PageMainView from 'editor/components/page-main/page-summary-view/pageMainView.vue'
import PageConnectionsUpView from 'editor/components/page-main/page-summary-view/pageConnectionsUpView.vue'
import PageConnectionsDownView from 'editor/components/page-main/page-summary-view/pageConnectionsDownView.vue'
import * as mutationTypes from 'editor/store/mutationTypes'

export default {
    components: {
        PageMainView,
        PageConnectionsUpView,
        PageConnectionsDownView,
    },
    props: {
        pageId: null,
    },
    computed: {
        pagesExists() {
            return this.$store.state.editor.bookData.pagesOrder.length > 0
        },
        editedPageExists() {
            return this.$store.state.editor.bookData.editedPage in this.$store.state.editor.bookData.pages
        },
        editedPageId() {
            return this.$store.state.editor.bookData.editedPage
        },
        pageData() {
            return this.$store.state.editor.bookData.pages[this.editedPageId]
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
                if(this.$store.state.editor.bookData.editedPage != value) {
                    this.$store.commit('editor/'+mutationTypes.EDIT_PAGE,value)
                }
            }
        },
        createNewPage() {
            this.$router.push({ name: 'editor-new-page', params: { pageId: this.pageId }})
        }
    }
}
</script>

<style>
    .page-view-root {
        display: flex;
        /*flex-grow: 10;*/
        border: 1px solid black;
        width: 100%;
        height: calc(100% - 2px);
        overflow:hidden;
        min-width:15rem;
        min-height:35rem;
        flex-direction: column;
        justify-content: space-around;
    }
    .page-view-missing-page {
        font-size:170%;
        text-align:center;
        font-weight:bold;
    }
</style>