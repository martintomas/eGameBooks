<template>
    <div class='item-module-workspace-root'>
        <!-- prepare modals for item module -->

        <!-- Modal for new item creation -->
        <dyn-modal ref='newItemModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
            <span slot='modalHeader'>
                {{String.doTranslationEditor('new-item-modal-header')}}
            </span>
            <span slot='modalBody'>
                <div class='new-item-body'>
                    <label for="newItemName" class="modalLabel">{{String.doTranslationEditor('item-name')}}<span class='required'>*</span>: </label>
                    <input class="modalInput" v-model="newItem.name" type="text" id="newItemName" :placeholder="String.doTranslationEditor('add-item-name')">
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('new-item-name-help')}}</span>
                    </dyn-tooltip>
                    <br>
                    <label for="newItemDescription" class="modalLabel">{{String.doTranslationEditor('item-description')}}: </label>
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip' :placeholder="String.doTranslationEditor('new-item-name-help')"></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('new-item-description-help')}}</span>
                    </dyn-tooltip>
                    <br>
                    <textarea cols='50' row='5' class="modalTextArea" v-model="newItem.description" :placeholder="String.doTranslationEditor('add-item-description')" id="newItemDescription"></textarea>
                </div>
            </span>
            <span slot='modalFooter'>
                <span class='common-button' @click='saveNewItem'>{{String.doTranslationEditor('save')}}</span>
                <span class='common-button' @click='closeNewItem'>{{String.doTranslationEditor('close')}}</span>
            </span>
        </dyn-modal>

        <!-- Modal for item editing -->
        <dyn-modal ref='itemEditModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
            <span slot='modalHeader'>
                {{String.doTranslationEditor('edit-item-modal-header')}}
            </span>
            <span slot='modalBody'>
                <div class='new-item-body' v-if='openedItem != null'>
                    <label for="newItemName" class="modalLabel">{{String.doTranslationEditor('item-name')}}<span class='required'>*</span>: </label>
                    <input class="modalInput" v-model="openedItem.name" type="text" id="newItemName" :placeholder="String.doTranslationEditor('add-item-name')">
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('new-item-name-help')}}</span>
                    </dyn-tooltip>
                    <br>
                    <label for="newItemDescription" class="modalLabel">{{String.doTranslationEditor('item-description')}}: </label>
                    <dyn-tooltip class='helper float-right'>
                        <i class="fa fa-question-circle unactive-icon tooltip" aria-hidden="true" slot='tooltip' :placeholder="String.doTranslationEditor('new-item-name-help')"></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('new-item-description-help')}}</span>
                    </dyn-tooltip>
                    <br>
                    <textarea cols='50' row='5' class="modalTextArea" v-model="openedItem.description" :placeholder="String.doTranslationEditor('add-item-description')" id="newItemDescription"></textarea>
                </div>
            </span>
            <span slot='modalFooter'>
                <template v-if='openedItem != null'>
                    <span class='common-button' @click='saveEditItem'>{{String.doTranslationEditor('save')}}</span>
                    <span class='common-button' @click='closeEditItem'>{{String.doTranslationEditor('close')}}</span>
                </template>
            </span>
        </dyn-modal>

        <!-- Modal for item info -->
        <dyn-modal ref='itemInfoModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
            <span slot='modalHeader'>
                {{String.doTranslationEditor('info-item-modal-header')}}
            </span>
            <span slot='modalBody'>
                <template v-if='openedItem != null'>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('item-id')}}: </label>
                    <span class="modalInput" v-if='openedItem.localId'>{{openedItem.localId}}</span>
                    <span class="modalInput" v-else>{{openedItem.id}}</span>
                    <br>
                    <span class="text-left modalLabel">{{String.doTranslationEditor('item-name')}}: </span>
                    <span class="modalInput">{{openedItem.name}}</span>
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('item-workspace')}}: </label>
                    <span class="modalInput" v-if='openedItem.localId'>{{String.doTranslationEditor('local')}}</span>
                    <span class="modalInput" v-else>{{openedItem.workspace}}</span>
                    <template v-if='openedItem.used'>
                        <br>
                        <label class="text-left modalLabel">{{String.doTranslationEditor('item-used')}}: </label>
                        <i v-if='openedItem.used.length > 0' class="fa fa-check modalInput" aria-hidden="true"></i>
                        <i v-else class="fa fa-times modalInput" aria-hidden="true"></i>
                        <br>
                        <template v-if='openedItem.used.length > 0'>
                            <label class="text-left modalLabelFull">{{String.doTranslationEditor('item-used-pages')}}: </label><br>
                            <span class='bold' style='padding-right:0.5rem;' v-for='(model,key,index) in openedItem.used'>
                                {{model.pageId}}
                            </span>
                            <br>
                        </template>
                    </template>
                    <br>
                    <label class="text-center modalLabelFull">{{String.doTranslationEditor('item-description')}}: </label><br>
                    <span class="text-center modalInputFull">{{openedItem.description}}</span>
                    <br>
                </template>
            </span>
            <span slot='modalFooter'>
                <span class='common-button' @click='closeInfoItem'>{{String.doTranslationEditor('close')}}</span>
            </span>
        </dyn-modal>

    </div>
