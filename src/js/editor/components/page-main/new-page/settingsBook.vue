<template>
    <div class='editor-main-form-root'>
        <div class='editor-main-form-form'>
            <div class='editor-main-form-header'>{{String.doTranslationEditor('change-book-settings')}}</div>
            <div class='editor-main-form-body'>
                <label class="mainLabel" for='bookSettingsBookName'>{{String.doTranslationEditor('book-name')}}<span class='required'>*</span>: </label>
                <input class="mainInput horizontal-space" style='width:90%;' v-model="bookName" type="text" id="bookSettingsBookName" :placeholder="String.doTranslationEditor('add-book-name')">
                <span>
                    <span v-if='bookNameChecked === null'><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>
                    <span v-else-if='bookNameChecked === true'><i class="fa fa-check" aria-hidden="true"></i></span>
                    <span v-else-if='bookNameChecked === false'><i class="fa fa-times" aria-hidden="true"></i></span>
                </span>
                <br>
                <br>
                <label class="mainLabel">{{String.doTranslationEditor('used-modules')}}: </label>
                <input type="checkbox" id='bookSettingsItemModules' value="item" v-model="usedModules">&nbsp;<label for="bookSettingsItemModules">Item module</label><br>
                <br>
            </div>
            <div class='editor-main-form-footer'>
                <span class='common-button' @click='saveSettingsBook'>{{String.doTranslationEditor('save')}}</span>
                <span class='common-button' @click='closeSettingsBook'>{{String.doTranslationEditor('close')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import {debounce} from 'defaults'
import {isBookNameUnique} from 'editor/api/'
import {messageBoxWrapper} from 'editor/services/defaults.js'

export default {
    data() {
        return {
            bookName: '',
            usedModules: [],
            bookNameChecked: true
        }
    },
    computed: {
        bookMain() {
            return this.$store.state.editor.bookData.mainInfo
        },
        bookNameOrig() {
            return this.bookMain.name
        },
        usedModulesOrig() {
            return this.bookMain.usedModules
        }
    },
    watch: {
        bookNameOrig(value) {
            this.bookName = value
        },
        bookName(value) {
            if(this.bookNameOrig != value) {
                this.bookNameChecked = null
                this.updateBookChecked(value)
            }
        },
        usedModulesOrig(value) {
            this.usedModules = value
        }
    },
    mounted() {
        this.bookName = this.bookNameOrig
        this.usedModules = this.usedModulesOrig
    },
    beforeRouteLeave (to, from, next) {
        this.bookName = this.bookNameOrig //clear old data
        this.usedModules = this.usedModulesOrig
        next()
    },
    methods: {
        updateBookChecked: debounce(function(value) {
            return isBookNameUnique(this.bookName).then((value) => {
                this.bookNameChecked = value
            }).catch((reason) => {
                console.log('Impossible to check if book name is unique. Reason of error is: '+reason)
            })
        },250),
        saveSettingsBook() {
            let bookData = {
                name: this.bookName,
                usedModules: this.usedModules
            }
            if(this.settingsBookValidation(bookData)) {
                this.$store.dispatch('editor/changeBookSettings',bookData)
            }
        },
        settingsBookValidation(bookData) {
            if(bookData.name === '') {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('settings-book-no-empty-name'))
                return false
            } else if(this.bookNameChecked === false) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('settings-book-no-unique-name'))
                return false
            }
            return true
        },
        closeSettingsBook() {
            if(this.bookName != this.bookNameOrig || JSON.stringify(this.usedModules) != JSON.stringify(this.usedModulesOrig)) {
                messageBoxWrapper.showChoiceMessage(this.$store.commit,String.doTranslationEditor('settings-book-no-save'),
                    () => {
                        this.$router.push({ name: 'editor-page-view-default'})
                    }
                )
            } else {
                this.$router.push({ name: 'editor-page-view-default'})
            }
        }
    }
}
</script>

<style>
</style>