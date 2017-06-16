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

        <!-- Modal for item workspace -->
        <dyn-modal ref='itemWorkspaceModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form-workspace'>
            <span slot='modalHeader'>
                {{String.doTranslationEditor('item-workspace-modal-header')}}
                <span v-if='itemWorkspaces != null' :class="[itemWorkspacesLength>=maxWorkspaceLimit ? 'error-color': '', '']">({{itemWorkspacesLength}}/{{maxWorkspaceLimit}})</span>
            </span>
            <span slot='modalBody'>
                <div class='editor-tabs'>
                    <span :class="[openedTabWorkspace === key ? 'active': '','bold','editor-tabs-item']" v-for='(model,key,index) in itemWorkspaces' @click='changeItemWorkspaceTab(key)'>
                        <template v-if="key === 'local' || key === 'global'">{{String.doTranslationEditor(key)}}</template>
                        <template v-else>{{key}}</template>
                    </span>
                </div>
                <template v-if='itemWorkspaces[openedTabWorkspace] != null'>
                    <div class='text-center workspace-table-wrapper' ref='itemWorkspaceTableWrapper'>
                        <div class='whisperer-scroller workspace-table-scroller'>
                            <table class='editor-workspace-table-items'>
                                <tr><th>{{String.doTranslationEditor('select')}}</th><th>{{String.doTranslationEditor('item-id')}}</th><th>{{String.doTranslationEditor('name')}}</th><th>{{String.doTranslationEditor('action')}}</th></tr>
                                <tr v-for='(model,index) in itemWorkspaces[openedTabWorkspace]'>
                                    <template v-if="openedTabWorkspace === 'local'">
                                        <td><input type="checkbox" :value="model.localId" v-model="checkedItems"></td>
                                        <td>{{model.localId}}</td>
                                    </template>
                                    <template v-else>
                                        <td><input type="checkbox" :value="model.id" v-model="checkedItems"></td>
                                        <td>{{model.id}}</td>
                                    </template>
                                    <td>{{model.name}}</td>
                                    <td>
                                        <span class='editor-workspace-table-button' v-if="openedTabWorkspace === 'local'"><i class="fa fa-edit" aria-hidden="true"></i></span>
                                        <span class='editor-workspace-table-button'><i class="fa fa-search" aria-hidden="true"></i></span>
                                        <span class='editor-workspace-table-button'><i class="fa fa-trash" aria-hidden="true"></i></span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div>
                        <span class='bold'>{{String.doTranslationEditor('limits')}}</span>:
                        <span :class="[itemWorkspaceLength>=itemsLimit ? 'error-color': '']">{{itemWorkspaceLength}}/{{itemsLimit}}</span>
                    </div>
                    <div class='text-center' style='margin-top:0.25rem;'>
                        <span class='editor-workspace-table-button editor-workspace-table-button-big' v-if="itemWorkspaceLength < itemsLimit && openedTabWorkspace === 'local'">{{String.doTranslationEditor('create-new-item')}}</span>
                        <span class='editor-workspace-table-button editor-workspace-table-button-big' v-if="openedTabWorkspace != 'global'">{{String.doTranslationEditor('delete-selected')}} ({{checkedItems.length}})</span>
                        <span class='dropbtn editor-workspace-table-button editor-workspace-table-button-big' style='display:inline-block;' :component-id="itemWorkspaceCopyToDropdown" @click='copyToDropdownShow'>
                            {{String.doTranslationEditor('copy-selected-to')}} ({{checkedItems.length}}): <i class="fa fa-chevron-down unactive-icon dropbtn" aria-hidden="true" :component-id="itemWorkspaceCopyToDropdown"></i>
                            <div class="workspace-copy-to-dropdown" ref="dropdownWorkspaceCopyTo">
                                <div class='whisperer-scroller'>
                                    <a v-for='(model, key, index) in itemWorkspaces' @click='copyItemsToWorkspace(key)' v-if="key != 'global' && key != openedTabWorkspace">{{key}}</a>
                                </div>
                            </div>
                        </span>
                    </div>
                </template>
                <template v-else>
                    <div class='text-center' style='margin:2rem 0 2rem 0;'>
                        <i class="fa fa-spinner fa-spin fa-2x" aria-hidden="true"></i>
                    </div>
                </template>
            </span>
            <span slot='modalFooter'>
                <span class='common-button' @click='' v-if='itemWorkspacesLength<maxWorkspaceLimit'>{{String.doTranslationEditor('new-workspace')}}</span>
                <span class='common-button' @click='' v-if="openedTabWorkspace != 'global' && openedTabWorkspace !='local'">{{String.doTranslationEditor('delete-workspace')}}</span>
                <span class='common-button' @click='closeWorkspaceItem'>{{String.doTranslationEditor('close')}}</span>
            </span>
        </dyn-modal>

    </div>
