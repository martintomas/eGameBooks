<template>
    <span>

        <ul>
           <li v-for="(value,key,index) in linkData" :key="key">
                <dyn-tooltip ref='tooltipLink' :tooltip-id="generateHash('link',index)" :reactToClick='true' :reactToHover='false'>
                    <span slot='tooltip' :component-id="generateHash('link',index)"  :class="[value.existsInText ? 'used':'',containsErrors(isActionCorrect('link',value)) ? 'wrong-action' : '','tooltip', 'markdown-action-buttons', 'markdown-action-buttons-links', 'bold']">
                    {{String.doTranslationEditor('link-small')}}:&nbsp;{{key}}&nbsp;
                        <template v-if="value.pageId != '' && value.pageId != null">
                            ({{String.doTranslationEditor('page-small')}}&nbsp;{{value.pageId}})
                        </template>
                    </span>
                    <span slot='tooltipText'>
                        <i class="fa fa-edit unactive-icon" aria-hidden="true" @click="editLink(value)"></i>
                        <i class="fa fa-question unactive-icon tooltip" aria-hidden="true" @click="showInfo(key)"></i>
                        <i class="fa fa-times-circle unactive-icon" aria-hidden="true" @click="removeLink(key)" ></i>
                    </span>
                </dyn-tooltip>
            </li>
        </ul>

        <template if='shownModal'>
            <!--Link modal-->
            <dyn-modal ref='linkModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
                <span slot='modalHeader'>{{String.doTranslationEditor('link-action-dev')}}</span>
                <span slot='modalBody'>
                    <template v-if='!editedNoNew'>
                        <label class='modalLabel text-left' for='actionIdEditedLink'>{{String.doTranslationEditor('action-id')}}<span class='required'>*</span>:</label>
                        <input class="modalInput" v-model.number="linkFormFields.id" type="number" id="actionIdEditedLink">
                        <dyn-tooltip class='helper float-right'>
                            <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                            <span slot='tooltipText'>{{String.doTranslationEditor('new-action-id-help')}}</span>
                        </dyn-tooltip>
                        <br>
                    </template>
                    <label class="modalLabel text-left" for='pageNumberEditLink'>{{String.doTranslationEditor('page-number')}}<span class='required'>*</span>: </label>
                    <page-whisperer :edited-page='pageId' :page-number='linkFormFields.pageId' ref='pageWhisperer' input-id='pageNumberEditLink'></page-whisperer>
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('new-page-id-help')}}</span>
                    </dyn-tooltip>
                    <br>
                    <dyn-condition ref='pageDynCondition' :pageCondition='linkFormFields.condition'></dyn-condition>
                </span>
                <span slot='modalFooter' class='text-right'>
                    <span class='common-button' @click='saveLinkAction'>{{String.doTranslationEditor('save')}}</span>
                    <span class='common-button' @click='closeLinkAction'>{{String.doTranslationEditor('close')}}</span>
                </span>
            </dyn-modal>
        </template>

        <!-- Modal for link info -->
        <dyn-modal ref='linkInfoModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
            <span slot='modalHeader'>
                {{String.doTranslationEditor('link-item-modal-header')}}
            </span>
            <span slot='modalBody'>
                <template v-if='openedLink != null'>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('link-id')}}: </label>
                    <span class="modalInput">{{openedLink.id}}</span>
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('page-number')}}: </label> 
                    <template v-if="openedLink.pageId != null">
                        <span class="modalInput">{{openedLink.pageId}}</span>
                    </template>
                    <template v-else>
                        <span class="modalInput">{{String.doTranslationEditor('missing-page')}}</span>
                    </template> 
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('condition')}}: </label> 
                    <span class="modalInput">{{openedLink.condition}}</span>
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('used-in-text')}}: </label>
                    <i class="fa fa-times-circle modalInput" v-if='!openedLink.existsInText' aria-hidden="true" ></i>
                    <i class="fa fa-check modalInput" v-else aria-hidden="true" ></i>
                </template>
            </span>
            <span slot='modalFooter'>
                <span class='common-button' @click='closeInfoLink'>{{String.doTranslationEditor('close')}}</span>
            </span>
        </dyn-modal>

    </span>
