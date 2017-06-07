<template>
    <span>

        <ul>
           <li v-for="(value,key,index) in localData" :key="key">
                <dyn-tooltip ref='tooltipLink' :tooltip-id="generateHash('item',index)" :react-to-click='true' :react-to-hover='false' tooltip-box='editorMarkdownActionPanel'>
                    <span slot='tooltip' :component-id="generateHash('item',index)"  :class="[value.existsInText ? 'used':'',containsErrors(isActionCorrect('item',value)) ? 'wrong-action' : '','tooltip', 'markdown-action-buttons', 'markdown-action-buttons-items', 'bold']">
                    {{String.doTranslationEditor('item-small')}}:&nbsp;{{key}}&nbsp;
                        <template v-if="value.ref != '' && value.ref != null">
                            ({{String.doTranslationEditor('id')}}&nbsp;{{value.ref}})
                        </template>
                        <template v-if="value.action === 'add'">
                            <i class="fa fa-arrow-up" aria-hidden="true"></i>
                        </template>
                        <template v-else-if="value.action === 'remove'">
                            <i class="fa fa-arrow-down" aria-hidden="true"></i>
                        </template>
                    </span>
                    <span slot='tooltipText'>
                        <i class="fa fa-edit unactive-icon" aria-hidden="true" @click="editAction(value)"></i>
                        <i class="fa fa-question unactive-icon tooltip" aria-hidden="true" @click="showInfo(key)"></i>
                        <i class="fa fa-times-circle unactive-icon" aria-hidden="true" @click="removeAction(key)" ></i>
                    </span>
                </dyn-tooltip>
            </li>
        </ul>

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
import {containsErrors,isActionCorrect} from 'editor/services/validators'

export default {
    components: {
        DynModal,
        DynTooltip,
        ItemWhisperer,
        DynCondition
    },
    props: {
        pageId: null,
        localData: Object,
    },
    data() {
        return {
            formFields: {'id':'','ref':'','action':'','condition':''},
            shownModal: false,
            openedData: null,
            editedNoNew: false,
        }
    },
    computed: {
        data() {
            return this.$store.state.editor.items.workspace.local
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
    methods: {
        generateHash,
        getUniqueId,
        containsErrors,
        isActionCorrect,
        showModal() {
            this.clear()

            this.shownModal = true
            this.editedNoNew = false
            Vue.set(this.formFields,'id',this.getUniqueId(this.localData)) //generete suitable id

            this.$refs.newActionModal.show()
        },
        saveAction() {
            let localData = {
                'id':this.formFields.id,
                'ref':this.$refs.itemWhisperer.filledDataLocal,
                'action':this.formFields.action,
                'condition':this.$refs.actionDynCondition.getDynConditionText()
            }

            if(this.validationNewItem(localData)) {
                if(!this.editedNoNew) {
                    this.$emit('add-action',{'actionType':AllowedActions.ITEM,'pageId':this.pageId,'actionData':localData})
                } else {
                    this.$emit('edit-action',{'actionType':AllowedActions.ITEM,'pageId':this.pageId,'actionId':this.formFields.id,'actionData':localData})
                }
                this.clear()
                this.$refs.newActionModal.close()
            }
        },
        validationNewItem(localData) {
            if(localData.id === null || localData.id === '' || !Number.isInteger(localData.id)) {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-action-id-wrong-format'))
                return false
            } else if(!this.editedNoNew && localData.id in this.localData) { //new link action but id already exists
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
            this.editedNoNew = true

            this.$refs.newActionModal.show()
        },
        removeAction(dataId) {
            this.$emit('remove-action',{'actionType':AllowedActions.ITEM,'pageId':this.pageId,'actionId':dataId,'used':this.localData[dataId].existsInText})
        },
        showInfo(dataId) {
            this.openedData = this.localData[dataId]
            this.$refs.actionInfoModal.show()
        },
        closeInfoModal() {
            this.openedData = null
            this.$refs.actionInfoModal.close()
        },
        clear() {
            clearDict(this.formFields,Vue)
            this.$refs.actionDynCondition.clear()
            this.$refs.itemWhisperer.clear()
        },
    }
}

</script>

<style>
.markdown-action-buttons-items {
    border: 1px solid #99e699;
    background-color:#99e699;
    cursor:pointer;
}
</style>