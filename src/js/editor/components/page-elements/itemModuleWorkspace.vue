<template>
    <div class='item-module-workspace-root'>
        <!-- prepare modals for item module -->

        <!-- Modal for new item creation -->
        <dyn-modal ref='newItemModal' body-specific='modal-body-item' footer-specific='modal-footer-item' content-specific='modal-content-item'>
            <span slot='modalHeader'>
                {{String.doTranslationEditor('new-item-modal-header')}}
            </span>
            <span slot='modalBody'>
                <div class='new-item-body'>
                    <label for="newItemName" class="modalLabel">{{String.doTranslationEditor('item-name')}}*: </label>
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
    },
    watch: {
        itemData(value) {
            this.returnToWorkspace = false
            if('type' in value) {
                if(value.type === 'new-item' && 'newItemModal' in this.$refs) { //if everything is prepared, show modal for item creation
                    clearDict(this.newItem) //clear data before showing new creation
                    this.$refs.newItemModal.show()
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
        saveNewItem() {
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
.modal-content-item {
    width: 50%;
    min-width: 12rem;
    max-width:25rem;
    height: 25%;
    min-height: 12em;
    max-height: 15rem;
    background-color: #fefefe;
}
.modal-body-item {
    height: calc(100% - 4.5rem);
    padding: 0.5rem;
    text-align:center;
}
.modal-footer-item {
    padding: 0.2rem 2%;
    background-color: white;
    text-align:center;
    height: 3rem;
    vertical-align: middle;
}
.new-item-body {
    text-align:left;
    width:100%;
    margin: 0 auto;
}
</style>