</template>

<script>
import Vue from 'vue'
import DynModal from 'editor/components/dyn-components/dynModal.vue'
import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import PageWhisperer from 'editor/components/dyn-components/pageWhisperer.vue'
import DynCondition from 'editor/components/page-main/page-editor-view/dynCondition.vue'
import {getUniqueId, generateHash,clearDict} from 'defaults.js'
import {AllowedActions} from 'editor/constants'
import {messageBoxWrapper} from 'editor/services/defaults.js'
import {containsErrors,isActionCorrect} from 'editor/services/validators'

export default {
    components: {
        DynModal,
        DynTooltip,
        PageWhisperer,
        DynCondition
    },
    props: {
        pageId: null,
        linkData: Object,
    },
    data() {
        return {
            linkFormFields: {'id':'','pageId':'','condition':''},
            shownModal: false,
            openedLink: null,
            editedNoNew: false,
        }
    },
    computed: {
        pages() {
            return this.$store.state.editor.bookData.pages
        }
    },
    methods: {
        generateHash,
        getUniqueId,
        containsErrors,
        isActionCorrect,
        showModal() {
            this.clear()

            this.shownModal = true
            this.editedNoNew = false
            Vue.set(this.linkFormFields,'id',this.getUniqueId(this.linkData)) //generete suitable id

            this.$refs.linkModal.show()
        },
        saveLinkAction() {
            let linkData = {
                'id':this.linkFormFields.id,
                'pageId':this.$refs.pageWhisperer.pageNumberLocal,
                'condition':this.$refs.pageDynCondition.getDynConditionText()
            }

            if(this.validationNewLink(linkData)) {
                if(!this.editedNoNew) {
                    this.$emit('add-action',{'actionType':AllowedActions.LINK,'pageId':this.pageId,'actionData':linkData})
                } else {
                    this.$emit('edit-action',{'actionType':AllowedActions.LINK,'pageId':this.pageId,'actionId':this.linkFormFields.id,'actionData':linkData})
                }
                this.clear()
                this.$refs.linkModal.close()
            }
        },
        validationNewLink(linkData) {
            if(linkData.id === null || linkData.id === '' || !Number.isInteger(linkData.id)) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-id-wrong-format'))
                return false
            } else if(!this.editedNoNew && linkData.id in this.linkData) { //new link action but id already exists
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-id-not-unique'))
                return false
            } else if(linkData.pageId === null || linkData.pageId === '') {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-page-missing'))
                return false
            } else if(!(linkData.pageId in this.pages)) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-pages-doesnt-exists'))
                return false
            } else if(!this.$refs.pageDynCondition.isSelectionValid) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-condition-not-valid'))
                return false
            }
            return true
        },
        closeLinkAction() {
            this.clear()
            this.$refs.linkModal.close()
        },
        editLink(linkData) {
            this.clear()

            Vue.set(this.linkFormFields,'id',linkData['id'])
            Vue.set(this.linkFormFields,'pageId',linkData['pageId'])
            Vue.set(this.linkFormFields,'condition',linkData['condition'])
            this.editedNoNew = true

            this.$refs.linkModal.show()
        },
        removeLink(linkId) {
            this.$emit('remove-action',{'actionType':AllowedActions.LINK,'pageId':this.pageId,'actionId':linkId})
        },
        showInfo(linkId) {
            this.openedLink = this.linkData[linkId]
            this.$refs.linkInfoModal.show()
        },
        closeInfoLink() {
            this.openedLink = null
            this.$refs.linkInfoModal.close()
        },
        clear() {
            clearDict(this.linkFormFields,Vue)
            this.$refs.pageWhisperer.clear()
            this.$refs.pageDynCondition.clear()
        },
    }
}

</script>

<style>
.markdown-action-buttons-links {
    border: 1px solid #FFCC99;
    background-color:#FFCC99;
    cursor:pointer;
}
</style>