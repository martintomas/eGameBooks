<template>
    <div class='new-page-root'>
        <div class='new-page-header'>{{String.doTranslationEditor('new-page-def')}}</div>
        <div class='new-page-form'>
            <label class="modalLabel">{{String.doTranslationEditor('method-page-number')}}*: </label>
            <input type="radio" id='newPageFirst' value="first" v-model="pageNumberMethod"><label for="newPageFirst" >{{String.doTranslationEditor('first-suitable')}}</label>
            &nbsp;&nbsp;
            <input type="radio" id='newPageLast' value="last" v-model="pageNumberMethod"><label for="newPageLast" >{{String.doTranslationEditor('last-suitable')}}</label>
            &nbsp;&nbsp;
            <input type="radio" id='newPageOptional' value="optional" v-model="pageNumberMethod"><label for="newPageOptional" >{{String.doTranslationEditor('optional')}}</label>
            <br>
            <label class="modalLabel" for='newPagePageNumber'>{{String.doTranslationEditor('page-number')}}*: </label>
            <input v-if="pageNumberMethod === 'optional'" class="modalInput" v-model="pageNumber" type="number" id="newPagePageNumber" :placeholder="String.doTranslationEditor('add-page-number')">
            <input v-else class="modalInput" v-model="pageNumber" type="number" id="newPagePageNumber" disabled>
            <br>
            <label class="modalLabel">{{String.doTranslationEditor('is-starting-page')}}*: </label>
            <input type="radio" id="newPageStartingYes" value="yes" v-model="startingPage"><label for="newPageStartingYes" >{{String.doTranslationEditor('yes')}} </label>
            <input type="radio" id="newPageStartingNo" value="no" v-model="startingPage"><label for="newPageStartingNo" >{{String.doTranslationEditor('no')}} </label>
        </div>
        <div class='new-page-footer'>
            <span class='common-button' @click='saveNewPage'>{{String.doTranslationEditor('create')}}</span>
            <span class='common-button' @click='closeNewPage'>{{String.doTranslationEditor('leave')}}</span>
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
        }
    },
    computed: {
        pages() {
            return this.$store.state.editor.bookData.pages
        },
        pagesOrder() {
            return this.$store.state.editor.bookData.pagesOrder
        }
    },
    watch: {
        pageNumberMethod(value) {
            this.pageNumber = this.getSuitablePageNumber(this.pageNumberMethod)
        },
        pagesOrder() {
            this.pageNumber = this.getSuitablePageNumber(this.pageNumberMethod)
        }
    },
    mounted() {
        this.pageNumber = this.getSuitablePageNumber(this.pageNumberMethod)
    },
    methods: {
        getSuitablePageNumber(method) {
            if(method === 'first') {
                return getUniqueId(this.pages)
            } else if(method === 'last') {
                return this.pagesOrder[this.pagesOrder.length-1] + 1
            } else {
                return ''
            }
        },
        saveNewPage() {
            let newPage = {
                pageNumber:Number(this.pageNumber),
                isStartingPage: this.startingPage === 'yes' ? true:false,
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
            this.$router.push({ name: 'editor-page-view-default'})
        }
    }
}
</script>

<style>
.new-page-root {
    border: black solid 1px;
    width:100%;
    min-width:15rem;
}
.new-page-form {
    position:relative;
    width: 80%;
    left: 15%;
}
.new-page-header {
    position:relative;
    width: 80%;
    font-size:135%;
    font-weight:bold;
    text-align:center;
    text-decoration: underline;
    margin: 1rem 0 1rem 0;
    left:15%;
    max-width:40rem;
}
.new-page-footer {
    position:relative;
    left:15%;
    width: 80%;
    max-width:40rem;
    text-align:center;
    margin-top:1rem;
}
</style>