<template>
    <div class='editor-main-form-root'>
        <template v-if='page != null'>
            <div class='editor-main-form-form'>
                <div class='editor-main-form-header'>{{String.doTranslationEditor('edit-page-def')}}</div>
                <div class='editor-main-form-body'>
                    <label class="mainLabel" for='newPagePageTittle'>{{String.doTranslationEditor('page-tittle')}}: </label>
                    <input class="mainInput horizontal-space" v-model="pageTittle" type="text" id="newPagePageTittle" :placeholder="String.doTranslationEditor('add-page-tittle')">
                    <br>
                    <br>
                    <label class="mainLabel">{{String.doTranslationEditor('is-starting-page')}}<span class='required'>*</span>: </label>
                    <input class='horizontal-space' type="radio" id="newPageStartingYes" value="yes" v-model="startingPage"><label class='horizontal-space vertical-proc-right-space' for="newPageStartingYes" >{{String.doTranslationEditor('yes')}} </label>
                    <input class='horizontal-space vertical-proc-left-space' type="radio" id="newPageStartingNo" value="no" v-model="startingPage"><label class='horizontal-space' for="newPageStartingNo" >{{String.doTranslationEditor('no')}} </label>
                    <br>
                </div>
                <div class='editor-main-form-footer'>
                    <span class='common-button' @click='saveEditPage'>{{String.doTranslationEditor('save')}}</span>
                    <span class='common-button' @click='closeEditPage'>{{String.doTranslationEditor('leave')}}</span>
                </div>
            </div>
        </template>
        <template v-else>
            <div class='page-view-missing-page' style='margin-top:2rem;'>
                {{String.doTranslationEditor('missing-page-error',pageId)}}
                <span style='text-decoration:underline;cursor:pointer;' @click='createNewPage'>{{String.doTranslationEditor('missing-page-create-new')}}</span>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        pageId: 0,
    },
    data() {
        return {
            pageTittle: '',
            startingPage: 'no',
        }
    },
    computed: {
        pages() {
            return this.$store.state.editor.bookData.pages
        },
        page() {
            if(this.pageId in this.pages) {
                return this.pages[this.pageId]
                
            }
            return null
        },
        isStartingPage() {
            if(this.pageId == this.$store.state.editor.bookData.startPage) {
                return true
            }
            return false
        },
        pageTittleOrig() {
            if(this.page != null) return this.page.data.pageTittle
            else return ''
        }
    },
    watch: {
        pageTittleOrig(value) {
            this.pageTittle = value
        },
        isStartingPage(value) {
            if(value) this.startingPage = 'yes'
            else this.startingPage = 'no'
        }
    },
    mounted() {
        if(this.isStartingPage) this.startingPage = 'yes'
        else this.startingPage = 'no'

        this.pageTittle = this.pageTittleOrig
    },
    beforeRouteLeave (to, from, next) {
        this.pageTittle = '' //clear old data
        next()
    },
    methods: {
        saveEditPage() {
            let editedArgs = {
                page: this.page,
                pageTittle: this.pageTittle,
                isStartingPage: this.startingPage === 'yes' ? true:false,
            }

            if(this.editedPageValidation(editedArgs)) {
                this.$store.dispatch('editor/changeSettingsPage',editedArgs).then(() => {
                    this.$router.push({ name: 'editor-page-view', params: { pageId: this.pageId }})
                })
            }
        },
        editedPageValidation(editedArgs) {
            return true
        },
        closeEditPage() {
            if(this.page != null) this.$router.push({ name: 'editor-page-view',params: { pageId: this.pageId }})
            else this.$router.push({ name: 'editor-page-view-default'})
        },
        createNewPage() {
            this.$router.push({ name: 'editor-new-page', params: { pageId: this.pageId }})
        }
    }
}
</script>

<style>

</style>