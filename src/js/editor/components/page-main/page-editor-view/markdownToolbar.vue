<template>
    <div class='markdown-toolbar-root'>
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
        <span class='markdown-toolbar-button' v-if="!previewShown" @click="showPreview()"><i class="fa fa-eye" aria-hidden="true"></i></span>
        <span class='markdown-toolbar-button' v-if="previewShown" @click="hidePreview()"><i class="fa fa-eye-slash" aria-hidden="true"></i></span>

        <template if='showModal'>
            <!--action modal-->
            <dyn-modal ref='actionModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
                <span slot='modalHeader'>{{String.doTranslationEditor('add-action-def')}}</span>
                <span slot='modalBody'>
                    <label for="markdown-toolbar-actionType" class="modalLabel">{{String.doTranslationEditor('action-type')}}<span class='required'>*</span>:</label>
                    <select v-model="selectedActionType" class="modalInput">
                        <option disabled value="">{{String.doTranslationEditor('please-select-one')}}</option>
                        <option v-for="option in actionTypes" v-bind:value="option" id="markdown-toolbar-actionType">
                            {{ option }}
                        </option>
                    </select>
                    <br />
                    <label for="markdown-toolbar-actionId" class="modalLabel">{{String.doTranslationEditor('action-id')}}:</label>
                    <select v-model="selectedActionId" class="modalInput">
                        <option disabled value="">{{String.doTranslationEditor('please-select-one')}}</option>
                        <option v-for="option in actionIds" v-bind:value="option" id="markdown-toolbar-actionId">
                            {{ option }}
                        </option>
                    </select>
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

export default {
    components: {
        DynModal
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
            previewShown: true,
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
            this.$refs.actionModal.show()
        },
        addAction() {
            let toolDict = {
                before:':::'+this.selectedActionType+':'+this.selectedActionId+':',
                after:':::'}
            this.$emit('add-simple-text-textarea',toolDict)
            this.selectedActionType = ''
            this.selectedActionId = ''
            this.$refs.actionModal.close()
        },
        closeAction() {
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
            this.previewShown = false
        },
        showPreview() {
            this.$emit('show-markdown-preview')
            this.previewShown = true
        }
    }

}

</script>

<style>
.markdown-toolbar-root {
    height:2rem;
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