</template>

<script>
import {bus} from 'app.js'
import IScroll from 'iscroll'
import DynModal from 'editor/components/dyn-components/dynModal.vue'
import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import {getUniqueId,clearDict,generateHash} from 'defaults'
import {messageBoxWrapper} from 'editor/services/defaults.js'
import * as mutationTypes from 'editor/store/mutationTypes'
import {getWorkspaceItems} from 'editor/api'

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
            },
            openedTabWorkspace: 'local',
            scrollWorkspaceTable: null,
            scrollCopyToDropdown: null,
            checkedItems: [],
            itemWorkspaceCopyToDropdown: this.generateHash('item-workspace',0)
        }
    },
    computed: {
        items() {
            return this.$store.state.editor.items
        },
        itemWorkspaces() {
            return this.items.workspace
        },
        itemWorkspacesLength() {
            return Object.keys(this.itemWorkspaces).length
        },
        itemWorkspaceLength() {
            if(this.itemWorkspaces[this.openedTabWorkspace] === null) return 0
            return Object.keys(this.itemWorkspaces[this.openedTabWorkspace]).length
        },
        localItems() {
            return this.itemWorkspaces.local
        },
        itemsLimit() {
            return this.$store.state.editor.items.maxItemLimit
        },
        maxWorkspaceLimit() {
            return this.$store.state.editor.items.maxWorkspaceLimit
        },
        itemsCount() {
            return Object.keys(this.localItems).length
        },
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
                } else if(value.type === 'item-workspace' && 'itemWorkspaceModal' in this.$refs) {
                    this.checkedItems = []
                    this.$refs.itemWorkspaceModal.show()
                    this.$nextTick(() => {
                        this.initializeScrollers()
                    })
                }
            }
        },
    },
    created() {
        bus.$on('automatic-hide', source => {
            if (!source.target.matches('.dropbtn')) {
                this.hideToDropdownShow()
            } else {
                let componentId = source.target.getAttribute('component-id')
                if(componentId && this.undoDropdownId != null) {
                    if(componentId != this.undoDropdownId) {
                        this.hideToDropdownShow()
                    }
                }
            }
        })
    },
    mounted() {
    },
    methods: {
        generateHash,
        closeNewItem() {
            if(this.newItem.name != '' || this.newItem.description != '') {
                messageBoxWrapper.showChoiceMessage(this.$store.commit,String.doTranslationEditor('new-item-no-save'),
                    () => {
                        this.$refs.newItemModal.close()
                        if(this.returnToWorkspace) {  //activate workspace
                            this.$refs.itemWorkspaceModal.show()
                        }
                    })
            } else {
                this.$refs.newItemModal.close()
                if(this.returnToWorkspace) {  //activate workspace
                    this.$refs.itemWorkspaceModal.show()
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
                        if(this.returnToWorkspace) {  //activate workspace
                            this.$refs.itemWorkspaceModal.show()
                        }
                    })
            } else {
                this.$refs.itemEditModal.close()
                if(this.returnToWorkspace) {  //activate workspace
                    this.$refs.itemWorkspaceModal.show()
                }
            }
        },
        closeInfoItem() {
            this.$refs.itemInfoModal.close()
            this.openedItem = null

            if(this.returnToWorkspace) { //activate workspace
                this.$refs.itemWorkspaceModal.show()
            }
        },
        closeWorkspaceItem() {
            this.$refs.itemWorkspaceModal.close()
        },
        changeItemWorkspaceTab(key) {
            if(this.openedTabWorkspace != key) {
                this.openedTabWorkspace = key
                this.checkedItems = []
                if(this.itemWorkspaces[this.openedTabWorkspace] === null) {
                    this.$store.dispatch('editor/loadWorkspaceData', {
                        moduleType: 'item',
                        workspaceName:key,
                    }).then(() => {
                        this.$nextTick(() => {
                            this.initializeScrollers()
                        })
                    }).catch((reason) => {
                        messageBoxWrapper.showErrorMessage(this.$store.commit,String.doTranslationEditor('workspace-data-no-obtained',reason))
                    })
                } else {
                    this.$nextTick(() => {
                        this.initializeScrollers()
                    })
                }
            }
        },
        copyToDropdownShow() {
            if('dropdownWorkspaceCopyTo' in this.$refs && this.$refs.dropdownWorkspaceCopyTo)this.$refs.dropdownWorkspaceCopyTo.classList.toggle("show-block")
        },
        hideToDropdownShow() {
            if ('dropdownWorkspaceCopyTo' in this.$refs && this.$refs.dropdownWorkspaceCopyTo && this.$refs.dropdownWorkspaceCopyTo.classList.contains('show-block')) {
                this.$refs.dropdownWorkspaceCopyTo.classList.remove('show-block');
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
        initializeScrollers() {
            if(this.scrollWorkspaceTable === null) {
                this.scrollWorkspaceTable = new IScroll(this.$refs.itemWorkspaceTableWrapper, {
                    mouseWheel: true,
                    bounce: false,
                    interactiveScrollbars: true,
                    shrinkScrollbars: 'clip',
                    scrollbars: 'custom',
                })
            } else {
                setTimeout(() => {
                    if(this.scrollWorkspaceTable != null) this.scrollWorkspaceTable.refresh()
                }, 200)
            }

            if(this.scrollCopyToDropdown === null) {
                this.scrollCopyToDropdown = new IScroll(this.$refs.dropdownWorkspaceCopyTo, {
                    mouseWheel: true,
                    bounce: false,
                    interactiveScrollbars: true,
                    shrinkScrollbars: 'clip',
                    scrollbars: 'custom',
                })
            } else {
                setTimeout(() => {
                    if(this.scrollCopyToDropdown != null) this.scrollCopyToDropdown.refresh()
                }, 200)
            }
        }
    }
}
</script>

