<template>
    <div class='markdown-toolbar-root'>
        <span class='markdown-toolbar-button' @click="savePage"><i class="fa fa-save" aria-hidden="true"></i></span>
        <!--<span class='markdown-toolbar-button' @click=""><i class="fa fa-mail-reply" aria-hidden="true"></i></span>-->
        <!--<span class='markdown-toolbar-button' @click=""><i class="fa fa-mail-forward" aria-hidden="true"></i></span>-->
        <span class='markdown-toolbar-button' @click="addDoubleText('**','**')"><i class="fa fa-bold" aria-hidden="true"></i></span>
        <span class='markdown-toolbar-button' @click="addDoubleText('*','*')"><i class="fa fa-italic" aria-hidden="true"></i></span>
        <span class='markdown-toolbar-button dropbtn' style='display:inline-block;' :component-id="headerComponentId" @click='showDropDownHeader'><i :component-id="headerComponentId" class="fa fa-header dropbtn" aria-hidden="true"></i>
            <div class="dropdown-toolbar-header-content" ref="dropdownToolbarHeader">
                <a href="#" @click="addSimpleText('# ')">{{String.doTranslationEditor('header')}} 1</a>
                <a href="#" @click="addSimpleText('## ')">{{String.doTranslationEditor('header')}} 2</a>
                <a href="#" @click="addSimpleText('### ')">{{String.doTranslationEditor('header')}} 3</a>
            </div>
        </span>
        <span class='markdown-toolbar-button bold' @click="addActionText">{{String.doTranslationEditor('actions')}}</span>
        <!--<span class='markdown-toolbar-button' @click=""><i class="fa fa-image" aria-hidden="true"></i></span>-->
        <span class='markdown-toolbar-button' v-if="!previewShown" @click="showPreview()"><i class="fa fa-eye" aria-hidden="true"></i></span>
        <span class='markdown-toolbar-button' v-if="previewShown" @click="hidePreview()"><i class="fa fa-eye-slash" aria-hidden="true"></i></span>
        <span class='markdown-toolbar-button' v-if="simplePreview" @click="changePreview(false)">{{String.doTranslationEditor('full-preview')}}</span>
        <span class='markdown-toolbar-button' v-if="!simplePreview" @click="changePreview(true)">{{String.doTranslationEditor('simple-preview')}}</span>
        <span class='markdown-toolbar-button float-right' @click='closeEditor'>{{String.doTranslationEditor('close')}}</span>

        <template if='showModal'>
            <!--action modal-->
            <dyn-modal ref='actionModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
                <span slot='modalHeader'>{{String.doTranslationEditor('add-action-def')}}</span>
                <span slot='modalBody'>
                    <label for="markdown-toolbar-actionType" class="modalLabel text-left">{{String.doTranslationEditor('action-type')}}<span class='required'>*</span>:</label>
                    <select v-model="selectedActionType" class="modalInput">
                        <option disabled value="">{{String.doTranslationEditor('please-select-one')}}</option>
                        <option v-for="option in actionTypes" v-bind:value="option" id="markdown-toolbar-actionType">
                            {{ option }}
                        </option>
                    </select>
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('select-action-type-help')}}</span>
                    </dyn-tooltip>
                    <br />
                    <label for="markdown-toolbar-actionId" class="modalLabel text-left">{{String.doTranslationEditor('action-id')}}<span class='required'>*</span>:</label>
                    <select v-model="selectedActionId" class="modalInput">
                        <option disabled value="">{{String.doTranslationEditor('please-select-one')}}</option>
                        <option v-for="option in actionIds" v-bind:value="option" id="markdown-toolbar-actionId">
                            {{ option }}
                        </option>
                    </select>
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('select-action-id-help')}}</span>
                    </dyn-tooltip>
                    <br>
                    <label for="markdownToolbarActionText" class="modalLabelFull text-left">{{String.doTranslationEditor('action-text')}}: </label>
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip' :placeholder="String.doTranslationEditor('new-action-text-help')"></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('new-action-text-help')}}</span>
                    </dyn-tooltip>
                    <br>
                    <input class="modalInputFull" v-model="actionText" type="text" id="markdownToolbarActionText" :placeholder="String.doTranslationEditor('new-action-text-help')">
                </span>
                <span slot='modalFooter' class='text-right'>
                    <span class='common-button' @click='addAction'>{{String.doTranslationEditor('add-action')}}</span>
                    <span class='common-button' @click='closeAction'>{{String.doTranslationEditor('close')}}</span>
                </span>
            </dyn-modal>
        </template>

    </div>
