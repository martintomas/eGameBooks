<template>
    <div class='editor-main-form-root'>
        <div class='editor-main-form-form'>
            <div class='editor-main-form-header'>
                {{String.doTranslationEditor('new-page-def')}}
                <span :class="[pagesCount>=pagesLimit ? 'error-color': '', 'float-right']">{{pagesCount}}/{{pagesLimit}}</span>
            </div>
            <div class='editor-main-form-body'>
                <label class="mainLabel">{{String.doTranslationEditor('method-page-number')}}<span class='required'>*</span>: </label>
                <input class='horizontal-space'type="radio" id='newPageFirst' value="first" v-model="pageNumberMethod"><label class='horizontal-space vertical-proc-right-space' for="newPageFirst" >{{String.doTranslationEditor('first-suitable')}}</label>
                &nbsp;&nbsp;
                <input class='horizontal-space vertical-proc-left-space' type="radio" id='newPageLast' value="last" v-model="pageNumberMethod"><label class='horizontal-space vertical-proc-right-space' for="newPageLast" >{{String.doTranslationEditor('last-suitable')}}</label>
                &nbsp;&nbsp;
                <input class='horizontal-space vertical-proc-left-space' type="radio" id='newPageOptional' value="optional" v-model="pageNumberMethod"><label class='horizontal-space' for="newPageOptional" >{{String.doTranslationEditor('optional')}}</label>
                <br>
                <br>
                <label class="mainLabel" for='newPagePageNumber'>{{String.doTranslationEditor('page-number')}}<span class='required'>*</span>: </label>
                <input v-if="pageNumberMethod === 'optional'" class="mainInput horizontal-space" v-model="pageNumber" type="number" id="newPagePageNumber" :placeholder="String.doTranslationEditor('add-page-number')">
                <input v-else class="mainInput horizontal-space" v-model="pageNumber" type="number" id="newPagePageNumber" disabled>
                <br>
                <br>
                <label class="mainLabel" for='newPagePageTittle'>{{String.doTranslationEditor('page-tittle')}}: </label>
                <input class="mainInput horizontal-space" v-model="pageTittle" type="text" id="newPagePageTittle" :placeholder="String.doTranslationEditor('add-page-tittle')">
                <br>
                <br>
                <label class="mainLabel" for='newPagePageType'>{{String.doTranslationEditor('new-page-page-type')}}<span class='required'>*</span>: </label>
                <select class='mainInput horizontal-space' v-model="pageType" id='newPagePageType'>
                    <option value='text'>{{String.doTranslationEditor('text')}}</option>
                </select>
                <br>
                <br>
                <label class="mainLabel">{{String.doTranslationEditor('is-starting-page')}}<span class='required'>*</span>: </label>
                <input class='horizontal-space' type="radio" id="newPageStartingYes" value="yes" v-model="startingPage"><label class='horizontal-space vertical-proc-right-space' for="newPageStartingYes" >{{String.doTranslationEditor('yes')}} </label>
                <input class='horizontal-space vertical-proc-left-space' type="radio" id="newPageStartingNo" value="no" v-model="startingPage"><label class='horizontal-space' for="newPageStartingNo" >{{String.doTranslationEditor('no')}} </label>
                <br>
            </div>
            <div class='editor-main-form-footer'>
                <span class='common-button' @click='saveNewPage'>{{String.doTranslationEditor('create')}}</span>
                <span class='common-button' @click='closeNewPage'>{{String.doTranslationEditor('leave')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import {getUniqueId} from 'defaults'
import {messageBoxWrapper} from 'editor/services/defaults.js'
import * as mutationTypes from 'editor/store/mutationTypes'

export default {
    props: {
        pageId: null
    },
    data() {
        return {
            startingPage: 'no',
            pageNumberMethod: 'first',
            pageNumber: '',
            pageTittle:'',
            pageType:'text',
            setActionId: null,
            setPageId: null,
        }
    },
    computed: {
        pages() {
            return this.$store.state.editor.bookData.pages
        },
        pagesOrder() {
            return this.$store.state.editor.bookData.pagesOrder
        },
        pagesCount() {
            return this.$store.state.editor.bookData.pagesOrder.length
        },
        pagesLimit() {
            return this.$store.state.editor.bookData.maxPageLimit
        }
    },
    watch: {
        pageNumberMethod(value) {
            this.pageNumber = this.getSuitablePageNumber(this.pageNumberMethod)
        },
        pagesOrder() {
            this.pageNumber = this.getSuitablePageNumber(this.pageNumberMethod)
        },
        pageId(value) {
            if(Number.isInteger(Number(value))) this.pageNumberMethod = 'optional'
            else this.pageNumberMethod = 'first'
        }
    },
    mounted() {
        if(Number.isInteger(Number(this.pageId))) this.pageNumberMethod = 'optional'
        else this.pageNumber = this.getSuitablePageNumber(this.pageNumberMethod)
    },
    beforeRouteEnter (to, from, next) {
        if(to.query.action && to.query.page) {
            next(vm => {
                vm.setActionId = to.query.action
                vm.setPageId = to.query.page
            })
        } else {
            next()
        }
    },
    beforeRouteUpdate (to, from, next) {
        if(to.query.action && to.query.page) {
            this.setActionId = to.query.action
            this.setPageId = to.query.page
        } else {
            this.setActionId = null
            this.setPageId = null
        }
        next()
    },
    beforeRouteLeave (to, from, next) {
        this.pageTittle = '' //clear page tittle data
        this.setActionId = null
        this.setPageId = null
        next()
    },
    methods: {
        getSuitablePageNumber(method) {
            if(method === 'first') {
                return getUniqueId(this.pages)
            } else if(method === 'last') {
                return this.pagesOrder[this.pagesOrder.length-1] + 1
            } else if(this.pageId){
                return this.pageId
            } else {
                return ''
            }
        },
        saveNewPage() {
            if(this.pagesCount >= this.pagesLimit) {
                messageBoxWrapper.showErrorMessage(this.$store.commit,String.doTranslationEditor('new-page-hit-limit'))
                return
            }

            let newPage, linkData = null, setLinkAction = false
            if(this.setActionId != null && this.setPageId != null) {
                setLinkAction = true
                linkData = {
                    pageId: this.setPageId,
                    actionId: this.setActionId
                }
            }

            newPage = {
                pageNumber:Number(this.pageNumber),
                isStartingPage: this.startingPage === 'yes' ? true:false,
                pageType: this.pageType,
                pageTittle: this.pageTittle,
                setLinkAction: setLinkAction,
                linkData: linkData
            }

            if(this.newPageValidation(newPage)) {
                this.$store.dispatch('editor/addNewPage',newPage).then(() => {
                    this.$router.push({ name: 'editor-page-view', params: { pageId: newPage.pageNumber }})
                })
            }
        },
        newPageValidation(newPage) {
            if(newPage.pageNumber === null || newPage.pageNumber === '' || !Number.isInteger(newPage.pageNumber)) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-page-wrong-page-number'))
                return false
            } else if(newPage.pageNumber in this.pages) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-page-not-unique-page-number'))
                return false
            }
            return true
        },
        closeNewPage() {
            if(this.setActionId != null && this.setPageId != null) {
                this.$router.push({ name: 'editor-page-view',params: { pageId: this.setPageId }})
            } else if(this.pageId && this.pageId != null) {
                this.$router.push({ name: 'editor-page-view',params: { pageId: this.pageId }})
            } else {
                this.$router.push({ name: 'editor-page-view-default'})
            }
        }
    }
}
</script>

<style>

</style>