</template>

<script>
import DynModal from 'editor/components/dyn-components/dynModal.vue'
import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import {getUniqueId,clearDict} from 'defaults'
import {messageBoxWrapper} from 'editor/services/defaults.js'
import * as mutationTypes from 'editor/store/mutationTypes'

export default {
    components: {
        DynModal,
        DynTooltip
    },
    props: {
        itemData: {
            default: null,
            type: Object
        }
    },
    data() {
        return {
            returnToWorkspace: false,
            openedItem: null,
            newItem: {
                name: '',
                description: '',
            }
        }
    },
    computed: {
        items() {
            return this.$store.state.editor.items
        },
        localItems() {
            return this.items.workspace.local
        },
        itemsLimit() {
            return this.$store.state.editor.items.maxItemLimit
        },
        itemsCount() {
            return Object.keys(this.localItems).length
        }
    },
    watch: {
        itemData(value) {
            this.returnToWorkspace = false
            if('type' in value) {
                if(value.type === 'new-item' && 'newItemModal' in this.$refs) { //if everything is prepared, show modal for item creation
                    clearDict(this.newItem) //clear data before showing new creation
                    this.$refs.newItemModal.show()
                } else if(value.type === 'info-item' && value.item && 'itemInfoModal' in this.$refs) {
                    this.openedItem = JSON.parse(JSON.stringify(value.item))
                    if(value.workspace) this.openedItem.workspace = value.workspace
                    if(value.item.localId) this.openedItem.used = this.$store.state.editor.items.reverseInfo[value.item.localId]
                    this.$refs.itemInfoModal.show()
                } else if(value.type === 'edit-item' && value.item && 'itemEditModal' in this.$refs) {
                    this.openedItem = JSON.parse(JSON.stringify(value.item))
                    if(value.workspace) this.openedItem.workspace = value.workspace
                    this.$refs.itemEditModal.show()
                }
            }
        },
    },
    methods: {
        closeNewItem() {
            if(this.newItem.name != '' || this.newItem.description != '') {
                messageBoxWrapper.showChoiceMessage(this.$store.commit,String.doTranslationEditor('new-item-no-save'),
                    () => {
                        this.$refs.newItemModal.close()
                        if(this.returnToWorkspace) {
                            //activate workspace
                        }
                    })
            } else {
                this.$refs.newItemModal.close()
                if(this.returnToWorkspace) {
                    //activate workspace
                }
            }
        },
        closeEditItem() {
            let origValues
            if(this.openedItem.localId && this.openedItem.localId != null) {
                origValues = this.$store.state.editor.items.workspace.local[this.openedItem.localId]
            } else {
                origValues = this.$store.state.editor.items.workspace[this.openedItem.workspace][this.openedItem.id]
            }

            if(origValues.name != this.openedItem.name || origValues.description != this.openedItem.description) {
                messageBoxWrapper.showChoiceMessage(this.$store.commit,String.doTranslationEditor('edit-item-no-save'),
                    () => {
                        this.$refs.itemEditModal.close()
                        if(this.returnToWorkspace) {
                            //activate workspace
                        }
                    })
            } else {
                this.$refs.itemEditModal.close()
                if(this.returnToWorkspace) {
                    //activate workspace
                }
            }
        },
        closeInfoItem() {
            this.$refs.itemInfoModal.close()
            this.openedItem = null

            if(this.returnToWorkspace) {
                //activate workspace
            }
        },
        saveNewItem() {
            if(this.itemsCount >= this.itemsLimit) {
                messageBoxWrapper.showErrorMessage(this.$store.commit,String.doTranslationEditor('new-item-hit-limit'))
                return
            }

            if(this.newItemValidation(this.newItem)) {
                this.newItem.localId = getUniqueId(this.localItems)

                this.$store.dispatch('editor/newItemModule',this.newItem)
                this.$refs.newItemModal.close()
                clearDict(this.newItem)

                this.$emit('workspace-message', {
                    'module':'item',
                    'message':'new-item'
                })
            }
        },
        saveEditItem() {
            if(this.newItemValidation(this.openedItem)) {
                this.$store.dispatch('editor/editItemModule',this.openedItem)
                this.$refs.itemEditModal.close()
                this.openedItem = null
            }
        },
        newItemValidation(newItem) {
            if(newItem.name === '') {
                messageBoxWrapper.showWarnMessage(this.$store.commit,String.doTranslationEditor('new-item-name-required'))
                return false
            }
            return true
        },
    }
}
</script>

<style>
.new-item-body {
    text-align:left;
    width:100%;
    margin: 0 auto;
}
</style>