<template>
    <span>

        <template if='shownModal'>
            <!--Link modal-->
            <dyn-modal ref='newActionModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
                <span slot='modalHeader'>{{String.doTranslationEditor('link-action-dev')}}</span>
                <span slot='modalBody'>
                    <template v-if='!editedNoNew'>
                        <label class='modalLabel text-left' for='actionIdEditedLink'>{{String.doTranslationEditor('action-id')}}<span class='required'>*</span>:</label>
                        <input class="modalInput" v-model.number="formFields.id" type="number" id="actionIdEditedLink">
                        <dyn-tooltip class='helper float-right'>
                            <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                            <span slot='tooltipText'>{{String.doTranslationEditor('new-action-id-help')}}</span>
                        </dyn-tooltip>
                        <br>
                    </template>
                    <label class="modalLabel text-left" for='pageNumberEditLink'>{{String.doTranslationEditor('page-number')}}<span class='required'>*</span>: </label>
                    <page-whisperer :edited-page='pageId' :page-number='formFields.pageId' ref='pageWhisperer' input-id='pageNumberEditLink'></page-whisperer>
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('new-page-id-help')}}</span>
                    </dyn-tooltip>
                    <br>
                    <dyn-condition ref='pageDynCondition' :pageCondition='formFields.condition'></dyn-condition>
                </span>
                <span slot='modalFooter' class='text-right'>
                    <span class='common-button' @click='saveAction'>{{String.doTranslationEditor('save')}}</span>
                    <span class='common-button' @click='closeAction'>{{String.doTranslationEditor('close')}}</span>
                </span>
            </dyn-modal>
        </template>

        <!-- Modal for link info -->
        <dyn-modal ref='actionInfoModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
            <span slot='modalHeader'>
                {{String.doTranslationEditor('link-item-modal-header')}}
            </span>
            <span slot='modalBody'>
                <template v-if='openedData != null'>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('link-id')}}: </label>
                    <span class="modalInput">{{openedData.id}}</span>
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('page-number')}}: </label> 
                    <template v-if="openedData.pageId != null">
                        <span class="modalInput">{{openedData.pageId}}</span>
                    </template>
                    <template v-else>
                        <span class="modalInput">{{String.doTranslationEditor('missing-page')}}</span>
                    </template> 
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('condition')}}: </label> 
                    <span class="modalInput">{{openedData.condition}}</span>
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('used-in-text')}}: </label>
                    <i class="fa fa-times-circle modalInput" v-if='!openedData.existsInText' aria-hidden="true" ></i>
                    <i class="fa fa-check modalInput" v-else aria-hidden="true" ></i>
                </template>
            </span>
            <span slot='modalFooter'>
                <span class='common-button' @click='closeInfoModal'>{{String.doTranslationEditor('close')}}</span>
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

export default {
    components: {
        DynModal,
        DynTooltip,
        PageWhisperer,
        DynCondition
    },
    props: {
        pageId: null,
        localData: {
            type:Object,
            default:null
        }
    },
    data() {
        return {
            formFields: {'id':'','pageId':'','condition':''},
            shownModal: false,
            openedData: null,
            editedNoNew: false,
        }
    },
    computed: {
        pages() {
            return this.$store.state.editor.bookData.pages
        },
        data() {
            return this.$store.state.editor.items.workspace.local
        },
        actions() {
            if(this.pageId in this.pages) return this.pages[this.pageId].actions
            return []
        },
        actionData() {
            return this.actions.link
        },
    },
    watch: {
        localData(value) {
            if(value.actionType === AllowedActions.LINK) {
                if(value.action === 'info') {
                    this.showInfo(value.data)
                } else if(value.action === 'edit') {
                    this.editAction(value.data)
                }
            }
        }
    },
    methods: {
        generateHash,
        getUniqueId,
        showModal() {
            this.clear()

            this.shownModal = true
            this.editedNoNew = false
            Vue.set(this.formFields,'id',this.getUniqueId(this.actionData)) //generete suitable id

            this.$refs.newActionModal.show()
        },
        saveAction() {
            let localData = {
                'id':this.formFields.id,
                'pageId':this.$refs.pageWhisperer.pageNumberLocal,
                'condition':this.$refs.pageDynCondition.getDynConditionText()
            }

            if(this.validationNewLink(localData)) {
                if(!this.editedNoNew) {
                    this.$emit('add-action',{'actionType':AllowedActions.LINK,'pageId':this.pageId,'actionData':localData})
                } else {
                    this.$emit('edit-action',{'actionType':AllowedActions.LINK,'pageId':this.pageId,'actionId':this.formFields.id,'actionData':localData})
                }
                this.clear()
                this.$refs.newActionModal.close()
            }
        },
        validationNewLink(localData) {
            if(localData.id === null || localData.id === '' || !Number.isInteger(localData.id)) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-id-wrong-format'))
                return false
            } else if(!this.editedNoNew && localData.id in this.actionData) { //new link action but id already exists
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-id-not-unique'))
                return false
            } else if(localData.pageId === null || localData.pageId === '') {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-page-missing'))
                return false
            } else if(!(localData.pageId in this.pages)) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-pages-doesnt-exists'))
                return false
            } else if(!this.$refs.pageDynCondition.isSelectionValid) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-condition-not-valid'))
                return false
            }
            return true
        },
        closeAction() {
            this.clear()
            this.$refs.newActionModal.close()
        },
        editAction(localData) {
            this.clear()

            Vue.set(this.formFields,'id',localData['id'])
            Vue.set(this.formFields,'pageId',localData['pageId'])
            Vue.set(this.formFields,'condition',localData['condition'])
            this.editedNoNew = true

            this.$refs.newActionModal.show()
        },
        showInfo(localData) {
            this.openedData = localData
            this.$refs.actionInfoModal.show()
        },
        closeInfoModal() {
            this.openedData = null
            this.$refs.actionInfoModal.close()
        },
        clear() {
            clearDict(this.formFields,Vue)
            this.$refs.pageWhisperer.clear()
            this.$refs.pageDynCondition.clear()
        },
    }
}

</script>

<style>

</style>