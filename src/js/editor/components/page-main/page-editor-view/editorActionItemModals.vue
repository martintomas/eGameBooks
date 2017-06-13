<template>
    <span>

        <template if='shownModal'>
            <!--Item modal-->
            <dyn-modal ref='newActionModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
                <span slot='modalHeader'>{{String.doTranslationEditor('item-action-dev')}}</span>
                <span slot='modalBody'>
                    <template v-if='!editedNoNew'>
                        <label class='modalLabel text-left' for='actionIdEditedItem'>{{String.doTranslationEditor('action-id')}}<span class='required'>*</span>:</label>
                        <input class="modalInput" v-model.number="formFields.id" type="number" id="actionIdEditedItem">
                        <dyn-tooltip class='helper float-right'>
                            <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                            <span slot='tooltipText'>{{String.doTranslationEditor('new-action-id-help')}}</span>
                        </dyn-tooltip>
                        <br>
                    </template>
                    <label class="modalLabel text-left" for='itemRefEditItem'>{{String.doTranslationEditor('item-id')}}<span class='required'>*</span>: </label>
                    <item-whisperer :existing-data='formFields.ref' ref='itemWhisperer' input-id='itemRefEditItem'></item-whisperer>
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('new-item-ref-help')}}</span>
                    </dyn-tooltip>
                    <br>
                    <label class="modalLabel text-left" for='itemActionEditItem'>{{String.doTranslationEditor('item-action')}}<span class='required'>*</span>: </label>
                    <div class='modalInput'>
                        <input class='' type="radio" id='itemActionEditItemAdd' value="add" v-model="formFields.action"><label class='' for="itemActionEditItemAdd" >{{String.doTranslationEditor('add')}}</label>
                        &nbsp;&nbsp;
                        <input class='' type="radio" id='itemActionEditItemRemove' value="remove" v-model="formFields.action"><label class='' for="itemActionEditItemRemove" >{{String.doTranslationEditor('remove')}}</label>
                    </div>
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('new-item-action-help')}}</span>
                    </dyn-tooltip>
                    <br>
                    <dyn-condition ref='actionDynCondition' :pageCondition='formFields.condition'></dyn-condition>
                    <label class="modalLabel text-left">{{String.doTranslationEditor('required')}}<span class='required'>*</span>: </label>
                    <div class='modalInput'>
                        <input class='' type="radio" id='itemRequiredItemTrue' value="true" v-model="formFields.required"><label class='' for="itemRequiredItemTrue" >{{String.doTranslationEditor('yes')}}</label>
                        &nbsp;&nbsp;
                        <input class='' type="radio" id='itemRequiredItemFalse' value="false" v-model="formFields.required"><label class='' for="itemRequiredItemFalse" >{{String.doTranslationEditor('no')}}</label>
                    </div>
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('required-help')}}</span>
                    </dyn-tooltip>
                </span>
                <span slot='modalFooter' class='text-right'>
                    <span class='common-button' @click='saveAction'>{{String.doTranslationEditor('save')}}</span>
                    <span class='common-button' @click='closeAction'>{{String.doTranslationEditor('close')}}</span>
                </span>
            </dyn-modal>
        </template>

        <!-- Modal for item info -->
        <dyn-modal ref='actionInfoModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
            <span slot='modalHeader'>
                {{String.doTranslationEditor('item-info-modal-header')}}
            </span>
            <span slot='modalBody'>
                <template v-if='openedData != null'>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('action-id')}}: </label>
                    <span class="modalInput">{{openedData.id}}</span>
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('item-id')}}: </label> 
                    <template v-if="openedData.ref != null">
                        <span class="modalInput">{{openedData.ref}}</span>
                    </template>
                    <template v-else>
                        <span class="modalInput">{{String.doTranslationEditor('missing-ref')}}</span>
                    </template> 
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('item-action')}}: </label>
                    <span class="modalInput">{{String.doTranslationEditor(openedData.action)}}</span>
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('condition')}}: </label> 
                    <span class="modalInput">{{openedData.condition}}</span>
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('required')}}: </label> 
                    <i class="fa fa-times-circle modalInput" v-if='!openedData.required' aria-hidden="true" ></i>
                    <i class="fa fa-check modalInput" v-else aria-hidden="true" ></i>
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('used-in-text')}}: </label>
                    <i class="fa fa-times-circle modalInput" v-if='!openedData.existsInText' aria-hidden="true" ></i>
                    <i class="fa fa-check modalInput" v-else aria-hidden="true" ></i>
                </template>
                <template v-if='itemInfo != null'>
                    <br>
                    <br>
                    <span class='modalLabelFull bold'>{{String.doTranslationEditor('info-item-modal-header')}}:</span>
                    <br>
                    <span class="text-left modalLabel">{{String.doTranslationEditor('item-name')}}: </span>
                    <span class="modalInput">{{itemInfo.name}}</span>
                    <br>
                    <label class="text-left modalLabelFull">{{String.doTranslationEditor('item-description')}}: </label><br>
                    <span class="text-left modalInputFull">{{itemInfo.description}}</span>
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
import ItemWhisperer from 'editor/components/dyn-components/itemWhisperer.vue'
import DynCondition from 'editor/components/page-main/page-editor-view/dynCondition.vue'
import {getUniqueId, generateHash,clearDict,containArray} from 'defaults.js'
import {AllowedActions} from 'editor/constants'
import {messageBoxWrapper} from 'editor/services/defaults.js'