<style>
.new-item-body {
    text-align:left;
    width:100%;
    margin: 0 auto;
}
.editor-tabs {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
}
.editor-tabs-item {
    cursor:pointer;
    padding: 0.2rem 2rem 0.2rem 2rem;
    font-size: 120%;
    margin-bottom: 0.25rem;
}
.editor-tabs .active {
    background-color:gray;
    border-radius: 0.25rem;
}
.editor-tabs-item:hover {
    background-color:gray;
    border-radius: 0.25rem;
}
.editor-workspace-table-items {
    border-collapse: collapse;
    margin: 0.2rem auto;
    width: 100%;
    font-size: 110%;
}
.editor-workspace-table-items tr {
    border-bottom: black 1px solid;
    text-align:center;
    height:1.5rem
}
.editor-workspace-table-items tr:first-child { 
    border-width:2px;
}
.editor-workspace-table-items tr:last-child { 
    border:none;
}
.workspace-table-wrapper {
    position: relative;
    max-height: 50vh;
    overflow: hidden;
}
.workspace-table-scroller {
    padding-bottom: 0.2rem;
}
.modal-content-form-workspace {
    min-width: 12rem;
    max-width: 75vh;
    background-color: #fefefe;
}
.editor-workspace-table-button {
    cursor:pointer;
    padding:0 1rem 0 1rem;
    border: solid black 1px;
    border-radius: 0.25rem;
    font-size:120%;
    margin: 0 0.1rem 0 0.1rem;
}
.editor-workspace-table-button-big {
    font-size:150% !important;
    margin: 0.2rem !important;
    padding:0.25rem;
}
.editor-workspace-table-button:hover {
    background-color:gray;
}
.workspace-copy-to-dropdown {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.2);
    z-index: 1;
    overflow:hidden;
    max-height:10rem;
    max-width:15rem;
    border-radius: 0.25rem;
}
.workspace-copy-to-dropdown a {
    color:black;
    padding: 0.2rem 1rem;
    text-decoration: none;
    display: block;
    text-align: left;
    font-size:80%;
}
.workspace-copy-to-dropdown a:hover {
    background-color: #ddd;
}
</style>