</template>

<script>

import {bus} from 'app.js'
import DynModal from 'editor/components/dyn-components/dynModal.vue'
import {generateHash} from 'defaults'
import {AllowedActions} from 'editor/constants'
import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import {messageBoxWrapper} from 'editor/services/defaults.js'

export default {
    components: {
        DynModal,
        DynTooltip,
    },
    props: {
        pageId:null,
    },
    data() {
        return {
            dropdownToolbarHeader: null,
            headerComponentId: this.generateHash('markdown-header-toolbar',0),
            showModal: false,
            selectedActionType: '',
            selectedActionId: '',
            actionText: '',
        }
    },
    computed: {
        pages() {
            return this.$store.state.editor.bookData.pages
        },
        actionTypes() {
            return [
                AllowedActions.LINK,
                AllowedActions.ITEM
            ]
        },
        actionIds() {
            if(this.pageId in this.pages && this.selectedActionType in this.pages[this.pageId].actions) {
                return Object.keys(this.pages[this.pageId].actions[this.selectedActionType])
            }
            return []
        },
        previewShown() {
            return this.$store.state.editor.editorStatus.editorShowPreview
        },
        simplePreview() {
            return this.$store.state.editor.editorStatus.editorSimplePreview
        }
    },
    created() {
        bus.$on('automatic-hide', source => {
            if (!source.target.matches('.dropbtn')) {
                this.hideDropDownHeader()
            } else {
                let componentId = source.target.getAttribute('component-id')
                if(componentId && this.headerComponentId != null) {
                    if(componentId != this.headerComponentId) {
                        this.hideDropDownHeader()
                    }
                }
            }
        })
    },
    mounted() {
        this.dropdownToolbarHeader = this.$refs.dropdownToolbarHeader
    },
    methods: {
        generateHash,
        addDoubleText(before,after) {
            let toolDict = {before:before,after:after}
            this.$emit('add-simple-text-textarea',toolDict)
        },
        addSimpleText(before) {
            let toolDict = {before:before,after:''}
            this.$emit('add-simple-text-textarea',toolDict)
        },
        addActionText() {
            this.showModal = true
            this.actionText = ''
            this.selectedActionType = ''
            this.selectedActionId = ''

            this.$refs.actionModal.show()
        },
        addAction() {
            if(this.actionValidation()) {
                let toolDict = {
                    before:':::'+this.selectedActionType+':'+this.selectedActionId+':'+this.actionText,
                    after:':::'}
                this.$emit('add-simple-text-textarea',toolDict)
                this.selectedActionType = ''
                this.selectedActionId = ''
                this.$refs.actionModal.close()
            }
        },
        actionValidation() {
            if(this.selectedActionType === '' || this.actionTypes.indexOf(this.selectedActionType) === -1) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-type-missing'))
                return false
            } else if(this.selectedActionId === '' || this.actionIds.indexOf(this.selectedActionId) === -1) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-id-missing'))
                return false
            }
            return true
        },
        closeAction() {
            this.actionText = ''
            this.selectedActionType = ''
            this.selectedActionId = ''

            this.$refs.actionModal.close()
        },
        showDropDownHeader() {
            this.dropdownToolbarHeader.classList.toggle("show-block")
        },
        hideDropDownHeader() {
            if (this.dropdownToolbarHeader.classList.contains('show-block')) {
                this.dropdownToolbarHeader.classList.remove('show-block');
            }
        },
        hidePreview() {
            this.$emit('hide-markdown-preview')
        },
        showPreview() {
            this.$emit('show-markdown-preview')
        },
        changePreview(value) {
            this.$emit('change-preview-type',value)
        },
        savePage() {
            this.$store.dispatch('editor/savePage',this.pageId)
        },
        closeEditor() {
            this.$router.push({ name: 'editor-page-view', params: { pageId: this.pageId }})
        }
    }

}

</script>

<style>
.markdown-toolbar-root {
    /*height:2rem;*/
    width:100%;
}
.dropdown-toolbar-header-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    overflow:auto;
}

.dropdown-toolbar-header-content a {
    float: none;
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
}
.dropdown-toolbar-header-content a:hover {
    background-color: #ddd;
}
</style>