export default {
    components: {
        DynModal,
        DynTooltip,
        ItemWhisperer,
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
            formFields: {'id':'','ref':'','action':'','condition':'','required':false},
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
            return this.actions.item
        },
        itemInfo() {
            if(this.openedData != null && this.openedData.ref in this.data) {
                return this.data[this.openedData.ref]
            }
            return null
        },
        possibleItemActions() {
            return this.$store.state.editor.items.possibleItemActions
        }
    },
    watch: {
        localData(value) {
            if(value.actionType === AllowedActions.ITEM) {
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
                'ref':this.$refs.itemWhisperer.filledDataLocal,
                'action':this.formFields.action,
                'required':(this.formFields.required == 'true'),
                'condition':this.$refs.actionDynCondition.getDynConditionText()
            }

            if(this.validationNewItem(localData)) {
                if(localData.id != this.localData.data.id || localData.ref != this.localData.data.ref || localData.action != this.localData.data.action || localData.required != this.localData.data.required || localData.condition != this.localData.data.condition) {
                    if(!this.editedNoNew) {
                        this.$emit('add-action',{'actionType':AllowedActions.ITEM,'pageId':this.pageId,'actionData':localData})
                    } else {
                        this.$emit('edit-action',{'actionType':AllowedActions.ITEM,'pageId':this.pageId,'actionId':this.formFields.id,'actionData':localData})
                    }
                }
                this.clear()
                this.$refs.newActionModal.close()
            }
        },
        validationNewItem(localData) {
            if(localData.id === null || localData.id === '' || !Number.isInteger(localData.id)) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-id-wrong-format'))
                return false
            } else if(!this.editedNoNew && localData.id in this.actionData) { //new link action but id already exists
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-id-not-unique'))
                return false
            } else if(localData.ref === null || localData.ref === '') {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-ref-missing'))
                return false
            } else if(!(localData.ref in this.data)) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-ref-doesnt-exists'))
                return false
            } else if(localData.action === null || localData.action === '') {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-item-action-missing'))
                return false
            } else if(!containArray(localData.action,this.possibleItemActions)) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-item-action-doesnt-exists'))
                return false
            } else if(!this.$refs.actionDynCondition.isSelectionValid) {
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
            Vue.set(this.formFields,'ref',localData['ref'])
            Vue.set(this.formFields,'action',localData['action'])
            Vue.set(this.formFields,'condition',localData['condition'])
            Vue.set(this.formFields,'required',localData['required'])
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
            Vue.set(this.formFields,'required',false)
            this.$refs.actionDynCondition.clear()
            this.$refs.itemWhisperer.clear()
        },
    }
}

</script>

<style>

</style>